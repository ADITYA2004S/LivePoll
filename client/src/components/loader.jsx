import React, { useState, useEffect } from "react";

const LivePollLoader = () => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const steps = [
    "Initializing LivePoll...",
    "Loading components...",
    "Preparing dashboard...",
    "Almost ready...",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + Math.random() * 12 + 3;

        // Update step based on progress
        if (newProgress > 25 && currentStep < 1) setCurrentStep(1);
        if (newProgress > 50 && currentStep < 2) setCurrentStep(2);
        if (newProgress > 80 && currentStep < 3) setCurrentStep(3);

        if (newProgress >= 100) {
          setIsComplete(true);
          clearInterval(interval);
          return 100;
        }
        return newProgress;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [currentStep]);

  return (
    <div className="fixed inset-0 bg-slate-900 flex items-center justify-center">
      {/* Subtle grid pattern background */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="text-center space-y-8 px-8">
        {/* Logo section */}
        <div className="space-y-6">
          {/* Animated logo mark */}
          <div className="relative mx-auto w-20 h-20">
            {/* Outer rotating ring */}
            <div
              className="absolute inset-0 border-2 border-blue-500/30 rounded-full animate-spin"
              style={{ animationDuration: "3s" }}
            >
              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-500 rounded-full" />
            </div>

            {/* Inner pulsing core */}
            <div className="absolute inset-3 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
              <div className="w-6 h-6 bg-white rounded-sm animate-pulse flex items-center justify-center">
                <div className="w-3 h-3 bg-blue-600 rounded-sm" />
              </div>
            </div>
          </div>

          {/* Brand name */}
          <div>
            <h1 className="text-4xl font-light text-white tracking-wide mb-2">
              Live<span className="font-semibold text-blue-400">Poll</span>
            </h1>
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-blue-400 to-transparent mx-auto" />
          </div>
        </div>

        {/* Progress section */}
        <div className="space-y-4 max-w-md mx-auto">
          {/* Progress bar */}
          <div className="relative">
            <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-300 ease-out relative"
                style={{ width: `${progress}%` }}
              >
                {/* Subtle glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 opacity-50 animate-pulse" />
              </div>
            </div>

            {/* Progress dots */}
            <div className="absolute top-1/2 transform -translate-y-1/2 w-full flex justify-between px-1">
              {[25, 50, 75].map((milestone, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                    progress >= milestone ? "bg-blue-400" : "bg-slate-600"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Status text */}
          <div className="space-y-2">
            <p className="text-slate-300 text-sm font-medium transition-all duration-300">
              {isComplete ? "Ready!" : steps[currentStep]}
            </p>
            <p className="text-slate-500 text-xs">
              {Math.round(progress)}% complete
            </p>
          </div>
        </div>

        {/* Feature preview */}
        <div className="grid grid-cols-3 gap-4 max-w-xs mx-auto opacity-40">
          {["Real-time", "Analytics", "Insights"].map((feature, i) => (
            <div
              key={i}
              className={`text-xs text-slate-400 py-2 px-3 border border-slate-700 rounded-md transition-all duration-500 ${
                currentStep >= i ? "border-blue-500/30 text-blue-300" : ""
              }`}
              style={{ transitionDelay: `${i * 200}ms` }}
            >
              {feature}
            </div>
          ))}
        </div>
      </div>

      {/* Ambient lighting effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-blue-900/5 via-transparent to-indigo-900/5 pointer-events-none" />
    </div>
  );
};

export default LivePollLoader;
