import React, { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Github,
  Linkedin,
  ExternalLink,
  Home,
  Code,
  Terminal,
  Cpu,
  Database,
  LayoutDashboard,
  MessageSquare,
  User,
  BookOpen,
  Server,
  Paintbrush,
  Palette,
} from "lucide-react";

const DeveloperPortfolio = () => {
  const [showProjectStructure, setShowProjectStructure] = useState(false);
  const [showPersonalInfo, setShowPersonalInfo] = useState(false);

  // Your actual project structure
  const projectStructure = [
    {
      name: "client",
      type: "folder",
      icon: <LayoutDashboard size={16} className="text-blue-400 mr-2" />,
      items: [
        { name: "node_modules", type: "folder", icon: "📦" },
        { name: "public", type: "folder", icon: "🌐" },
        {
          name: "src",
          type: "folder",
          icon: <Code size={16} className="text-purple-400 mr-2" />,
          items: [
            {
              name: "components",
              type: "folder",
              icon: "🧩",
              items: [
                { name: "Chat.jsx", type: "file", icon: "💬" },
                { name: "developer.jsx", type: "file", icon: "👨‍💻" },
                { name: "loader.jsx", type: "file", icon: "⏳" },
                { name: "StudentView.jsx", type: "file", icon: "🎓" },
                { name: "TeacherDashboard.jsx", type: "file", icon: "👨‍🏫" },
              ],
            },
            { name: "App.js", type: "file", icon: "⚛️" },
            { name: "index.css", type: "file", icon: "🎨" },
            { name: "index.js", type: "file", icon: "🚀" },
          ],
        },
        { name: "package-lock.json", type: "file", icon: "🔒" },
        { name: "package.json", type: "file", icon: "📄" },
      ],
    },
    {
      name: "server",
      type: "folder",
      icon: <Server size={16} className="text-green-400 mr-2" />,
      items: [
        { name: "models", type: "folder", icon: "📊" },
        { name: "node_modules", type: "folder", icon: "📦" },
        { name: "routes", type: "folder", icon: "🛣️" },
        { name: "package-lock.json", type: "file", icon: "🔒" },
        { name: "package.json", type: "file", icon: "📄" },
        { name: "server.js", type: "file", icon: "⚙️" },
      ],
    },
    { name: ".gitignore", type: "file", icon: "👁️‍🗨️" },
    { name: "package-lock.json", type: "file", icon: "🔒" },
    {
      name: "README.md",
      type: "file",
      icon: <BookOpen size={16} className="text-yellow-400 mr-2" />,
    },
  ];

  // Recursive component for rendering file structure
  const FileItem = ({ item, depth = 0 }) => {
    const [expanded, setExpanded] = useState(false);
    const isFolder = item.type === "folder";

    return (
      <div className={`${depth > 0 ? "ml-6" : ""}`}>
        <div
          className="flex items-center py-1 hover:bg-gray-700/30 rounded cursor-pointer transition-colors"
          onClick={() => isFolder && setExpanded(!expanded)}
        >
          <span className="inline-flex items-center mr-2">
            {isFolder ? (
              expanded ? (
                <ChevronDown size={14} />
              ) : (
                <ChevronRight size={14} />
              )
            ) : (
              <span className="w-4"></span>
            )}
          </span>
          <span className="mr-2">
            {typeof item.icon === "string"
              ? item.icon
              : item.icon || (isFolder ? "📁" : "📄")}
          </span>
          <span className={`${isFolder ? "font-medium" : ""}`}>
            {item.name}
          </span>
        </div>

        {isFolder && expanded && item.items && (
          <div className="space-y-1 mt-1">
            {item.items.map((subItem, index) => (
              <FileItem key={index} item={subItem} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 font-sans">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden opacity-20">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full mix-blend-overlay filter blur-3xl animate-float"></div>
        <div className="absolute top-1/2 right-1/3 w-72 h-72 bg-indigo-500 rounded-full mix-blend-overlay filter blur-3xl animate-float animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-56 h-56 bg-purple-500 rounded-full mix-blend-overlay filter blur-3xl animate-float animation-delay-4000"></div>
      </div>

      {/* Home Button */}
      <a
        href="/"
        className="fixed top-6 left-6 z-50 p-3 bg-gray-800/50 hover:bg-gray-700/70 backdrop-blur-md rounded-full border border-gray-700 transition-all hover:scale-110 shadow-lg"
        aria-label="Home"
      >
        <Home size={20} className="text-blue-400" />
      </a>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        {/* Header Section */}
        <header className="text-center mb-16 animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center animate-pulse shadow-lg">
                <Terminal size={48} className="text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-400 rounded-full flex items-center justify-center animate-ping-slow">
                <div className="w-3 h-3 bg-green-600 rounded-full"></div>
              </div>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
            Aditya Singh
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto flex items-center justify-center">
            <Cpu className="mr-2" size={20} />
            Full Stack Developer | Problem Solver | Tech Enthusiast
          </p>
          <div className="flex justify-center space-x-4 mt-6">
            <a
              href="https://github.com/ADITYA2004S"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-gray-800/50 hover:bg-gray-700/70 backdrop-blur-md rounded-full border border-gray-700 transition-all hover:scale-110"
              aria-label="GitHub"
            >
              <Github size={20} className="text-blue-400" />
            </a>
            <a
              href="https://www.linkedin.com/in/adityasingh04/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-gray-800/50 hover:bg-gray-700/70 backdrop-blur-md rounded-full border border-gray-700 transition-all hover:scale-110"
              aria-label="LinkedIn"
            >
              <Linkedin size={20} className="text-blue-400" />
            </a>
            <a
              href="https://aditya-singh-portfolio.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-gray-800/50 hover:bg-gray-700/70 backdrop-blur-md rounded-full border border-gray-700 transition-all hover:scale-110"
              aria-label="Portfolio"
            >
              <ExternalLink size={20} className="text-blue-400" />
            </a>
          </div>
        </header>

        {/* Main Content */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Column - Project Structure */}
          <div className="md:col-span-2 space-y-8">
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700 shadow-lg">
              <button
                onClick={() => setShowProjectStructure(!showProjectStructure)}
                className="flex items-center w-full text-left mb-4 focus:outline-none group"
              >
                <div className="p-2 mr-3 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors">
                  <Code size={20} className="text-blue-400" />
                </div>
                <h2 className="text-xl font-semibold flex-1">
                  Project Structure
                </h2>
                {showProjectStructure ? (
                  <ChevronDown
                    size={20}
                    className="text-gray-400 group-hover:text-white transition-colors"
                  />
                ) : (
                  <ChevronRight
                    size={20}
                    className="text-gray-400 group-hover:text-white transition-colors"
                  />
                )}
              </button>

              {showProjectStructure && (
                <div className="animate-slide-down">
                  <div className="font-mono text-sm space-y-1 bg-gray-900/30 p-4 rounded-lg border border-gray-800">
                    {projectStructure.map((item, index) => (
                      <FileItem key={index} item={item} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Introduction Section */}
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700 shadow-lg animate-fade-in-up">
              <div className="flex items-center mb-6">
                <div className="p-2 mr-3 bg-indigo-500/20 rounded-lg">
                  <User size={20} className="text-indigo-400" />
                </div>
                <h2 className="text-xl font-semibold">About Me</h2>
              </div>
              <div className="space-y-4 text-gray-300 pl-2">
                <p className="flex items-start">
                  <span className="mr-2">👋</span>
                  Hello! I'm Aditya Singh, a passionate Full Stack Developer
                  with expertise in JavaScript, React, Node.js, and modern web
                  technologies.
                </p>
                <p className="flex items-start">
                  <span className="mr-2">💻</span>I specialize in building
                  scalable, performant web applications with clean, maintainable
                  code. My approach combines technical excellence with
                  user-centric design.
                </p>
                <p className="flex items-start">
                  <span className="mr-2">🌱</span>
                  When I'm not coding, you can find me contributing to open
                  source, learning new technologies, or mentoring aspiring
                  developers.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Personal Info */}
          <div className="space-y-8">
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700 shadow-lg">
              <button
                onClick={() => setShowPersonalInfo(!showPersonalInfo)}
                className="flex items-center w-full text-left mb-4 focus:outline-none group"
              >
                <div className="p-2 mr-3 bg-purple-500/20 rounded-lg group-hover:bg-purple-500/30 transition-colors">
                  <MessageSquare size={20} className="text-purple-400" />
                </div>
                <h2 className="text-xl font-semibold flex-1">
                  Personal Profile
                </h2>
                {showPersonalInfo ? (
                  <ChevronDown
                    size={20}
                    className="text-gray-400 group-hover:text-white transition-colors"
                  />
                ) : (
                  <ChevronRight
                    size={20}
                    className="text-gray-400 group-hover:text-white transition-colors"
                  />
                )}
              </button>

              {showPersonalInfo && (
                <div className="animate-slide-down space-y-6">
                  <div className="overflow-hidden rounded-lg border-2 border-gray-700 hover:border-blue-500 transition-all duration-300">
                    <img
                      src="https://via.placeholder.com/400x300"
                      alt="Aditya Singh"
                      className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/400x300";
                      }}
                    />
                  </div>
                  <a
                    href="https://aditya-singh-portfolio.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center space-x-2 w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-lg font-medium transition-all shadow-lg hover:shadow-blue-500/20"
                  >
                    <span>View Full Portfolio</span>
                    <ExternalLink size={16} />
                  </a>
                </div>
              )}
            </div>

            {/* Skills Quick View */}
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700 shadow-lg animate-fade-in-up">
              <div className="flex items-center mb-6">
                <div className="p-2 mr-3 bg-green-500/20 rounded-lg">
                  <Database size={20} className="text-green-400" />
                </div>
                <h2 className="text-xl font-semibold">Core Skills</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  {
                    skill: "JavaScript",
                    icon: "JS",
                    color: "bg-yellow-500/20 text-yellow-400",
                  },
                  {
                    skill: "React",
                    icon: "⚛️",
                    color: "bg-blue-500/20 text-blue-400",
                  },
                  {
                    skill: "Node.js",
                    icon: "🟢",
                    color: "bg-green-500/20 text-green-400",
                  },
                  {
                    skill: "Python",
                    icon: "🐍",
                    color: "bg-indigo-500/20 text-indigo-400",
                  },
                  {
                    skill: "MongoDB",
                    icon: "🍃",
                    color: "bg-green-600/20 text-green-500",
                  },
                  {
                    skill: "AWS",
                    icon: "☁️",
                    color: "bg-orange-500/20 text-orange-400",
                  },
                  {
                    skill: "CSS",
                    icon: <Paintbrush size={14} className="mr-1" />,
                    color: "bg-blue-400/20 text-blue-300",
                  },
                  {
                    skill: "Tailwind CSS",
                    icon: <Palette size={14} className="mr-1" />,
                    color: "bg-cyan-500/20 text-cyan-400",
                  },
                  {
                    skill: "Java",
                    icon: "☕",
                    color: "bg-red-500/20 text-red-400",
                  },
                  {
                    skill: "Figma",
                    icon: "✏️",
                    color: "bg-purple-500/20 text-purple-400",
                  },
                ].map((item, index) => (
                  <span
                    key={index}
                    className={`px-3 py-1 ${item.color} rounded-full text-sm flex items-center`}
                  >
                    <span className="mr-1">{item.icon}</span>
                    {item.skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animation styles */}
      <style jsx global>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes ping-slow {
          0% {
            transform: scale(0.8);
            opacity: 0.8;
          }
          70% {
            transform: scale(1.3);
            opacity: 0.2;
          }
          100% {
            transform: scale(0.8);
            opacity: 0.8;
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }
        .animate-slide-down {
          animation: slide-down 0.4s ease-out;
        }
        .animate-ping-slow {
          animation: ping-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default DeveloperPortfolio;
