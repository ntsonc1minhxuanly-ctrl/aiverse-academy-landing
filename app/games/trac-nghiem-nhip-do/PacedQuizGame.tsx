import React, { useState, useEffect, useRef } from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "../../../src/components/ui/card";
import { Button } from "../../../src/components/ui/button";
import { Game, QuizQuestion } from "../../../src/types";
import { ArrowLeft, Trophy, RotateCw, CheckCircle2, AlertTriangle, Play, Sparkles, Clock } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface PacedQuizGameProps {
  game?: Game;
  onBackToDashboard: () => void;
}

const DEFAULT_QUESTIONS: QuizQuestion[] = [
  {
    id: "q1",
    question: "Tác phẩm 'Dế Mèn Phiêu Lưu Ký' là của nhà văn nào?",
    options: ["Tô Hoài", "Nam Cao", "Xuân Quỳnh", "Thạch Lam"],
    correctAnswer: 0,
    explanation: "'Dế Mèn Phiêu Lưu Ký' là tác phẩm văn học thiếu nhi kinh điển của nhà văn Tô Hoài."
  },
  {
    id: "q2",
    question: "Châu lục nào rộng lớn nhất thế giới?",
    options: ["Châu Phi", "Châu Á", "Châu Mỹ", "Châu Âu"],
    correctAnswer: 1,
    explanation: "Châu Á là châu lục lớn nhất và đông dân nhất trên Trái Đất."
  },
  {
    id: "q3",
    question: "Công thức hóa học của nước là gì?",
    options: ["CO2", "H2O", "NaCl", "O2"],
    correctAnswer: 1,
    explanation: "Công thức hóa học của nước là H2O (gồm hai nguyên tử Hydro và một nguyên tử Oxy)."
  }
];

export default function PacedQuizGame({ game, onBackToDashboard }: PacedQuizGameProps) {
  const questions: QuizQuestion[] = game?.content?.questions || DEFAULT_QUESTIONS;

  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [tempoTick, setTempoTick] = useState(1); // 1, 2, 3, 4 (metronome beats)
  const [secondsLeft, setSecondsLeft] = useState(10.0); // decimal countdown
  const [multiplier, setMultiplier] = useState<"PERFECT" | "GOOD" | "OK" | "SLOW" | null>(null);
  const [gameFinished, setGameFinished] = useState(false);

  // Metronome and countdown interval
  useEffect(() => {
    if (isSubmitted || gameFinished) return;

    const timer = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 0.1) {
          clearInterval(timer);
          handleTimeOut();
          return 0;
        }
        return Number((prev - 0.1).toFixed(1));
      });
    }, 100);

    // Metronome beating rhythm (ticks every 800ms)
    const metronome = setInterval(() => {
      setTempoTick(prev => (prev % 4) + 1);
    }, 800);

    return () => {
      clearInterval(timer);
      clearInterval(metronome);
    };
  }, [isSubmitted, gameFinished, currentIdx]);

  const currentQuestion = questions[currentIdx];

  const handleOptionSelect = (idx: number) => {
    if (isSubmitted) return;
    setSelectedOption(idx);
  };

  const handleTimeOut = () => {
    setIsSubmitted(true);
    setIsCorrect(false);
    setMultiplier("SLOW");
  };

  const handleSubmit = () => {
    if (selectedOption === null || isSubmitted) return;

    const correct = selectedOption === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    setIsSubmitted(true);

    if (correct) {
      // Calculate rhythm bonus based on timing of the metronome tick
      // Perfect bonus if you click when secondsLeft has a fraction of .0, .5 or if you did it extremely fast
      let responseTiming: "PERFECT" | "GOOD" | "OK" = "OK";
      if (secondsLeft > 8.0) {
        responseTiming = "PERFECT"; // Super fast reflex bonus!
        setScore(prev => prev + 150);
      } else if (secondsLeft > 5.0) {
        responseTiming = "GOOD";
        setScore(prev => prev + 120);
      } else {
        responseTiming = "OK";
        setScore(prev => prev + 100);
      }
      setMultiplier(responseTiming);
    } else {
      setMultiplier(null);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setIsSubmitted(false);
    setSecondsLeft(10.0);
    setMultiplier(null);

    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      setGameFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setScore(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setSecondsLeft(10.0);
    setMultiplier(null);
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
          <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-extrabold rounded-md uppercase tracking-wider font-mono">
            Nhịp độ thời gian • Trắc nghiệm Nhịp Độ
          </span>
          <h2 className="text-sm font-bold text-slate-800 mt-1">{game?.title || "Trắc nghiệm Nhịp độ sôi động"}</h2>
        </div>
        <div className="w-24"></div>
      </div>

      {gameFinished ? (
        /* FINISHED SCOREBOARD */
        <Card className="border-slate-100 shadow-xl p-8 text-center bg-white space-y-6 rounded-3xl max-w-md mx-auto">
          <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <Trophy className="h-8 w-8 animate-bounce" />
          </div>
          <div className="space-y-1">
            <span className="px-3 py-1 bg-amber-50 text-amber-700 text-[10px] font-extrabold rounded-full font-mono uppercase">
              Thang điểm nhịp điệu
            </span>
            <h3 className="text-xl font-black text-slate-900 pt-2">Chiến thắng nhịp độ!</h3>
            <p className="text-xs text-slate-500">
              Các em học sinh đã có phản xạ nhịp điệu hoàn hảo để chinh phục các thử thách.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
            <span className="block text-3xl font-black text-indigo-600 font-mono">{score} điểm</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase font-mono mt-1 block">TỔNG ĐIỂM SỐ RHYTHM</span>
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
        <div className="space-y-6">
          
          {/* BEAT TIMER METRONOME PANEL */}
          <Card className="border-slate-100 shadow-lg bg-white rounded-3xl p-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-50 mb-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-4.5 w-4.5 text-indigo-600 animate-spin" />
                <span className="text-xs font-bold text-slate-600">
                  Câu trắc nghiệm: <strong className="font-mono text-slate-900">{currentIdx + 1} / {questions.length}</strong>
                </span>
              </div>
              <div className="text-xs font-bold text-slate-600 flex items-center space-x-1">
                <Trophy className="h-4 w-4 text-yellow-500" />
                <span>Điểm: <strong className="text-indigo-600 font-mono">{score}</strong></span>
              </div>
            </div>

            {/* Metronome Beat pulses visualization */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              
              {/* Giant countdown meter - 4 columns */}
              <div className="md:col-span-4 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0">
                <div className="relative w-32 h-32 rounded-full border-4 border-indigo-100 flex flex-col items-center justify-center overflow-hidden">
                  
                  {/* Floating pulse backdrop based on metronome tick */}
                  <motion.div
                    key={tempoTick}
                    initial={{ scale: 0.9, opacity: 0.3 }}
                    animate={{ scale: 1.4, opacity: 0 }}
                    transition={{ duration: 0.7 }}
                    className="absolute inset-0 bg-indigo-500 rounded-full"
                  ></motion.div>

                  <span className={`text-4xl font-black font-mono tracking-tighter ${
                    secondsLeft < 3 ? "text-red-600 animate-ping" : "text-slate-800"
                  }`}>
                    {secondsLeft.toFixed(1)}
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 font-mono mt-0.5">giây còn lại</span>
                </div>

                {/* metronome beating circles */}
                <div className="flex space-x-2 mt-4">
                  {[1, 2, 3, 4].map((beatNum) => (
                    <div
                      key={beatNum}
                      className={`w-3.5 h-3.5 rounded-full border border-indigo-200/50 flex items-center justify-center text-[8px] font-bold font-mono transition-all ${
                        tempoTick === beatNum
                          ? "bg-indigo-600 text-white scale-125 shadow-md shadow-indigo-100"
                          : "bg-slate-50 text-slate-400"
                      }`}
                    >
                      {beatNum}
                    </div>
                  ))}
                </div>
              </div>

              {/* Quiz interactive selection - 8 columns */}
              <div className="md:col-span-8 space-y-3.5">
                <div className="text-sm font-extrabold text-slate-900 leading-relaxed pb-1.5">
                  {currentQuestion?.question}
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  {currentQuestion?.options.map((option, idx) => (
                    <button
                      key={idx}
                      type="button"
                      disabled={isSubmitted}
                      onClick={() => handleOptionSelect(idx)}
                      className={`w-full p-3 rounded-2xl border text-left text-xs font-semibold cursor-pointer transition-all flex justify-between items-center ${
                        selectedOption === idx
                          ? "bg-indigo-50 border-indigo-400 text-indigo-800 font-extrabold"
                          : "bg-white border-slate-200 hover:border-slate-300 text-slate-700"
                      }`}
                    >
                      <span>{["A.", "B.", "C.", "D."][idx]} {option}</span>
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        selectedOption === idx ? "border-indigo-600 bg-indigo-600 text-white" : "border-slate-300"
                      }`}>
                        {selectedOption === idx && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                      </div>
                    </button>
                  ))}
                </div>

                {!isSubmitted ? (
                  <Button
                    disabled={selectedOption === null}
                    onClick={handleSubmit}
                    className="w-full h-10 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold cursor-pointer"
                  >
                    Gửi câu trả lời
                  </Button>
                ) : (
                  <div className="space-y-3">
                    {/* Timing multiplier indicator banner */}
                    {multiplier && (
                      <motion.div
                        initial={{ scale: 0.95 }}
                        animate={{ scale: [1.02, 1] }}
                        className={`p-3 rounded-xl border text-center font-bold font-mono text-xs ${
                          multiplier === "PERFECT" 
                            ? "bg-amber-100 border-amber-200 text-amber-800" 
                            : multiplier === "GOOD" 
                            ? "bg-emerald-100 border-emerald-200 text-emerald-800"
                            : "bg-indigo-50 border-indigo-100 text-indigo-700"
                        }`}
                      >
                        ⚡ PHẢN XẠ NHỊP ĐIỆU: {multiplier === "PERFECT" ? "PERFECT RHYTHM! (+150 ĐIỂM)" : multiplier === "GOOD" ? "GOOD RHYTHM! (+120 ĐIỂM)" : "OK RHYTHM! (+100 ĐIỂM)"}
                      </motion.div>
                    )}

                    <div className={`p-4 rounded-2xl border flex items-start space-x-3.5 ${
                      isCorrect 
                        ? "bg-green-50 border-green-100 text-green-800" 
                        : "bg-red-50 border-red-100 text-red-800"
                    }`}>
                      {isCorrect ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="space-y-1">
                        <h4 className="font-extrabold text-xs">
                          {isCorrect ? "Câu trả lời hoàn toàn chính xác!" : "Hết giờ hoặc sai mất rồi!"}
                        </h4>
                        <p className="text-[11px] text-slate-600 leading-relaxed font-semibold">
                          💡 Giải thích: {currentQuestion?.explanation}
                        </p>
                      </div>
                    </div>

                    <Button
                      onClick={handleNext}
                      className="w-full h-10 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer"
                    >
                      {currentIdx < questions.length - 1 ? "Câu hỏi tiếp theo" : "Bảng xếp hạng chung cuộc"}
                    </Button>
                  </div>
                )}
              </div>

            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
