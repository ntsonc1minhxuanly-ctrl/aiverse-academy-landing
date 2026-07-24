import React from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { Gamepad2, Play, Users, Sparkles, Star, Flame, Trophy, VolumeX, Swords } from "lucide-react";
import { motion } from "motion/react";

interface GameStoreProps {
  onStartGame: (route: string) => void;
}

interface GameCard {
  id: string;
  title: string;
  icon: string;
  color: string;
  badge: string;
  badgeColor: string;
  description: string;
  route: string;
  tags: string[];
}

export default function GameStore({ onStartGame }: GameStoreProps) {
  const games: GameCard[] = [
    {
      id: "keo-co",
      title: "Kéo Co",
      icon: "⚔️",
      color: "from-blue-500 to-indigo-600",
      badge: "Đối kháng",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-100",
      description: "Thách thức hai nhóm học sinh thi đấu kéo co bằng cách trả lời nhanh các câu hỏi trắc nghiệm ôn tập kiến thức.",
      route: "/games/keo-co",
      tags: ["Kịch tính", "Trực quan", "Tranh tài"]
    },
    {
      id: "quiz-nghieng-dau",
      title: "Quiz Nghiêng Đầu",
      icon: "🤔",
      color: "from-amber-400 to-orange-500",
      badge: "Vận động",
      badgeColor: "bg-amber-50 text-amber-700 border-amber-100",
      description: "Lớp học nghiêng đầu qua trái hoặc phải để thăng bằng bàn cân và chọn câu trả lời đúng. Khởi động thể chất vui vẻ!",
      route: "/games/quiz-nghieng-dau",
      tags: ["Vận động", "Thăng bằng", "Phản xạ"]
    },
    {
      id: "vong-quay",
      title: "Vòng Quay",
      icon: "🎡",
      color: "from-indigo-500 to-purple-600",
      badge: "Ngẫu nhiên",
      badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-100",
      description: "Vòng quay may mắn giúp chọn ngẫu nhiên tên học sinh trả lời câu hỏi, chia nhóm học tập hoặc trao phần thưởng đột xuất.",
      route: "/games/vong-quay",
      tags: ["Kịch tính", "Phần thưởng", "Cá nhân"]
    },
    {
      id: "chem-hoa-qua",
      title: "Chém Hoa Quả",
      icon: "🎯",
      color: "from-rose-500 to-pink-600",
      badge: "Phản xạ nhanh",
      badgeColor: "bg-rose-50 text-rose-700 border-rose-100",
      description: "Các quả bong bóng đáp án liên tục bay lên màn hình. Học sinh nhanh tay click chém đúng loại quả để giành điểm tuyệt đối.",
      route: "/games/chem-hoa-qua",
      tags: ["Tập trung", "Thao tác nhanh", "Hứng thú"]
    },
    {
      id: "rong-ngu",
      title: "Rồng Ngủ (Quản lý lớp)",
      icon: "🐉",
      color: "from-emerald-500 to-teal-600",
      badge: "Nề nếp",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-100",
      description: "Giám sát tiếng ồn tự động bằng microphone thông minh. Giúp học sinh giữ trật tự và tự quản lớp học một cách tự giác, thú vị.",
      route: "/games/rong-ngu",
      tags: ["Giữ trật tự", "Microphone", "Thi đua nhóm"]
    },
    {
      id: "trac-nghiem-nhip-do",
      title: "Trắc nghiệm theo nhịp độ",
      icon: "📝",
      color: "from-cyan-500 to-blue-600",
      badge: "Áp lực thời gian",
      badgeColor: "bg-cyan-50 text-cyan-700 border-cyan-100",
      description: "Đếm ngược thời gian cực nhanh kết hợp nhịp metronome gõ nhịp. Học sinh suy nghĩ phản xạ nhanh, điểm thưởng nhân đôi.",
      route: "/games/trac-nghiem-nhip-do",
      tags: ["Nhịp độ nhanh", "Căng thẳng", "Quyết đoán"]
    },
    {
      id: "the-hoc-nhom",
      title: "Thẻ học nhóm",
      icon: "📚",
      color: "from-fuchsia-500 to-pink-600",
      badge: "Ghi nhớ",
      badgeColor: "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-100",
      description: "Học tập chủ động bằng flashcard tương tác lật mặt 3D. Hỗ trợ tạo và lưu bộ thẻ câu hỏi theo từng môn học, độ khó khác nhau.",
      route: "/games/the-hoc-nhom",
      tags: ["Flashcard", "Ghi nhớ nhanh", "Học chủ động"]
    }
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-1 select-none">
      
      {/* Intro Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-blue-950 rounded-3xl p-8 text-white relative overflow-hidden shadow-lg">
        <div className="absolute -right-12 -bottom-12 opacity-10">
          <Gamepad2 className="w-80 h-80 rotate-12" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <span className="px-3.5 py-1.5 bg-blue-500/20 rounded-full text-xs font-semibold text-blue-300 font-mono tracking-wider uppercase">
            Cổng Trò Chơi Sư Phạm Số
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight mt-3 text-white leading-tight">
            Kho Trò Chơi Học Tập Đổi Mới
          </h1>
          <p className="mt-2.5 text-slate-300 leading-relaxed text-sm">
            Tổng hợp các hoạt động sư phạm gamification (trò chơi hóa) đột phá, giúp giáo viên biến mọi bài giảng khô khan thành đấu trường tri thức hào hứng và sôi nổi.
          </p>
        </div>
      </div>

      {/* Grid List */}
      <div className="space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Danh sách trò chơi tương tác</h3>
            <p className="text-xs text-slate-400">Ấn nút "Bắt đầu" để khởi chạy trò chơi tương ứng trên máy chiếu.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((g, idx) => (
            <motion.div
              key={g.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -4 }}
              className="bg-white rounded-2xl border border-slate-100 hover:border-blue-100/70 shadow-sm hover:shadow-md transition-all p-5 flex flex-col justify-between group cursor-pointer relative overflow-hidden"
            >
              {/* Colored side decoration */}
              <div className="absolute -top-12 -right-12 w-24 h-24 bg-slate-50 rounded-full opacity-0 group-hover:opacity-40 transition-all duration-300"></div>

              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  {/* Styled Emoji Icon */}
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${g.color} text-white flex items-center justify-center text-2xl shadow-md shadow-slate-100 group-hover:scale-105 transition-transform duration-300`}>
                    {g.icon}
                  </div>
                  {/* Category Badge */}
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border font-mono tracking-wider ${g.badgeColor}`}>
                    {g.badge}
                  </span>
                </div>

                <div className="space-y-1">
                  <h4 className="text-base font-extrabold text-slate-800 group-hover:text-blue-600 transition-colors">
                    {g.title}
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed min-h-[48px] line-clamp-3">
                    {g.description}
                  </p>
                </div>

                {/* Sub tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {g.tags.map((tag, tagIdx) => (
                    <span 
                      key={tagIdx}
                      className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md font-mono"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Start action bottom */}
              <div className="border-t border-slate-50 mt-5 pt-4 flex items-center justify-end">
                <Button
                  size="sm"
                  onClick={() => onStartGame(g.route)}
                  className="h-9 rounded-xl text-xs font-bold px-4 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer group flex items-center shadow-md shadow-blue-50 hover:shadow-lg transition-shadow"
                >
                  Bắt đầu <Play className="h-3 w-3 ml-1 fill-white text-white group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

    </div>
  );
}
