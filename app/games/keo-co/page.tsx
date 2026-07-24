'use client'
import { useState, useEffect } from 'react'
import { getQuestionsBySubject, getActiveQuestionBank, Question } from '@/app/data/questionBank'
import { motion, AnimatePresence } from 'motion/react'
import { Trophy, ChevronLeft, Gamepad2, RotateCw, BookOpen, Users, Star } from 'lucide-react'

interface KeoCoGameProps {
  onBackToDashboard?: () => void;
}

const SUBJECT_METADATA: Record<string, { name: string, emoji: string, color: string, bg: string, border: string }> = {
  math: { name: 'Toán học', emoji: '📘', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
  vietnamese: { name: 'Tiếng Việt', emoji: '📗', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
  english: { name: 'Tiếng Anh', emoji: '📕', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100' },
  history: { name: 'Lịch sử', emoji: '📒', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
  geography: { name: 'Địa lý', emoji: '📙', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100' },
  science: { name: 'Khoa học', emoji: '🔬', color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
}

export default function KeoCoGame({ onBackToDashboard }: KeoCoGameProps) {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null)
  const [teamAScore, setTeamAScore] = useState(0)
  const [teamBScore, setTeamBScore] = useState(0)
  const [currentTeam, setCurrentTeam] = useState<'A' | 'B'>('A')
  const [questionIndex, setQuestionIndex] = useState(0)
  const [message, setMessage] = useState('')
  const [gameOver, setGameOver] = useState(false)
  const [gameQuestions, setGameQuestions] = useState<Question[]>([])

  // Load questions when subject is selected
  useEffect(() => {
    if (selectedSubject) {
      if (selectedSubject === 'all') {
        const activeBank = getActiveQuestionBank()
        const all = Object.values(activeBank).flat().sort(() => Math.random() - 0.5)
        setGameQuestions(all)
      } else {
        const qList = getQuestionsBySubject(selectedSubject)
        // Shuffle questions
        const shuffled = [...qList].sort(() => Math.random() - 0.5)
        setGameQuestions(shuffled)
      }
      setTeamAScore(0)
      setTeamBScore(0)
      setCurrentTeam('A')
      setQuestionIndex(0)
      setMessage('')
      setGameOver(false)
    }
  }, [selectedSubject])

  const handleAnswer = (selected: string) => {
    if (gameOver || gameQuestions.length === 0) return

    const currentQ = gameQuestions[questionIndex]
    const isCorrect = selected === currentQ.correctAnswer

    if (isCorrect) {
      if (currentTeam === 'A') {
        setTeamAScore(prev => {
          const next = prev + 1
          if (next >= 10) setGameOver(true)
          return next
        })
        setMessage('✅ Đội A trả lời ĐÚNG và kéo mạnh sang trái!')
      } else {
        setTeamBScore(prev => {
          const next = prev + 1
          if (next >= 10) setGameOver(true)
          return next
        })
        setMessage('✅ Đội B trả lời ĐÚNG và kéo mạnh sang phải!')
      }
    } else {
      // Wrong answers benefit the opposing team
      if (currentTeam === 'A') {
        setTeamBScore(prev => {
          const next = prev + 1
          if (next >= 10) setGameOver(true)
          return next
        })
        setMessage('❌ Đội A trả lời sai! Đội B tận dụng thời cơ ghi điểm!')
      } else {
        setTeamAScore(prev => {
          const next = prev + 1
          if (next >= 10) setGameOver(true)
          return next
        })
        setMessage('❌ Đội B trả lời sai! Đội A tận dụng thời cơ ghi điểm!')
      }
    }

    // Move to next question or check winner
    if (teamAScore + 1 >= 10 || teamBScore + 1 >= 10) {
      setGameOver(true)
      return
    }

    setQuestionIndex(prev => (prev + 1) % gameQuestions.length)
    setCurrentTeam(prev => prev === 'A' ? 'B' : 'A')
  }

  const resetGame = () => {
    setTeamAScore(0)
    setTeamBScore(0)
    setCurrentTeam('A')
    setQuestionIndex(0)
    setMessage('')
    setGameOver(false)
    // Reshuffle questions
    if (selectedSubject) {
      if (selectedSubject === 'all') {
        const activeBank = getActiveQuestionBank()
        const all = Object.values(activeBank).flat().sort(() => Math.random() - 0.5)
        setGameQuestions(all)
      } else {
        const qList = getQuestionsBySubject(selectedSubject)
        const shuffled = [...qList].sort(() => Math.random() - 0.5)
        setGameQuestions(shuffled)
      }
    }
  }

  const changeSubject = () => {
    setSelectedSubject(null)
    setGameQuestions([])
  }

  // Calculate percentage of pulling (centered at 50%)
  const scoreDifference = teamBScore - teamAScore // ranges from -10 to +10
  const ropePosition = 50 + (scoreDifference * 5) // ranges from 0% to 100%

  // Determine game over winner based on scores
  const winner = teamAScore >= 10 ? 'A' : teamBScore >= 10 ? 'B' : null

  // If winner is decided, show Trophy banner
  useEffect(() => {
    if (gameOver && winner) {
      setMessage(`🏆 Chúc mừng ĐỘI ${winner} đã chiến thắng cuộc thi Kéo Co!`)
    }
  }, [gameOver, winner])

  const goBackToMain = () => {
    if (onBackToDashboard) {
      onBackToDashboard()
    } else {
      window.history.pushState(null, "", "/dashboard")
      window.dispatchEvent(new PopStateEvent("popstate"))
    }
  }

  const activeBank = getActiveQuestionBank()

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto min-h-[85vh] flex flex-col justify-center animate-fadeIn">
      {/* Subject Selection Screen */}
      <AnimatePresence mode="wait">
        {!selectedSubject ? (
          <motion.div
            key="selection-screen"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <button
                onClick={goBackToMain}
                className="flex items-center space-x-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors bg-white px-3.5 py-2 rounded-xl shadow-sm border border-slate-100 cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Quay lại trang chủ</span>
              </button>
              <span className="text-[10px] bg-indigo-50 text-indigo-700 font-black px-2.5 py-1 rounded-full uppercase tracking-wider font-mono">
                ⚔️ ĐỐ VUI ĐỒNG ĐỘI
              </span>
            </div>

            <div className="text-center space-y-2">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                ⚔️ Trò Chơi Kéo Co Kịch Tính
              </h1>
              <p className="text-sm text-slate-500 max-w-lg mx-auto">
                Chia lớp thành hai đội A và B. Trả lời đúng câu hỏi trắc nghiệm của môn học để kéo sợi dây chiến thắng về phía đội mình!
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-4">
              {Object.entries(SUBJECT_METADATA).map(([key, meta]) => {
                const count = activeBank[key]?.length || 0;
                return (
                  <motion.button
                    key={key}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedSubject(key)}
                    className={`p-5 rounded-2xl border ${meta.border} ${meta.bg} flex flex-col items-start text-left space-y-3 cursor-pointer shadow-sm hover:shadow transition-all`}
                  >
                    <span className="text-3xl">{meta.emoji}</span>
                    <div>
                      <h3 className="font-bold text-slate-800 text-lg leading-tight">{meta.name}</h3>
                      <p className="text-xs text-slate-400 mt-1 font-mono">{count} câu hỏi sẵn có</p>
                    </div>
                  </motion.button>
                )
              })}

              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedSubject('all')}
                className="p-5 rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-purple-50 flex flex-col items-start text-left space-y-3 cursor-pointer shadow-sm hover:shadow transition-all"
              >
                <span className="text-3xl">🧩</span>
                <div>
                  <h3 className="font-bold text-indigo-900 text-lg leading-tight">Tổng hợp ngẫu nhiên</h3>
                  <p className="text-xs text-indigo-500 mt-1 font-mono">
                    {Object.values(activeBank).flat().length} câu hỏi ngẫu nhiên
                  </p>
                </div>
              </motion.button>
            </div>
          </motion.div>
        ) : (
          /* Active Gameplay Screen */
          <motion.div
            key="game-screen"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="space-y-6 bg-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-100"
          >
            {/* Game Header / Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-50 pb-4">
              <div>
                <button
                  onClick={changeSubject}
                  className="flex items-center space-x-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Chọn môn khác</span>
                </button>
                <h2 className="text-lg font-black text-slate-900 mt-1 flex items-center gap-1.5">
                  Môn chơi: {selectedSubject === 'all' ? 'Tổng hợp ngẫu nhiên' : SUBJECT_METADATA[selectedSubject]?.name}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={resetGame}
                  className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg text-xs font-bold flex items-center gap-1 border border-slate-150 transition cursor-pointer"
                >
                  <RotateCw className="h-3.5 w-3.5" />
                  <span>Thiết lập lại</span>
                </button>
                <span className="text-[10px] bg-rose-50 text-rose-700 font-bold px-2.5 py-1 rounded-full font-mono uppercase">
                  ⚔️ Trận chiến Kéo Co
                </span>
              </div>
            </div>

            {/* Rope Pull Visual Component */}
            <div className="space-y-3">
              <div className="flex justify-between text-sm font-black font-sans uppercase">
                <div className="flex flex-col items-start">
                  <span className="text-blue-600 text-base">🔵 ĐỘI A</span>
                  <span className="text-2xl font-black font-mono text-blue-700 mt-0.5">{teamAScore} <span className="text-xs text-slate-400 font-sans font-normal">điểm</span></span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-rose-600 text-base">🔴 ĐỘI B</span>
                  <span className="text-2xl font-black font-mono text-rose-700 mt-0.5">{teamBScore} <span className="text-xs text-slate-400 font-sans font-normal">điểm</span></span>
                </div>
              </div>

              {/* Interactive Dynamic Rope Container */}
              <div className="relative bg-slate-100 h-10 rounded-2xl border border-slate-200/50 overflow-hidden flex items-center px-4 shadow-inner">
                {/* Center marker line */}
                <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-slate-300 z-10 border-dashed border-l border-slate-400"></div>
                <span className="absolute left-4 text-xs font-bold text-blue-500 font-mono">Đội A</span>
                <span className="absolute right-4 text-xs font-bold text-rose-500 font-mono">Đội B</span>

                {/* Rope Line */}
                <div className="absolute left-8 right-8 h-2.5 bg-amber-800/40 rounded-full flex items-center justify-between">
                  <div className="h-full bg-amber-900/60 w-full rounded-full relative">
                    {/* The Tug Marker flag */}
                    <motion.div
                      animate={{ left: `${ropePosition}%` }}
                      transition={{ type: 'spring', stiffness: 100, damping: 15 }}
                      className="absolute -top-3.5 -ml-4 w-8 h-10 flex flex-col items-center justify-center cursor-default z-20"
                    >
                      <div className="w-1.5 h-10 bg-yellow-500 rounded-full shadow border border-yellow-600 relative flex items-center justify-center">
                        <span className="absolute -top-4 text-sm animate-bounce">🚩</span>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
              <div className="text-[10px] text-slate-400 text-center font-semibold uppercase tracking-wider font-mono">
                Đội nào đạt 10 điểm trước sẽ giật sập dây và chiến thắng!
              </div>
            </div>

            {/* Turn Announcement & Action Info */}
            {!gameOver && (
              <div className="p-4 bg-slate-50 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 border border-slate-100">
                <div className="flex items-center space-x-3 text-sm">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-black text-sm ${
                    currentTeam === 'A' ? 'bg-blue-600 shadow shadow-blue-200' : 'bg-rose-600 shadow shadow-rose-200'
                  }`}>
                    {currentTeam}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">Lượt thi đấu của Đội {currentTeam}</p>
                    <p className="text-xs text-slate-500">Đồng đội cùng thảo luận nhanh để đưa ra đáp án đúng!</p>
                  </div>
                </div>

                <div className="text-xs font-bold font-mono text-slate-400 bg-white px-3 py-1.5 rounded-lg border border-slate-100">
                  Câu hỏi: {questionIndex + 1} / {gameQuestions.length}
                </div>
              </div>
            )}

            {/* Question Screen */}
            {!gameOver && gameQuestions.length > 0 ? (
              <div className="space-y-4">
                <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 text-center space-y-3">
                  <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded-full font-mono uppercase">
                    Thử Thách Trí Tuệ
                  </span>
                  <h3 className="text-xl font-black text-slate-900 leading-snug">
                    {gameQuestions[questionIndex]?.question}
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {gameQuestions[questionIndex]?.options.map((opt, idx) => (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.015 }}
                      whileTap={{ scale: 0.985 }}
                      onClick={() => handleAnswer(opt)}
                      className="p-4 bg-white border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/10 text-slate-800 hover:text-indigo-900 font-bold rounded-2xl text-left cursor-pointer transition-all shadow-sm flex items-center space-x-3 group animate-fadeIn"
                    >
                      <span className="w-6.5 h-6.5 rounded-lg bg-slate-100 group-hover:bg-indigo-100 text-slate-600 group-hover:text-indigo-700 font-black text-xs flex items-center justify-center font-mono transition-colors">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="text-sm">{opt}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Feedback message overlay / text */}
            {message && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`text-center font-bold p-4 rounded-2xl text-sm sm:text-base border ${
                  message.includes('🏆')
                    ? 'bg-yellow-50 border-yellow-200 text-yellow-800'
                    : message.includes('✅')
                    ? 'bg-emerald-50 border-emerald-100 text-emerald-800'
                    : 'bg-rose-50 border-rose-100 text-rose-800'
                }`}
              >
                <p className="flex items-center justify-center gap-2">
                  {message.includes('🏆') && <Trophy className="h-5 w-5 text-yellow-500 animate-bounce" />}
                  <span>{message}</span>
                </p>
              </motion.div>
            )}

            {/* Game Over Controls */}
            {gameOver && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="pt-4 flex flex-col sm:flex-row gap-3"
              >
                <button
                  onClick={resetGame}
                  className="flex-1 h-11 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer transition-all hover:shadow"
                >
                  <RotateCw className="h-4 w-4" />
                  <span>Chơi lại Trận đấu</span>
                </button>
                <button
                  onClick={changeSubject}
                  className="flex-1 h-11 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 border border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer transition-all hover:shadow"
                >
                  <BookOpen className="h-4 w-4" />
                  <span>Đổi chủ đề câu hỏi</span>
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
