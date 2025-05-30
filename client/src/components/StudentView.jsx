import React, { useState, useEffect } from "react";
import {
  Clock,
  AlertCircle,
  CheckCircle,
  Vote,
  Users,
  TrendingUp,
  Sparkles,
} from "lucide-react";

const StudentView = ({
  currentPoll,
  pollResults,
  timeLeft,
  hasAnswered,
  selectedAnswer,
  onSubmitAnswer,
  formatTime,
}) => {
  const [localSelectedAnswer, setLocalSelectedAnswer] =
    useState(selectedAnswer);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showResults, setShowResults] = useState(hasAnswered);

  useEffect(() => {
    if (hasAnswered && !showResults) {
      // Delay showing results for a smooth transition
      setTimeout(() => setShowResults(true), 500);
    }
  }, [hasAnswered, showResults]);

  const submitAnswer = () => {
    if (localSelectedAnswer && currentPoll) {
      setIsAnimating(true);
      setTimeout(() => {
        onSubmitAnswer(localSelectedAnswer);
        setIsAnimating(false);
      }, 600);
    }
  };

  const getTimeColor = () => {
    if (timeLeft > 60) return "#5767D0";
    if (timeLeft > 30) return "#F59E0B";
    return "#EF4444";
  };

  const getTimeBackground = () => {
    if (timeLeft > 60) return "bg-blue-50";
    if (timeLeft > 30) return "bg-yellow-50";
    return "bg-red-50";
  };

  const totalVotes = pollResults
    ? Object.values(pollResults).reduce((sum, count) => sum + count, 0)
    : 0;
  const isLowTime = timeLeft <= 30 && timeLeft > 0;

  return (
    <div className="max-w-4xl mx-auto px-4">
      {currentPoll ? (
        <div className="relative">
          {/* Floating background elements */}
          <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full opacity-20 animate-pulse"></div>
          <div
            className="absolute -top-2 -right-8 w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full opacity-30 animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>

          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden backdrop-blur-sm">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-8 border-b border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-white rounded-2xl shadow-sm">
                    <Vote className="w-6 h-6" style={{ color: "#5767D0" }} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                      Live Poll
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Cast your vote now
                    </p>
                  </div>
                </div>

                <div
                  className={`flex items-center space-x-3 px-4 py-2 rounded-2xl ${getTimeBackground()} border border-white shadow-sm transition-all duration-300 ${
                    isLowTime ? "animate-bounce" : ""
                  }`}
                >
                  <Clock
                    className="w-5 h-5"
                    style={{ color: getTimeColor() }}
                  />
                  <span
                    className="font-mono font-bold text-lg"
                    style={{ color: getTimeColor() }}
                  >
                    {formatTime(timeLeft)}
                  </span>
                  {isLowTime && (
                    <Sparkles className="w-4 h-4 text-red-500 animate-spin" />
                  )}
                </div>
              </div>

              <h3
                className="text-2xl font-semibold leading-relaxed"
                style={{ color: "#373737" }}
              >
                {currentPoll.question}
              </h3>

              {totalVotes > 0 && (
                <div className="flex items-center space-x-2 mt-4 text-sm text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>
                    {totalVotes} {totalVotes === 1 ? "vote" : "votes"} cast
                  </span>
                </div>
              )}
            </div>

            {/* Content Section */}
            <div className="p-8">
              {!hasAnswered && timeLeft > 0 ? (
                <div className="space-y-4">
                  <div className="grid gap-4">
                    {currentPoll.options.map((option, index) => (
                      <label
                        key={index}
                        className={`group relative flex items-center p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                          localSelectedAnswer === option
                            ? "border-purple-300 bg-gradient-to-r from-purple-50 to-blue-50 shadow-lg scale-105"
                            : "border-gray-200 hover:border-purple-200 bg-white hover:bg-gradient-to-r hover:from-gray-50 hover:to-purple-50"
                        }`}
                        style={{
                          animationDelay: `${index * 100}ms`,
                        }}
                      >
                        <div className="relative">
                          <input
                            type="radio"
                            name="poll-option"
                            value={option}
                            checked={localSelectedAnswer === option}
                            onChange={(e) =>
                              setLocalSelectedAnswer(e.target.value)
                            }
                            className="sr-only"
                          />
                          <div
                            className={`w-6 h-6 rounded-full border-2 transition-all duration-200 ${
                              localSelectedAnswer === option
                                ? "border-purple-500 bg-purple-500"
                                : "border-gray-300 group-hover:border-purple-400"
                            }`}
                          >
                            {localSelectedAnswer === option && (
                              <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-ping"></div>
                            )}
                          </div>
                        </div>

                        <span
                          className={`ml-4 font-semibold text-lg transition-colors duration-200 ${
                            localSelectedAnswer === option
                              ? "text-purple-700"
                              : "text-gray-700 group-hover:text-purple-600"
                          }`}
                        >
                          {option}
                        </span>

                        {/* Hover effect */}
                        <div className="absolute right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                        </div>
                      </label>
                    ))}
                  </div>

                  <div className="pt-6">
                    <button
                      onClick={submitAnswer}
                      disabled={!localSelectedAnswer || isAnimating}
                      className={`group relative w-full py-4 px-8 rounded-2xl font-bold text-lg text-white transition-all duration-300 transform hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed overflow-hidden ${
                        isAnimating ? "animate-pulse" : ""
                      }`}
                      style={{
                        background: localSelectedAnswer
                          ? "linear-gradient(135deg, #5767D0 0%, #7765DA 100%)"
                          : "linear-gradient(135deg, #9CA3AF 0%, #6B7280 100%)",
                      }}
                    >
                      {/* Button background animation */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 group-hover:animate-pulse"></div>

                      <span className="relative z-10 flex items-center justify-center space-x-2">
                        {isAnimating ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Submitting...</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-5 h-5" />
                            <span>Submit Answer</span>
                          </>
                        )}
                      </span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {hasAnswered && (
                    <div className="flex items-center justify-center p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200 shadow-sm">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-green-100 rounded-full">
                          <CheckCircle className="w-6 h-6 text-green-600 animate-bounce" />
                        </div>
                        <div>
                          <span className="text-green-800 font-bold text-lg">
                            Answer Submitted!
                          </span>
                          <p className="text-green-600 text-sm mt-1">
                            Your response has been recorded
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Results Section */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 mb-4">
                      <TrendingUp
                        className="w-5 h-5"
                        style={{ color: "#5767D0" }}
                      />
                      <h4
                        className="text-xl font-bold"
                        style={{ color: "#373737" }}
                      >
                        Live Results
                      </h4>
                    </div>

                    {currentPoll.options.map((option, index) => {
                      const votes = pollResults[option] || 0;
                      const percentage =
                        totalVotes > 0 ? (votes / totalVotes) * 100 : 0;
                      const isSelected = selectedAnswer === option;

                      return (
                        <div
                          key={index}
                          className={`relative p-5 rounded-2xl border-2 transition-all duration-500 ${
                            isSelected
                              ? "border-purple-300 bg-gradient-to-r from-purple-50 to-blue-50 shadow-lg"
                              : "border-gray-200 bg-white hover:border-gray-300"
                          }`}
                          style={{
                            animationDelay: `${index * 150}ms`,
                          }}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              <span
                                className={`font-bold text-lg ${
                                  isSelected
                                    ? "text-purple-700"
                                    : "text-gray-700"
                                }`}
                              >
                                {option}
                              </span>
                              {isSelected && (
                                <div className="flex items-center space-x-1">
                                  <CheckCircle className="w-4 h-4 text-purple-600" />
                                  <span className="text-purple-600 text-sm font-medium">
                                    Your choice
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="text-right">
                              <div
                                className="font-bold text-lg"
                                style={{ color: "#373737" }}
                              >
                                {votes} {votes === 1 ? "vote" : "votes"}
                              </div>
                              <div
                                className="text-sm"
                                style={{ color: "#6E6E6E" }}
                              >
                                {percentage.toFixed(1)}%
                              </div>
                            </div>
                          </div>

                          <div className="relative">
                            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                              <div
                                className="h-4 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                                style={{
                                  width: `${percentage}%`,
                                  background: isSelected
                                    ? "linear-gradient(90deg, #5767D0 0%, #7765DA 100%)"
                                    : "linear-gradient(90deg, #9CA3AF 0%, #6B7280 100%)",
                                }}
                              >
                                {/* Shimmer effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 transform -skew-x-12 animate-pulse"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="relative">
          {/* Floating background elements */}
          <div className="absolute -top-4 -left-4 w-32 h-32 bg-gradient-to-br from-gray-100 to-blue-100 rounded-full opacity-20 animate-pulse"></div>

          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-12 text-center backdrop-blur-sm">
            <div className="space-y-6">
              <div className="relative inline-block">
                <AlertCircle
                  className="w-20 h-20 mx-auto animate-pulse"
                  style={{ color: "#6E6E6E" }}
                />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-100 rounded-full animate-ping"></div>
              </div>

              <div>
                <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  No Active Poll
                </h3>
                <p
                  className="text-lg leading-relaxed max-w-md mx-auto"
                  style={{ color: "#6E6E6E" }}
                >
                  Waiting for your teacher to start an exciting poll. Get ready
                  to share your thoughts!
                </p>
              </div>

              <div className="flex justify-center space-x-2 mt-8">
                <div className="w-3 h-3 bg-gray-300 rounded-full animate-bounce"></div>
                <div
                  className="w-3 h-3 bg-gray-300 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-3 h-3 bg-gray-300 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentView;
