import React, { useState, useEffect } from "react";
import {
  Users,
  MessageCircle,
  BarChart3,
  X,
  Sparkles,
  Zap,
  TrendingUp,
  Award,
  Globe,
  Shield,
  ArrowRight,
  Star,
  CheckCircle,
} from "lucide-react";
import io from "socket.io-client";
import TeacherDashboard from "./components/TeacherDashboard";
import StudentView from "./components/StudentView";

const Chat = ({ messages, onSendMessage, onClose, userType, studentName }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-xl p-6 w-full max-w-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">Chat</h3>
        <button onClick={onClose}>
          <X className="w-5 h-5" />
        </button>
      </div>
      <p>Chat interface would go here...</p>
    </div>
  </div>
);

const App = () => {
  const [socket, setSocket] = useState(null);
  const [userType, setUserType] = useState(null);
  const [studentName, setStudentName] = useState("");
  const [currentPoll, setCurrentPoll] = useState(null);
  const [pollResults, setPollResults] = useState({});
  const [timeLeft, setTimeLeft] = useState(60);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [connectedStudents, setConnectedStudents] = useState([]);
  const [chatVisible, setChatVisible] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [pastPolls, setPastPolls] = useState([]);
  const [showPastPolls, setShowPastPolls] = useState(false);

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io("http://localhost:5000"); // Replace with your server URL
    setSocket(newSocket);

    // Socket event listeners
    newSocket.on("connect", () => {
      console.log("Connected to server");
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    newSocket.on("poll-created", (poll) => {
      setCurrentPoll(poll);
      setPollResults({});
      setTimeLeft(poll.duration);
      setHasAnswered(false);
      setSelectedAnswer("");
    });

    newSocket.on("poll-results", (results) => {
      setPollResults(results);
    });

    newSocket.on("time-update", (time) => {
      setTimeLeft(time);
    });

    newSocket.on("poll-ended", () => {
      setCurrentPoll(null);
      setTimeLeft(0);
    });

    newSocket.on("students-update", (students) => {
      setConnectedStudents(students);
    });

    newSocket.on("chat-message", (message) => {
      setChatMessages((prev) => [...prev, message]);
    });

    newSocket.on("past-polls", (polls) => {
      setPastPolls(polls);
    });

    newSocket.on("student-kicked", (data) => {
      if (userType === "student" && data.studentId === newSocket.id) {
        alert("You have been removed from the session");
        setUserType(null);
        setStudentName("");
      }
    });

    // Cleanup on unmount
    return () => {
      newSocket.close();
    };
  }, [userType]);

  const handleTeacherLogin = () => {
    if (socket) {
      setUserType("teacher");
      socket.emit("join-as-teacher");
      socket.emit("get-past-polls");
    }
  };

  const handleStudentLogin = () => {
    if (studentName.trim() && socket) {
      setUserType("student");
      socket.emit("join-as-student", { name: studentName });
    }
  };

  const handleCreatePoll = (poll) => {
    if (socket) {
      socket.emit("create-poll", poll);
    }
  };

  const handleSubmitAnswer = (answer) => {
    setHasAnswered(true);
    setSelectedAnswer(answer);
    if (socket && currentPoll) {
      socket.emit("submit-answer", { pollId: currentPoll.id, answer: answer });
    }
  };

  const handleSendMessage = (message) => {
    if (socket) {
      const messageData = { text: message, type: userType };
      socket.emit("send-message", messageData);
    }
  };

  const kickStudent = (studentId) => {
    if (socket) {
      socket.emit("kick-student", studentId);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const canCreateNewPoll = () => {
    if (!currentPoll) return true;
    const studentsCount = connectedStudents.length;
    if (studentsCount === 0) return true;
    const answeredCount = Object.values(pollResults).reduce(
      (sum, count) => sum + count,
      0
    );
    return answeredCount >= studentsCount || timeLeft <= 0;
  };

  if (!userType) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div
            className="absolute top-40 right-10 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute -bottom-8 left-20 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"
            style={{ animationDelay: "4s" }}
          ></div>
        </div>

        {/* Floating Icons */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute top-32 left-1/4 animate-bounce"
            style={{ animationDelay: "0s", animationDuration: "3s" }}
          >
            <BarChart3 className="w-8 h-8 text-purple-300 opacity-60" />
          </div>
          <div
            className="absolute top-1/2 right-1/4 animate-bounce"
            style={{ animationDelay: "1s", animationDuration: "4s" }}
          >
            <Users className="w-6 h-6 text-blue-300 opacity-60" />
          </div>
          <div
            className="absolute bottom-1/3 left-1/6 animate-bounce"
            style={{ animationDelay: "2s", animationDuration: "5s" }}
          >
            <TrendingUp className="w-7 h-7 text-indigo-300 opacity-60" />
          </div>
          <div
            className="absolute top-1/4 right-1/3 animate-bounce"
            style={{ animationDelay: "3s", animationDuration: "3.5s" }}
          >
            <Award className="w-5 h-5 text-purple-400 opacity-60" />
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
          <div className="w-full max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Side - Hero Content */}
              <div className="text-center lg:text-left space-y-8">
                <div className="space-y-6">
                  <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                    <Sparkles className="w-4 h-4 text-yellow-300" />
                    <span className="text-white/90 text-sm font-medium">
                      Revolutionary Polling Experience
                    </span>
                  </div>

                  <h1 className="text-5xl lg:text-7xl font-black text-white leading-tight">
                    Live
                    <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                      Poll
                    </span>
                  </h1>

                  <p className="text-xl lg:text-2xl text-white/80 leading-relaxed max-w-2xl">
                    Transform your classroom with{" "}
                    <span className="text-purple-300 font-semibold">
                      real-time polling
                    </span>
                    , instant feedback, and engaging interactions that make
                    learning unforgettable.
                  </p>
                </div>

                {/* Feature Pills */}
                <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                  <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    <span className="text-white/90 text-sm">
                      Instant Results
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                    <Globe className="w-4 h-4 text-green-400" />
                    <span className="text-white/90 text-sm">
                      Real-time Sync
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                    <Shield className="w-4 h-4 text-blue-400" />
                    <span className="text-white/90 text-sm">
                      Secure & Private
                    </span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-6 max-w-md mx-auto lg:mx-0">
                  <div className="text-center">
                    <div className="text-2xl lg:text-3xl font-bold text-white">
                      99%
                    </div>
                    <div className="text-white/60 text-sm">Engagement</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl lg:text-3xl font-bold text-white">
                      5M+
                    </div>
                    <div className="text-white/60 text-sm">Responses</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl lg:text-3xl font-bold text-white">
                      10k+
                    </div>
                    <div className="text-white/60 text-sm">Teachers</div>
                  </div>
                </div>
              </div>

              {/* Right Side - Login Card */}
              <div className="flex justify-center lg:justify-end">
                <div className="w-full max-w-md">
                  <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 relative overflow-hidden">
                    {/* Card Background Effect */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full opacity-10 transform translate-x-16 -translate-y-16"></div>

                    <div className="relative z-10">
                      <div className="text-center mb-8">
                        <div className="relative inline-block mb-6">
                          <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg transform hover:scale-110 transition-all duration-300">
                            <BarChart3 className="w-10 h-10 text-white" />
                          </div>
                          <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse">
                            <Sparkles className="w-4 h-4 text-white" />
                          </div>
                        </div>

                        <h2 className="text-3xl font-bold text-gray-800 mb-2">
                          Get Started
                        </h2>
                        <p className="text-gray-600">
                          Choose your role to begin your polling journey
                        </p>
                      </div>

                      <div className="space-y-4">
                        <button
                          onClick={handleTeacherLogin}
                          className="group w-full py-4 px-6 rounded-2xl font-bold text-white transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 relative overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-indigo-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                          <div className="relative flex items-center justify-center space-x-3">
                            <Users className="w-6 h-6" />
                            <span>I'm a Teacher</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </button>

                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl opacity-20 blur-sm"></div>
                          <input
                            type="text"
                            placeholder="Enter your name as student"
                            value={studentName}
                            onChange={(e) => setStudentName(e.target.value)}
                            className="relative w-full py-4 px-6 rounded-2xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-all duration-300 bg-white/90 backdrop-blur-sm placeholder-gray-500 font-medium hover:bg-white focus:bg-white"
                            onKeyPress={(e) =>
                              e.key === "Enter" && handleStudentLogin()
                            }
                          />
                        </div>

                        <button
                          onClick={handleStudentLogin}
                          disabled={!studentName.trim()}
                          className="group w-full py-4 px-6 rounded-2xl font-bold text-white transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg disabled:opacity-50 disabled:hover:scale-100 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 relative overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                          <div className="relative flex items-center justify-center space-x-3">
                            <Star className="w-5 h-5" />
                            <span>Join as Student</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </button>
                      </div>

                      {/* Trust Indicators */}
                      <div className="mt-8 pt-6 border-t border-gray-200">
                        <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span>Secure</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span>Fast</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span>Free</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/20 to-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F2F2F2" }}>
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold" style={{ color: "#4F0DCE" }}>
                LivePoll
              </h1>
              <p className="text-sm" style={{ color: "#6E6E6E" }}>
                {userType === "teacher"
                  ? "Teacher Dashboard"
                  : `Welcome, ${studentName}`}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {userType === "teacher" && (
              <button
                onClick={() => setShowPastPolls(true)}
                className="px-4 py-2 rounded-lg font-medium text-white transition-all duration-200 hover:scale-105"
                style={{ backgroundColor: "#5767D0" }}
              >
                View History
              </button>
            )}
            <button
              onClick={() => setChatVisible(true)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              style={{ color: "#7765DA" }}
            >
              <MessageCircle className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {userType === "teacher" ? (
          <TeacherDashboard
            currentPoll={currentPoll}
            pollResults={pollResults}
            timeLeft={timeLeft}
            connectedStudents={connectedStudents}
            pastPolls={pastPolls}
            onCreatePoll={handleCreatePoll}
            onKickStudent={kickStudent}
            canCreateNewPoll={canCreateNewPoll}
            formatTime={formatTime}
          />
        ) : (
          <StudentView
            currentPoll={currentPoll}
            pollResults={pollResults}
            timeLeft={timeLeft}
            hasAnswered={hasAnswered}
            selectedAnswer={selectedAnswer}
            onSubmitAnswer={handleSubmitAnswer}
            formatTime={formatTime}
          />
        )}
      </div>

      {/* Past Polls Modal */}
      {showPastPolls && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-96 flex flex-col">
            <div className="flex items-center justify-between p-6 border-b">
              <h3
                className="text-xl font-semibold"
                style={{ color: "#373737" }}
              >
                Past Polls
              </h3>
              <button
                onClick={() => setShowPastPolls(false)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="text-center py-8">
                <p className="text-gray-500">No past polls found</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chat Modal */}
      {chatVisible && (
        <Chat
          messages={chatMessages}
          onSendMessage={handleSendMessage}
          onClose={() => setChatVisible(false)}
          userType={userType}
          studentName={studentName}
        />
      )}
    </div>
  );
};

export default App;
