import React, { useState } from "react";
import { Sparkles, BrainCircuit, Check, Save, ArrowRight, HelpCircle, FileText, CheckCircle2, AlertTriangle, Play } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "./ui/button";

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface GeneratedQuiz {
  title: string;
  description: string;
  questions: QuizQuestion[];
}

export default function AICreatePage({ currentUser }: { currentUser: any }) {
  const [topic, setTopic] = useState("");
  const [subject, setSubject] = useState("Toán");
  const [grade, setGrade] = useState("Lớp 2");
  const [loading, setLoading] = useState(false);
  const [progressText, setProgressText] = useState("");
  const [generatedQuiz, setGeneratedQuiz] = useState<GeneratedQuiz | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [savedGameId, setSavedGameId] = useState<string | null>(null);

  // Simulated texts to show step-by-step progress
  const progressSteps = [
    "Đang phân tích cấu trúc chương trình giáo dục phổ thông...",
    "Trí tuệ nhân tạo Gemini đang tìm kiếm phương pháp sư phạm phù hợp...",
    "Đang xây dựng câu hỏi trắc nghiệm chất lượng cao...",
    "Đang phân tích và tối ưu hóa các đáp án gây nhiễu...",
    "Đang biên soạn lời giải thích chi tiết trực quan..."
  ];

  const handleGenerateAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      setError("Vui lòng nhập chủ đề bài học trước khi bắt đầu!");
      return;
    }

    setLoading(true);
    setError(null);
    setSaveSuccess(false);
    setSavedGameId(null);
    setGeneratedQuiz(null);

    // Dynamic progress text interval
    let stepIdx = 0;
    setProgressText(progressSteps[0]);
    const progressInterval = setInterval(() => {
      stepIdx = (stepIdx + 1) % progressSteps.length;
      setProgressText(progressSteps[stepIdx]);
    }, 1500);

    try {
      const response = await fetch("/api/gemini/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Tạo 5 câu hỏi trắc nghiệm về chủ đề: ${topic}. Đảm bảo các câu hỏi phân hóa từ nhận biết đến vận dụng, nội dung gần gũi học sinh tiểu học hoặc trung học.`,
          type: "quiz",
          subject,
          grade
        }),
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        throw new Error("Không thể kết nối với dịch vụ AI. Vui lòng thử lại!");
      }

      const data = await response.json();
      
      if (data && data.questions && data.questions.length > 0) {
        // Enforce 5 questions maximum if more are generated, or clean up structure
        const formattedQuiz: GeneratedQuiz = {
          title: data.title || `Trò chơi trắc nghiệm: ${topic}`,
          description: data.description || `Bộ câu hỏi học tập tương tác về chủ đề ${topic}`,
          questions: data.questions.slice(0, 5).map((q: any) => ({
            question: q.question || "Nội dung câu hỏi chưa rõ ràng?",
            options: Array.isArray(q.options) && q.options.length >= 2 
              ? q.options 
              : ["Đáp án A", "Đáp án B", "Đáp án C", "Đáp án D"],
            correctAnswer: typeof q.correctAnswer === "number" && q.correctAnswer >= 0 && q.correctAnswer < 4
              ? q.correctAnswer 
              : 0,
            explanation: q.explanation || "Hãy suy luận thật kỹ để chọn phương án tối ưu nhất!"
          }))
        };

        setGeneratedQuiz(formattedQuiz);
      } else {
        throw new Error("Dữ liệu phản hồi từ AI không đúng cấu trúc yêu cầu.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Đã xảy ra lỗi trong quá trình tạo câu hỏi bằng AI.");
    } finally {
      clearInterval(progressInterval);
      setLoading(false);
    }
  };

  const handleSaveToStore = async () => {
    if (!generatedQuiz) return;

    try {
      const response = await fetch("/api/games", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: generatedQuiz.title,
          type: "quiz",
          subject,
          grade,
          description: generatedQuiz.description,
          content: {
            questions: generatedQuiz.questions.map((q, idx) => ({
              id: `ai_q_${Date.now()}_${idx}`,
              question: q.question,
              options: q.options,
              correctAnswer: q.correctAnswer,
              explanation: q.explanation
            }))
          },
          createdBy: currentUser?.fullName || "Giáo viên Đổi mới"
        })
      });

      if (!response.ok) {
        throw new Error("Không thể lưu trò chơi. Vui lòng thử lại!");
      }

      const savedGame = await response.json();
      setSaveSuccess(true);
      setSavedGameId(savedGame.id);
    } catch (err: any) {
      setError(err.message || "Lỗi lưu trữ trò chơi vào hệ thống.");
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Title Header Section */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-800 to-purple-800 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 opacity-10">
          <BrainCircuit className="w-64 h-64" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <span className="px-3.5 py-1 bg-white/20 rounded-full text-[10px] font-bold text-blue-100 font-mono tracking-wider uppercase">
            Soạn thảo kỹ thuật số
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-3">
            Tự động soạn thảo trò chơi bằng AI
          </h1>
          <p className="mt-2 text-slate-200 text-xs sm:text-sm leading-relaxed">
            Sử dụng công nghệ trí tuệ nhân tạo Gemini thế hệ mới để thiết kế các câu hỏi trắc nghiệm thông minh, phân bậc nhận thức chỉ trong vài giây.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Side: Topic input Form */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-5">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2 border-b border-slate-50 pb-3">
              <Sparkles className="h-4.5 w-4.5 text-blue-600" />
              <span>Thiết lập chủ đề</span>
            </h3>

            <form onSubmit={handleGenerateAI} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
                  Môn học
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                >
                  <option value="Toán">Toán học</option>
                  <option value="Văn">Văn / Tiếng Việt</option>
                  <option value="Anh">Tiếng Anh</option>
                  <option value="Lý">Vật lý</option>
                  <option value="Hóa">Hóa học</option>
                  <option value="Sinh">Sinh học</option>
                  <option value="Sử">Lịch sử</option>
                  <option value="Địa">Địa lý</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
                  Khối lớp
                </label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                >
                  <option value="Lớp 1">Lớp 1</option>
                  <option value="Lớp 2">Lớp 2</option>
                  <option value="Lớp 3">Lớp 3</option>
                  <option value="Lớp 4">Lớp 4</option>
                  <option value="Lớp 5">Lớp 5</option>
                  <option value="Trung học">Cấp 2 (Khối 6-9)</option>
                  <option value="Phổ thông">Cấp 3 (Khối 10-12)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
                  Chủ đề bài học <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Ví dụ: Phép cộng lớp 2"
                  className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium placeholder:text-slate-400"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                {loading ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Đang khởi tạo...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 text-amber-300" />
                    <span>Tạo game bằng AI</span>
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>

        {/* Right Side: Generated question list & Actions */}
        <div className="md:col-span-2 space-y-6">
          {/* Loading panel */}
          {loading && (
            <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm flex flex-col items-center justify-center text-center space-y-4">
              <div className="relative">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <Sparkles className="h-5 w-5 text-blue-500 absolute top-3.5 left-3.5 animate-ping" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-800 text-sm">Hệ thống AI đang biên soạn nội dung</h4>
                <p className="text-xs text-slate-400 font-mono italic max-w-sm">
                  {progressText || "Vui lòng chờ giây lát..."}
                </p>
              </div>
            </div>
          )}

          {/* Initial / Empty State */}
          {!loading && !generatedQuiz && !error && (
            <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-10 shadow-sm flex flex-col items-center justify-center text-center space-y-3">
              <div className="p-4 bg-slate-50 rounded-full text-slate-400">
                <BrainCircuit className="h-8 w-8 text-blue-500/80" />
              </div>
              <div>
                <h4 className="font-bold text-slate-700 text-sm">Hãy bắt đầu tạo câu hỏi trắc nghiệm</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-sm">
                  Nhập môn học, khối lớp và chủ đề bài học ở cột bên trái để AI đề xuất 5 câu hỏi trắc nghiệm đổi mới sáng tạo nhất.
                </p>
              </div>
            </div>
          )}

          {/* Error Alert */}
          {error && (
            <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex gap-3 text-red-700 text-xs">
              <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0" />
              <div className="space-y-1">
                <p className="font-bold">Đã xảy ra lỗi</p>
                <p className="text-red-600">{error}</p>
              </div>
            </div>
          )}

          {/* Success / Saved Game banner */}
          {saveSuccess && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-emerald-800">
              <div className="flex gap-3 text-xs">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold">Lưu trò chơi thành công!</p>
                  <p className="text-emerald-700 text-[11px]">
                    Trò chơi đã được thêm vào Kho câu hỏi tổng hợp và có sẵn để học sinh tham gia học tập.
                  </p>
                </div>
              </div>
              <Button
                variant="success"
                size="sm"
                className="rounded-xl flex items-center gap-1.5 font-bold text-xs"
                onClick={() => {
                  window.history.pushState(null, "", "/games");
                  window.dispatchEvent(new PopStateEvent("popstate"));
                }}
              >
                <Play className="h-3.5 w-3.5" />
                <span>Xem Kho game</span>
              </Button>
            </div>
          )}

          {/* Generated Question List Preview */}
          {generatedQuiz && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Header of Preview */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded font-mono uppercase">
                      Chủ đề: {topic}
                    </span>
                    <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded font-mono uppercase">
                      {subject} • {grade}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-800 text-base mt-1">{generatedQuiz.title}</h3>
                  <p className="text-xs text-slate-400 italic mt-0.5">{generatedQuiz.description}</p>
                </div>

                {!saveSuccess && (
                  <Button
                    onClick={handleSaveToStore}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold py-2 px-4 flex items-center gap-2 shadow-sm cursor-pointer whitespace-nowrap self-stretch sm:self-auto"
                  >
                    <Save className="h-4 w-4" />
                    <span>Lưu vào kho câu hỏi</span>
                  </Button>
                )}
              </div>

              {/* List of questions */}
              <div className="space-y-4">
                {generatedQuiz.questions.map((q, qIdx) => (
                  <div key={qIdx} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4 hover:shadow-md transition-all">
                    {/* Question prompt */}
                    <div className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs font-mono flex-shrink-0 mt-0.5">
                        {qIdx + 1}
                      </div>
                      <h4 className="font-semibold text-slate-800 text-sm leading-relaxed">{q.question}</h4>
                    </div>

                    {/* Options list */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-9">
                      {q.options.map((opt, optIdx) => {
                        const isCorrect = optIdx === q.correctAnswer;
                        return (
                          <div
                            key={optIdx}
                            className={`p-2.5 rounded-xl border text-xs flex items-center justify-between font-medium transition-colors ${
                              isCorrect
                                ? "bg-emerald-50/50 border-emerald-200 text-emerald-800"
                                : "bg-slate-50/30 border-slate-100 text-slate-600"
                            }`}
                          >
                            <span className="truncate pr-2">{opt}</span>
                            {isCorrect && (
                              <div className="w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center text-white flex-shrink-0">
                                <Check className="h-3 w-3" strokeWidth={3} />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanatory text */}
                    {q.explanation && (
                      <div className="pl-9 pt-1 border-t border-dashed border-slate-50 flex gap-2 text-[11px] text-slate-500 italic bg-slate-50/20 p-2.5 rounded-xl">
                        <HelpCircle className="h-4 w-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-indigo-950 not-italic font-bold block mb-0.5">Giải thích sư phạm:</strong>
                          <span>{q.explanation}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
