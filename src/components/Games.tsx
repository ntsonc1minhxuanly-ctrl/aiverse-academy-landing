import React, { useState, useEffect, useRef } from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { Game, QuizQuestion, WheelItem, FlashcardItem, MemoryItem } from "../types";
import { 
  ArrowLeft, RotateCw, Volume2, CheckCircle, XCircle, Award, 
  HelpCircle, Eye, ChevronRight, ChevronLeft, RefreshCw, Trophy, Clock, BrainCircuit
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import TugOfWarGame from "../../app/games/keo-co/TugOfWarGame";
import { useUser } from "../context/UserContext";

interface GamesProps {
  game: Game;
  onBackToDashboard: () => void;
}

export default function Games({ game, onBackToDashboard }: GamesProps) {
  if (game.type === "keoco") {
    return <TugOfWarGame game={game} onBackToDashboard={onBackToDashboard} />;
  }

  const { currentUser } = useUser();

  const saveGameResult = async (resultDetails: any) => {
    try {
      await fetch("/api/game_sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gameType: game.type,
          classId: "",
          quizId: game.id,
          results: {
            ...resultDetails,
            player: currentUser?.fullName || currentUser?.username || "Học sinh ẩn danh",
            playerRole: currentUser?.role || "student"
          }
        })
      });
      console.log("Đã lưu kết quả chơi game lên Firestore!");
    } catch (err) {
      console.error("Lỗi lưu kết quả game:", err);
    }
  };

  // Common states
  const [isPlaying, setIsPlaying] = useState(true);

  // 1. QUIZ STATES
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showSummary, setShowSummary] = useState(false);

  // 2. WHEEL STATES
  const [isSpinning, setIsSpinning] = useState(false);
  const [wheelResult, setWheelResult] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [rotation, setRotation] = useState(0);

  // 3. FLASHCARD STATES
  const [currentCardIdx, setCurrentCardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [masteredCards, setMasteredCards] = useState<string[]>([]);

  // 4. MEMORY STATES
  const [memoryCards, setMemoryCards] = useState<any[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]); // indices
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]); // matched terms
  const [moves, setMoves] = useState(0);
  const [memoryFinished, setMemoryFinished] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Initialize game subcomponents
  useEffect(() => {
    if (game.type === "wheel") {
      drawWheel(0);
    } else if (game.type === "memory") {
      initializeMemoryGame();
    }
  }, [game]);

  // ----------------------------------------------------
  // 1. QUIZ GAME LOGIC
  // ----------------------------------------------------
  const questions: QuizQuestion[] = game.content.questions || [];

  const handleOptionSelect = (optIdx: number) => {
    if (hasSubmitted) return;
    setSelectedOption(optIdx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || hasSubmitted) return;
    setHasSubmitted(true);
    if (selectedOption === questions[currentQuestionIdx].correctAnswer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setHasSubmitted(false);
    if (currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx((prev) => prev + 1);
    } else {
      setShowSummary(true);
      saveGameResult({
        score: score,
        maxScore: questions.length,
        accuracy: Math.round((score / questions.length) * 105) > 100 ? 100 : Math.round((score / questions.length) * 100)
      });
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIdx(0);
    setSelectedOption(null);
    setHasSubmitted(false);
    setScore(0);
    setShowSummary(false);
  };

  // ----------------------------------------------------
  // 2. WHEEL GAME LOGIC
  // ----------------------------------------------------
  const wheelItems: WheelItem[] = game.content.wheelItems || [];

  const drawWheel = (currentAngle: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const radius = Math.min(width, height) / 2 - 10;
    const centerX = width / 2;
    const centerY = height / 2;

    ctx.clearRect(0, 0, width, height);

    const arcSize = (2 * Math.PI) / wheelItems.length;

    wheelItems.forEach((item, idx) => {
      const angle = currentAngle + idx * arcSize;
      ctx.beginPath();
      ctx.fillStyle = item.color || "#4F46E5";
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, angle, angle + arcSize);
      ctx.lineTo(centerX, centerY);
      ctx.fill();
      ctx.stroke();

      // Draw text
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angle + arcSize / 2);
      ctx.textAlign = "right";
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 11px Inter, sans-serif";
      // Truncate text if too long
      const text = item.text.length > 20 ? item.text.substring(0, 18) + ".." : item.text;
      ctx.fillText(text, radius - 20, 5);
      ctx.restore();
    });

    // Draw center peg
    ctx.beginPath();
    ctx.arc(centerX, centerY, 15, 0, 2 * Math.PI);
    ctx.fillStyle = "#FFFFFF";
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = "#4F46E5";
    ctx.stroke();
  };

  const handleSpinWheel = () => {
    if (isSpinning || wheelItems.length === 0) return;
    setIsSpinning(true);
    setWheelResult(null);

    const spinDuration = 3500; // ms
    const startTime = performance.now();
    const startRotation = rotation;
    const randomExtraSpins = 4 * 2 * Math.PI; // min 4 full spins
    const targetRandomSliceAngle = Math.random() * 2 * Math.PI;
    const endRotation = startRotation + randomExtraSpins + targetRandomSliceAngle;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / spinDuration, 1);

      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentRotation = startRotation + (endRotation - startRotation) * easeOut;

      setRotation(currentRotation);
      drawWheel(currentRotation);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
        // Calculate result slice
        // The pointer is at the very right (0 radians) or very top (-Math.PI/2). Let's use 0 rad pointing right as index calculator.
        const normalizedRotation = (currentRotation % (2 * Math.PI));
        // Calculate which arc is at pointing right (0 rad in drawing arc)
        // Since wheel rotates clockwise, items are rotated, pointing slice is at (2 * Math.PI - normalizedRotation)
        const arcSize = (2 * Math.PI) / wheelItems.length;
        const pointingAngle = (2 * Math.PI - normalizedRotation) % (2 * Math.PI);
        const winningIndex = Math.floor(pointingAngle / arcSize);
        const winningItem = wheelItems[winningIndex];
        setWheelResult(winningItem ? winningItem.text : "Đang tính toán...");
      }
    };

    requestAnimationFrame(animate);
  };

  // ----------------------------------------------------
  // 3. FLASHCARDS LOGIC
  // ----------------------------------------------------
  const flashcards: FlashcardItem[] = game.content.flashcards || [];

  const handleCardFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNextCard = () => {
    setIsFlipped(false);
    setShowHint(false);
    if (currentCardIdx < flashcards.length - 1) {
      setCurrentCardIdx((prev) => prev + 1);
    }
  };

  const handlePrevCard = () => {
    setIsFlipped(false);
    setShowHint(false);
    if (currentCardIdx > 0) {
      setCurrentCardIdx((prev) => prev - 1);
    }
  };

  const toggleMastered = (cardId: string) => {
    if (masteredCards.includes(cardId)) {
      setMasteredCards((prev) => prev.filter((id) => id !== cardId));
    } else {
      setMasteredCards((prev) => [...prev, cardId]);
    }
  };

  // ----------------------------------------------------
  // 4. MEMORY MATCH GAME LOGIC
  // ----------------------------------------------------
  const memoryItems: MemoryItem[] = game.content.memoryItems || [];

  const initializeMemoryGame = () => {
    if (memoryItems.length === 0) return;

    // Create cards: 1 Term card and 1 Definition card for each pair
    const cardsList: any[] = [];
    memoryItems.forEach((item) => {
      cardsList.push({
        id: `term_${item.id}`,
        pairId: item.id,
        type: "term",
        text: item.term,
      });
      cardsList.push({
        id: `def_${item.id}`,
        pairId: item.id,
        type: "definition",
        text: item.definition,
      });
    });

    // Shuffle cards
    const shuffled = [...cardsList].sort(() => Math.random() - 0.5);
    setMemoryCards(shuffled);
    setFlippedCards([]);
    setMatchedPairs([]);
    setMoves(0);
    setMemoryFinished(false);
    setStartTime(Date.now());
    setElapsedTime(0);
  };

  // Stopwatch effect for memory game
  useEffect(() => {
    let interval: any = null;
    if (startTime && !memoryFinished && game.type === "memory") {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [startTime, memoryFinished, game.type]);

  const handleCardClick = (idx: number) => {
    if (flippedCards.length === 2 || flippedCards.includes(idx) || matchedPairs.includes(memoryCards[idx].pairId)) {
      return;
    }

    const newFlipped = [...flippedCards, idx];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((prev) => prev + 1);
      const firstCard = memoryCards[newFlipped[0]];
      const secondCard = memoryCards[newFlipped[1]];

      // Check match
      if (firstCard.pairId === secondCard.pairId) {
        setMatchedPairs((prev) => [...prev, firstCard.pairId]);
        setFlippedCards([]);

        // Check victory
        if (matchedPairs.length + 1 === memoryItems.length) {
          setMemoryFinished(true);
          saveGameResult({
            moves: moves + 1,
            elapsedTime
          });
        }
      } else {
        // Flip back down after short duration
        setTimeout(() => {
          setFlippedCards([]);
        }, 1200);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Game Header Control */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={onBackToDashboard}
          className="rounded-lg h-9 text-slate-600 hover:text-slate-900 shadow-none border-slate-200"
        >
          <ArrowLeft className="h-4 w-4 mr-1.5" /> Bàn làm việc
        </Button>
        <div className="text-right">
          <span className="text-xs font-mono font-bold uppercase text-slate-400 block">Dự án Giáo Viên Đổi Mới</span>
          <h2 className="text-md font-bold text-slate-800 line-clamp-1">{game.title}</h2>
        </div>
      </div>

      {/* GAME RUNTIME CONTAINERS BY TYPE */}
      <div>
        {/* ==================== 1. QUIZ PLAY ==================== */}
        {game.type === "quiz" && questions.length > 0 && (
          <div className="max-w-3xl mx-auto space-y-6">
            {!showSummary ? (
              <Card className="border-slate-100 shadow-md p-6 sm:p-8 space-y-6 relative overflow-hidden bg-white/90 backdrop-blur-sm">
                {/* Visual progression bar */}
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-indigo-600 h-full transition-all duration-300" 
                    style={{ width: `${((currentQuestionIdx + 1) / questions.length) * 100}%` }}
                  ></div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono font-bold text-indigo-600 uppercase bg-indigo-50 px-2.5 py-1 rounded-md">
                    CÂU {currentQuestionIdx + 1} / {questions.length}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">Điểm số: {score}</span>
                </div>

                {/* Question */}
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                  {questions[currentQuestionIdx].question}
                </h3>

                {/* Answer choices */}
                <div className="grid grid-cols-1 gap-3.5 pt-2">
                  {questions[currentQuestionIdx].options.map((opt, oIdx) => {
                    // Check conditional background styling
                    const isSelected = selectedOption === oIdx;
                    const isCorrect = oIdx === questions[currentQuestionIdx].correctAnswer;
                    
                    let cardStyle = "border-slate-100 hover:border-slate-300 bg-white hover:bg-slate-50";
                    if (hasSubmitted) {
                      if (isCorrect) {
                        cardStyle = "border-emerald-500 bg-emerald-50/50 text-emerald-950 font-medium";
                      } else if (isSelected) {
                        cardStyle = "border-red-400 bg-red-50/40 text-red-950";
                      } else {
                        cardStyle = "border-slate-100 opacity-60 bg-white";
                      }
                    } else if (isSelected) {
                      cardStyle = "border-indigo-600 bg-indigo-50/40 text-indigo-950 font-medium ring-1 ring-indigo-500";
                    }

                    return (
                      <button
                        key={oIdx}
                        onClick={() => handleOptionSelect(oIdx)}
                        disabled={hasSubmitted}
                        className={`p-4 rounded-xl text-left border text-sm transition-all flex items-center justify-between cursor-pointer ${cardStyle}`}
                      >
                        <div className="flex items-center space-x-3">
                          <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold font-mono text-xs ${
                            isSelected ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500"
                          }`}>
                            {String.fromCharCode(65 + oIdx)}
                          </span>
                          <span className="text-slate-800 font-medium">{opt}</span>
                        </div>

                        {/* Status icon after submit */}
                        {hasSubmitted && (
                          <div>
                            {isCorrect && <CheckCircle className="h-5 w-5 text-emerald-600" />}
                            {isSelected && !isCorrect && <XCircle className="h-5 w-5 text-red-600" />}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Pedagogical explanation block */}
                {hasSubmitted && questions[currentQuestionIdx].explanation && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="p-4 bg-indigo-50/50 border border-indigo-100/30 rounded-xl space-y-1.5 mt-4"
                  >
                    <h4 className="text-xs font-bold text-indigo-900 flex items-center uppercase font-mono tracking-wider">
                      <HelpCircle className="h-4 w-4 mr-1.5 text-indigo-600" /> Giải thích đổi mới sư phạm
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed pl-5">
                      {questions[currentQuestionIdx].explanation}
                    </p>
                  </motion.div>
                )}

                {/* Action footer inside card */}
                <div className="flex justify-end pt-4 border-t border-slate-50 mt-4">
                  {!hasSubmitted ? (
                    <Button 
                      onClick={handleSubmitAnswer}
                      disabled={selectedOption === null}
                      className="h-10 rounded-xl px-6 font-semibold"
                    >
                      Kiểm tra đáp án
                    </Button>
                  ) : (
                    <Button 
                      onClick={handleNextQuestion}
                      className="h-10 rounded-xl px-6 font-semibold flex items-center bg-indigo-600 hover:bg-indigo-700"
                    >
                      {currentQuestionIdx === questions.length - 1 ? "Hoàn thành" : "Câu tiếp theo"}{" "}
                      <ChevronRight className="ml-1.5 h-4 w-4" />
                    </Button>
                  )}
                </div>
              </Card>
            ) : (
              // Quiz Summary Screen
              <Card className="border-slate-100 shadow-xl p-8 max-w-md mx-auto text-center bg-white space-y-6 rounded-3xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-indigo-600"></div>
                <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <Trophy className="h-8 w-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-extrabold text-slate-900">Tuyệt vời Thầy Cô ơi!</h3>
                  <p className="text-xs text-slate-500">Hoạt động trắc nghiệm đã hoàn thành xuất sắc.</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 grid grid-cols-2 gap-4">
                  <div>
                    <span className="block text-3xl font-extrabold text-indigo-600">{score}/{questions.length}</span>
                    <span className="text-[10px] text-slate-400 font-mono uppercase font-bold">Số câu đúng</span>
                  </div>
                  <div>
                    <span className="block text-3xl font-extrabold text-emerald-600">
                      {Math.round((score / questions.length) * 100)}%
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono uppercase font-bold">Độ chính xác</span>
                  </div>
                </div>

                <div className="flex space-x-3 justify-center pt-2">
                  <Button variant="outline" onClick={handleRestartQuiz} className="h-10 rounded-xl flex-1 text-xs">
                    <RotateCw className="mr-1.5 h-3.5 w-3.5" /> Chơi lại
                  </Button>
                  <Button onClick={onBackToDashboard} className="h-10 rounded-xl flex-1 text-xs bg-indigo-600">
                    Bàn làm việc
                  </Button>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* ==================== 2. WHEEL PLAY ==================== */}
        {game.type === "wheel" && wheelItems.length > 0 && (
          <div className="max-w-xl mx-auto space-y-6 text-center">
            <Card className="border-slate-100 shadow-md p-6 bg-white rounded-3xl space-y-6">
              {/* Wheel Container Canvas */}
              <div className="relative flex justify-center py-4">
                {/* Pointer Indicator */}
                <div className="absolute top-1 right-[50%] translate-x-[50%] z-20">
                  <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[20px] border-t-red-600 filter drop-shadow-sm"></div>
                </div>
                <canvas 
                  ref={canvasRef} 
                  width={300} 
                  height={300} 
                  className="rounded-full shadow-inner border border-slate-100/50 bg-slate-50/50"
                />
              </div>

              {/* Action and Spin instructions */}
              <div className="space-y-4">
                <Button 
                  onClick={handleSpinWheel}
                  disabled={isSpinning}
                  className="w-48 h-11 text-sm font-bold tracking-wider uppercase rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-800"
                >
                  {isSpinning ? "Đang quay..." : "Quay Ngay! 🎡"}
                </Button>
                <p className="text-xs text-slate-400">
                  Phù hợp cho hoạt động gọi tên ngẫu nhiên học sinh hoặc quay chủ đề thảo luận nhóm sáng tạo.
                </p>
              </div>

              {/* Spin success banner */}
              <AnimatePresence>
                {wheelResult && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="p-5 bg-indigo-50 border border-indigo-100 rounded-2xl space-y-2 mt-4"
                  >
                    <span className="text-[10px] font-bold text-indigo-700 font-mono bg-indigo-100 px-2 py-0.5 rounded-full uppercase">
                      Kết quả vòng quay
                    </span>
                    <h3 className="text-lg font-extrabold text-slate-900">{wheelResult}</h3>
                    <p className="text-xs text-indigo-600 italic">
                      💡 Giáo viên: Hãy mời một học sinh đặt câu hoặc thảo luận về chủ đề trên!
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </div>
        )}

        {/* ==================== 3. FLASHCARDS PLAY ==================== */}
        {game.type === "flashcard" && flashcards.length > 0 && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex justify-between items-center text-xs text-slate-400 px-1 font-mono">
              <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-bold">
                THẺ {currentCardIdx + 1} / {flashcards.length}
              </span>
              <span>Đã thuộc: {masteredCards.length} thẻ</span>
            </div>

            {/* Flipped card with 3D animation perspective container */}
            <div 
              onClick={handleCardFlip}
              className="w-full h-72 cursor-pointer perspective-1000 select-none group"
            >
              <div 
                className={`relative w-full h-full duration-500 transform-style-3d transition-transform ${
                  isFlipped ? "rotate-y-180" : ""
                }`}
              >
                {/* CARD FRONT SIDE */}
                <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-3xl p-8 flex flex-col justify-between text-white backface-hidden shadow-lg border border-indigo-700">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-indigo-200">
                      Mặt trước • Câu hỏi / Thuật ngữ
                    </span>
                    <span className="p-1 bg-white/10 rounded-lg text-xs hover:bg-white/20 transition-all">💡 Nhấn để lật</span>
                  </div>
                  <div className="text-center py-6">
                    <h3 className="text-xl sm:text-2xl font-bold tracking-tight leading-relaxed">
                      {flashcards[currentCardIdx].front}
                    </h3>
                  </div>
                  <div className="text-center text-xs font-mono text-indigo-200">
                    Phần 2: Đáp án số sư phạm
                  </div>
                </div>

                {/* CARD BACK SIDE */}
                <div className="absolute inset-0 w-full h-full bg-white rounded-3xl p-8 flex flex-col justify-between text-slate-900 backface-hidden rotate-y-180 shadow-lg border border-slate-100">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      Mặt sau • Đáp án chính thức
                    </span>
                    <span className="p-1 bg-slate-50 border border-slate-100 rounded-lg text-xs hover:bg-slate-100 transition-all">💡 Nhấn để lật lại</span>
                  </div>
                  <div className="text-center py-6">
                    <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-indigo-900 leading-relaxed">
                      {flashcards[currentCardIdx].back}
                    </h3>
                  </div>
                  <div className="flex justify-between items-center text-xs pt-2">
                    <span className="text-slate-400">Giáo Viên Đổi Mới AI</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMastered(flashcards[currentCardIdx].id);
                      }}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer flex items-center space-x-1 ${
                        masteredCards.includes(flashcards[currentCardIdx].id)
                          ? "bg-emerald-50 border-emerald-500 text-emerald-700"
                          : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                      }`}
                    >
                      <CheckCircle className="h-3.5 w-3.5" />
                      <span>{masteredCards.includes(flashcards[currentCardIdx].id) ? "Đã thuộc bài ✓" : "Đánh dấu đã học"}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Hint & Navigation controls */}
            <div className="flex flex-col space-y-4">
              {flashcards[currentCardIdx].hint && (
                <div className="text-center">
                  <button
                    onClick={() => setShowHint(!showHint)}
                    className="text-xs font-semibold text-slate-500 hover:text-indigo-600 underline underline-offset-4 cursor-pointer"
                  >
                    {showHint ? "Ẩn gợi ý" : "Xem gợi ý học tập"}
                  </button>
                  <AnimatePresence>
                    {showHint && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-xs text-slate-500 italic bg-slate-100 p-2.5 rounded-xl border border-slate-200 mt-2 max-w-sm mx-auto"
                      >
                        Gợi ý: {flashcards[currentCardIdx].hint}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              )}

              <div className="flex items-center justify-between max-w-xs mx-auto w-full pt-2">
                <Button
                  variant="outline"
                  onClick={handlePrevCard}
                  disabled={currentCardIdx === 0}
                  className="rounded-xl h-10 w-24 flex items-center justify-center text-xs"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" /> Trước
                </Button>
                <span className="text-xs font-bold font-mono text-slate-500">
                  {currentCardIdx + 1} / {flashcards.length}
                </span>
                <Button
                  variant="outline"
                  onClick={handleNextCard}
                  disabled={currentCardIdx === flashcards.length - 1}
                  className="rounded-xl h-10 w-24 flex items-center justify-center text-xs"
                >
                  Tiếp <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ==================== 4. MEMORY MATCH GAME PLAY ==================== */}
        {game.type === "memory" && memoryCards.length > 0 && (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Stats bar */}
            <div className="flex justify-between items-center px-2 text-xs font-mono font-bold text-slate-500">
              <div className="flex items-center bg-slate-100 px-3 py-1 rounded-lg">
                <RefreshCw className="h-3.5 w-3.5 mr-1.5 text-slate-400" />
                <span>Số lượt lật: {moves}</span>
              </div>
              <div className="flex items-center bg-slate-100 px-3 py-1 rounded-lg">
                <Clock className="h-3.5 w-3.5 mr-1.5 text-slate-400" />
                <span>Thời gian: {elapsedTime}s</span>
              </div>
            </div>

            {/* Memory Card Grid */}
            {!memoryFinished ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {memoryCards.map((card, idx) => {
                  const isFlippedOpen = flippedCards.includes(idx);
                  const isMatched = matchedPairs.includes(card.pairId);

                  return (
                    <div
                      key={card.id}
                      onClick={() => handleCardClick(idx)}
                      className="h-28 cursor-pointer perspective-1000 select-none text-center"
                    >
                      <div
                        className={`relative w-full h-full duration-300 transform-style-3d transition-transform ${
                          isFlippedOpen || isMatched ? "rotate-y-180" : ""
                        }`}
                      >
                        {/* Front Side (Face Down - Purple Pattern) */}
                        <div className="absolute inset-0 w-full h-full bg-indigo-900 border border-indigo-950 rounded-xl flex items-center justify-center text-white backface-hidden shadow-sm">
                          <BrainCircuit className="h-7 w-7 text-indigo-400 opacity-60 animate-pulse" />
                        </div>

                        {/* Back Side (Face Up - Content shown) */}
                        <div className={`absolute inset-0 w-full h-full rounded-xl p-3 flex flex-col items-center justify-center border backface-hidden rotate-y-180 shadow-md ${
                          isMatched 
                            ? "bg-emerald-50 border-emerald-400 text-emerald-900" 
                            : "bg-white border-slate-200 text-slate-900"
                        }`}>
                          <span className="text-[8px] font-bold font-mono tracking-wider text-slate-400 uppercase mb-1">
                            {card.type === "term" ? "🔑 TỪ KHÓA" : "📝 ĐỊNH NGHĨA"}
                          </span>
                          <p className={`text-center font-bold tracking-tight leading-tight line-clamp-3 text-xs`}>
                            {card.text}
                          </p>
                          {isMatched && <span className="absolute bottom-1 right-1 text-emerald-600 font-bold text-[10px]">✓</span>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              // Victory screen
              <Card className="border-slate-100 shadow-xl p-8 max-w-md mx-auto text-center bg-white space-y-6 rounded-3xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-emerald-500"></div>
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <Award className="h-8 w-8 animate-bounce" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-extrabold text-slate-900">Chiến Thắng!</h3>
                  <p className="text-xs text-slate-500">Chúc mừng bạn đã ghép cặp hoàn thành mọi thuật ngữ trí tuệ.</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 grid grid-cols-2 gap-4">
                  <div>
                    <span className="block text-2xl font-extrabold text-indigo-600">{moves} lượt</span>
                    <span className="text-[10px] text-slate-400 font-mono uppercase font-bold">Tổng số lượt</span>
                  </div>
                  <div>
                    <span className="block text-2xl font-extrabold text-emerald-600">{elapsedTime} giây</span>
                    <span className="text-[10px] text-slate-400 font-mono uppercase font-bold">Thời gian hoàn thành</span>
                  </div>
                </div>

                <div className="flex space-x-3 justify-center pt-2">
                  <Button variant="outline" onClick={initializeMemoryGame} className="h-10 rounded-xl flex-1 text-xs">
                    <RotateCw className="mr-1.5 h-3.5 w-3.5" /> Chơi lại
                  </Button>
                  <Button onClick={onBackToDashboard} className="h-10 rounded-xl flex-1 text-xs bg-indigo-600">
                    Bàn làm việc
                  </Button>
                </div>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
