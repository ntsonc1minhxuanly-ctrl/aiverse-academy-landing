import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "../../../src/components/ui/card";
import { Button } from "../../../src/components/ui/button";
import { Game, QuizQuestion } from "../../../src/types";
import { ArrowLeft, Trophy, RotateCw, CheckCircle2, AlertTriangle, Swords, Sparkles, Navigation } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface TiltQuizGameProps {
  game?: Game;
  onBackToDashboard: () => void;
}

const DEFAULT_QUESTIONS: QuizQuestion[] = [
  {
    id: "q1",
    question: "Trái Đất quay quanh Trục theo hướng nào?",
    options: ["Từ Tây sang Đông", "Từ Đông sang Tây", "Từ Bắc xuống Nam", "Từ Nam lên Bắc"],
    correctAnswer: 0,
    explanation: "Trái Đất tự quay quanh trục của nó theo hướng từ tây sang đông, tạo ra chu kỳ ngày và đêm."
  },
  {
    id: "q2",
    question: "Số nguyên tố nhỏ nhất là số nào?",
    options: ["Số 1", "Số 2", "Số 3", "Số 5"],
    correctAnswer: 1,
    explanation: "Số 2 là số nguyên tố nhỏ nhất và cũng là số nguyên tố chẵn duy nhất."
  },
  {
    id: "q3",
    question: "Từ nào viết đúng chính tả tiếng Việt?",
    options: ["Chân chọng", "Trân trọng", "Chân trọng", "Trân chọng"],
    correctAnswer: 1,
    explanation: "Từ viết đúng chính tả là 'Trân trọng' (bày tỏ sự quý mến, kính trọng)."
  }
];

export default function TiltQuizGame({ game, onBackToDashboard }: TiltQuizGameProps) {
  // Use custom game questions if available, otherwise default ones
  const questions: QuizQuestion[] = game?.content?.questions || DEFAULT_QUESTIONS;

  // Game states
  const [currentIdx, setCurrentIdx] = useState(0);
  const [tiltAngle, setTiltAngle] = useState(0); // -45 to 45 degrees
  const [score, setScore] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [selectedSide, setSelectedSide] = useState<"left" | "right" | null>(null);
  const [gameFinished, setGameFinished] = useState(false);

  // Keyboard controls
  useEffect(() => {
    if (isSubmitted || gameFinished) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        setTiltAngle(-30);
        setSelectedSide("left");
      } else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        setTiltAngle(30);
        setSelectedSide("right");
      }
    };

    const handleKeyUp = () => {
      // Don't auto-reset if selected to lock choice, but lets keep it reactive
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isSubmitted, gameFinished]);

  const currentQuestion = questions[currentIdx];
  
  // Since tilt quiz usually simplifies options to 2 main choices (Left vs Right), 
  // let's grab option 0 and option 1, or dynamic pairing if there are more options.
  const leftOption = currentQuestion?.options[0] || "Đáp án A";
  const rightOption = currentQuestion?.options[1] || "Đáp án B";

  const handleTilt = (side: "left" | "right") => {
    if (isSubmitted || gameFinished) return;
    setSelectedSide(side);
    setTiltAngle(side === "left" ? -30 : 30);
  };

  const handleLockAnswer = () => {
    if (!selectedSide || isSubmitted) return;

    const chosenIndex = selectedSide === "left" ? 0 : 1;
    const correctIdx = currentQuestion.correctAnswer;
    const isAnsCorrect = chosenIndex === correctIdx;

    setIsCorrect(isAnsCorrect);
    setIsSubmitted(true);
    if (isAnsCorrect) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    setTiltAngle(0);
    setSelectedSide(null);
    setIsSubmitted(false);

    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      setGameFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setTiltAngle(0);
    setScore(0);
    setIsSubmitted(false);
    setSelectedSide(null);
    setGameFinished(false);
  };

  return (
    <div className="space-y-6 w-full max-w-3xl mx-auto px-1 select-none">
      
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
          <span className="px-2.5 py-0.5 bg-yellow-100 text-yellow-800 text-[10px] font-extrabold rounded-md uppercase tracking-wider font-mono">
            Vận động tương tác • Quiz Nghiêng Đầu
          </span>
          <h2 className="text-sm font-bold text-slate-800 mt-1">{game?.title || "Thử thách Nghiêng Đầu"}</h2>
        </div>
        <div className="w-24"></div>
      </div>

      {gameFinished ? (
        /* GAME FINISHED VIEW */
        <Card className="border-slate-100 shadow-xl p-8 text-center bg-white space-y-6 rounded-3xl max-w-md mx-auto">
          <div className="w-16 h-16 bg-yellow-100 text-yellow-700 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <Trophy className="h-8 w-8 animate-bounce" />
          </div>
          <div className="space-y-1">
            <span className="px-3 py-1 bg-yellow-50 text-yellow-700 text-[10px] font-extrabold rounded-full font-mono uppercase">
              Hoàn Thành Thử Thách
            </span>
            <h3 className="text-xl font-black text-slate-900 pt-2">Chiến thắng thăng bằng!</h3>
            <p className="text-xs text-slate-500">
              Thầy cô và các em đã xuất sắc giữ thăng bằng và đưa ra các quyết định chính xác.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 grid grid-cols-2 gap-4">
            <div>
              <span className="block text-2xl font-black text-yellow-600">{score} / {questions.length}</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase font-mono">Đúng thăng bằng</span>
            </div>
            <div>
              <span className="block text-2xl font-black text-slate-700">
                {Math.round((score / questions.length) * 100)}%
              </span>
              <span className="text-[10px] text-slate-400 font-bold uppercase font-mono">Độ chính xác</span>
            </div>
          </div>

          <div className="flex space-x-3 justify-center pt-2">
            <Button variant="outline" onClick={handleRestart} className="h-10 rounded-xl flex-1 text-xs font-bold cursor-pointer">
              <RotateCw className="mr-1.5 h-3.5 w-3.5" /> Chơi lại
            </Button>
            <Button onClick={onBackToDashboard} className="h-10 rounded-xl flex-1 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">
              Xác nhận hoàn thành
            </Button>
          </div>
        </Card>
      ) : (
        /* GAMEPLAY BOARD */
        <div className="space-y-6">
          {/* BALANCE STAGE */}
          <Card className="border-slate-100 shadow-lg overflow-hidden bg-white rounded-3xl p-6 relative">
            <div className="absolute top-3 left-3 text-[9px] font-black text-slate-400 uppercase font-mono tracking-wider">
              Bàn thăng bằng thông minh (Ấn phím ← / → hoặc A / D)
            </div>

            <div className="flex justify-between items-center px-2 pb-4 border-b border-slate-100 mb-6">
              <span className="text-xs font-bold text-slate-500">
                Câu hỏi: <strong className="font-mono text-slate-800">{currentIdx + 1} / {questions.length}</strong>
              </span>
              <span className="text-xs font-bold text-yellow-600 bg-yellow-50 px-2.5 py-1 rounded-lg flex items-center space-x-1">
                <Trophy className="h-3.5 w-3.5 text-yellow-500" />
                <span>Điểm: {score}</span>
              </span>
            </div>

            {/* Tiltable Balancing Board Arena */}
            <div className="relative h-60 bg-gradient-to-b from-sky-50 to-blue-50/40 rounded-2xl border border-sky-100/50 shadow-inner flex flex-col justify-between items-center p-4 overflow-hidden">
              
              {/* Option signs floating left & right */}
              <div className="w-full flex justify-between items-start pt-4 z-10 px-4">
                {/* Left choice sign */}
                <motion.button
                  onClick={() => handleTilt("left")}
                  disabled={isSubmitted}
                  animate={{ scale: selectedSide === "left" ? 1.05 : 1 }}
                  className={`max-w-[40%] p-3.5 rounded-2xl border-2 text-left cursor-pointer transition-all shadow-md ${
                    selectedSide === "left"
                      ? "bg-blue-600 text-white border-blue-700 font-extrabold"
                      : "bg-white border-slate-200 text-slate-700 hover:border-blue-400 font-bold"
                  }`}
                >
                  <div className="text-[10px] uppercase tracking-wider font-mono font-black mb-1 opacity-80">
                    👈 NGHIÊNG TRÁI (A)
                  </div>
                  <div className="text-xs line-clamp-2 leading-snug">{leftOption}</div>
                </motion.button>

                {/* Center marker */}
                <div className="w-1.5 h-6 bg-slate-300 rounded-full mt-4 flex justify-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full -top-1 relative animate-ping"></div>
                </div>

                {/* Right choice sign */}
                <motion.button
                  onClick={() => handleTilt("right")}
                  disabled={isSubmitted}
                  animate={{ scale: selectedSide === "right" ? 1.05 : 1 }}
                  className={`max-w-[40%] p-3.5 rounded-2xl border-2 text-left cursor-pointer transition-all shadow-md ${
                    selectedSide === "right"
                      ? "bg-red-600 text-white border-red-700 font-extrabold"
                      : "bg-white border-slate-200 text-slate-700 hover:border-red-400 font-bold"
                  }`}
                >
                  <div className="text-[10px] uppercase tracking-wider font-mono font-black mb-1 opacity-80">
                    👉 NGHIÊNG PHẢI (D)
                  </div>
                  <div className="text-xs line-clamp-2 leading-snug">{rightOption}</div>
                </motion.button>
              </div>

              {/* Animated Balanced Character and Board */}
              <div className="w-full flex flex-col items-center relative pb-6">
                
                {/* Animated Character sitting/standing on the balance board */}
                <motion.div
                  animate={{ 
                    rotate: tiltAngle,
                    x: tiltAngle * 2.5,
                    y: Math.abs(tiltAngle) * 0.1
                  }}
                  transition={{ type: "spring", stiffness: 80, damping: 12 }}
                  className="relative z-20 flex flex-col items-center cursor-pointer"
                >
                  {/* Balance avatar (funny student emoji) */}
                  <div className="text-6xl select-none filter drop-shadow-lg animate-bounce">
                    {selectedSide === "left" ? "🏄‍♂️" : selectedSide === "right" ? "🏄‍♀️" : "🧍‍♂️"}
                  </div>
                  
                  {/* Feet board */}
                  <div className="w-24 h-3 bg-slate-800 rounded-full shadow border-t border-slate-600 mt-1"></div>
                </motion.div>

                {/* The main fulcrum / Balance base */}
                <motion.div 
                  animate={{ rotate: tiltAngle }}
                  transition={{ type: "spring", stiffness: 80, damping: 12 }}
                  className="w-56 h-3 bg-gradient-to-r from-amber-600 to-amber-700 border-b border-amber-800 rounded-full shadow-md mt-1 z-10"
                ></motion.div>
                
                {/* Triangle support pivot */}
                <div className="w-0 h-0 border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-b-[24px] border-b-slate-700 -mt-1 shadow"></div>
              </div>

              {/* Tips */}
              <div className="text-[10px] font-semibold text-slate-400">
                Giữ thăng bằng và ấn "Xác nhận nghiêng" để nộp kết quả
              </div>
            </div>

            {/* Controls panel */}
            <div className="flex justify-center space-x-3 mt-4">
              <Button
                variant="outline"
                disabled={isSubmitted}
                onClick={() => handleTilt("left")}
                className="rounded-xl px-5 h-9 text-xs font-bold cursor-pointer"
              >
                👈 Nghiêng trái
              </Button>
              <Button
                disabled={!selectedSide || isSubmitted}
                onClick={handleLockAnswer}
                className="bg-slate-800 text-white rounded-xl px-8 h-10 text-xs font-black uppercase tracking-wider cursor-pointer"
              >
                🎯 Xác nhận Nghiêng
              </Button>
              <Button
                variant="outline"
                disabled={isSubmitted}
                onClick={() => handleTilt("right")}
                className="rounded-xl px-5 h-9 text-xs font-bold cursor-pointer"
              >
                Nghiêng phải 👉
              </Button>
            </div>
          </Card>

          {/* QUESTION PANEL */}
          <Card className="border-slate-100 shadow-md bg-white rounded-3xl overflow-hidden">
            <CardContent className="p-6 space-y-4">
              <div className="space-y-1">
                <span className="px-2.5 py-0.5 bg-sky-50 text-sky-700 text-[10px] font-black rounded-full font-mono uppercase">
                  Nội dung câu hỏi
                </span>
                <h3 className="text-base sm:text-lg font-extrabold text-slate-950 pt-2 leading-relaxed">
                  {currentQuestion?.question}
                </h3>
              </div>

              <AnimatePresence>
                {isSubmitted && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className={`p-4.5 rounded-2xl border flex items-start space-x-3.5 ${
                      isCorrect 
                        ? "bg-green-50 border-green-100 text-green-800" 
                        : "bg-red-50 border-red-100 text-red-800"
                    }`}
                  >
                    {isCorrect ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="space-y-1">
                      <h4 className="font-extrabold text-xs">
                        {isCorrect ? "Nghiêng người hoàn hảo! Bạn được cộng +1 điểm." : "Thăng bằng lệch hướng rồi! Chúc bạn may mắn lần sau."}
                      </h4>
                      <p className="text-[11px] text-slate-600 leading-relaxed font-semibold pt-1">
                        💡 Giải thích: {currentQuestion.explanation}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>

            {isSubmitted && (
              <CardFooter className="bg-slate-50/50 border-t border-slate-100 p-4.5 flex justify-end">
                <Button
                  onClick={handleNext}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold px-6 h-10 cursor-pointer"
                >
                  {currentIdx < questions.length - 1 ? "Tiếp tục" : "Xem kết quả"}
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
