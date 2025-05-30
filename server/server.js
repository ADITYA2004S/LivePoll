const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://127.0.0.1:3000",
      "http://127.0.0.1:3001",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://127.0.0.1:3000",
      "http://127.0.0.1:3001",
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.static("public")); // Serve static files

// In-memory storage (replace with database in production)
let polls = [];
let activePoll = null;
let connectedUsers = new Map();
let pollResults = new Map();
let chatMessages = [];
let pollTimer = null;

// Helper function to update teachers with current student list
function updateTeacherWithStudents() {
  const students = Array.from(connectedUsers.values()).filter(
    (u) => u.type === "student"
  );
  io.to("teachers").emit("connected-students", students);
}

// Basic REST API endpoints
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    connectedUsers: connectedUsers.size,
    activePoll: activePoll ? activePoll.id : null,
  });
});

app.get("/api/polls", (req, res) => {
  res.json(polls);
});

app.get("/api/active-poll", (req, res) => {
  res.json(activePoll);
});

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("User connected:", socket.id, "at", new Date().toISOString());

  // Teacher joins
  socket.on("join-as-teacher", (data = {}) => {
    console.log("Teacher joined:", socket.id);
    socket.join("teachers");
    connectedUsers.set(socket.id, {
      type: "teacher",
      id: socket.id,
      name: data.name || "Teacher",
      joinedAt: new Date(),
    });

    // Send current state to teacher
    socket.emit("current-poll", activePoll);
    socket.emit("poll-results", Object.fromEntries(pollResults));
    updateTeacherWithStudents();
    socket.emit("chat-history", chatMessages.slice(-50));

    // Send connection confirmation
    socket.emit("connection-confirmed", { type: "teacher", id: socket.id });

    // Set up periodic student list updates
    const updateInterval = setInterval(() => {
      updateTeacherWithStudents();
    }, 5000);

    // Clear interval on disconnect
    socket.on("disconnect", () => {
      clearInterval(updateInterval);
    });
  });

  // Student joins
  socket.on("join-as-student", (data) => {
    if (!data || !data.name || data.name.trim() === "") {
      socket.emit("error", { message: "Name is required" });
      return;
    }

    const studentName = data.name.trim();
    console.log("Student joined:", studentName, socket.id);

    // Leave any previous rooms to prevent duplicates
    socket.leave("students");
    socket.join("students");

    connectedUsers.set(socket.id, {
      type: "student",
      name: studentName,
      id: socket.id,
      hasAnswered: false,
      joinedAt: new Date(),
    });

    // Notify teachers about new student
    updateTeacherWithStudents();

    // Send current state to student
    if (activePoll) {
      socket.emit("new-poll", activePoll);
    }

    const user = connectedUsers.get(socket.id);
    if (activePoll && user) {
      socket.emit(
        "poll-results",
        user.hasAnswered ? Object.fromEntries(pollResults) : null
      );
    }
    socket.emit("chat-history", chatMessages.slice(-50));

    // Send connection confirmation
    socket.emit("connection-confirmed", {
      type: "student",
      name: studentName,
      id: socket.id,
    });
  });

  // Create new poll
  socket.on("create-poll", (pollData) => {
    const user = connectedUsers.get(socket.id);
    if (!user || user.type !== "teacher") {
      socket.emit("error", { message: "Only teachers can create polls" });
      return;
    }

    if (
      !pollData ||
      !pollData.question ||
      !pollData.options ||
      !pollData.duration
    ) {
      socket.emit("error", { message: "Invalid poll data" });
      return;
    }

    // Clear existing poll timer
    if (pollTimer) {
      clearTimeout(pollTimer);
    }

    activePoll = {
      ...pollData,
      id: uuidv4(),
      createdAt: new Date(),
      endTime: new Date(Date.now() + pollData.duration * 1000),
      createdBy: user.name,
    };

    // Reset poll results and user answered status
    pollResults.clear();
    connectedUsers.forEach((user) => {
      if (user.type === "student") {
        user.hasAnswered = false;
        user.answer = null;
      }
    });

    polls.push(activePoll);

    console.log("New poll created:", activePoll.question);

    // Broadcast to all users
    io.emit("new-poll", activePoll);

    // Start poll timer
    pollTimer = setTimeout(() => {
      console.log("Poll ended:", activePoll.question);
      const finalResults = Object.fromEntries(pollResults);
      io.emit("poll-ended", finalResults);

      // Update the poll with final results
      if (activePoll) {
        activePoll.results = finalResults;
        activePoll.endedAt = new Date();
      }
    }, pollData.duration * 1000);
  });

  // Submit answer
  socket.on("submit-answer", (data) => {
    if (!data || !data.pollId || data.answer === undefined) {
      socket.emit("error", { message: "Invalid answer data" });
      return;
    }

    const { pollId, answer } = data;
    const user = connectedUsers.get(socket.id);

    if (
      user &&
      user.type === "student" &&
      !user.hasAnswered &&
      activePoll &&
      activePoll.id === pollId
    ) {
      // Validate answer is within poll options
      if (
        activePoll.type === "multiple-choice" &&
        !activePoll.options.some(
          (opt) => opt.text === answer || opt.id === answer
        )
      ) {
        socket.emit("error", { message: "Invalid answer option" });
        return;
      }

      user.hasAnswered = true;
      user.answer = answer;
      user.answeredAt = new Date();

      console.log(`Student ${user.name} answered:`, answer);

      // Update results
      pollResults.set(answer, (pollResults.get(answer) || 0) + 1);

      // Send results to the student who just answered
      socket.emit("poll-results", Object.fromEntries(pollResults));
      socket.emit("answer-submitted", { answer, timestamp: user.answeredAt });

      // Update teachers with live results
      io.to("teachers").emit("poll-results", Object.fromEntries(pollResults));

      // Check if all students have answered
      const students = Array.from(connectedUsers.values()).filter(
        (u) => u.type === "student"
      );
      const answeredCount = students.filter((s) => s.hasAnswered).length;

      console.log(`${answeredCount}/${students.length} students have answered`);

      if (answeredCount === students.length && students.length > 0) {
        io.emit("all-students-answered", Object.fromEntries(pollResults));
      }
    } else {
      let errorMessage = "Cannot submit answer";
      if (!user) errorMessage = "User not found";
      else if (user.type !== "student")
        errorMessage = "Only students can answer";
      else if (user.hasAnswered) errorMessage = "You have already answered";
      else if (!activePoll) errorMessage = "No active poll";
      else if (activePoll.id !== pollId) errorMessage = "Poll has changed";

      socket.emit("error", { message: errorMessage });
    }
  });

  // Chat message
  socket.on("send-message", (messageData) => {
    if (!messageData || !messageData.text || messageData.text.trim() === "") {
      socket.emit("error", { message: "Message cannot be empty" });
      return;
    }

    const user = connectedUsers.get(socket.id);
    if (!user) {
      socket.emit("error", { message: "User not found" });
      return;
    }

    const message = {
      id: uuidv4(),
      text: messageData.text.trim(),
      timestamp: new Date(),
      sender: user.type === "teacher" ? "Teacher" : user.name,
      senderType: user.type,
      senderId: socket.id,
    };

    chatMessages.push(message);

    // Keep only last 100 messages in memory
    if (chatMessages.length > 100) {
      chatMessages = chatMessages.slice(-100);
    }

    console.log(`Message from ${message.sender}: ${message.text}`);
    io.emit("new-message", message);
  });

  // Kick student (teacher only)
  socket.on("kick-student", (studentId) => {
    const teacher = connectedUsers.get(socket.id);
    if (!teacher || teacher.type !== "teacher") {
      socket.emit("error", { message: "Only teachers can kick students" });
      return;
    }

    const kickedUser = connectedUsers.get(studentId);
    if (kickedUser && kickedUser.type === "student") {
      console.log(`Teacher kicked student: ${kickedUser.name}`);

      io.to(studentId).emit("kicked", {
        message: "You have been removed from the session",
      });
      connectedUsers.delete(studentId);

      updateTeacherWithStudents();
    }
  });

  // Get past polls (teacher only)
  socket.on("get-past-polls", () => {
    const user = connectedUsers.get(socket.id);
    if (user && user.type === "teacher") {
      socket.emit("past-polls", polls);
    } else {
      socket.emit("error", { message: "Only teachers can view past polls" });
    }
  });

  // End current poll (teacher only)
  socket.on("end-poll", () => {
    const user = connectedUsers.get(socket.id);
    if (!user || user.type !== "teacher") {
      socket.emit("error", { message: "Only teachers can end polls" });
      return;
    }

    if (!activePoll) {
      socket.emit("error", { message: "No active poll to end" });
      return;
    }

    // Clear timer and end poll
    if (pollTimer) {
      clearTimeout(pollTimer);
      pollTimer = null;
    }

    console.log("Poll manually ended by teacher:", activePoll.question);
    const finalResults = Object.fromEntries(pollResults);
    io.emit("poll-ended", finalResults);

    if (activePoll) {
      activePoll.results = finalResults;
      activePoll.endedAt = new Date();
    }
  });

  // Handle disconnection
  socket.on("disconnect", (reason) => {
    const user = connectedUsers.get(socket.id);
    console.log(
      "User disconnected:",
      socket.id,
      reason,
      user ? `(${user.type}: ${user.name})` : ""
    );

    if (user) {
      if (user.type === "student") {
        updateTeacherWithStudents();
      }
      connectedUsers.delete(socket.id);
    }
  });

  // Handle connection errors
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

const PORT = process.env.PORT || 3001;

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Optional: Handle unhandled promise rejections or errors
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});
