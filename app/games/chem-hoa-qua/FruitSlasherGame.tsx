import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "../../../src/components/ui/card";
import { Button } from "../../../src/components/ui/button";
import { Game, QuizQuestion } from "../../../src/types";
import { ArrowLeft, Trophy, RotateCw, CheckCircle2, AlertTriangle, Play, Sparkles, Flame } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface FruitSlasherGameProps {
  game?: Game;
  onBackToDashboard: () => void;
}

const DEFAULT_QUESTIONS: QuizQuestion[] = [
  {
    id: "q1",
    question: "Kim loại nào dẫn điện tốt nhất?",
    options: ["Bạc (Silver)", "Đồng (Copper)", "Vàng (Gold)", "Nhôm (Aluminum)"],
    correctAnswer: 0,
    explanation: "Bạc là kim loại dẫn điện tốt nhất trong các kim loại thường gặp, tiếp sau đó mới là đồng và vàng."
  },
  {
    id: "q2",
    question: "Tính chất của nước tinh khiết là gì?",
    options: ["Có màu xanh nhạt", "Không màu, không mùi, không vị", "Có vị ngọt nhẹ", "Có mùi hăng"],
    correctAnswer: 1,
    explanation: "Nước nguyên chất tinh khiết là chất lỏng không có màu, không có mùi và không có vị."
  },
  {
    id: "q3",
    question: "Quốc hoa của Việt Nam là loài hoa nào?",
    options: ["Hoa Mai", "Hoa Sen", "Hoa Đào", "Hoa Hồng"],
    correctAnswer: 1,
    explanation: "Hoa Sen được xem là Quốc hoa của Việt Nam, tượng trưng cho sự thanh cao, bất khuất của dân tộc."
  }
];

interface FloatingFruit {
  id: number;
  optionIdx: number;
  text: string;
  emoji: string;
  color: string;
  x: number; // percentage width
  y: number; // percentage height
  vx: number;
  vy: number;
  isSliced: boolean;
}

export default function FruitSlasherGame({ game, onBackToDashboard }: FruitSlasherGameProps) {
  const questions: QuizQuestion[] = game?.content?.questions || DEFAULT_QUESTIONS;

  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [fruits, setFruits] = useState<FloatingFruit[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const [splashColor, setSplashColor] = useState<string | null>(null);

  const FRUIT_PRESETS = [
    { emoji: "🍎", color: "from-red-500 to-rose-600" },
    { emoji: "🍌", color: "from-yellow-400 to-amber-500" },
    { emoji: "🍉", color: "from-green-500 to-emerald-600" },
    { emoji: "🍇", color: "from-purple-500 to-indigo-600" }
  ];

  const currentQuestion = questions[currentIdx];

  // Initialize and update floating fruits when a new question arrives
  useEffect(() => {
    if (!currentQuestion) return;

    // Generate random fruits with unique float trajectories
    const generatedFruits: FloatingFruit[] = currentQuestion.options.map((option, idx) => {
      const preset = FRUIT_PRESETS[idx % FRUIT_PRESETS.length];
      
      // Distribute evenly horizontally
      const startX = 15 + idx * 22 + (Math.random() * 8 - 4); 

      return {
        id: idx,
        optionIdx: idx,
        text: option,
        emoji: preset.emoji,
        color: preset.color,
        x: startX,
        y: 110, // start below the screen
        vx: (Math.random() * 0.4 - 0.2), // mild sway
        vy: -(1.1 + Math.random() * 0.5), // upwards velocity
        isSliced: false
      };
    });

    setFruits(generatedFruits);
    setIsAnswered(false);
    setIsCorrect(null);
    setSplashColor(null);
  }, [currentIdx, currentQuestion]);

  // Floating physics animation effect
  useEffect(() => {
    if (isAnswered || gameFinished || fruits.length === 0) return;

    const interval = setInterval(() => {
      setFruits(prevFruits => {
        return prevFruits.map(fruit => {
          if (fruit.isSliced) return fruit;

          let nextY = fruit.y + fruit.vy;
          let nextX = fruit.x + fruit.vx;

          // Bounce back from left/right walls
          let nextVx = fruit.vx;
          if (nextX < 5 || nextX > 90) nextVx = -fruit.vx;

          // Simulate gravity acceleration slowing down rising
          let nextVy = fruit.vy + 0.015;

          // If it falls completely off bottom, re-launch it upwards!
          if (nextY > 120 && nextVy > 0) {
            nextY = 110;
            nextVy = -(1.1 + Math.random() * 0.5);
            nextX = 15 + Math.random() * 70;
          }

          return {
            ...fruit,
            x: nextX,
            y: nextY,
            vx: nextVx,
            vy: nextVy
          };
        });
      });
    }, 16);

    return () => clearInterval(interval);
  }, [isAnswered, gameFinished, fruits]);

  const handleSlashFruit = (fruit: FloatingFruit) => {
    if (isAnswered || fruit.isSliced) return;

    // Check if correct
    const isCorrectChoice = fruit.optionIdx === currentQuestion.correctAnswer;
    
    // Set sliced status
    setFruits(prev => prev.map(f => f.id === fruit.id ? { ...f, isSliced: true } : f));
    setIsAnswered(true);
    setIsCorrect(isCorrectChoice);
    setSplashColor(fruit.color);

    if (isCorrectChoice) {
      setScore(prev => prev + 100 + combo * 10);
      setCombo(prev => {
        const nextCombo = prev + 1;
        if (nextCombo > maxCombo) setMaxCombo(nextCombo);
        return nextCombo;
      });
    } else {
      setCombo(0);
    }
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      setGameFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setGameFinished(false);
  };

  return (
    <div className="space-y-6 w-full max-w-4xl mx-auto px-1 select-none">
      
      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <Button 
          variant="outline" 
          onClick={onBackToDashboard}
          className="h-9.5 rounded-xl text-xs flex items-center space-x-1.5 cursor-pointer hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4 text-slate-500" />
          <span>Quay lại Thư viện</span>
        </Button>
        <div className="text-center">
          <span className="px-2.5 py-0.5 bg-rose-100 text-rose-800 text-[10px] font-extrabold rounded-md uppercase tracking-wider font-mono">
            Phản xạ nhanh • Chém Hoa Quả
          </span>
          <h2 className="text-sm font-bold text-slate-800 mt-1">{game?.title || "Chém Hoa Quả Học Tập"}</h2>
        </div>
        <div className="w-24"></div>
      </div>

      {gameFinished ? (
        /* FINISHED VIEW */
        <Card className="border-slate-100 shadow-xl p-8 text-center bg-white space-y-6 rounded-3xl max-w-md mx-auto">
          <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <Trophy className="h-8 w-8 animate-bounce" />
          </div>
          <div className="space-y-1">
            <span className="px-3 py-1 bg-rose-50 text-rose-600 text-[10px] font-extrabold rounded-full font-mono uppercase">
              Bảng Vàng Học Tập
            </span>
            <h3 className="text-xl font-black text-slate-900 pt-2">Chiến thắng ngọt ngào!</h3>
            <p className="text-xs text-slate-500">
              Các em đã cực kỳ nhanh mắt, nhanh tay để hoàn thành bài tập trắc nghiệm này!
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 grid grid-cols-2 gap-4">
            <div>
              <span className="block text-2xl font-black text-rose-600">{score} điểm</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase font-mono">Tổng điểm đạt</span>
            </div>
            <div>
              <span className="block text-2xl font-black text-slate-700">{maxCombo} x</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase font-mono">Combo lớn nhất</span>
            </div>
          </div>

          <div className="flex space-x-3 justify-center pt-2">
            <Button variant="outline" onClick={handleRestart} className="h-10 rounded-xl flex-1 text-xs font-bold cursor-pointer">
              <RotateCw className="mr-1.5 h-3.5 w-3.5" /> Chơi lại
            </Button>
            <Button onClick={onBackToDashboard} className="h-10 rounded-xl flex-1 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">
              Hoàn thành
            </Button>
          </div>
        </Card>
      ) : (
        /* GAMEPLAY Arena */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Main Board - 8 columns */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Target Question */}
            <Card className="border-slate-100 shadow-sm bg-white rounded-2xl">
              <CardContent className="p-5">
                <div className="flex justify-between items-center mb-2">
                  <span className="px-2 py-0.5 bg-rose-50 text-rose-700 text-[9px] font-extrabold rounded-md font-mono uppercase">
                    CÂU HỎI {currentIdx + 1}
                  </span>
                  {combo > 0 && (
                    <span className="text-xs font-extrabold text-orange-500 flex items-center animate-pulse">
                      <Flame className="h-4.5 w-4.5 mr-0.5 fill-orange-500" /> Combo {combo}x!
                    </span>
                  )}
                </div>
                <h3 className="text-sm sm:text-base font-extrabold text-slate-800 leading-relaxed">
                  {currentQuestion?.question}
                </h3>
              </CardContent>
            </Card>

            {/* Slasher Canvas Stage */}
            <Card className="border-slate-800/20 shadow-xl overflow-hidden bg-slate-950 rounded-3xl h-[420px] relative select-none cursor-crosshair">
              
              {/* Splattered background juices on answer */}
              {isAnswered && splashColor && (
                <div className={`absolute inset-0 bg-gradient-to-br ${splashColor} opacity-15 transition-all duration-300 z-0`}></div>
              )}

              {/* Floating Fruits Arena */}
              <div className="absolute inset-0 z-10 p-4">
                {fruits.map((fruit) => {
                  const isCorrectAnswer = fruit.optionIdx === currentQuestion.correctAnswer;
                  
                  return (
                    <motion.div
                      key={fruit.id}
                      style={{ 
                        left: `${fruit.x}%`, 
                        top: `${fruit.y}%`,
                        transform: "translate(-50%, -50%)" 
                      }}
                      className="absolute"
                    >
                      <AnimatePresence mode="wait">
                        {!fruit.isSliced ? (
                          // Uncut fruit floating bubble
                          <motion.button
                            onClick={() => handleSlashFruit(fruit)}
                            whileHover={{ scale: 1.15 }}
                            whileTap={{ scale: 0.9 }}
                            className={`p-3.5 bg-gradient-to-br ${fruit.color} text-white rounded-2xl shadow-xl flex flex-col items-center justify-center border border-white/20 min-w-32 max-w-[150px] transition-shadow hover:shadow-2xl cursor-crosshair`}
                          >
                            <span className="text-3xl filter drop-shadow select-none">{fruit.emoji}</span>
                            <span className="text-[10px] font-black uppercase tracking-wider font-mono opacity-80 mt-1">
                              Chọn {["A", "B", "C", "D"][fruit.optionIdx]}
                            </span>
                            <span className="text-[11px] font-bold text-center line-clamp-1 leading-snug w-full">
                              {fruit.text}
                            </span>
                          </motion.button>
                        ) : (
                          // Sliced fruit effect
                          <div className="relative flex items-center justify-center">
                            {/* Left sliced half */}
                            <motion.div
                              initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
                              animate={{ x: -60, y: 80, rotate: -45, opacity: 0 }}
                              transition={{ duration: 0.6 }}
                              className="text-3xl select-none absolute"
                            >
                              {fruit.emoji}
                            </motion.div>
                            {/* Right sliced half */}
                            <motion.div
                              initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
                              animate={{ x: 60, y: 80, rotate: 45, opacity: 0 }}
                              transition={{ duration: 0.6 }}
                              className="text-3xl select-none absolute"
                            >
                              {fruit.emoji}
                            </motion.div>
                            {/* Slashed flash line */}
                            <motion.div
                              initial={{ scaleX: 0, opacity: 1 }}
                              animate={{ scaleX: 2.2, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="w-16 h-1 bg-white rounded-full absolute"
                            ></motion.div>
                          </div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>

              {/* Answering indicator overlay */}
              <AnimatePresence>
                {isAnswered && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none p-6"
                  >
                    <div className="bg-slate-900/90 text-white p-6 rounded-3xl max-w-sm text-center border border-white/10 shadow-2xl space-y-4 pointer-events-auto">
                      <div className="flex justify-center">
                        {isCorrect ? (
                          <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center text-white text-2xl font-black">
                            ✓
                          </div>
                        ) : (
                          <div className="w-12 h-12 bg-red-500 rounded-2xl flex items-center justify-center text-white text-2xl font-black">
                            ✗
                          </div>
                        )}
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-black uppercase tracking-wider font-mono">
                          {isCorrect ? "Chém hoàn hảo!" : "Sai hoa quả rồi!"}
                        </h4>
                        <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                          💡 Giải thích: {currentQuestion.explanation}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        onClick={handleNext}
                        className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold w-full h-9.5 cursor-pointer"
                      >
                        {currentIdx < questions.length - 1 ? "Câu tiếp theo" : "Bảng điểm chung cuộc"}
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Instructions banner */}
              <div className="absolute bottom-3 left-4 text-[10px] font-mono text-slate-500 tracking-wider">
                Chém / Click vào loại quả mang câu trả lời đúng!
              </div>
            </Card>
          </div>

          {/* Stats and guide - 4 columns */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* SCORE CARD */}
            <Card className="border-slate-100 shadow-sm bg-white rounded-2xl p-5 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono block">Điểm số hiện có</span>
              <span className="text-3xl font-black text-rose-600 mt-1 block tracking-tight font-mono">{score}</span>
              <div className="border-t border-slate-50 mt-4.5 pt-3.5 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold font-mono">Tiến trình</span>
                  <span className="font-bold text-slate-800 font-mono">{currentIdx + 1} / {questions.length}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold font-mono">Combo tối đa</span>
                  <span className="font-bold text-slate-800 font-mono">{maxCombo}x</span>
                </div>
              </div>
            </Card>

            {/* CLASS GAME INSTRUCTION CARD */}
            <Card className="border-slate-100 shadow-sm bg-white rounded-2xl p-5 space-y-3.5">
              <h4 className="text-xs font-bold text-slate-800 flex items-center">
                <Sparkles className="h-4 w-4 text-rose-500 mr-1.5" /> Hướng Dẫn Giáo Viên
              </h4>
              <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
                Trò chơi này lý tưởng để trình chiếu trên máy chiếu / bảng tương tác. Hãy mời học sinh lên bảng và "chém" trực tiếp bằng tay, hoặc nhấp chuột để trả lời câu hỏi dưới sự cổ vũ nồng nhiệt của cả lớp!
              </p>
            </Card>
          </div>

        </div>
      )}
    </div>
  );
}
