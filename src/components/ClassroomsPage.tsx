import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Classroom } from "../types";
import { 
  Plus, Trash2, Copy, Check, Users, Sparkles, BookOpen, 
  School, HelpCircle, GraduationCap, FileText, CheckCircle2, ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ClassroomsPageProps {
  currentUser: any;
  classes: Classroom[];
  onRefreshClasses: () => void;
  onDeleteClass: (id: string) => any;
}

export default function ClassroomsPage({
  currentUser,
  classes,
  onRefreshClasses,
  onDeleteClass,
}: ClassroomsPageProps) {
  // Form states
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("Toán");
  const [grade, setGrade] = useState("Lớp 5");
  const [description, setDescription] = useState("");
  
  // App states
  const [loading, setLoading] = useState(false);
  const [createdClass, setCreatedClass] = useState<Classroom | null>(null);
  const [copiedClassId, setCopiedClassId] = useState<string | null>(null);
  const [copiedSuccessCode, setCopiedSuccessCode] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const handleCopyCode = (code: string, id: string, isCelebration: boolean = false) => {
    const copyToClipboard = (text: string) => {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        return navigator.clipboard.writeText(text);
      } else {
        const el = document.createElement("textarea");
        el.value = text;
        document.body.appendChild(el);
        el.select();
        const success = document.execCommand("copy");
        document.body.removeChild(el);
        return success ? Promise.resolve() : Promise.reject();
      }
    };

    copyToClipboard(code)
      .then(() => {
        if (isCelebration) {
          setCopiedSuccessCode(true);
          setTimeout(() => setCopiedSuccessCode(false), 2500);
        } else {
          setCopiedClassId(id);
          setTimeout(() => setCopiedClassId(null), 2000);
        }
        triggerToast("Đã sao chép mã lớp học thành công!");
      })
      .catch((err) => {
        console.error("Không thể sao chép:", err);
        triggerToast("Lỗi sao chép mã. Thầy cô vui lòng tự chọn và copy!");
      });
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg("Vui lòng nhập tên lớp học!");
      return;
    }
    if (!subject.trim()) {
      setErrorMsg("Vui lòng nhập môn học!");
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setCreatedClass(null);

    try {
      const res = await fetch("/api/classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          subject: subject.trim(),
          grade,
          description: description.trim(),
        }),
      });

      if (res.ok) {
        const data: Classroom = await res.json();
        setCreatedClass(data);
        onRefreshClasses();
        // Clear form
        setName("");
        setSubject("");
        setGrade("Lớp 5");
        setDescription("");
        triggerToast("Đã tạo lớp học thành công!");
      } else {
        const errData = await res.json();
        setErrorMsg(errData.error || "Có lỗi xảy ra khi tạo lớp học.");
      }
    } catch (err) {
      console.error("Lỗi khi kết nối API tạo lớp:", err);
      setErrorMsg("Không thể kết nối đến máy chủ. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 w-full max-w-5xl mx-auto px-1">
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-5 py-3 rounded-2xl shadow-xl z-50 text-sm font-semibold flex items-center space-x-2.5 border border-blue-500/30"
          >
            <CheckCircle2 className="h-4.5 w-4.5 text-blue-100" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header section with page title */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <span className="px-3 py-1 bg-blue-50 text-blue-700 text-[11px] font-bold rounded-full uppercase tracking-wider font-mono">
            Không gian cộng tác số
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1.5 flex items-center">
            <School className="h-6 w-6 text-blue-600 mr-2.5" /> Quản Lý Lớp Học Số
          </h1>
          <p className="text-sm text-slate-500 mt-1 leading-relaxed">
            Thiết lập các lớp học thông minh để lưu trữ, chia sẻ trò chơi học tập và theo dõi mức độ tiến bộ của học sinh.
          </p>
        </div>
      </div>

      {/* Celebration Modal / Banner for newly created class code */}
      <AnimatePresence>
        {createdClass && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-blue-200/50 relative overflow-hidden"
          >
            <div className="absolute -right-6 -bottom-6 opacity-10">
              <Sparkles className="w-48 h-48" />
            </div>
            
            <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center justify-between">
              <div className="space-y-2 text-center md:text-left">
                <div className="inline-flex items-center space-x-2 bg-white/20 px-3.5 py-1 rounded-full text-xs font-bold tracking-tight">
                  <Sparkles className="h-3.5 w-3.5 text-yellow-300 animate-spin" />
                  <span>ĐÃ TẠO LỚP HỌC THÀNH CÔNG!</span>
                </div>
                <h2 className="text-2xl font-extrabold tracking-tight pt-1">
                  {createdClass.name}
                </h2>
                <div className="flex flex-wrap gap-2.5 justify-center md:justify-start text-xs font-medium text-blue-100 mt-2">
                  <span className="bg-white/10 px-2.5 py-1 rounded-lg">Môn học: {createdClass.subject}</span>
                  <span className="bg-white/10 px-2.5 py-1 rounded-lg">{createdClass.grade}</span>
                </div>
                {createdClass.description && (
                  <p className="text-sm text-blue-100 max-w-lg leading-relaxed pt-1">
                    "{createdClass.description}"
                  </p>
                )}
              </div>

              {/* Huge beautiful sharing code box */}
              <div className="bg-white rounded-2xl p-5 text-slate-800 shadow-md flex flex-col items-center min-w-[240px] sm:min-w-[280px] text-center border border-white/20">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">
                  MÃ CHIA SẺ LỚP HỌC
                </span>
                <span className="text-3xl font-black text-blue-700 font-mono tracking-widest my-2.5 select-all uppercase">
                  {createdClass.code}
                </span>
                
                <Button
                  onClick={() => handleCopyCode(createdClass.code, createdClass.id, true)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl h-10 transition-all shadow-sm flex items-center justify-center space-x-2 cursor-pointer"
                >
                  {copiedSuccessCode ? (
                    <>
                      <Check className="h-4 w-4" />
                      <span>Đã sao chép!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      <span>Sao chép mã chia sẻ</span>
                    </>
                  )}
                </Button>
                <span className="text-[10px] text-slate-400 leading-normal mt-2.5 max-w-[240px]">
                  Gửi mã này cho học sinh để các em gia nhập lớp trên hệ thống!
                </span>
              </div>
            </div>

            {/* Clear Button */}
            <button
              onClick={() => setCreatedClass(null)}
              className="absolute top-4 right-4 text-white/70 hover:text-white hover:bg-white/10 p-1.5 rounded-full transition-colors cursor-pointer"
              title="Đóng thông báo"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left column: Form to Create Class (Spans 5 columns) */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-slate-100 shadow-sm overflow-hidden bg-white rounded-2xl">
            <CardHeader className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 border-b border-slate-100 p-5">
              <div className="flex items-center space-x-2.5 text-blue-700">
                <Plus className="h-5 w-5" />
                <CardTitle className="text-base font-extrabold tracking-tight">Tạo Lớp Học Mới</CardTitle>
              </div>
              <CardDescription className="text-xs pt-1">
                Nhập đầy đủ thông tin để kiến tạo không gian lớp học kỹ thuật số.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5">
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                {errorMsg && (
                  <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-700 font-medium flex items-center space-x-2">
                    <svg className="h-4 w-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Class Name */}
                <div className="space-y-1.5">
                  <label className="block font-bold text-slate-700">Tên lớp học <span className="text-red-500">*</span></label>
                  <Input
                    type="text"
                    placeholder="Ví dụ: Lớp 5A - Sáng tạo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="h-10 text-xs rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Subject */}
                <div className="space-y-1.5">
                  <label className="block font-bold text-slate-700">Môn học <span className="text-red-500">*</span></label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                    required
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

                {/* Grade */}
                <div className="space-y-1.5">
                  <label className="block font-bold text-slate-700">Khối lớp</label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  >
                    <option value="Lớp 1">Khối Lớp 1</option>
                    <option value="Lớp 2">Khối Lớp 2</option>
                    <option value="Lớp 3">Khối Lớp 3</option>
                    <option value="Lớp 4">Khối Lớp 4</option>
                    <option value="Lớp 5">Khối Lớp 5</option>
                    <option value="Trung học">Cấp Trung học Cơ sở (6-9)</option>
                    <option value="Phổ thông">Cấp Trung học Phổ thông (10-12)</option>
                    <option value="Mọi khối lớp">Phù hợp mọi cấp lớp</option>
                  </select>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="block font-bold text-slate-700">Mô tả lớp học</label>
                  <textarea
                    placeholder="Nhập mô tả về mục tiêu bài học, định hướng lớp hoặc thông tin chia sẻ..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-md shadow-blue-100 flex items-center justify-center space-x-2 cursor-pointer mt-2"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4.5 h-4.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Đang tạo lớp học...</span>
                    </div>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      <span>Kiến tạo Lớp học ngay</span>
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Quick pedagogical card */}
          <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50/60 rounded-2xl border border-blue-100/30 text-xs">
            <h4 className="font-extrabold text-blue-900 mb-1 flex items-center">
              <GraduationCap className="h-4 w-4 text-blue-600 mr-1.5" /> Lợi ích của Lớp học số
            </h4>
            <p className="text-slate-600 leading-relaxed font-medium">
              Lớp học số giúp thầy cô quản lý và phân phối trò chơi học tập dễ dàng. Khi học sinh nhập đúng Mã lớp học, các em sẽ tự động được xếp vào lớp và có quyền truy cập trực tiếp các học liệu số thầy cô biên soạn.
            </p>
          </div>
        </div>

        {/* Right column: List of Active Classrooms (Spans 7 columns) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center">
              <Users className="h-5 w-5 text-blue-600 mr-2" /> Danh Sách Lớp Học Đang Hoạt Động ({classes.length})
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {classes.length === 0 ? (
              <div className="col-span-full bg-white border border-slate-100 rounded-2xl p-10 text-center text-slate-400 space-y-3">
                <School className="h-10 w-10 text-slate-300 mx-auto animate-bounce" />
                <p className="text-xs font-semibold">Chưa có không gian lớp học số nào được thiết lập.</p>
                <p className="text-[11px] text-slate-400">Thầy cô vui lòng điền form bên cạnh để tạo lớp đầu tiên!</p>
              </div>
            ) : (
              classes.map((c) => (
                <Card 
                  key={c.id} 
                  className="border-slate-100 hover:border-blue-100 hover:shadow-md transition-all duration-300 overflow-hidden bg-white rounded-2xl flex flex-col group relative"
                >
                  <CardHeader className="p-4 pb-3 border-b border-slate-50 relative pr-10">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-md">
                        {c.grade}
                      </span>
                      {c.subject && (
                        <span className="px-2 py-0.5 bg-purple-50 text-purple-700 text-[10px] font-bold rounded-md">
                          {c.subject}
                        </span>
                      )}
                    </div>
                    <CardTitle className="text-sm font-extrabold text-slate-800 tracking-tight mt-1.5 leading-tight group-hover:text-blue-700 transition-colors">
                      {c.name}
                    </CardTitle>
                    {c.description && (
                      <CardDescription className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                        {c.description}
                      </CardDescription>
                    )}
                    
                    {/* Delete button absolutely positioned at top right */}
                    <button
                      onClick={() => onDeleteClass(c.id)}
                      className="absolute top-4 right-3 text-slate-300 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                      title="Xóa lớp học"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </CardHeader>
                  <CardContent className="p-4 pt-3 flex-1 flex flex-col justify-between space-y-3 bg-slate-50/50">
                    {/* Student count and info */}
                    <div className="flex items-center text-[11px] text-slate-500 font-medium">
                      <Users className="h-3.5 w-3.5 text-slate-400 mr-1.5" />
                      <span>{c.studentCount} học sinh tham gia</span>
                    </div>

                    {/* Compact copy code box */}
                    <div className="bg-white border border-slate-100 rounded-xl p-2 flex items-center justify-between shadow-inner">
                      <div className="flex flex-col pl-1">
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider font-mono leading-none">Mã chia sẻ</span>
                        <span className="text-sm font-black text-slate-700 font-mono tracking-widest mt-0.5 uppercase">{c.code}</span>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleCopyCode(c.code, c.id, false)}
                        className={`h-8 w-8 p-0 rounded-lg transition-all ${
                          copiedClassId === c.id 
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-100" 
                            : "text-blue-600 hover:bg-blue-50"
                        }`}
                        title="Sao chép mã chia sẻ"
                      >
                        {copiedClassId === c.id ? (
                          <Check className="h-3.5 w-3.5" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
