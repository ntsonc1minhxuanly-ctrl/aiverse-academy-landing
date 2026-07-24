import React, { useState } from "react";
import { Sparkles, LayoutDashboard, Gamepad2, Users, LogOut, ChevronRight, User, AlertCircle, Brain } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface LayoutProps {
  children: React.ReactNode;
  activeTab: "dashboard" | "games" | "classes" | "ai-create" | "questions";
  onTabChange: (tab: "dashboard" | "games" | "classes" | "ai-create" | "questions") => void;
  currentUser: any;
  onLogout: () => void;
  onNavigateLogin?: () => void;
}

export default function Layout({
  children,
  activeTab,
  onTabChange,
  currentUser,
  onLogout,
  onNavigateLogin,
}: LayoutProps) {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const handleTabClick = (tab: "dashboard" | "games" | "classes" | "ai-create" | "questions") => {
    if (!currentUser) {
      setToastMessage("Thầy cô vui lòng đăng nhập trước để sử dụng tính năng này!");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      onNavigateLogin?.();
      return;
    }
    onTabChange(tab);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans relative">
      {/* Toast Notification for Unauthenticated Actions */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-5 py-3 rounded-2xl shadow-xl z-50 text-sm font-semibold flex items-center space-x-2.5 border border-blue-500/30"
          >
            <AlertCircle className="h-4.5 w-4.5 text-blue-100 animate-bounce" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Navbar */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-100 sticky top-0 z-40 shadow-sm shadow-slate-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Left side: Logo */}
            <div 
              className="flex items-center space-x-3 cursor-pointer select-none group"
              onClick={() => handleTabClick("dashboard")}
            >
              <div className="p-2 bg-blue-600 rounded-xl text-white flex items-center justify-center shadow-md shadow-blue-200 transition-all duration-300 group-hover:scale-105 group-hover:rotate-3">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-base sm:text-lg font-black tracking-tight bg-gradient-to-r from-blue-700 via-blue-600 to-blue-800 bg-clip-text text-transparent block">
                  GIÁO VIÊN ĐỔI MỚI
                </span>
                <span className="text-[9px] text-slate-400 font-mono tracking-widest block uppercase font-bold -mt-0.5">
                  PHƯƠNG PHÁP SƯ PHẠM SỐ
                </span>
              </div>
            </div>

            {/* Middle: Menu Navigation Bar */}
            <nav className="hidden md:flex items-center space-x-1.5">
              <button
                onClick={() => handleTabClick("dashboard")}
                className={`px-4 py-2 rounded-xl text-sm font-bold tracking-tight transition-all duration-200 relative cursor-pointer ${
                  activeTab === "dashboard" && currentUser
                    ? "text-blue-700 bg-blue-50/80"
                    : "text-slate-600 hover:text-blue-600 hover:bg-slate-50"
                }`}
              >
                🏠 Trang chủ
                {activeTab === "dashboard" && currentUser && (
                  <motion.span 
                    layoutId="activeHeaderLine" 
                    className="absolute bottom-0 left-4 right-4 h-0.5 bg-blue-600 rounded-full" 
                  />
                )}
              </button>
              
              <button
                onClick={() => handleTabClick("games")}
                className={`px-4 py-2 rounded-xl text-sm font-bold tracking-tight transition-all duration-200 relative cursor-pointer ${
                  activeTab === "games" && currentUser
                    ? "text-blue-700 bg-blue-50/80"
                    : "text-slate-600 hover:text-blue-600 hover:bg-slate-50"
                }`}
              >
                Kho game
                {activeTab === "games" && currentUser && (
                  <motion.span 
                    layoutId="activeHeaderLine" 
                    className="absolute bottom-0 left-4 right-4 h-0.5 bg-blue-600 rounded-full" 
                  />
                )}
              </button>

              <button
                onClick={() => handleTabClick("classes")}
                className={`px-4 py-2 rounded-xl text-sm font-bold tracking-tight transition-all duration-200 relative cursor-pointer ${
                  activeTab === "classes" && currentUser
                    ? "text-blue-700 bg-blue-50/80"
                    : "text-slate-600 hover:text-blue-600 hover:bg-slate-50"
                }`}
              >
                Tạo lớp
                {activeTab === "classes" && currentUser && (
                  <motion.span 
                    layoutId="activeHeaderLine" 
                    className="absolute bottom-0 left-4 right-4 h-0.5 bg-blue-600 rounded-full" 
                  />
                )}
              </button>

              <button
                onClick={() => handleTabClick("ai-create")}
                className={`px-4 py-2 rounded-xl text-sm font-bold tracking-tight transition-all duration-200 relative cursor-pointer ${
                  activeTab === "ai-create" && currentUser
                    ? "text-blue-700 bg-blue-50/80"
                    : "text-slate-600 hover:text-blue-600 hover:bg-slate-50"
                }`}
              >
                Soạn game AI
                {activeTab === "ai-create" && currentUser && (
                  <motion.span 
                    layoutId="activeHeaderLine" 
                    className="absolute bottom-0 left-4 right-4 h-0.5 bg-blue-600 rounded-full" 
                  />
                )}
              </button>

              <button
                onClick={() => handleTabClick("questions")}
                className={`px-4 py-2 rounded-xl text-sm font-bold tracking-tight transition-all duration-200 relative cursor-pointer ${
                  activeTab === "questions" && currentUser
                    ? "text-blue-700 bg-blue-50/80"
                    : "text-slate-600 hover:text-blue-600 hover:bg-slate-50"
                }`}
              >
                📚 Ngân hàng câu hỏi
                {activeTab === "questions" && currentUser && (
                  <motion.span 
                    layoutId="activeHeaderLine" 
                    className="absolute bottom-0 left-4 right-4 h-0.5 bg-blue-600 rounded-full" 
                  />
                )}
              </button>

              <button
                onClick={() => {
                  window.history.pushState(null, "", "/games/keo-co");
                  window.dispatchEvent(new PopStateEvent("popstate"));
                }}
                className="px-4 py-2 rounded-xl text-sm font-bold tracking-tight transition-all duration-200 text-slate-600 hover:text-blue-600 hover:bg-slate-50 cursor-pointer"
              >
                ⚔️ Kéo Co
              </button>

              <button
                onClick={() => {
                  window.history.pushState(null, "", "/games/vong-quay");
                  window.dispatchEvent(new PopStateEvent("popstate"));
                }}
                className="px-4 py-2 rounded-xl text-sm font-bold tracking-tight transition-all duration-200 text-slate-600 hover:text-blue-600 hover:bg-slate-50 cursor-pointer"
              >
                🎡 Vòng Quay
              </button>

              <button
                onClick={() => {
                  window.history.pushState(null, "", "/games/trac-nghiem-nhip-do");
                  window.dispatchEvent(new PopStateEvent("popstate"));
                }}
                className="px-4 py-2 rounded-xl text-sm font-bold tracking-tight transition-all duration-200 text-slate-600 hover:text-blue-600 hover:bg-slate-50 cursor-pointer"
              >
                📝 Trắc nghiệm nhịp độ
              </button>

              <button
                onClick={() => {
                  window.history.pushState(null, "", "/games/rong-ngu");
                  window.dispatchEvent(new PopStateEvent("popstate"));
                }}
                className="px-4 py-2 rounded-xl text-sm font-bold tracking-tight transition-all duration-200 text-slate-600 hover:text-blue-600 hover:bg-slate-50 cursor-pointer"
              >
                🐉 Rồng Ngủ
              </button>

              <button
                onClick={() => {
                  window.history.pushState(null, "", "/games/the-hoc-nhom");
                  window.dispatchEvent(new PopStateEvent("popstate"));
                }}
                className="px-4 py-2 rounded-xl text-sm font-bold tracking-tight transition-all duration-200 text-slate-600 hover:text-blue-600 hover:bg-slate-50 cursor-pointer"
              >
                📚 Thẻ học nhóm
              </button>

              <button
                onClick={() => {
                  if (currentUser) {
                    onLogout();
                  } else {
                    onNavigateLogin?.();
                  }
                }}
                className={`px-4 py-2 rounded-xl text-sm font-bold tracking-tight transition-all duration-200 cursor-pointer ${
                  !currentUser
                    ? "text-blue-700 bg-blue-50 hover:bg-blue-100 shadow-sm shadow-blue-50"
                    : "text-slate-600 hover:text-red-600 hover:bg-red-50"
                }`}
              >
                {currentUser ? "Đăng xuất" : "Đăng nhập"}
              </button>
            </nav>

            {/* Right side: User Profile (only shown when authenticated) */}
            <div className="flex items-center space-x-3">
              {currentUser ? (
                <div className="flex items-center space-x-2.5">
                  <div className="h-8.5 w-8.5 rounded-full bg-blue-50 flex items-center justify-center text-blue-700 font-bold border border-blue-100">
                    <User className="h-4 w-4" />
                  </div>
                  <div className="hidden sm:block text-left leading-none">
                    <p className="text-xs font-bold text-slate-800">{currentUser.fullName || "Giáo viên"}</p>
                    <p className="text-[10px] text-slate-400 font-mono capitalize mt-0.5">
                      {currentUser.role === "teacher" ? "🏫 Giáo Viên" : "🎒 Học Sinh"}
                    </p>
                  </div>
                  {/* Logout Button (Mobile or backup) */}
                  <button
                    onClick={onLogout}
                    className="md:hidden p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-50 cursor-pointer"
                    title="Đăng xuất"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={onNavigateLogin}
                  className="md:hidden inline-flex items-center text-xs font-bold bg-blue-600 text-white py-1.5 px-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Đăng nhập
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex-1 py-8 flex flex-col md:flex-row gap-8">
        {/* Sidebar navigation (Only shown when authenticated) */}
        {currentUser && (
          <aside className="w-full md:w-64 flex-shrink-0">
            <nav className="bg-white rounded-2xl border border-slate-100 p-4 space-y-1 shadow-sm sticky top-24">
              <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                Bảng điều khiển
              </div>

              <button
                onClick={() => handleTabClick("dashboard")}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold tracking-tight transition-all cursor-pointer ${
                  activeTab === "dashboard"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-100"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <LayoutDashboard className="h-4.5 w-4.5" />
                  <span>🏠 Trang chủ</span>
                </div>
                <ChevronRight className={`h-4 w-4 opacity-70 ${activeTab === "dashboard" ? "block" : "hidden"}`} />
              </button>

              <button
                onClick={() => handleTabClick("games")}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold tracking-tight transition-all cursor-pointer ${
                  activeTab === "games"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-100"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Gamepad2 className="h-4.5 w-4.5" />
                  <span>Trò chơi giáo dục</span>
                </div>
                <ChevronRight className={`h-4 w-4 opacity-70 ${activeTab === "games" ? "block" : "hidden"}`} />
              </button>

              <button
                onClick={() => handleTabClick("ai-create")}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold tracking-tight transition-all cursor-pointer ${
                  activeTab === "ai-create"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-100"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Brain className="h-4.5 w-4.5" />
                  <span>Soạn game AI</span>
                </div>
                <ChevronRight className={`h-4 w-4 opacity-70 ${activeTab === "ai-create" ? "block" : "hidden"}`} />
              </button>

              <button
                onClick={() => handleTabClick("questions")}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold tracking-tight transition-all cursor-pointer ${
                  activeTab === "questions"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-100"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <span className="text-base leading-none">📚</span>
                  <span>📚 Ngân hàng câu hỏi</span>
                </div>
                <ChevronRight className={`h-4 w-4 opacity-70 ${activeTab === "questions" ? "block" : "hidden"}`} />
              </button>

              <button
                onClick={() => {
                  window.history.pushState(null, "", "/games/keo-co");
                  window.dispatchEvent(new PopStateEvent("popstate"));
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold tracking-tight transition-all cursor-pointer text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              >
                <div className="flex items-center space-x-2.5">
                  <span>⚔️ Kéo Co</span>
                </div>
              </button>

              <button
                onClick={() => {
                  window.history.pushState(null, "", "/games/vong-quay");
                  window.dispatchEvent(new PopStateEvent("popstate"));
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold tracking-tight transition-all cursor-pointer text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              >
                <div className="flex items-center space-x-2.5">
                  <span>🎡 Vòng Quay</span>
                </div>
              </button>

              <button
                onClick={() => {
                  window.history.pushState(null, "", "/games/trac-nghiem-nhip-do");
                  window.dispatchEvent(new PopStateEvent("popstate"));
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold tracking-tight transition-all cursor-pointer text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              >
                <div className="flex items-center space-x-2.5">
                  <span>📝 Trắc nghiệm nhịp độ</span>
                </div>
              </button>

              <button
                onClick={() => {
                  window.history.pushState(null, "", "/games/rong-ngu");
                  window.dispatchEvent(new PopStateEvent("popstate"));
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold tracking-tight transition-all cursor-pointer text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              >
                <div className="flex items-center space-x-2.5">
                  <span>🐉 Rồng Ngủ</span>
                </div>
              </button>

              <button
                onClick={() => {
                  window.history.pushState(null, "", "/games/the-hoc-nhom");
                  window.dispatchEvent(new PopStateEvent("popstate"));
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold tracking-tight transition-all cursor-pointer text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              >
                <div className="flex items-center space-x-2.5">
                  <span>📚 Thẻ học nhóm</span>
                </div>
              </button>

              <div className="pt-4 px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                Phương pháp & Đổi mới
              </div>

              <div className="p-3 bg-gradient-to-br from-blue-50/50 to-purple-50/30 rounded-xl border border-blue-100/30">
                <h4 className="text-xs font-semibold text-blue-950 mb-1 flex items-center">
                  💡 Giáo án 5 bước
                </h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Tích hợp hoạt động Trò chơi tương tác giúp nâng cao mức độ tập trung và hứng thú của học sinh thêm 85%.
                </p>
              </div>
            </nav>
          </aside>
        )}

        {/* Content View - Center-aligned when unauthenticated */}
        <main className={`flex-1 min-w-0 ${!currentUser ? "max-w-2xl mx-auto w-full flex items-center justify-center py-6" : ""}`}>
          <div className="w-full">
            {children}
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-6 text-center text-xs text-slate-400 mt-auto font-mono">
        <div className="max-w-7xl mx-auto px-4">
          <p>© 2026 Giáo Viên Đổi Mới - Kiến tạo tương lai số Việt Nam</p>
        </div>
      </footer>
    </div>
  );
}
