'use client'
import { useState, useEffect, useRef } from 'react'
import { getRandomQuestionsBySubject, subjectLabels, subjectList } from '@/app/data/questionBank'

// ============================
// COMPONENT BỘ ĐẾM NGƯỢC
// ============================
function CountdownTimer({ 
  timeLeft, 
  totalTime, 
  isActive 
}: { 
  timeLeft: number, 
  totalTime: number, 
  isActive: boolean 
}) {
  const percentage = (timeLeft / totalTime) * 100
  
  const getColor = () => {
    if (percentage > 60) return 'bg-green-500'
    if (percentage > 30) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <div className="relative w-16 h-16">
      <svg className="w-16 h-16 transform -rotate-90">
        <circle
          className="text-gray-200"
          strokeWidth="6"
          stroke="currentColor"
          fill="transparent"
          r="28"
          cx="32"
          cy="32"
        />
        <circle
          className={`${getColor()} transition-all duration-300`}
          strokeWidth="6"
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r="28"
          cx="32"
          cy="32"
          style={{
            strokeDasharray: 175.93,
            strokeDashoffset: 175.93 * (1 - percentage / 100),
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-xl font-bold">
        {timeLeft}
      </div>
    </div>
  )
}

// ============================
// MAIN GAME PAGE
// ============================
export default function TracNghiemNhipDo() {
  // State
  const [selectedSubject, setSelectedSubject] = useState('math')
  const [questions, setQuestions] = useState<any[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [totalQuestions, setTotalQuestions] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [timeLeft, setTimeLeft] = useState(10)
  const [totalTime] = useState(10)
  const [isActive, setIsActive] = useState(false)
  const [showAnswer, setShowAnswer] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [message, setMessage] = useState('')
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  
  // Stats
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [wrongAnswers, setWrongAnswers] = useState(0)
  
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // ===== BẮT ĐẦU GAME =====
  const startGame = () => {
    const qs = getRandomQuestionsBySubject(selectedSubject, 15)
    if (qs.length === 0) {
      setMessage('❌ Không có câu hỏi cho môn học này!')
      return
    }
    setQuestions(qs)
    setTotalQuestions(qs.length)
    setCurrentIndex(0)
    setScore(0)
    setCorrectAnswers(0)
    setWrongAnswers(0)
    setGameOver(false)
    setGameStarted(true)
    setTimeLeft(totalTime)
    setShowAnswer(false)
    setSelectedAnswer('')
    setIsCorrect(null)
    setMessage('')
    startTimer()
  }

  // ===== TIMER =====
  const startTimer = () => {
    setIsActive(true)
    setTimeLeft(totalTime)
    
    if (timerRef.current) clearInterval(timerRef.current)
    
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Hết giờ => sang câu tiếp theo
          clearInterval(timerRef.current!)
          setIsActive(false)
          handleTimeout()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleTimeout = () => {
    setShowAnswer(true)
    setIsCorrect(false)
    setWrongAnswers(prev => prev + 1)
    setMessage('⏰ Hết giờ!')
    
    setTimeout(() => {
      nextQuestion()
    }, 1500)
  }

  // ===== XỬ LÝ CHỌN ĐÁP ÁN =====
  const handleAnswer = (selected: string) => {
    if (showAnswer || !isActive) return

    const currentQ = questions[currentIndex]
    if (!currentQ) return

    const correct = selected === currentQ.correctAnswer
    setIsCorrect(correct)
    setSelectedAnswer(selected)
    setShowAnswer(true)
    setIsActive(false)
    
    if (timerRef.current) clearInterval(timerRef.current)

    if (correct) {
      setScore(prev => prev + 1)
      setCorrectAnswers(prev => prev + 1)
      // Bonus điểm cho thời gian còn lại
      const bonus = Math.floor(timeLeft / 2)
      if (bonus > 0) setScore(prev => prev + bonus)
      setMessage(`✅ Đúng! +${1 + Math.floor(timeLeft / 2)} điểm`)
    } else {
      setWrongAnswers(prev => prev + 1)
      setMessage(`❌ Sai! Đáp án đúng: ${currentQ.correctAnswer}`)
    }

    setTimeout(() => {
      nextQuestion()
    }, 1500)
  }

  // ===== CÂU TIẾP THEO =====
  const nextQuestion = () => {
    const nextIndex = currentIndex + 1
    
    if (nextIndex >= questions.length) {
      // Hết câu hỏi
      setGameOver(true)
      setGameStarted(false)
      setIsActive(false)
      if (timerRef.current) clearInterval(timerRef.current)
      return
    }

    setCurrentIndex(nextIndex)
    setShowAnswer(false)
    setSelectedAnswer('')
    setIsCorrect(null)
    setMessage('')
    setTimeLeft(totalTime)
    setIsActive(true)
    startTimer()
  }

  // ===== RESET GAME =====
  const resetGame = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    setGameStarted(false)
    setGameOver(false)
    setQuestions([])
    setCurrentIndex(0)
    setScore(0)
    setTotalQuestions(0)
    setCorrectAnswers(0)
    setWrongAnswers(0)
    setTimeLeft(totalTime)
    setIsActive(false)
    setShowAnswer(false)
    setSelectedAnswer('')
    setIsCorrect(null)
    setMessage('')
  }

  // ===== CLEANUP TIMER =====
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  // ===== MÀN HÌNH CHỌN MÔN =====
  if (!gameStarted && !gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-center text-purple-800 mb-8 font-sans">
            📝 TRẮC NGHIỆM THEO NHỊP ĐỘ
          </h1>
          
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <p className="text-gray-600 text-lg">🎯 Mỗi câu hỏi có <span className="font-bold text-purple-600">{totalTime} giây</span> để trả lời</p>
              <p className="text-gray-500 text-sm">Trả lời càng nhanh càng được nhiều điểm</p>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-700 mb-4">📚 Chọn môn học</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {subjectList.map(subject => (
                  <button
                    key={subject}
                    onClick={() => setSelectedSubject(subject)}
                    className={`p-3 rounded-xl border-2 transition-all cursor-pointer ${
                      selectedSubject === subject
                        ? 'border-purple-600 bg-purple-50 shadow-md'
                        : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-semibold text-sm">{subjectLabels[subject]}</div>
                  </button>
                ))}
              </div>
            </div>

            {message && (
              <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-xl text-center">
                {message}
              </div>
            )}

            <button
              onClick={startGame}
              className="w-full py-4 bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-xl font-bold text-lg hover:from-purple-600 hover:to-purple-800 transition shadow-lg cursor-pointer"
            >
              🚀 Bắt đầu thi
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ===== KẾT QUẢ GAME OVER =====
  if (gameOver) {
    const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
            <div className="text-6xl mb-4">🏆</div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">KẾT THÚC!</h1>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-blue-50 p-4 rounded-xl">
                <div className="text-2xl font-bold text-blue-600">{score}</div>
                <div className="text-sm text-gray-600">Tổng điểm</div>
              </div>
              <div className="bg-green-50 p-4 rounded-xl">
                <div className="text-2xl font-bold text-green-600">{correctAnswers}</div>
                <div className="text-sm text-gray-600">Đúng</div>
              </div>
              <div className="bg-red-50 p-4 rounded-xl">
                <div className="text-2xl font-bold text-red-600">{wrongAnswers}</div>
                <div className="text-sm text-gray-600">Sai</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-xl">
                <div className="text-2xl font-bold text-purple-600">{accuracy}%</div>
                <div className="text-sm text-gray-600">Tỷ lệ đúng</div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={resetGame}
                className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition cursor-pointer"
              >
                🔄 Làm lại
              </button>
              <button
                onClick={() => {
                  resetGame()
                  setGameStarted(false)
                }}
                className="flex-1 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition cursor-pointer"
              >
                📚 Chọn môn khác
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ===== MÀN HÌNH CHƠI GAME =====
  const currentQ = questions[currentIndex]
  if (!currentQ) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-4 mb-4">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm text-gray-500">Câu hỏi {currentIndex + 1}/{totalQuestions}</div>
              <div className="text-sm font-medium text-purple-600">{subjectLabels[selectedSubject]}</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm font-bold text-gray-700">⭐ {score} điểm</div>
              <CountdownTimer 
                timeLeft={timeLeft} 
                totalTime={totalTime} 
                isActive={isActive} 
              />
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
            <div 
              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
            />
          </div>
        </div>

        {/* Câu hỏi */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-4">
          <div className="text-center mb-6">
            <div className={`text-xl md:text-2xl font-bold text-gray-800 transition-opacity ${
              showAnswer ? 'opacity-60' : 'opacity-100'
            }`}>
              {currentQ.question}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {currentQ.options.map((opt: string, idx: number) => {
              const isSelected = selectedAnswer === opt
              const isCorrectAnswer = opt === currentQ.correctAnswer
              
              let className = "p-4 rounded-xl border-2 font-medium transition-all text-center"
              
              if (!showAnswer) {
                className += " border-gray-200 hover:border-purple-400 hover:bg-purple-50 cursor-pointer"
              } else {
                if (isCorrectAnswer) {
                  className += " border-green-500 bg-green-100 text-green-800"
                } else if (isSelected && !isCorrectAnswer) {
                  className += " border-red-500 bg-red-100 text-red-800"
                } else {
                  className += " border-gray-200 bg-gray-50 text-gray-400"
                }
              }
              
              return (
                <button
                  key={idx}
                  onClick={() => handleAnswer(opt)}
                  disabled={showAnswer}
                  className={className}
                >
                  {opt}
                </button>
              )
            })}
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`text-center p-4 rounded-xl font-bold ${
            message.includes('✅') ? 'bg-green-100 text-green-800' :
            message.includes('❌') ? 'bg-red-100 text-red-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {message}
          </div>
        )}
      </div>
    </div>
  )
}
