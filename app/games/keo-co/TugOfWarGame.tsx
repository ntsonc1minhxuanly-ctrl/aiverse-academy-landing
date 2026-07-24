import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "../../../src/components/ui/card";
import { Button } from "../../../src/components/ui/button";
import { Input } from "../../../src/components/ui/input";
import { Game, QuizQuestion } from "../../../src/types";
import { 
  ArrowLeft, Trophy, RotateCw, ChevronRight, 
  Swords, ShieldAlert, Check, Play, HelpCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useUser } from "../../../src/context/UserContext";

interface TugOfWarGameProps {
  game?: Game;
  onBackToDashboard: () => void;
}

// 10 high-quality sample questions on Math, Literature, and English (Toán, Văn, Anh)
const DEFAULT_QUESTIONS: QuizQuestion[] = [
  {
    id: "q1",
    question: "Kết quả của phép tính: 15 + 7 x 2 là bao nhiêu?",
    options: ["44", "29", "31", "22"],
    correctAnswer: 1,
    explanation: "Thực hiện phép nhân trước: 7 x 2 = 14, sau đó cộng với 15: 15 + 14 = 29."
  },
  {
    id: "q2",
    question: "Tác phẩm 'Dế Mèn Phiêu Lưu Ký' của nhà văn nào?",
    options: ["Nam Cao", "Thạch Lam", "Tô Hoài", "Xuân Quỳnh"],
    correctAnswer: 2,
    explanation: "Tác phẩm nổi tiếng này do nhà văn Tô Hoài sáng tác vào năm 1941."
  },
  {
    id: "q3",
    question: "Hoàn thành câu sau: 'She ___ to school every day.'",
    options: ["go", "goes", "going", "gone"],
    correctAnswer: 1,
    explanation: "Chủ ngữ là 'She' (ngôi thứ ba số ít), câu diễn tả hành động lặp đi lặp lại hàng ngày (Thì Hiện tại đơn) nên động từ thêm 'es'."
  },
  {
    id: "q4",
    question: "Số nguyên tố nhỏ nhất và cũng là số nguyên tố chẵn duy nhất là số nào?",
    options: ["1", "2", "3", "5"],
    correctAnswer: 1,
    explanation: "Số 2 là số nguyên tố nhỏ nhất và cũng là số chẵn duy nhất trong tập hợp các số nguyên tố."
  },
  {
    id: "q5",
    question: "Bài thơ 'Bánh trôi nước' ('Thân em vừa trắng lại vừa tròn...') là của nhà thơ nào?",
    options: ["Hồ Xuân Hương", "Bà Huyện Thanh Quan", "Đoàn Thị Điểm", "Xuân Quỳnh"],
    correctAnswer: 0,
    explanation: "Bài thơ này được sáng tác bởi nữ sĩ Hồ Xuân Hương, người được mệnh danh là 'Bà chúa thơ Nôm'."
  },
  {
    id: "q6",
    question: "Từ nào trái nghĩa với từ 'generous' (hào phóng) trong tiếng Anh?",
    options: ["kind", "mean", "friendly", "honest"],
    correctAnswer: 1,
    explanation: "'Mean' có nghĩa là keo kiệt hoặc bủn xỉn, trái nghĩa trực tiếp với 'generous' (hào phóng)."
  },
  {
    id: "q7",
    question: "Tính diện tích hình tròn có bán kính r = 3cm? (Lấy π ≈ 3.14)",
    options: ["9.42 cm²", "18.84 cm²", "28.26 cm²", "31.4 cm²"],
    correctAnswer: 2,
    explanation: "Diện tích hình tròn: S = π x r² = 3.14 x 3 x 3 = 28.26 cm²."
  },
  {
    id: "q8",
    question: "Từ nào dưới đây viết ĐÚNG chính tả tiếng Việt?",
    options: ["Sơ xuất", "Sơ suất", "Xơ xuất", "Xơ suất"],
    correctAnswer: 1,
    explanation: "'Sơ suất' là từ viết đúng chính tả, chỉ sự không cẩn thận, thiếu chú ý gây ra sai sót."
  },
  {
    id: "q9",
    question: "Thủ đô của nước Anh (United Kingdom) là thành phố nào?",
    options: ["Paris", "London", "New York", "Washington D.C."],
    correctAnswer: 1,
    explanation: "London là thủ đô và là thành phố lớn nhất của nước Anh."
  },
  {
    id: "q10",
    question: "Tìm tập nghiệm của phương trình x² - 4 = 0?",
    options: ["x = 2", "x = -2", "x = 2 hoặc x = -2", "Vô nghiệm"],
    correctAnswer: 2,
    explanation: "x² - 4 = 0 ⇔ x² = 4 ⇔ x = 2 hoặc x = -2. Vậy phương trình có hai nghiệm phân biệt."
  }
];

export default function TugOfWarGame({ game, onBackToDashboard }: TugOfWarGameProps) {
  const { currentUser } = useUser();
  const questions: QuizQuestion[] = game?.content?.questions && game.content.questions.length > 0 
    ? game.content.questions 
    : DEFAULT_QUESTIONS;

  const gameTitle = game?.title || "Trận Chiến Kéo Co Trí Tuệ";

  // Setup states
  const [gameStarted, setGameStarted] = useState(false);
  const [teamAName, setTeamAName] = useState("Chiến binh Xanh (Đội A)");
  const [teamBName, setTeamBName] = useState("Phượng hoàng Đỏ (Đội B)");
  const [targetScoreToWin, setTargetScoreToWin] = useState(3); // rope shifts to win (+3 or -3)

  // Gameplay states
  const [ropePosition, setRopePosition] = useState(0); // -target to +target
  const [currentTeamTurn, setCurrentTeamTurn] = useState<"A" | "B">("A");
  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(false);
  const [winner, setWinner] = useState<"A" | "B" | null>(null);
  const [totalQuestionsAnswered, setTotalQuestionsAnswered] = useState(0);

  // Animation states
  const [isPulling, setIsPulling] = useState(false);
  const [pullingTeam, setPullingTeam] = useState<"A" | "B" | null>(null);

  // Auto-win check when ropePosition changes
  useEffect(() => {
    if (ropePosition <= -targetScoreToWin) {
      setWinner("A");
    } else if (ropePosition >= targetScoreToWin) {
      setWinner("B");
    }
  }, [ropePosition, targetScoreToWin]);

  // Save game results to Firestore when a game concludes
  useEffect(() => {
    if (winner) {
      fetch("/api/game_sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gameType: "keoco",
          classId: "",
          quizId: game?.id || "default_keoco",
          results: {
            winner: winner === "A" ? teamAName : teamBName,
            scoreA,
            scoreB,
            totalQuestionsAnswered,
            player: currentUser?.fullName || currentUser?.username || "Giáo viên",
            playerRole: currentUser?.role || "teacher"
          }
        })
      }).catch(err => console.error("Lỗi lưu kết quả Kéo co:", err));
    }
  }, [winner]);

  const handleOptionSelect = (idx: number) => {
    if (hasSubmitted || winner) return;
    setSelectedOption(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || hasSubmitted || winner) return;

    const currentQuestion = questions[currentQuestionIdx];
    const isCorrect = selectedOption === currentQuestion.correctAnswer;
    
    setIsCorrectAnswer(isCorrect);
    setHasSubmitted(true);
    setTotalQuestionsAnswered(prev => prev + 1);

    setIsPulling(true);

    if (isCorrect) {
      // Correct answer: Current team pulls rope towards their side
      setPullingTeam(currentTeamTurn);
      
      if (currentTeamTurn === "A") {
        setScoreA(prev => prev + 1);
        setRopePosition(prev => Math.max(prev - 1, -targetScoreToWin));
      } else {
        setScoreB(prev => prev + 1);
        setRopePosition(prev => Math.min(prev + 1, targetScoreToWin));
      }
    } else {
      // Incorrect answer: Opposing team grabs the advantage and pulls the rope 1 step towards them!
      const opposingTeam = currentTeamTurn === "A" ? "B" : "A";
      setPullingTeam(opposingTeam);

      if (currentTeamTurn === "A") {
        // A is wrong -> pulls rope towards B (right)
        setRopePosition(prev => Math.min(prev + 1, targetScoreToWin));
      } else {
        // B is wrong -> pulls rope towards A (left)
        setRopePosition(prev => Math.max(prev - 1, -targetScoreToWin));
      }
    }

    setTimeout(() => {
      setIsPulling(false);
      setPullingTeam(null);
    }, 850);
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setHasSubmitted(false);
    
    // Switch turn to the other team for the next question
    setCurrentTeamTurn(prev => prev === "A" ? "B" : "A");

    // Cycle through questions
    if (currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
    } else {
      setCurrentQuestionIdx(0);
    }
  };

  const handleRestart = () => {
    setRopePosition(0);
    setCurrentTeamTurn("A");
    setScoreA(0);
    setScoreB(0);
    setCurrentQuestionIdx(0);
    setSelectedOption(null);
    setHasSubmitted(false);
    setWinner(null);
    setTotalQuestionsAnswered(0);
    setIsPulling(false);
    setPullingTeam(null);
  };

  // Fun animal avatars representing the tug-of-war squads
  const squadA = ["🦁", "🐯", "🐼", "🦊"];
  const squadB = ["🦄", "🐨", "🐰", "🐵"];

  return (
    <div className="space-y-6 w-full max-w-4xl mx-auto px-2 select-none font-sans">
      
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row items-center justify-between border-b border-blue-100 pb-4 gap-4">
        <Button 
          variant="outline" 
          onClick={onBackToDashboard}
          className="h-10 rounded-xl text-xs flex items-center space-x-1.5 hover:bg-blue-50 border-blue-200 text-blue-700 cursor-pointer w-full sm:w-auto justify-center"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="font-semibold">Quay lại Thư viện</span>
        </Button>
        <div className="text-center">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-[10px] font-black rounded-full uppercase tracking-wider font-mono">
            Trò chơi vận động trí tuệ • Kéo co
          </span>
          <h2 className="text-base font-extrabold text-blue-900 mt-1">{gameTitle}</h2>
        </div>
        <div className="hidden sm:block w-36"></div> {/* Spacer to maintain symmetry */}
      </div>

      {!gameStarted ? (
        /* SETUP SCREEN */
        <Card className="border-blue-100 shadow-xl overflow-hidden bg-white rounded-3xl max-w-xl mx-auto">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-sky-600 p-6 text-center text-white">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm text-white rounded-2xl flex items-center justify-center mx-auto shadow-inner mb-3">
              <Swords className="h-8 w-8 animate-pulse" />
            </div>
            <CardTitle className="text-xl font-extrabold">Chuẩn Bị Sân Đấu Kéo Co</CardTitle>
            <CardDescription className="text-xs text-blue-100 pt-1">
              Điền tên hai đội tuyển để bắt đầu trận chiến trắc nghiệm siêu kịch tính!
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Team A Setup */}
              <div className="space-y-2 p-4 bg-sky-50 border border-sky-100 rounded-2xl">
                <label className="block text-xs font-black text-blue-700 flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block animate-ping"></span>
                  <span>ĐỘI XANH (BÊN TRÁI)</span>
                </label>
                <Input
                  value={teamAName}
                  onChange={(e) => setTeamAName(e.target.value)}
                  placeholder="Tên Đội A..."
                  className="bg-white border-blue-200 h-10 text-xs rounded-xl focus:ring-blue-500 font-bold text-blue-900 focus:border-blue-500"
                />
                <div className="flex space-x-2 text-2xl pt-2 justify-center">
                  {squadA.map((emoji, i) => (
                    <span key={i} className="animate-bounce" style={{ animationDelay: `${i * 150}ms` }}>{emoji}</span>
                  ))}
                </div>
              </div>

              {/* Team B Setup */}
              <div className="space-y-2 p-4 bg-red-50/50 border border-red-100 rounded-2xl">
                <label className="block text-xs font-black text-red-700 flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block animate-ping"></span>
                  <span>ĐỘI ĐỎ (BÊN PHẢI)</span>
                </label>
                <Input
                  value={teamBName}
                  onChange={(e) => setTeamBName(e.target.value)}
                  placeholder="Tên Đội B..."
                  className="bg-white border-red-200 h-10 text-xs rounded-xl focus:ring-red-500 font-bold text-red-900 focus:border-red-500"
                />
                <div className="flex space-x-2 text-2xl pt-2 justify-center">
                  {squadB.map((emoji, i) => (
                    <span key={i} className="animate-bounce" style={{ animationDelay: `${i * 150}ms` }}>{emoji}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Target score selection */}
            <div className="space-y-3 pt-2 text-center">
              <label className="block text-xs font-bold text-slate-600">
                Độ dài kéo dây cần thiết để giành chiến thắng chung cuộc
              </label>
              <div className="flex justify-center gap-2 flex-wrap">
                {[2, 3, 4, 5].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setTargetScoreToWin(val)}
                    className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      targetScoreToWin === val
                        ? "bg-blue-600 text-white shadow-md scale-105"
                        : "bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200/50"
                    }`}
                  >
                    Kéo {val} Nhịp
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-blue-50/50 p-6 border-t border-blue-100">
            <Button
              onClick={() => {
                if (questions.length === 0) {
                  alert("Trò chơi chưa có câu hỏi nào để bắt đầu!");
                  return;
                }
                setGameStarted(true);
              }}
              className="w-full h-11 text-xs font-extrabold uppercase tracking-wider bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 shadow-md text-white rounded-xl flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Play className="h-4.5 w-4.5" />
              <span>BẮT ĐẦU KÉO CO!</span>
            </Button>
          </CardFooter>
        </Card>
      ) : (
        /* GAMEPLAY BOARD */
        <div className="space-y-6">
          
          {/* TUG OF WAR visual stage - Blue themed with smooth physics animations */}
          <Card className="border-blue-150 shadow-lg overflow-hidden bg-white rounded-3xl p-5 relative border-2">
            <div className="absolute top-3 left-3 text-[10px] font-bold text-blue-400 uppercase font-mono">
              Đấu trường Kéo Co Số
            </div>

            {/* Score HUD display */}
            <div className="flex items-center justify-between px-3 pb-4 border-b border-blue-50 mt-2">
              {/* Score Team A */}
              <div className="flex items-center space-x-2.5">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-lg font-black text-blue-700 shadow-sm border border-blue-200">
                  {scoreA}
                </div>
                <div className="text-left">
                  <h4 className="font-extrabold text-blue-800 text-xs truncate max-w-[120px] sm:max-w-[180px]">
                    {teamAName}
                  </h4>
                  <span className="text-[9px] text-blue-500 font-semibold uppercase">Lượt trả lời đúng</span>
                </div>
              </div>

              {/* VS badge */}
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-extrabold text-xs px-3.5 py-1 rounded-full font-mono shadow-sm">
                VS
              </div>

              {/* Score Team B */}
              <div className="flex items-center space-x-2.5 text-right">
                <div className="text-right">
                  <h4 className="font-extrabold text-red-800 text-xs truncate max-w-[120px] sm:max-w-[180px]">
                    {teamBName}
                  </h4>
                  <span className="text-[9px] text-red-500 font-semibold uppercase">Lượt trả lời đúng</span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-lg font-black text-red-700 shadow-sm border border-red-200">
                  {scoreB}
                </div>
              </div>
            </div>

            {/* THE ARENA VISUAL STAGE - Beautiful sky/blue theme */}
            <div className="relative h-48 my-4 rounded-2xl bg-gradient-to-b from-sky-100 to-blue-200/70 border border-blue-200/50 shadow-inner overflow-hidden flex flex-col justify-between p-4">
              
              {/* Field Markings: Center line, Win lines */}
              <div className="absolute inset-0 flex justify-between pointer-events-none opacity-50 px-10 sm:px-24">
                {/* Win Boundary Team A (Left) */}
                <div className="h-full border-l-2 border-dashed border-blue-500 flex items-center justify-start relative">
                  <span className="absolute top-2 left-1.5 text-[9px] font-black text-blue-700 tracking-tight leading-none bg-white/90 px-1.5 py-0.5 rounded border border-blue-200">
                    MỐC THẮNG {teamAName.substring(0, 5)}
                  </span>
                </div>
                {/* Center line */}
                <div className="h-full border-l-2 border-blue-300"></div>
                {/* Win Boundary Team B (Right) */}
                <div className="h-full border-r-2 border-dashed border-red-500 flex items-center justify-end relative">
                  <span className="absolute top-2 right-1.5 text-[9px] font-black text-red-700 tracking-tight leading-none bg-white/90 px-1.5 py-0.5 rounded border border-red-200">
                    MỐC THẮNG {teamBName.substring(0, 5)}
                  </span>
                </div>
              </div>

              {/* Team Labels */}
              <div className="flex justify-between items-start z-10">
                <div className="bg-blue-600/90 text-white px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-wider">
                  {teamAName}
                </div>
                <div className="bg-red-600/90 text-white px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-wider">
                  {teamBName}
                </div>
              </div>

              {/* ROPE SYSTEM WITH ANIMATED SQUADS */}
              <div className="relative w-full flex items-center justify-center py-6">
                
                {/* Physical rope element */}
                <div className="absolute left-6 right-6 h-3.5 bg-amber-850 rounded-full border-y border-amber-900 shadow-md flex items-center overflow-hidden">
                  <div className="w-full h-1 bg-amber-600/30 repeating-linear-rope animate-[pulse_2s_infinite]"></div>
                </div>

                {/* Smooth spring-animated dragging center */}
                <motion.div 
                  className="relative flex items-center justify-center w-full max-w-[80%]"
                  animate={{ 
                    x: ropePosition * 35, // Amplified distance for clear visual movement
                    scale: isPulling ? [1, 1.04, 1] : 1
                  }}
                  transition={{ type: "spring", stiffness: 120, damping: 12 }}
                >
                  {/* Team A Characters */}
                  <div className="absolute right-[54%] flex items-center space-x-1.5 pr-6">
                    {squadA.map((emoji, i) => (
                      <motion.span 
                        key={i} 
                        className="text-3xl filter drop-shadow-md select-none block"
                        animate={{ 
                          rotate: isPulling && pullingTeam === "A" ? [-5, -24, -5] : -12,
                          x: isPulling && pullingTeam === "A" ? [-3, -12, -3] : 0,
                          scale: isPulling && pullingTeam === "A" ? 1.2 : 1
                        }}
                        transition={{ duration: 0.6 }}
                      >
                        {emoji}
                      </motion.span>
                    ))}
                  </div>

                  {/* Flag at the exact center of the rope */}
                  <div className="relative z-20 flex flex-col items-center">
                    <motion.div 
                      className="w-6 h-11 bg-red-600 rounded-b-md shadow-lg border border-red-700 flex items-center justify-center text-[10px] font-bold text-white leading-none relative"
                      animate={{ 
                        rotate: isPulling ? [0, 15, -15, 0] : 0,
                        scale: isPulling ? 1.15 : 1
                      }}
                      transition={{ type: "spring", stiffness: 140 }}
                    >
                      🚩
                    </motion.div>
                    {/* Position target reference marker */}
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400 absolute -top-1 border border-white shadow"></div>
                  </div>

                  {/* Team B Characters */}
                  <div className="absolute left-[54%] flex items-center space-x-1.5 pl-6">
                    {squadB.map((emoji, i) => (
                      <motion.span 
                        key={i} 
                        className="text-3xl filter drop-shadow-md select-none block"
                        animate={{ 
                          rotate: isPulling && pullingTeam === "B" ? [5, 24, 5] : 12,
                          x: isPulling && pullingTeam === "B" ? [3, 12, 3] : 0,
                          scale: isPulling && pullingTeam === "B" ? 1.2 : 1
                        }}
                        transition={{ duration: 0.6 }}
                      >
                        {emoji}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>

              </div>

              {/* Interactive visual state text */}
              <div className="text-center z-10 mt-1">
                <span className="bg-white/95 border border-blue-200 px-3.5 py-1 rounded-full text-[10px] font-black text-blue-800 shadow-sm tracking-wide font-mono uppercase">
                  Vị trí cờ: <span className="text-xs text-indigo-700 font-extrabold">{Math.abs(ropePosition)}</span> nhịp về phía {ropePosition < 0 ? teamAName.substring(0, 10) : ropePosition > 0 ? teamBName.substring(0, 10) : "TRUNG TÂM"}
                </span>
              </div>
            </div>
          </Card>

          <AnimatePresence mode="wait">
            {winner ? (
              /* VICTORY SCREEN */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="max-w-md mx-auto"
              >
                <Card className="border-blue-100 shadow-2xl p-8 text-center bg-white space-y-6 rounded-3xl relative overflow-hidden border-2">
                  <div className={`absolute top-0 left-0 w-full h-2 ${winner === "A" ? "bg-blue-600" : "bg-red-600"}`}></div>
                  <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto shadow-md ${winner === "A" ? "bg-blue-50 text-blue-600 border border-blue-200" : "bg-red-50 text-red-600 border border-red-200"}`}>
                    <Trophy className="h-10 w-10 animate-bounce text-yellow-500" />
                  </div>
                  <div className="space-y-2">
                    <span className="px-3.5 py-1 bg-yellow-100 text-yellow-800 text-[10px] font-black rounded-full uppercase tracking-widest font-mono">
                      🏆 CHIẾN THẮNG CHUNG CUỘC 🏆
                    </span>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight pt-1">
                      {winner === "A" ? teamAName : teamBName}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium px-4 leading-relaxed">
                      Chúc mừng đội thắng cuộc đã vượt qua thử thách trí tuệ, chứng minh sức mạnh của tinh thần đồng đội xuất sắc!
                    </p>
                  </div>

                  <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 grid grid-cols-2 gap-4">
                    <div>
                      <span className={`block text-2xl font-extrabold ${winner === "A" ? "text-blue-600" : "text-red-600"}`}>
                        {winner === "A" ? scoreA : scoreB} câu
                      </span>
                      <span className="text-[10px] text-blue-600 font-bold uppercase font-mono">Trả lời đúng</span>
                    </div>
                    <div>
                      <span className="block text-2xl font-extrabold text-slate-700">{totalQuestionsAnswered} câu</span>
                      <span className="text-[10px] text-slate-500 font-bold uppercase font-mono">Tổng lượt đấu</span>
                    </div>
                  </div>

                  <div className="flex space-x-3 justify-center pt-2">
                    <Button variant="outline" onClick={handleRestart} className="h-11 rounded-xl flex-1 text-xs font-bold border-blue-200 hover:bg-blue-50 text-blue-700 cursor-pointer">
                      <RotateCw className="mr-1.5 h-3.5 w-3.5" /> Chơi lại ngay
                    </Button>
                    <Button onClick={onBackToDashboard} className="h-11 rounded-xl flex-1 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white cursor-pointer shadow-md shadow-blue-200">
                      Quay lại Thư viện
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ) : (
              /* ACTIVE QUIZ QUESTION CARD */
              <motion.div
                key={currentQuestionIdx}
                initial={{ opacity: 0, x: 25 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -25 }}
              >
                <Card className="border-blue-100 shadow-lg overflow-hidden bg-white rounded-3xl border-2">
                  {/* Team Turn Indicator Banner */}
                  <div className={`p-4 text-center border-b font-extrabold text-xs flex items-center justify-center space-x-2 transition-colors duration-300 ${
                    currentTeamTurn === "A" 
                      ? "bg-blue-600 text-white" 
                      : "bg-red-600 text-white"
                  }`}>
                    <Swords className="h-4 w-4 animate-spin-slow" />
                    <span className="uppercase tracking-wider font-mono">
                      LƯỢT CHƠI: ĐỘI {currentTeamTurn === "A" ? teamAName.toUpperCase() : teamBName.toUpperCase()} TRẢ LỜI
                    </span>
                  </div>

                  <CardContent className="p-6 sm:p-8 space-y-6">
                    {/* Question text */}
                    <div className="space-y-2.5">
                      <span className="px-3 py-1 bg-blue-50 text-blue-700 text-[10px] font-black rounded-full font-mono uppercase tracking-wider">
                        CÂU HỎI {currentQuestionIdx + 1} / {questions.length}
                      </span>
                      <h3 className="text-base sm:text-lg font-black text-slate-800 leading-relaxed pt-1">
                        {questions[currentQuestionIdx]?.question}
                      </h3>
                    </div>

                    {/* Options Grid (A, B, C, D) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {questions[currentQuestionIdx]?.options.map((opt, idx) => {
                        const isSelected = selectedOption === idx;
                        const isCorrectOpt = idx === questions[currentQuestionIdx].correctAnswer;
                        
                        let optionStyle = "border-slate-200 hover:bg-slate-50 hover:border-blue-200 text-slate-700";
                        if (isSelected && !hasSubmitted) {
                          optionStyle = currentTeamTurn === "A"
                            ? "bg-blue-50 border-blue-500 text-blue-900 shadow-sm font-black"
                            : "bg-red-50 border-red-500 text-red-900 shadow-sm font-black";
                        } else if (hasSubmitted) {
                          if (isCorrectOpt) {
                            optionStyle = "bg-green-50 border-green-500 text-green-900 shadow-sm font-black";
                          } else if (isSelected) {
                            optionStyle = "bg-red-50 border-red-500 text-red-900 shadow-sm opacity-90 font-black";
                          } else {
                            optionStyle = "border-slate-100 text-slate-400 opacity-60";
                          }
                        }

                        return (
                          <button
                            key={idx}
                            onClick={() => handleOptionSelect(idx)}
                            disabled={hasSubmitted}
                            className={`p-4 rounded-2xl border text-left text-xs font-bold transition-all flex items-start space-x-3 cursor-pointer ${optionStyle}`}
                          >
                            <span className="w-6 h-6 rounded-full bg-blue-50 border border-blue-150 text-blue-700 flex items-center justify-center font-mono text-xs font-black flex-shrink-0 shadow-sm">
                              {String.fromCharCode(65 + idx)}
                            </span>
                            <span className="pt-0.5 leading-relaxed">{opt}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Answer explanation visual feedback banner */}
                    <AnimatePresence>
                      {hasSubmitted && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className={`p-4 rounded-2xl border flex items-start space-x-3 ${
                            isCorrectAnswer 
                              ? "bg-green-50 border-green-200 text-green-800" 
                              : "bg-red-50 border-red-200 text-red-800"
                          }`}
                        >
                          {isCorrectAnswer ? (
                            <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5 animate-bounce" />
                          ) : (
                            <ShieldAlert className="h-5 w-5 text-red-650 flex-shrink-0 mt-0.5 animate-shake" />
                          )}
                          <div className="space-y-1">
                            <h4 className="font-extrabold text-xs">
                              {isCorrectAnswer 
                                ? `Chính xác! Đội ${currentTeamTurn === "A" ? teamAName : teamBName} đã kéo cờ dịch thêm 1 nhịp về phía mình!` 
                                : `Sai rồi! Lực thế nghiêng hẳn về đối phương, giật dây thêm 1 nhịp về phía đội ${currentTeamTurn === "A" ? teamBName : teamAName}!`
                              }
                            </h4>
                            {questions[currentQuestionIdx].explanation && (
                              <p className="text-[11px] text-slate-600 leading-relaxed pt-1.5">
                                💡 <strong>Giải thích:</strong> {questions[currentQuestionIdx].explanation}
                              </p>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>

                  {/* Submission and navigation control footer */}
                  <CardFooter className="p-6 bg-slate-50 border-t border-blue-50 flex justify-end">
                    {!hasSubmitted ? (
                      <Button
                        onClick={handleSubmitAnswer}
                        disabled={selectedOption === null}
                        className={`h-11 rounded-xl px-8 text-xs font-black tracking-wider transition-all shadow-md cursor-pointer uppercase ${
                          currentTeamTurn === "A" 
                            ? "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-100" 
                            : "bg-red-600 text-white hover:bg-red-700 shadow-red-100"
                        }`}
                      >
                        Bắt đầu kéo! 🤼
                      </Button>
                    ) : (
                      <Button
                        onClick={handleNextQuestion}
                        className="h-11 rounded-xl px-7 text-xs font-extrabold bg-blue-950 hover:bg-black text-white flex items-center space-x-2 cursor-pointer shadow-md"
                      >
                        <span>Nhường lượt kéo tiếp theo</span>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
