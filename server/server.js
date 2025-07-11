require("dotenv").config({ path: "./.env" });
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

const app = express();
const server = http.createServer(app);

const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? [process.env.FRONTEND_URL]
    : [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
      ];

// Socket.IO configuration with enhanced production settings
const io = socketIo(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"], // Ensure WebSocket fallback
  pingTimeout: 60000, // Increase timeout for production
  pingInterval: 25000,
});

// Enhanced CORS middleware
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// Security middleware
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// Serve static files from React app
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));

  // Handle React routing, return all requests to React app
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build", "index.html"));
  });
} else {
  app.use(express.static("public"));
}

// In-memory storage with enhanced structure
const dataStore = {
  polls: [],
  activePoll: null,
  connectedUsers: new Map(),
  pollResults: new Map(),
  chatMessages: [],
  pollTimer: null,
  // Add cleanup mechanism
  cleanup: function () {
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
      this.pollTimer = null;
    }
  },
};

// Helper functions with error handling
function updateTeachersWithStudents() {
  try {
    const students = Array.from(dataStore.connectedUsers.values()).filter(
      (u) => u.type === "student"
    );
    io.to("teachers").emit("connected-students", students);
  } catch (error) {
    console.error("Error in updateTeachersWithStudents:", error);
  }
}

function broadcastPollResults() {
  try {
    const results = Object.fromEntries(dataStore.pollResults);
    io.emit("poll-results", results);
  } catch (error) {
    console.error("Error in broadcastPollResults:", error);
  }
}

// API endpoints with error handling
app.get("/api/health", (req, res) => {
  try {
    res.json({
      status: "OK",
      timestamp: new Date().toISOString(),
      connectedUsers: dataStore.connectedUsers.size,
      activePoll: dataStore.activePoll ? dataStore.activePoll.id : null,
      environment: process.env.NODE_ENV || "development",
    });
  } catch (error) {
    console.error("Health check error:", error);
    res.status(500).json({ status: "ERROR", error: error.message });
  }
});

// Socket.IO connection handling with robust error management
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Heartbeat mechanism
  let heartbeatInterval = setInterval(() => {
    socket.emit("ping");
  }, 30000);

  socket.on("pong", () => {
    // Connection is alive
  });

  // Teacher join with validation
  socket.on("join-as-teacher", (data = {}) => {
    try {
      socket.join("teachers");

      dataStore.connectedUsers.set(socket.id, {
        type: "teacher",
        id: socket.id,
        name: data.name || "Teacher",
        joinedAt: new Date(),
      });

      socket.emit("current-poll", dataStore.activePoll);
      if (dataStore.activePoll) {
        socket.emit("poll-results", Object.fromEntries(dataStore.pollResults));
      }

      updateTeachersWithStudents();
      socket.emit("chat-history", dataStore.chatMessages.slice(-50));
      socket.emit("connection-confirmed", { type: "teacher", id: socket.id });
    } catch (error) {
      console.error("Teacher join error:", error);
      socket.emit("error", { message: "Internal server error" });
    }
  });

  // Student join with validation
  socket.on("join-as-student", (data) => {
    try {
      if (!data?.name?.trim()) {
        throw new Error("Name is required");
      }

      const studentName = data.name.trim();
      socket.join("students");

      dataStore.connectedUsers.set(socket.id, {
        type: "student",
        name: studentName,
        id: socket.id,
        hasAnswered: false,
        joinedAt: new Date(),
      });

      updateTeachersWithStudents();

      if (dataStore.activePoll) {
        socket.emit("new-poll", dataStore.activePoll);
        const user = dataStore.connectedUsers.get(socket.id);
        if (user?.hasAnswered) {
          socket.emit(
            "poll-results",
            Object.fromEntries(dataStore.pollResults)
          );
        }
      }

      socket.emit("chat-history", dataStore.chatMessages.slice(-50));
      socket.emit("connection-confirmed", {
        type: "student",
        name: studentName,
        id: socket.id,
      });
    } catch (error) {
      console.error("Student join error:", error);
      socket.emit("error", { message: error.message || "Join failed" });
    }
  });

  // Create poll with validation
  socket.on("create-poll", (pollData) => {
    try {
      const user = dataStore.connectedUsers.get(socket.id);
      if (!user || user.type !== "teacher") {
        throw new Error("Only teachers can create polls");
      }

      if (!pollData?.question || !pollData?.options || !pollData?.duration) {
        throw new Error("Invalid poll data");
      }

      // Cleanup previous poll
      if (dataStore.pollTimer) {
        clearInterval(dataStore.pollTimer);
        dataStore.pollTimer = null;
      }

      dataStore.activePoll = {
        ...pollData,
        id: uuidv4(),
        createdAt: new Date(),
        endTime: new Date(Date.now() + pollData.duration * 1000),
        createdBy: user.name,
      };

      // Reset state
      dataStore.pollResults.clear();
      dataStore.connectedUsers.forEach((user) => {
        if (user.type === "student") {
          user.hasAnswered = false;
          user.answer = null;
        }
      });

      dataStore.polls.push(dataStore.activePoll);
      io.emit("new-poll", dataStore.activePoll);

      // Poll timer with cleanup
      let timeLeft = pollData.duration;
      dataStore.pollTimer = setInterval(() => {
        timeLeft--;
        io.emit("time-update", timeLeft);

        if (timeLeft <= 0) {
          clearInterval(dataStore.pollTimer);
          dataStore.pollTimer = null;
          const finalResults = Object.fromEntries(dataStore.pollResults);
          io.emit("poll-ended", finalResults);

          if (dataStore.activePoll) {
            dataStore.activePoll.results = finalResults;
            dataStore.activePoll.endedAt = new Date();
          }
          dataStore.activePoll = null;
        }
      }, 1000);
    } catch (error) {
      console.error("Create poll error:", error);
      socket.emit("error", {
        message: error.message || "Poll creation failed",
      });
    }
  });

  // Submit answer handler - THIS WAS MISSING
  socket.on("submit-answer", (data) => {
    try {
      const user = dataStore.connectedUsers.get(socket.id);
      if (!user || user.type !== "student") {
        throw new Error("Only students can submit answers");
      }

      if (!dataStore.activePoll) {
        throw new Error("No active poll");
      }

      if (!data?.answer) {
        throw new Error("Answer is required");
      }

      // Mark user as answered
      user.hasAnswered = true;
      user.answer = data.answer;

      // Update poll results
      const currentCount = dataStore.pollResults.get(data.answer) || 0;
      dataStore.pollResults.set(data.answer, currentCount + 1);

      console.log(`Student ${user.name} submitted answer: ${data.answer}`);

      // Broadcast updated results to all users
      broadcastPollResults();

      // Notify that answer was submitted
      socket.emit("answer-submitted", { success: true });

      // Check if all students have answered
      const totalStudents = Array.from(
        dataStore.connectedUsers.values()
      ).filter((u) => u.type === "student").length;
      const answeredCount = Array.from(
        dataStore.connectedUsers.values()
      ).filter((u) => u.type === "student" && u.hasAnswered).length;

      if (answeredCount >= totalStudents && totalStudents > 0) {
        const finalResults = Object.fromEntries(dataStore.pollResults);
        io.emit("all-students-answered", finalResults);
      }
    } catch (error) {
      console.error("Submit answer error:", error);
      socket.emit("error", {
        message: error.message || "Answer submission failed",
      });
    }
  });

  // Kick student handler - THIS WAS MISSING
  socket.on("kick-student", (studentId, callback) => {
    try {
      const user = dataStore.connectedUsers.get(socket.id);
      if (!user || user.type !== "teacher") {
        const error = {
          success: false,
          error: "Only teachers can kick students",
        };
        if (callback) callback(error);
        return;
      }

      const studentSocket = io.sockets.sockets.get(studentId);
      if (studentSocket) {
        // Remove from data store
        dataStore.connectedUsers.delete(studentId);

        // Emit kicked event to the student
        studentSocket.emit("kicked", { reason: "Removed by teacher" });

        // Disconnect the student
        studentSocket.disconnect(true);

        // Update teachers with new student list
        updateTeachersWithStudents();

        console.log(`Student ${studentId} kicked by teacher ${socket.id}`);

        if (callback) {
          callback({ success: true });
        }
      } else {
        const error = { success: false, error: "Student not found" };
        if (callback) callback(error);
      }
    } catch (error) {
      console.error("Kick student error:", error);
      const errorResponse = {
        success: false,
        error: error.message || "Kick failed",
      };
      if (callback) callback(errorResponse);
    }
  });

  // Send message handler - THIS WAS MISSING
  socket.on("send-message", (messageData) => {
    try {
      const user = dataStore.connectedUsers.get(socket.id);
      if (!user) {
        throw new Error("User not found");
      }

      const message = {
        id: uuidv4(),
        text: messageData.text,
        type: user.type,
        name: user.name,
        timestamp: new Date(),
      };

      dataStore.chatMessages.push(message);

      // Keep only last 100 messages
      if (dataStore.chatMessages.length > 100) {
        dataStore.chatMessages = dataStore.chatMessages.slice(-100);
      }

      io.emit("new-message", message);
    } catch (error) {
      console.error("Send message error:", error);
      socket.emit("error", { message: error.message || "Message send failed" });
    }
  });

  // Get past polls handler - THIS WAS MISSING
  socket.on("get-past-polls", () => {
    try {
      const user = dataStore.connectedUsers.get(socket.id);
      if (!user || user.type !== "teacher") {
        socket.emit("error", { message: "Only teachers can view past polls" });
        return;
      }

      socket.emit("past-polls", dataStore.polls);
    } catch (error) {
      console.error("Get past polls error:", error);
      socket.emit("error", { message: "Failed to get past polls" });
    }
  });

  // Leave session handler - THIS WAS MISSING
  socket.on("leave-session", () => {
    try {
      const user = dataStore.connectedUsers.get(socket.id);
      if (user) {
        dataStore.connectedUsers.delete(socket.id);
        if (user.type === "student") {
          updateTeachersWithStudents();
        }
        console.log(`User ${socket.id} left session`);
      }
    } catch (error) {
      console.error("Leave session error:", error);
    }
  });

  // Enhanced disconnect handler
  socket.on("disconnect", (reason) => {
    try {
      console.log(`User disconnected: ${socket.id} (${reason})`);
      clearInterval(heartbeatInterval);

      const user = dataStore.connectedUsers.get(socket.id);
      if (user) {
        dataStore.connectedUsers.delete(socket.id);
        if (user.type === "student") {
          setTimeout(updateTeachersWithStudents, 100);
        }
      }
    } catch (error) {
      console.error("Disconnect handler error:", error);
    }
  });

  // Error handler for socket
  socket.on("error", (error) => {
    console.error("Socket error:", error);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Server startup with cleanup
const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(
    `Server running in ${
      process.env.NODE_ENV || "development"
    } mode on port ${PORT}`
  );
});

// Cleanup on process termination
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  dataStore.cleanup();
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT received. Shutting down gracefully...");
  dataStore.cleanup();
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});
