import React, { useState, useEffect } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";
import Games from "./components/Games";
import GameStore from "./components/GameStore";
import AICreatePage from "./components/AICreatePage";
import { Button } from "./components/ui/button";
import { User, Game } from "./types";
import { motion, AnimatePresence } from "motion/react";
import { useUser } from "./context/UserContext";

// Game Imports
import TugOfWarGame from "../app/games/keo-co/page";
import TiltQuizGame from "../app/games/quiz-nghieng-dau/TiltQuizGame";
import LuckyWheelGame from "../app/games/vong-quay/page";
import FruitSlasherGame from "../app/games/chem-hoa-qua/FruitSlasherGame";
import SleepingDragonGame from "../app/games/rong-ngu/page";
import PacedQuizGame from "../app/games/trac-nghiem-nhip-do/page";
import TheHocNhomGame from "../app/games/the-hoc-nhom/page";
import ManageQuestions from "../app/dashboard/questions/page";

export default function App() {
  const { currentUser, logout, loading } = useUser();
  const [currentPage, setCurrentPage] = useState<"login" | "register" | "dashboard" | "games" | "ai-create">("login");
  const [activeTab, setActiveTab] = useState<"dashboard" | "games" | "classes" | "ai-create" | "questions">("dashboard");
  const [activeGame, setActiveGame] = useState<Game | null>(null);
  
  // Custom SPA Routing with window history API
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigateTo = (path: string) => {
    window.history.pushState(null, "", path);
    setCurrentPath(path);
  };

  // Sync routing state with page and activeTab states
  useEffect(() => {
    if (currentPath === "/" || currentPath === "/dashboard") {
      setActiveTab("dashboard");
      setCurrentPage("dashboard");
    } else if (currentPath === "/games") {
      setActiveTab("games");
      setCurrentPage("dashboard");
    } else if (currentPath === "/classes") {
      setActiveTab("classes");
      setCurrentPage("dashboard");
    } else if (currentPath === "/ai-create") {
      setActiveTab("ai-create");
      setCurrentPage("dashboard");
    } else if (currentPath === "/dashboard/questions") {
      setActiveTab("questions");
      setCurrentPage("dashboard");
    } else if (currentPath.startsWith("/games/")) {
      setCurrentPage("games");
    }
  }, [currentPath]);

  // Check and sync page state when session is resolved
  useEffect(() => {
    if (!loading) {
      if (currentUser) {
        if (currentPage === "login" || currentPage === "register") {
          // Keep current path if it's already a game, else go to dashboard
          if (currentPath.startsWith("/games/")) {
            setCurrentPage("games");
          } else if (currentPath === "/games") {
            setActiveTab("games");
            setCurrentPage("dashboard");
          } else if (currentPath === "/classes") {
            setActiveTab("classes");
            setCurrentPage("dashboard");
          } else if (currentPath === "/ai-create") {
            setActiveTab("ai-create");
            setCurrentPage("dashboard");
          } else {
            navigateTo("/");
          }
        }
      } else {
        if (currentPage !== "register") {
          setCurrentPage("login");
        }
      }
    }
  }, [currentUser, loading]);

  const handleLoginSuccess = (user: User) => {
    navigateTo("/");
  };

  const handleRegisterSuccess = () => {
    setCurrentPage("login");
  };

  const handleLogout = () => {
    logout();
    setCurrentPage("login");
    navigateTo("/");
  };

  const handlePlayGame = (game: Game) => {
    setActiveGame(game);
    if (game.type === "keoco") {
      navigateTo("/games/keo-co");
    } else {
      setCurrentPage("games");
    }
  };

  const handleBackToDashboard = () => {
    setActiveGame(null);
    navigateTo("/games");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-slate-600">Đang khởi động hệ thống...</p>
        </div>
      </div>
    );
  }

  // Helper to render current route-specific game
  const renderGameRoute = () => {
    const props = {
      game: activeGame || undefined,
      onBackToDashboard: handleBackToDashboard
    };

    switch (currentPath) {
      case "/games/keo-co":
        return <TugOfWarGame {...props} />;
      case "/games/quiz-nghieng-dau":
        return <TiltQuizGame {...props} />;
      case "/games/vong-quay":
        return <LuckyWheelGame {...props} />;
      case "/games/chem-hoa-qua":
        return <FruitSlasherGame {...props} />;
      case "/games/rong-ngu":
        return <SleepingDragonGame {...props} />;
      case "/games/trac-nghiem-nhip-do":
        return <PacedQuizGame {...props} />;
      case "/games/the-hoc-nhom":
        return <TheHocNhomGame {...props} />;
      default:
        // Fallback for custom user created games
        if (activeGame) {
          return <Games game={activeGame} onBackToDashboard={handleBackToDashboard} />;
        }
        return (
          <div className="p-8 text-center space-y-4">
            <h3 className="text-lg font-bold text-slate-800">Không tìm thấy trò chơi</h3>
            <Button onClick={handleBackToDashboard}>Quay lại Kho game</Button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-blue-600 selection:text-white">
      <Layout
        activeTab={activeTab}
        onTabChange={(tab) => {
          if (tab === "dashboard") navigateTo("/");
          else if (tab === "games") navigateTo("/games");
          else if (tab === "classes") navigateTo("/classes");
          else if (tab === "ai-create") navigateTo("/ai-create");
          else if (tab === "questions") navigateTo("/dashboard/questions");
        }}
        currentUser={currentUser}
        onLogout={handleLogout}
        onNavigateLogin={() => {
          setActiveGame(null);
          setCurrentPage("login");
        }}
      >
        <AnimatePresence mode="wait">
          {currentPage === "login" && (
            <motion.div
              key="login"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="w-full"
            >
              <Login
                onLoginSuccess={handleLoginSuccess}
                onNavigateToRegister={() => setCurrentPage("register")}
              />
            </motion.div>
          )}

          {currentPage === "register" && (
            <motion.div
              key="register"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="w-full"
            >
              <Register
                onRegisterSuccess={handleRegisterSuccess}
                onNavigateToLogin={() => setCurrentPage("login")}
              />
            </motion.div>
          )}

          {currentPage === "dashboard" && currentUser && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full"
            >
              {activeTab === "questions" ? (
                <ManageQuestions />
              ) : activeTab === "games" ? (
                <GameStore onStartGame={(route) => navigateTo(route)} />
              ) : activeTab === "ai-create" ? (
                <AICreatePage currentUser={currentUser} />
              ) : (
                <Dashboard 
                  currentUser={currentUser} 
                  onPlayGame={handlePlayGame}
                  activeTab={activeTab === "questions" ? "dashboard" : activeTab as any}
                />
              )}
            </motion.div>
          )}

          {currentPage === "games" && currentUser && (
            <motion.div
              key="games"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full"
            >
              {renderGameRoute()}
            </motion.div>
          )}
        </AnimatePresence>
      </Layout>
    </div>
  );
}
