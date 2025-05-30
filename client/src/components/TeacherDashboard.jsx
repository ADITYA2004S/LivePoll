import React, { useState } from "react";
import { Users, Clock, BarChart3, AlertCircle, Plus, X } from "lucide-react";

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

  const createPoll = () => {
    const poll = {
      question: newQuestion,
      options: newOptions.filter((opt) => opt.trim()),
      duration: pollDuration,
    };
    onCreatePoll(poll);

    // Reset form
    setNewQuestion("");
    setNewOptions(["", ""]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {/* Create Poll Section */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-purple-100 backdrop-blur-sm">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center mr-3">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Create New Poll
              </h2>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold mb-3 text-gray-700">
                  Poll Question
                </label>
                <div className="relative">
                  <textarea
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    placeholder="What would you like to ask your students?"
                    className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none resize-none transition-all duration-200 hover:border-purple-300 bg-gray-50 focus:bg-white"
                    rows={3}
                  />
                  <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                    {newQuestion.length}/200
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-3 text-gray-700">
                  Answer Options
                </label>
                <div className="space-y-3">
                  {newOptions.map((option, index) => (
                    <div key={index} className="relative group">
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => {
                          const updated = [...newOptions];
                          updated[index] = e.target.value;
                          setNewOptions(updated);
                        }}
                        placeholder={`Option ${index + 1}`}
                        className="w-full p-4 pr-12 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none transition-all duration-200 hover:border-purple-300 bg-gray-50 focus:bg-white"
                      />
                      {newOptions.length > 2 && (
                        <button
                          onClick={() => removeOption(index)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-red-400 hover:text-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}

                  {newOptions.length < 6 && (
                    <button
                      onClick={addOption}
                      className="w-full p-3 border-2 border-dashed border-purple-300 rounded-xl text-purple-600 hover:border-purple-400 hover:bg-purple-50 transition-all duration-200 flex items-center justify-center space-x-2 group"
                    >
                      <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      <span className="font-medium">Add Another Option</span>
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-3 text-gray-700">
                  Poll Duration
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={pollDuration}
                    onChange={(e) => setPollDuration(Number(e.target.value))}
                    min="10"
                    max="300"
                    className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none transition-all duration-200 hover:border-purple-300 bg-gray-50 focus:bg-white"
                  />
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                    seconds
                  </span>
                </div>
              </div>

              <button
                onClick={createPoll}
                disabled={
                  !newQuestion.trim() ||
                  newOptions.filter((opt) => opt.trim()).length < 2 ||
                  !canCreateNewPoll()
                }
                className="w-full py-4 px-6 rounded-xl font-bold text-white transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 shadow-lg bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 disabled:from-gray-400 disabled:to-gray-400"
              >
                {!canCreateNewPoll()
                  ? "⏳ Wait for current poll to finish"
                  : "🚀 Launch Poll"}
              </button>
            </div>

            {/* Connected Students */}
            <div className="mt-8">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center mr-3">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-700">
                  Connected Students ({connectedStudents.length})
                </h3>
              </div>

              <div className="space-y-2 max-h-40 overflow-y-auto">
                {connectedStudents.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white font-bold text-sm">
                          {student.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="font-semibold text-gray-700">
                        {student.name}
                      </span>
                    </div>
                    <button
                      onClick={() => onKickStudent(student.id)}
                      className="px-3 py-1 text-xs bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 hover:scale-105 active:scale-95 font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                {connectedStudents.length === 0 && (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-gray-500 font-medium">
                      No students connected yet
                    </p>
                    <p className="text-gray-400 text-sm">
                      Share your room code with students
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Live Poll & Results */}
        <div className="lg:col-span-2">
          {currentPoll ? (
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-purple-100 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl flex items-center justify-center mr-4 animate-pulse">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    Live Poll Results
                  </h2>
                </div>
                <div className="flex items-center space-x-3 bg-gradient-to-r from-orange-400 to-red-500 text-white px-4 py-2 rounded-xl shadow-lg">
                  <Clock className="w-5 h-5 animate-spin" />
                  <span className="font-mono font-bold text-lg">
                    {formatTime(timeLeft)}
                  </span>
                </div>
              </div>

              <div className="mb-8">
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 mb-6 border-l-4 border-purple-500">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {currentPoll.question}
                  </h3>
                  <p className="text-gray-600">Students are voting now...</p>
                </div>

                {/* Results */}
                <div className="space-y-4">
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
                        className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-all duration-300"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-bold text-gray-800 text-lg">
                            {option}
                          </span>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-semibold text-gray-600">
                              {votes} votes
                            </span>
                            <span className="text-lg font-bold text-purple-600">
                              {percentage.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
                          <div
                            className={`h-4 rounded-full transition-all duration-1000 ease-out bg-gradient-to-r ${
                              colors[index % colors.length]
                            } shadow-sm`}
                            style={{
                              width: `${percentage}%`,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 text-center">
                  <p className="text-gray-600 font-medium">
                    Total Responses:{" "}
                    <span className="font-bold text-purple-600">
                      {Object.values(pollResults).reduce(
                        (sum, count) => sum + count,
                        0
                      )}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-purple-100 backdrop-blur-sm">
              <div className="bg-gradient-to-r from-gray-100 to-purple-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-12 h-12 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-700 mb-3">
                No Active Poll
              </h3>
              <p className="text-gray-500 text-lg mb-6">
                Create your first poll to start engaging with students
              </p>
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 inline-block">
                <p className="text-purple-600 font-medium">
                  💡 Tip: Use polls to check understanding, gather opinions, or
                  make decisions together!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
