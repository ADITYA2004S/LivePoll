import React, { useState } from "react";
import {
  Users,
  Clock,
  BarChart3,
  AlertCircle,
  Plus,
  X,
  Zap,
  TrendingUp,
  Award,
  Eye,
} from "lucide-react";

const TeacherDashboard = ({
  currentPoll,
  pollResults,
  timeLeft,
  connectedStudents,
  pastPolls,
  onCreatePoll,
  onKickStudent,
  canCreateNewPoll,
  formatTime,
}) => {
  const [newQuestion, setNewQuestion] = useState("");
  const [newOptions, setNewOptions] = useState(["", ""]);
  const [pollDuration, setPollDuration] = useState(60);
  const [isCreating, setIsCreating] = useState(false);

  const addOption = () => {
    if (newOptions.length < 6) {
      setNewOptions([...newOptions, ""]);
    }
  };

  const removeOption = (index) => {
    if (newOptions.length > 2) {
      const updated = newOptions.filter((_, i) => i !== index);
      setNewOptions(updated);
    }
  };

  const createPoll = async () => {
    const validOptions = newOptions.filter((opt) => opt.trim());
    if (!newQuestion.trim() || validOptions.length < 2) {
      alert("Please provide a question and at least 2 options");
      return;
    }

    setIsCreating(true);

    const poll = {
      question: newQuestion.trim(),
      options: validOptions,
      duration: pollDuration,
    };

    console.log("Creating poll:", poll);

    // Simulate API call
    setTimeout(() => {
      onCreatePoll(poll);
      setNewQuestion("");
      setNewOptions(["", ""]);
      setIsCreating(false);
    }, 800);
  };

  const totalVotes = Object.values(pollResults).reduce(
    (sum, count) => sum + count,
    0
  );
  const responseRate =
    connectedStudents.length > 0
      ? (totalVotes / connectedStudents.length) * 100
      : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 lg:p-6">
      {/* Header Stats Bar */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Connected Students
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {connectedStudents.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Response Rate
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {responseRate.toFixed(0)}%
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Votes</p>
                <p className="text-2xl font-bold text-gray-900">{totalVotes}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Poll Status</p>
                <p className="text-2xl font-bold text-gray-900">
                  {currentPoll ? "Live" : "Ready"}
                </p>
              </div>
              <div
                className={`w-12 h-12 bg-gradient-to-r ${
                  currentPoll
                    ? "from-green-500 to-emerald-500"
                    : "from-gray-400 to-gray-500"
                } rounded-xl flex items-center justify-center`}
              >
                <Eye className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {/* Create Poll Section - Enhanced */}
        <div className="xl:col-span-1">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-white/20 hover:shadow-3xl transition-all duration-500">
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Create New Poll
                </h2>
                <p className="text-sm text-gray-500">
                  Engage your students instantly
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="group">
                <label className="block text-sm font-semibold mb-3 text-gray-800">
                  Poll Question
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <textarea
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    placeholder="What would you like to ask your students?"
                    className="w-full p-4 rounded-2xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none resize-none transition-all duration-300 hover:border-purple-300 bg-gray-50/50 focus:bg-white shadow-sm focus:shadow-md backdrop-blur-sm"
                    rows={3}
                    maxLength={200}
                  />
                  <div className="absolute bottom-3 right-3 text-xs text-gray-400 bg-white/80 px-2 py-1 rounded-lg">
                    {newQuestion.length}/200
                  </div>
                </div>
              </div>

              <div className="group">
                <label className="block text-sm font-semibold mb-3 text-gray-800">
                  Answer Options
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="space-y-3">
                  {newOptions.map((option, index) => (
                    <div key={index} className="relative group/option">
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => {
                          const updated = [...newOptions];
                          updated[index] = e.target.value;
                          setNewOptions(updated);
                        }}
                        placeholder={`Option ${index + 1}`}
                        className="w-full p-4 pr-12 rounded-2xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-all duration-300 hover:border-purple-300 bg-gray-50/50 focus:bg-white shadow-sm focus:shadow-md backdrop-blur-sm"
                        maxLength={100}
                      />
                      {newOptions.length > 2 && (
                        <button
                          onClick={() => removeOption(index)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 opacity-0 group-hover/option:opacity-100 transition-all duration-200 text-red-400 hover:text-red-600 bg-white rounded-full p-1 shadow-md hover:shadow-lg"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}

                  {newOptions.length < 6 && (
                    <button
                      onClick={addOption}
                      className="w-full p-4 border-2 border-dashed border-purple-300 rounded-2xl text-purple-600 hover:border-purple-500 hover:bg-purple-50/50 transition-all duration-300 flex items-center justify-center space-x-2 group/add backdrop-blur-sm"
                    >
                      <Plus className="w-5 h-5 group-hover/add:scale-110 transition-transform duration-200" />
                      <span className="font-semibold">Add Another Option</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="group">
                <label className="block text-sm font-semibold mb-3 text-gray-800">
                  Poll Duration
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={pollDuration}
                    onChange={(e) => setPollDuration(Number(e.target.value))}
                    min="10"
                    max="300"
                    className="w-full p-4 rounded-2xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-all duration-300 hover:border-purple-300 bg-gray-50/50 focus:bg-white shadow-sm focus:shadow-md backdrop-blur-sm"
                  />
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm bg-white/80 px-2 py-1 rounded-lg">
                    seconds
                  </span>
                </div>
              </div>

              <button
                onClick={createPoll}
                disabled={
                  !newQuestion.trim() ||
                  newOptions.filter((opt) => opt.trim()).length < 2 ||
                  !canCreateNewPoll() ||
                  isCreating
                }
                className="w-full py-4 px-6 rounded-2xl font-bold text-white transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 shadow-xl hover:shadow-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative flex items-center justify-center space-x-2">
                  {isCreating ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Creating...</span>
                    </>
                  ) : !canCreateNewPoll() ? (
                    <>
                      <Clock className="w-5 h-5" />
                      <span>Wait for current poll to finish</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5" />
                      <span>Launch Poll</span>
                    </>
                  )}
                </div>
              </button>
            </div>

            {/* Connected Students - Enhanced */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">
                      Connected Students
                    </h3>
                    <p className="text-sm text-gray-500">
                      {connectedStudents.length} active
                    </p>
                  </div>
                </div>
                <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                  Online
                </div>
              </div>

              <div className="space-y-3 max-h-48 overflow-y-auto custom-scrollbar">
                {connectedStudents.map((student, index) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50/80 to-purple-50/80 rounded-2xl border border-blue-100/50 hover:shadow-md transition-all duration-300 backdrop-blur-sm group"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-3 shadow-md">
                        <span className="text-white font-bold text-sm">
                          {student.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-800">
                          {student.name}
                        </span>
                        <p className="text-xs text-gray-500">Active now</p>
                      </div>
                    </div>
                    <button
                      onClick={() => onKickStudent(student.id)}
                      className="px-3 py-2 text-xs bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-200 hover:scale-105 active:scale-95 font-semibold opacity-0 group-hover:opacity-100 shadow-md"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                {connectedStudents.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-600 font-semibold mb-1">
                      No students connected yet
                    </p>
                    <p className="text-gray-400 text-sm">
                      Students will appear here when they join
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Live Poll & Results - Enhanced */}
        <div className="xl:col-span-2">
          {currentPoll ? (
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 hover:shadow-3xl transition-all duration-500">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center">
                  <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mr-4 shadow-xl animate-pulse">
                    <BarChart3 className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      Live Poll Results
                    </h2>
                    <p className="text-gray-500">Real-time student responses</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Time Remaining</p>
                    <div className="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-2xl shadow-lg">
                      <Clock className="w-5 h-5" />
                      <span className="font-mono font-bold text-lg">
                        {formatTime(timeLeft)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <div className="bg-gradient-to-r from-purple-50/80 to-blue-50/80 rounded-3xl p-8 mb-8 border-l-4 border-purple-500 backdrop-blur-sm shadow-lg">
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">
                    {currentPoll.question}
                  </h3>
                  <div className="flex items-center space-x-4">
                    <p className="text-gray-600">Students are voting now...</p>
                    <div className="flex space-x-1">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                          style={{ animationDelay: `${i * 0.2}s` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Enhanced Results */}
                <div className="space-y-6">
                  {currentPoll.options.map((option, index) => {
                    const votes = pollResults[option] || 0;
                    const totalVotes = Object.values(pollResults).reduce(
                      (sum, count) => sum + count,
                      0
                    );
                    const percentage =
                      totalVotes > 0 ? (votes / totalVotes) * 100 : 0;

                    const colors = [
                      "from-purple-500 to-indigo-500",
                      "from-blue-500 to-cyan-500",
                      "from-green-500 to-emerald-500",
                      "from-yellow-500 to-orange-500",
                      "from-pink-500 to-rose-500",
                      "from-indigo-500 to-purple-500",
                    ];

                    return (
                      <div
                        key={index}
                        className="bg-gray-50/80 backdrop-blur-sm rounded-2xl p-6 hover:shadow-lg transition-all duration-500 border border-gray-100/50 group"
                        style={{ animationDelay: `${index * 150}ms` }}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div
                              className={`w-4 h-4 rounded-full bg-gradient-to-r ${
                                colors[index % colors.length]
                              } shadow-md`}
                            />
                            <span className="font-bold text-gray-800 text-lg">
                              {option}
                            </span>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <span className="text-sm font-medium text-gray-600 block">
                                {votes} votes
                              </span>
                            </div>
                            <div className="bg-white px-3 py-1 rounded-xl shadow-md">
                              <span className="text-xl font-bold text-purple-600">
                                {percentage.toFixed(1)}%
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-5 overflow-hidden shadow-inner">
                          <div
                            className={`h-5 rounded-full transition-all duration-1000 ease-out bg-gradient-to-r ${
                              colors[index % colors.length]
                            } shadow-md relative overflow-hidden`}
                            style={{
                              width: `${percentage}%`,
                            }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent opacity-50" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-8 bg-gradient-to-r from-gray-50/80 to-purple-50/80 rounded-2xl p-6 text-center backdrop-blur-sm border border-gray-100/50">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">
                        Total Responses
                      </p>
                      <p className="text-2xl font-bold text-purple-600">
                        {Object.values(pollResults).reduce(
                          (sum, count) => sum + count,
                          0
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">
                        Connected Students
                      </p>
                      <p className="text-2xl font-bold text-blue-600">
                        {connectedStudents.length}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">
                        Response Rate
                      </p>
                      <p className="text-2xl font-bold text-green-600">
                        {responseRate.toFixed(0)}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-16 text-center border border-white/20 hover:shadow-3xl transition-all duration-500">
              <div className="bg-gradient-to-r from-gray-100/80 to-purple-100/80 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg backdrop-blur-sm">
                <AlertCircle className="w-16 h-16 text-purple-400" />
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-4">
                No Active Poll
              </h3>
              <p className="text-gray-600 text-xl mb-8 max-w-md mx-auto">
                Create your first poll to start engaging with students and
                gather real-time feedback
              </p>
              <div className="bg-gradient-to-r from-purple-50/80 to-blue-50/80 rounded-2xl p-6 inline-block backdrop-blur-sm shadow-lg border border-purple-100/50">
                <p className="text-purple-700 font-semibold text-lg mb-2">
                  💡 Pro Tips
                </p>
                <ul className="text-purple-600 text-left space-y-1">
                  <li>• Use polls to check understanding</li>
                  <li>• Gather opinions and feedback</li>
                  <li>• Make collaborative decisions</li>
                  <li>• Keep students engaged</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #8b5cf6, #6366f1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #7c3aed, #4f46e5);
        }
      `}</style>
    </div>
  );
};

export default TeacherDashboard;
