import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Classroom, Game } from "../types";
import ClassroomsPage from "./ClassroomsPage";
import { 
  Sparkles, Plus, Trash2, Play, Users, Gamepad2, FileText, 
  HelpCircle, RotateCw, Layers, BrainCircuit, Search, Calendar, ChevronRight, Trophy
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface DashboardProps {
  currentUser: any;
  onPlayGame: (game: Game) => void;
  activeTab?: "dashboard" | "games" | "classes" | "questions" | "ai-create" | any;
  onNavigate?: (path: string) => void;
}

const PEDAGOGICAL_TIPS = [
  "Đang áp dụng thuyết kiến tạo xã hội để thiết kế hoạt động...",
  "Đang cấu trúc câu hỏi theo thang đo nhận thức Bloom (Nhận biết, Thông hiểu, Vận dụng)...",
  "Đang đóng gói câu đố thành hoạt động trò chơi hóa (Gamification) kích thích Dopamine học sinh...",
  "Đang đồng bộ thuật toán vòng quay ngẫu nhiên tương tác trực quan...",
  "Đang tối ưu hóa gợi ý của Thẻ ghi nhớ (Flashcard) nhằm thúc đẩy khả năng gợi nhớ chủ động (Active Recall)..."
];

export default function Dashboard({ currentUser, onPlayGame, activeTab, onNavigate }: DashboardProps) {
  // States for Classrooms
  const [classes, setClasses] = useState<Classroom[]>([]);
  const [newClassName, setNewClassName] = useState("");
  const [newClassGrade, setNewClassGrade] = useState("Lớp 5");
  const [newClassSubject, setNewClassSubject] = useState("Toán");
  const [newClassDesc, setNewClassDesc] = useState("");
  const [isCreatingClass, setIsCreatingClass] = useState(false);

  // States for Games
  const [games, setGames] = useState<Game[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");

  // States for AI Generator
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiGameType, setAiGameType] = useState<"quiz" | "wheel" | "flashcard" | "memory" | "keoco">("quiz");
  const [aiSubject, setAiSubject] = useState("Toán");
  const [aiGrade, setAiGrade] = useState("Lớp 5");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiProgressText, setAiProgressText] = useState("");
  const [generatedPreview, setGeneratedPreview] = useState<any | null>(null);

  // Loading notifications
  const [notif, setNotif] = useState<string | null>(null);

  // Game Sessions List state
  const [sessions, setSessions] = useState<any[]>([]);

  // Load data on mount
  useEffect(() => {
    fetchClasses();
    fetchGames();
    fetchSessions();
  }, []);

  // Handle header menu navigation scrolling & state activation
  useEffect(() => {
    if (!activeTab) return;
    if (activeTab === "classes") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (activeTab === "games") {
      setTimeout(() => {
        const el = document.getElementById("games-library-section");
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 150);
    } else if (activeTab === "dashboard") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [activeTab]);

  const fetchClasses = async () => {
    try {
      const res = await fetch("/api/classes");
      if (res.ok) {
        const data = await res.json();
        setClasses(data);
      }
    } catch (err) {
      console.error("Lỗi lấy danh sách lớp học:", err);
    }
  };

  const fetchGames = async () => {
    try {
      const res = await fetch("/api/games");
      if (res.ok) {
        const data = await res.json();
        setGames(data);
      }
    } catch (err) {
      console.error("Lỗi lấy danh sách trò chơi:", err);
    }
  };

  const fetchSessions = async () => {
    try {
      const res = await fetch("/api/game_sessions");
      if (res.ok) {
        const data = await res.json();
        const sorted = data.sort((a: any, b: any) => {
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        });
        setSessions(sorted);
      }
    } catch (err) {
      console.error("Lỗi lấy lịch sử phiên chơi game:", err);
    }
  };

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) return;

    try {
      const res = await fetch("/api/classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newClassName,
          grade: newClassGrade,
          subject: newClassSubject,
          description: newClassDesc,
        }),
      });

      if (res.ok) {
        const newClass = await res.json();
        setClasses((prev) => [...prev, newClass]);
        setNewClassName("");
        setNewClassDesc("");
        setNewClassSubject("Toán");
        setIsCreatingClass(false);
        showNotification(`🎉 Tạo lớp thành công! Mã lớp: ${newClass.code} (Học sinh sử dụng mã này để tham gia)`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteClass = async (id: string) => {
    if (!confirm("Thầy cô có chắc chắn muốn xóa lớp học này không?")) return;
    try {
      const res = await fetch(`/api/classes/${id}`, { method: "DELETE" });
      if (res.ok) {
        setClasses((prev) => prev.filter((c) => c.id !== id));
        showNotification("Đã xóa lớp học thành công.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const showNotification = (msg: string) => {
    setNotif(msg);
    setTimeout(() => setNotif(null), 3000);
  };

  // AI Generation Trigger
  const handleAIGenerate = async () => {
    if (!aiPrompt.trim()) {
      alert("Vui lòng nhập mô tả ý tưởng bài học/trò chơi muốn AI soạn!");
      return;
    }

    setAiLoading(true);
    setGeneratedPreview(null);
    
    // Cycle progress tips
    let tipIndex = 0;
    setAiProgressText(PEDAGOGICAL_TIPS[0]);
    const interval = setInterval(() => {
      tipIndex = (tipIndex + 1) % PEDAGOGICAL_TIPS.length;
      setAiProgressText(PEDAGOGICAL_TIPS[tipIndex]);
    }, 2500);

    try {
      const res = await fetch("/api/gemini/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: aiPrompt,
          type: aiGameType,
          subject: aiSubject,
          grade: aiGrade,
        }),
      });

      if (!res.ok) {
        throw new Error("Lỗi máy chủ khi thiết kế bằng AI");
      }

      const generatedData = await res.json();
      setGeneratedPreview(generatedData);
    } catch (err: any) {
      alert("Lỗi khi soạn thảo bằng AI: " + err.message);
    } finally {
      clearInterval(interval);
      setAiLoading(false);
    }
  };

  // Save generated preview to database
  const handleSaveGenerated = async () => {
    if (!generatedPreview) return;

    try {
      const contentField: any = {};
      if (aiGameType === "quiz") {
        contentField.questions = generatedPreview.questions;
      } else if (aiGameType === "flashcard") {
        contentField.flashcards = generatedPreview.flashcards;
      } else if (aiGameType === "memory") {
        contentField.memoryItems = generatedPreview.memoryItems;
      } else {
        contentField.wheelItems = generatedPreview.wheelItems;
      }

      const res = await fetch("/api/games", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: generatedPreview.title || `${aiGameType.toUpperCase()}: ${aiPrompt}`,
          type: aiGameType,
          subject: aiSubject,
          grade: aiGrade,
          description: generatedPreview.description || `Được kiến tạo từ ý tưởng: ${aiPrompt}`,
          content: contentField,
          createdBy: currentUser?.fullName || "Giáo viên Đổi Mới",
        }),
      });

      if (res.ok) {
        const savedGame = await res.json();
        setGames((prev) => [savedGame, ...prev]);
        setGeneratedPreview(null);
        setAiPrompt("");
        showNotification("Đã lưu trò chơi học tập mới thành công!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteGame = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Thầy cô có chắc chắn muốn xóa trò chơi học tập này không?")) return;

    try {
      const res = await fetch(`/api/games/${id}`, { method: "DELETE" });
      if (res.ok) {
        setGames((prev) => prev.filter((g) => g.id !== id));
        showNotification("Đã xóa trò chơi thành công.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredGames = games.filter((game) => {
    const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          game.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || game.type === filterType;
    return matchesSearch && matchesType;
  });

  if (activeTab === "classes") {
    return (
      <ClassroomsPage
        currentUser={currentUser}
        classes={classes}
        onRefreshClasses={fetchClasses}
        onDeleteClass={handleDeleteClass}
      />
    );
  }

  return (
    <div className="space-y-10">
      {/* Toast Notification */}
      <AnimatePresence>
        {notif && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-8 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl z-50 text-sm font-medium flex items-center space-x-2.5"
          >
            <Sparkles className="h-4.5 w-4.5 text-emerald-400" />
            <span>{notif}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-950 to-slate-950 rounded-3xl p-8 text-white relative overflow-hidden shadow-lg">
        <div className="absolute -right-10 -bottom-10 opacity-10">
          <Gamepad2 className="w-80 h-80 rotate-12" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <span className="px-3.5 py-1.5 bg-blue-500/20 rounded-full text-xs font-semibold text-blue-300 font-mono tracking-wider uppercase">
            Hệ sinh thái sư phạm số
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight mt-3 text-white leading-tight">
            Thiết kế Trò chơi & Bài giảng thông minh với Trợ lý AI
          </h1>
          <p className="mt-2.5 text-slate-300 leading-relaxed text-sm">
            Tự động hóa soạn thảo trò chơi tương tác như Vòng quay may mắn, Trắc nghiệm sinh động, Thẻ ghi nhớ thông thái bằng trí tuệ nhân tạo Gemini chỉ trong 10 giây.
          </p>
        </div>
      </div>

      {/* Two-Column Grid: AI Workspace & Classrooms */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (AI Workspace) - Spans 2 columns */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-slate-100/80 bg-white shadow-sm overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50/50 to-purple-50/50 border-b border-slate-100">
              <div className="flex items-center space-x-2 text-blue-700">
                <BrainCircuit className="h-5 w-5" />
                <CardTitle className="text-lg">Xưởng Sáng Tạo AI</CardTitle>
              </div>
              <CardDescription>
                Nhập nội dung bài học mong muốn, AI sẽ lập tức thiết kế ra một trò chơi học tập tương tác xuất sắc.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Prompt Input */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 font-mono">
                  Ý tưởng hoặc Chủ đề của Thầy Cô
                </label>
                <textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Ví dụ: Tạo 5 câu trắc nghiệm thú vị về bảo vệ môi trường biển cho học sinh khối lớp 4..."
                  className="w-full h-28 rounded-2xl border border-slate-200 bg-white p-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-all resize-none"
                />
              </div>

              {/* Selection Settings Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 font-mono">
                    Loại Trò Chơi
                  </label>
                  <select
                    value={aiGameType}
                    onChange={(e) => setAiGameType(e.target.value as any)}
                    className="w-full h-10.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="quiz">🎯 Thử Thách Trắc Nghiệm</option>
                    <option value="keoco">🤼 Kéo Co Đối Kháng</option>
                    <option value="wheel">🎡 Vòng Quay May Mắn</option>
                    <option value="flashcard">🗂️ Thẻ Ghi Nhớ Thông Thái</option>
                    <option value="memory">🧠 Lật Hình Rèn Trí Nhớ</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 font-mono">
                    Môn Học
                  </label>
                  <select
                    value={aiSubject}
                    onChange={(e) => setAiSubject(e.target.value)}
                    className="w-full h-10.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Toán">Toán Học</option>
                    <option value="Ngữ văn">Ngữ Văn / Tiếng Việt</option>
                    <option value="Tiếng Anh">Tiếng Anh</option>
                    <option value="Khoa học">Khoa Học Tự Nhiên</option>
                    <option value="Lịch sử">Lịch Sử / Địa Lý</option>
                    <option value="Đạo đức">Đạo Đức / Kỹ Năng Sống</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 font-mono">
                    Khối Lớp
                  </label>
                  <select
                    value={aiGrade}
                    onChange={(e) => setAiGrade(e.target.value)}
                    className="w-full h-10.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Lớp 1">Khối Lớp 1</option>
                    <option value="Lớp 2">Khối Lớp 2</option>
                    <option value="Lớp 3">Khối Lớp 3</option>
                    <option value="Lớp 4">Khối Lớp 4</option>
                    <option value="Lớp 5">Khối Lớp 5</option>
                    <option value="Trung học">Khối Trung học (6-9)</option>
                    <option value="Phổ thông">Khối Phổ thông (10-12)</option>
                  </select>
                </div>
              </div>

              {/* Action Button */}
              <Button
                type="button"
                onClick={handleAIGenerate}
                disabled={aiLoading}
                className="w-full h-11 flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 cursor-pointer text-white"
              >
                {aiLoading ? (
                  <div className="flex items-center space-x-2">
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                    <span>Đang kiến tạo bằng trí tuệ nhân tạo...</span>
                  </div>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 text-emerald-300" />
                    <span>Thiết Kế Hoạt Động Bằng AI</span>
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* AI Loader Overlay & Sư phạm Tip */}
          <AnimatePresence>
            {aiLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-6 bg-blue-50 border border-blue-100 rounded-2xl flex flex-col items-center justify-center space-y-4 shadow-inner"
              >
                <div className="relative">
                  <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <Sparkles className="h-4 w-4 text-blue-600 absolute top-3 left-3 animate-ping" />
                </div>
                <div className="text-center">
                  <h4 className="font-bold text-blue-900 text-sm">Hệ thống đang thiết kế thông minh</h4>
                  <p className="text-xs text-blue-700 mt-1.5 font-mono italic">
                    {aiProgressText}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Generated AI Preview Board */}
          <AnimatePresence>
            {generatedPreview && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                className="space-y-4"
              >
                <Card className="border-emerald-200 bg-emerald-50/20 shadow-md">
                  <CardHeader className="border-b border-emerald-100 bg-emerald-50/40">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-bold uppercase font-mono">
                          Bản thảo AI Thiết kế
                        </span>
                        <CardTitle className="text-lg mt-1.5 text-slate-900">
                          {generatedPreview.title}
                        </CardTitle>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setGeneratedPreview(null)}
                          className="h-8.5 rounded-lg border-slate-200 text-slate-500 hover:text-slate-950"
                        >
                          Hủy bỏ
                        </Button>
                        <Button 
                          size="sm" 
                          variant="success"
                          onClick={handleSaveGenerated}
                          className="h-8.5 rounded-lg text-xs"
                        >
                          Phê duyệt & Lưu
                        </Button>
                      </div>
                    </div>
                    <CardDescription className="text-slate-600 mt-1">
                      {generatedPreview.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    {/* Content type preview details */}
                    {aiGameType === "quiz" && generatedPreview.questions && (
                      <div className="space-y-4">
                        <p className="text-xs font-bold text-slate-500 font-mono uppercase tracking-wider mb-2">
                          Tổng số: {generatedPreview.questions.length} câu hỏi trắc nghiệm
                        </p>
                        {generatedPreview.questions.map((q: any, idx: number) => (
                          <div key={idx} className="p-4 bg-white border border-emerald-100 rounded-xl space-y-2 text-sm shadow-sm">
                            <p className="font-semibold text-slate-800 flex">
                              <span className="text-indigo-600 mr-1.5">Câu {idx + 1}:</span> {q.question}
                            </p>
                            <div className="grid grid-cols-2 gap-2 pl-2">
                              {q.options?.map((opt: string, oIdx: number) => (
                                <div 
                                  key={oIdx} 
                                  className={`p-2 rounded-lg text-xs border ${
                                    oIdx === q.correctAnswer 
                                      ? "bg-emerald-50 border-emerald-300 text-emerald-800 font-medium" 
                                      : "bg-slate-50 border-slate-100 text-slate-500"
                                  }`}
                                >
                                  {oIdx + 1}. {opt} {oIdx === q.correctAnswer && "✓"}
                                </div>
                              ))}
                            </div>
                            {q.explanation && (
                              <p className="text-xs text-slate-500 bg-slate-50 p-2 rounded-lg italic pl-3 border-l-2 border-indigo-400">
                                <span className="font-semibold not-italic text-indigo-800">Giải thích:</span> {q.explanation}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {aiGameType === "flashcard" && generatedPreview.flashcards && (
                      <div className="space-y-3">
                        <p className="text-xs font-bold text-slate-500 font-mono uppercase tracking-wider mb-2">
                          Tổng số: {generatedPreview.flashcards.length} thẻ ghi nhớ
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {generatedPreview.flashcards.map((f: any, idx: number) => (
                            <div key={idx} className="p-4 bg-white border border-emerald-100 rounded-xl space-y-1.5 shadow-sm text-xs">
                              <p className="font-semibold text-slate-400 font-mono">THẺ SỐ {idx + 1}</p>
                              <p className="font-bold text-slate-800">Mặt trước: <span className="font-normal text-slate-600">{f.front}</span></p>
                              <p className="font-bold text-emerald-700">Mặt sau: <span className="font-normal text-emerald-600">{f.back}</span></p>
                              {f.hint && <p className="text-slate-400 italic">Gợi ý: {f.hint}</p>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {aiGameType === "memory" && generatedPreview.memoryItems && (
                      <div className="space-y-3">
                        <p className="text-xs font-bold text-slate-500 font-mono uppercase tracking-wider mb-2">
                          Tổng số: {generatedPreview.memoryItems.length} cặp lật hình trí nhớ
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {generatedPreview.memoryItems.map((m: any, idx: number) => (
                            <div key={idx} className="p-3 bg-white border border-emerald-100 rounded-xl flex items-center justify-between text-xs shadow-sm">
                              <div>
                                <span className="font-bold text-slate-800 bg-indigo-50 px-2 py-0.5 rounded-md mr-1.5">{m.term}</span>
                              </div>
                              <div className="text-slate-600 text-right flex-1 pl-4">
                                {m.definition}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {aiGameType === "wheel" && generatedPreview.wheelItems && (
                      <div className="space-y-3">
                        <p className="text-xs font-bold text-slate-500 font-mono uppercase tracking-wider mb-2">
                          Tổng số: {generatedPreview.wheelItems.length} phần tử vòng quay
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {generatedPreview.wheelItems.map((wi: any, idx: number) => (
                            <span 
                              key={idx} 
                              className="px-3 py-1.5 rounded-full text-xs font-medium text-white shadow-sm flex items-center space-x-1" 
                              style={{ backgroundColor: wi.color || "#4F46E5" }}
                            >
                              <span>{wi.text}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Column (Classrooms Section) - Spans 1 column */}
        <div className="space-y-8" id="classrooms-section">
          <Card className="border-slate-100 bg-white shadow-sm overflow-hidden">
            <CardHeader className="border-b border-slate-100 flex flex-row items-center justify-between p-5">
              <div className="flex items-center space-x-2 text-blue-700">
                <Users className="h-5 w-5" />
                <CardTitle className="text-base font-bold">Lớp Học Số</CardTitle>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsCreatingClass(!isCreatingClass)}
                className="h-8 rounded-lg text-xs"
              >
                {isCreatingClass ? "Hủy" : <Plus className="h-3.5 w-3.5" />}
              </Button>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              
              {/* Add class modal/form inside card */}
              <AnimatePresence>
                {isCreatingClass && (
                  <motion.form
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    onSubmit={handleCreateClass}
                    className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-3 overflow-hidden text-xs"
                  >
                    <div>
                      <label className="block font-semibold text-slate-600 mb-1">Tên lớp học</label>
                      <Input
                        type="text"
                        placeholder="Ví dụ: Lớp 5A - Sáng tạo"
                        value={newClassName}
                        onChange={(e) => setNewClassName(e.target.value)}
                        className="h-9 text-xs rounded-lg"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-600 mb-1">Mô tả lớp học</label>
                      <textarea
                        placeholder="Nhập mô tả tóm tắt về lớp..."
                        value={newClassDesc}
                        onChange={(e) => setNewClassDesc(e.target.value)}
                        rows={2}
                        className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all resize-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block font-semibold text-slate-600 mb-1">Môn học</label>
                        <select
                          value={newClassSubject}
                          onChange={(e) => setNewClassSubject(e.target.value)}
                          className="w-full h-9 rounded-lg border border-slate-200 bg-white px-2 text-xs text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="Toán">Toán</option>
                          <option value="Văn">Văn</option>
                          <option value="Anh">Anh</option>
                          <option value="Lý">Lý</option>
                          <option value="Hóa">Hóa</option>
                          <option value="Sinh">Sinh</option>
                          <option value="Sử">Sử</option>
                          <option value="Địa">Địa</option>
                        </select>
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-600 mb-1">Khối lớp</label>
                        <select
                          value={newClassGrade}
                          onChange={(e) => setNewClassGrade(e.target.value)}
                          className="w-full h-9 rounded-lg border border-slate-200 bg-white px-2 text-xs text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="Lớp 1">Lớp 1</option>
                          <option value="Lớp 2">Lớp 2</option>
                          <option value="Lớp 3">Lớp 3</option>
                          <option value="Lớp 4">Lớp 4</option>
                          <option value="Lớp 5">Lớp 5</option>
                          <option value="Trung học">Cấp 2 (6-9)</option>
                          <option value="Phổ thông">Cấp 3 (10-12)</option>
                        </select>
                      </div>
                    </div>
                    <div className="pt-1">
                      <Button type="submit" className="w-full h-9 rounded-lg text-xs font-bold">
                        Kiến tạo Lớp học ngay
                      </Button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>

              {/* Class list */}
              <div className="space-y-3">
                {classes.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 text-xs">
                    Chưa có lớp học số nào được lập. Nhấn dấu cộng để tạo lớp!
                  </div>
                ) : (
                  classes.map((c) => (
                    <div 
                      key={c.id} 
                      className="p-3 bg-white border border-slate-100 rounded-xl shadow-sm hover:border-slate-200 transition-all group flex items-center justify-between"
                    >
                      <div className="flex-1 min-w-0 pr-2">
                        <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
                          <h4 className="font-bold text-slate-800 text-sm truncate">{c.name}</h4>
                          {c.subject && (
                            <span className="px-1.5 py-0.2 bg-purple-50 text-purple-700 text-[10px] font-bold rounded">
                              {c.subject}
                            </span>
                          )}
                        </div>
                        {c.description && (
                          <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1 italic">
                            {c.description}
                          </p>
                        )}
                        <div className="flex items-center space-x-3 text-[11px] text-slate-400 mt-1 font-mono">
                          <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[10px]">{c.grade}</span>
                          <span>Mã lớp: <strong className="text-blue-600 select-all font-bold uppercase">{c.code}</strong></span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteClass(c.id)}
                        className="p-1.5 text-slate-300 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                        title="Xóa lớp học"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats Panel - Thống kê & Quản lý câu hỏi */}
          <Card className="bg-gradient-to-br from-slate-50 to-blue-50/50 border border-slate-100 shadow-sm p-5 space-y-4 rounded-2xl">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              📊 Chỉ số Đổi mới & Câu hỏi
            </h4>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                <span className="block text-lg font-bold text-blue-600">18</span>
                <span className="text-[9px] text-slate-400 font-semibold font-mono uppercase block leading-tight">Tổng số câu hỏi</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                <span className="block text-lg font-bold text-indigo-600">6</span>
                <span className="text-[9px] text-slate-400 font-semibold font-mono uppercase block leading-tight">Số môn học</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                <span className="block text-lg font-bold text-emerald-600">{sessions.length || 0}</span>
                <span className="text-[9px] text-slate-400 font-semibold font-mono uppercase block leading-tight">Số game đã chơi</span>
              </div>
            </div>
            
            <div className="space-y-2 pt-2">
              <Button
                variant="outline"
                className="w-full h-9 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 border-blue-200 text-blue-700 bg-blue-50/50 hover:bg-blue-50 cursor-pointer"
                onClick={() => {
                  if (onNavigate) {
                    onNavigate("/dashboard/questions");
                  } else {
                    window.history.pushState(null, "", "/dashboard/questions");
                    window.dispatchEvent(new PopStateEvent("popstate"));
                  }
                }}
              >
                📚 Quản lý câu hỏi
              </Button>
              <Button
                className="w-full h-9 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer"
                onClick={() => {
                  if (onNavigate) {
                    onNavigate("/games/keo-co");
                  } else {
                    window.history.pushState(null, "", "/games/keo-co");
                    window.dispatchEvent(new PopStateEvent("popstate"));
                  }
                }}
              >
                ⚔️ Chơi Kéo Co
              </Button>
            </div>
          </Card>

          {/* Lịch sử phiên chơi & kết quả game */}
          <Card className="border-slate-100 bg-white shadow-sm overflow-hidden rounded-2xl">
            <CardHeader className="border-b border-slate-100 flex flex-row items-center space-x-2 p-5 text-indigo-700 bg-slate-50/50">
              <Trophy className="h-4 w-4 text-amber-500" />
              <CardTitle className="text-xs font-bold text-slate-800">Lịch Sử Phiên Chơi & Kết Quả</CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-3 max-h-[360px] overflow-y-auto custom-scrollbar">
              {sessions.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  Chưa có lịch sử chơi game nào được ghi nhận. Hãy khởi động một game bất kỳ!
                </div>
              ) : (
                sessions.map((s) => {
                  let badgeColor = "bg-blue-50 text-blue-700";
                  let gameName = "Trò chơi";
                  let resultStr = "";

                  if (s.gameType === "keoco") {
                    badgeColor = "bg-amber-50 text-amber-700";
                    gameName = "⚔️ Kéo Co";
                    resultStr = `${s.results?.winner ? `Thắng: ${s.results.winner}` : "Hoàn thành"} (${s.results?.scoreA || 0} - ${s.results?.scoreB || 0})`;
                  } else if (s.gameType === "quiz") {
                    badgeColor = "bg-red-50 text-red-700";
                    gameName = "🎯 Trắc nghiệm";
                    resultStr = `Đúng: ${s.results?.score || 0}/${s.results?.maxScore || 0} (${s.results?.accuracy || 0}%)`;
                  } else if (s.gameType === "memory") {
                    badgeColor = "bg-purple-50 text-purple-700";
                    gameName = "🧠 Lật hình";
                    resultStr = `${s.results?.moves || 0} lượt, ${s.results?.elapsedTime || 0} giây`;
                  } else if (s.gameType === "wheel") {
                    badgeColor = "bg-emerald-50 text-emerald-700";
                    gameName = "🎡 Vòng quay";
                    resultStr = `Kết quả: ${s.results?.wheelResult || "Hoàn thành"}`;
                  }

                  return (
                    <div 
                      key={s.id} 
                      className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1 hover:border-slate-200 transition-all text-xs"
                    >
                      <div className="flex justify-between items-center">
                        <span className={`px-2 py-0.5 rounded font-bold text-[10px] uppercase font-mono ${badgeColor}`}>
                          {gameName}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {s.createdAt ? new Date(s.createdAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }) + " " + new Date(s.createdAt).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" }) : ""}
                        </span>
                      </div>
                      <div className="font-semibold text-slate-800 pt-0.5">
                        {resultStr}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono flex justify-between items-center">
                        <span>Người chơi: <strong>{s.results?.player || "Giáo viên"}</strong></span>
                        <span className="capitalize px-1.5 py-0.2 bg-slate-200 rounded font-bold text-[9px]">
                          {s.results?.playerRole === "teacher" ? "Giáo viên" : "Học sinh"}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Section: My Educational Games Library */}
      <div className="space-y-4" id="games-library-section">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center">
              <Gamepad2 className="h-5 w-5 text-blue-600 mr-2" /> Thư Viện Trò Chơi Học Tập
            </h2>
            <p className="text-xs text-slate-500">
              Danh sách các hoạt động tương tác đột phá giúp tăng cường kết quả học tập của học sinh.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-60">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Tìm kiếm trò chơi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9.5 rounded-xl text-xs"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="h-9.5 rounded-xl border border-slate-200 bg-white px-2.5 text-xs text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
            >
              <option value="all">Tất cả thể loại</option>
              <option value="quiz">🎯 Trắc nghiệm</option>
              <option value="keoco">🤼 Kéo co</option>
              <option value="wheel">🎡 Vòng quay</option>
              <option value="flashcard">🗂️ Thẻ ghi nhớ</option>
              <option value="memory">🧠 Lật hình</option>
            </select>
          </div>
        </div>

        {/* Games Bento Grid */}
        {filteredGames.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 py-16 text-center text-slate-400 text-sm shadow-sm">
            Không tìm thấy trò chơi nào phù hợp. Thầy cô hãy thiết kế bằng AI phía trên!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGames.map((game, index) => {
              // Extract items count based on game type
              let itemsCount = 0;
              if (game.type === "quiz") itemsCount = game.content.questions?.length || 0;
              else if (game.type === "flashcard") itemsCount = game.content.flashcards?.length || 0;
              else if (game.type === "memory") itemsCount = game.content.memoryItems?.length || 0;
              else if (game.type === "wheel") itemsCount = game.content.wheelItems?.length || 0;

              return (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => onPlayGame(game)}
                  className="bg-white rounded-2xl border border-slate-100 hover:border-indigo-100 shadow-sm hover:shadow-md transition-all p-5 flex flex-col justify-between group cursor-pointer relative overflow-hidden"
                >
                  {/* Decorative background circle */}
                  <div className="absolute -top-12 -right-12 w-24 h-24 bg-indigo-50 rounded-full opacity-0 group-hover:opacity-40 transition-all duration-300"></div>

                  <div className="space-y-3 relative z-10">
                    <div className="flex justify-between items-center">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase font-mono ${
                        game.type === "quiz" ? "bg-red-50 text-red-700" :
                        game.type === "wheel" ? "bg-amber-50 text-amber-700" :
                        game.type === "flashcard" ? "bg-emerald-50 text-emerald-700" :
                        "bg-purple-50 text-purple-700"
                      }`}>
                        {game.type === "quiz" ? "🎯 Trắc nghiệm" :
                         game.type === "wheel" ? "🎡 Vòng quay" :
                         game.type === "flashcard" ? "🗂️ Thẻ học" :
                         "🧠 Trí nhớ"}
                      </span>
                      <span className="text-[11px] font-medium text-slate-400 bg-slate-50 px-2 py-0.5 rounded font-mono">
                        {game.subject}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors text-base line-clamp-1">
                        {game.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 h-8 leading-relaxed">
                        {game.description}
                      </p>
                    </div>

                    <div className="flex items-center space-x-3 text-[11px] text-slate-400 font-mono pt-1">
                      <span className="flex items-center">
                        <Users className="h-3 w-3 mr-1" /> {game.grade}
                      </span>
                      <span>•</span>
                      <span>{itemsCount} mục học tập</span>
                    </div>
                  </div>

                  <div className="border-t border-slate-50 mt-4 pt-3 flex items-center justify-between relative z-10">
                    <span className="text-[10px] text-slate-400 font-mono flex items-center">
                      <Calendar className="h-3 w-3 mr-1" /> {new Date(game.createdAt).toLocaleDateString("vi-VN")}
                    </span>
                    <div className="flex space-x-2">
                      <button
                        onClick={(e) => handleDeleteGame(game.id, e)}
                        className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                        title="Xóa trò chơi"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <Button
                        size="sm"
                        className="h-8 rounded-lg text-xs font-semibold px-3 flex items-center"
                      >
                        Chạy game <Play className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
