'use client'
import { useState, useRef, ChangeEvent, useEffect } from 'react'
import * as XLSX from 'xlsx'
import { getRandomQuestionsBySubject, subjectLabels, subjectList } from '@/app/data/questionBank'

// ============================
// COMPONENT VÒNG QUAY
// ============================
function WheelOfFortune({ 
  items, 
  onSpinComplete 
}: { 
  items: string[], 
  onSpinComplete: (selected: string) => void 
}) {
  const [rotation, setRotation] = useState(0)
  const [isSpinning, setIsSpinning] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)

  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
    '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F',
    '#BB8FCE', '#85C1E9', '#F8C471', '#82E0AA',
    '#F1948A', '#82E0AA', '#85C1E9', '#F8C471',
    '#D7BDE2', '#A3E4D7', '#FAD7A0', '#AED6F1'
  ]

  const spin = () => {
    if (isSpinning || items.length === 0) return

    setIsSpinning(true)
    setSelectedIndex(-1)

    const segmentAngle = 360 / items.length
    const randomIndex = Math.floor(Math.random() * items.length)
    const targetAngle = 360 * 5 + (360 - randomIndex * segmentAngle - segmentAngle / 2)
    const newRotation = rotation + targetAngle

    setRotation(newRotation)

    setTimeout(() => {
      setIsSpinning(false)
      setSelectedIndex(randomIndex)
      onSpinComplete(items[randomIndex])
    }, 5000)
  }

  if (items.length === 0) {
    return (
      <div className="text-center text-gray-500 py-12">
        <p className="text-6xl mb-4">🎡</p>
        <p>Chưa có học sinh. Hãy import danh sách!</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-80 h-80">
        {/* Kim chỉ */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 z-10">
          <div className="w-0 h-0 border-l-[15px] border-r-[15px] border-t-[30px] border-t-red-600 border-l-transparent border-r-transparent"></div>
        </div>

        {/* Vòng quay */}
        <div
          className="w-full h-full rounded-full shadow-2xl transition-all duration-[5000ms] ease-out"
          style={{
            transform: `rotate(${rotation}deg)`,
            background: `conic-gradient(${items.map((_, i) =>
              `${colors[i % colors.length]} ${(i * 360 / items.length)}deg ${((i + 1) * 360 / items.length)}deg`
            ).join(', ')})`
          }}
        >
          {/* Tên trên vòng quay */}
          {items.map((item, index) => {
            const angle = (index * 360 / items.length) + (360 / items.length / 2)
            const radius = 100
            const x = 50 + radius * Math.cos((angle - 90) * Math.PI / 180)
            const y = 50 + radius * Math.sin((angle - 90) * Math.PI / 180)
            return (
              <div
                key={index}
                className="absolute text-white text-xs font-bold truncate w-16 text-center"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: 'translate(-50%, -50%)',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                  maxWidth: '60px'
                }}
              >
                {item}
              </div>
            )
          })}
        </div>

        {/* Tâm vòng quay */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg border-4 border-gray-300 z-10 flex items-center justify-center">
          <span className="text-2xl">🎯</span>
        </div>
      </div>

      <button
        onClick={spin}
        disabled={isSpinning}
        className="mt-6 px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-full font-bold hover:from-blue-600 hover:to-blue-800 transition disabled:from-gray-400 disabled:to-gray-500 shadow-lg"
      >
        {isSpinning ? '🔄 Đang quay...' : '🎯 QUAY THÔI!'}
      </button>

      {selectedIndex >= 0 && !isSpinning && (
        <div className="mt-4 text-center bg-green-100 text-green-800 px-6 py-2 rounded-full font-bold">
          🎉 {items[selectedIndex]}
        </div>
      )}
    </div>
  )
}

// ============================
// MAIN GAME PAGE
// ============================
export default function VongQuayGame() {
  // State
  const [selectedSubject, setSelectedSubject] = useState('math')
  const [students, setStudents] = useState<string[]>([])
  const [fileName, setFileName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState('')
  const [question, setQuestion] = useState<any>(null)
  const [showQuestion, setShowQuestion] = useState(false)
  const [score, setScore] = useState(0)
  const [message, setMessage] = useState('')
  const [gameStarted, setGameStarted] = useState(false)
  const [showImport, setShowImport] = useState(true)

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Danh sách mẫu khi chưa import
  const defaultStudents = [
    'Nguyễn Văn An', 'Trần Thị Bình', 'Lê Văn Cường',
    'Phạm Thị Dung', 'Hoàng Văn Em', 'Ngô Thị Hà'
  ]

  // ===== HANDLE IMPORT EXCEL =====
  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsLoading(true)
    setFileName(file.name)
    setMessage('⏳ Đang đọc file...')

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const data = event.target?.result
        const workbook = XLSX.read(data, { type: 'array' })
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
        const jsonData = XLSX.utils.sheet_to_json(firstSheet)

        const studentNames: string[] = []
        jsonData.forEach((row: any) => {
          const name = row['Họ và tên'] || row['Họ tên'] || row['Tên'] || row['Name'] || row['name']
          if (name && typeof name === 'string') {
            studentNames.push(name.trim())
          } else {
            const firstValue = Object.values(row)[0]
            if (firstValue && typeof firstValue === 'string') {
              studentNames.push(firstValue.trim())
            }
          }
        })

        if (studentNames.length === 0) {
          setMessage('❌ Không tìm thấy tên học sinh!')
          setIsLoading(false)
          return
        }

        const finalList = studentNames.slice(0, 100)
        setStudents(finalList)
        setMessage(`✅ Import thành công ${finalList.length} học sinh!`)
        setIsLoading(false)
        setShowImport(false)

        // Reset game state
        setSelectedStudent('')
        setQuestion(null)
        setShowQuestion(false)
        setScore(0)

      } catch (error) {
        setMessage('❌ Lỗi đọc file!')
        setIsLoading(false)
      }
    }

    reader.readAsArrayBuffer(file)
  }

  // ===== XỬ LÝ KHI QUAY XONG =====
  const handleSpinComplete = (student: string) => {
    setSelectedStudent(student)
    
    // Lấy câu hỏi ngẫu nhiên
    const questions = getRandomQuestionsBySubject(selectedSubject, 1)
    if (questions.length > 0) {
      setQuestion(questions[0])
      setShowQuestion(true)
      setMessage(`🎯 ${student} ơi, trả lời câu hỏi nào!`)
    } else {
      setMessage(`❌ Không có câu hỏi cho môn này!`)
    }
  }

  // ===== XỬ LÝ TRẢ LỜI =====
  const handleAnswer = (selectedOption: string) => {
    if (!question) return

    const isCorrect = selectedOption === question.correctAnswer
    
    if (isCorrect) {
      setScore(prev => prev + 1)
      setMessage(`✅ Đúng rồi! ${selectedStudent} được +1 điểm! (Tổng: ${score + 1})`)
    } else {
      setMessage(`❌ Sai rồi! Đáp án đúng là: ${question.correctAnswer}`)
    }

    setTimeout(() => {
      setShowQuestion(false)
      setQuestion(null)
    }, 2500)
  }

  // ===== RESET GAME =====
  const resetGame = () => {
    setGameStarted(false)
    setSelectedStudent('')
    setQuestion(null)
    setShowQuestion(false)
    setScore(0)
    setMessage('')
  }

  // ===== DÙNG DANH SÁCH MẪU =====
  const useDefaultList = () => {
    setStudents(defaultStudents)
    setFileName('')
    setMessage(`✅ Đã dùng danh sách mẫu (${defaultStudents.length} học sinh)`)
    setShowImport(false)
  }

  // ===== XÓA DANH SÁCH =====
  const clearList = () => {
    setStudents([])
    setFileName('')
    setMessage('🗑️ Đã xóa danh sách')
    setShowImport(true)
  }

  // ===== MÀN HÌNH CHỌN MÔN + IMPORT =====
  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center text-blue-800 mb-8 font-sans">
            🎡 VÒNG QUAY MAY MẮN
          </h1>

          <div className="bg-white rounded-2xl shadow-2xl p-8">
            {/* Chọn môn học */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-700 mb-4">📚 Chọn môn học</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {subjectList.map(subject => (
                  <button
                    key={subject}
                    onClick={() => setSelectedSubject(subject)}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      selectedSubject === subject
                        ? 'border-blue-600 bg-blue-50 shadow-md'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-semibold text-sm">{subjectLabels[subject]}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Import Excel */}
            {showImport && (
              <div className="mb-6 p-6 bg-blue-50 rounded-xl border-2 border-dashed border-blue-300">
                <h3 className="font-bold text-blue-700 mb-3">📤 Import danh sách học sinh</h3>
                <p className="text-sm text-gray-600 mb-4">
                  File Excel cần có cột <span className="font-bold">"Họ và tên"</span> hoặc <span className="font-bold">"Tên"</span>
                  <br />⚠️ Tối đa 100 học sinh
                </p>

                <div className="flex flex-wrap gap-3 items-center">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                    disabled={isLoading}
                  >
                    📂 Chọn file Excel
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileUpload}
                    className="hidden"
                  />

                  <button
                    onClick={useDefaultList}
                    className="px-5 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-medium"
                  >
                    👥 Dùng mẫu
                  </button>
                </div>

                {fileName && (
                  <p className="text-sm text-green-600 mt-3">✅ File: {fileName}</p>
                )}
                {isLoading && <p className="text-sm text-blue-600 mt-3">⏳ Đang đọc...</p>}
              </div>
            )}

            {/* Hiển thị danh sách hiện tại */}
            {students.length > 0 && (
              <div className="mb-6 p-4 bg-yellow-50 rounded-xl">
                <div className="flex justify-between items-center mb-3">
                  <p className="font-medium">
                    👨👩👧👦 Danh sách học sinh: <span className="text-blue-600 font-bold">{students.length}</span> em
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowImport(true)}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      📤 Thay đổi
                    </button>
                    <button
                      onClick={clearList}
                      className="text-sm text-red-600 hover:text-red-800 font-medium"
                    >
                      🗑️ Xóa
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                  {students.slice(0, 50).map((s, i) => (
                    <span key={i} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      {s}
                    </span>
                  ))}
                  {students.length > 50 && (
                    <span className="px-3 py-1 bg-gray-200 text-gray-600 text-sm rounded-full">
                      +{students.length - 50} em khác
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Message */}
            {message && (
              <div className={`mb-4 p-3 rounded-xl text-center ${
                message.includes('✅') ? 'bg-green-100 text-green-800' :
                message.includes('❌') ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {message}
              </div>
            )}

            {/* Nút bắt đầu */}
            <button
              onClick={() => {
                if (students.length === 0) {
                  setMessage('❌ Chưa có học sinh! Hãy import hoặc dùng danh sách mẫu.')
                  return
                }
                setGameStarted(true)
              }}
              className="w-full py-4 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-xl font-bold text-lg hover:from-green-600 hover:to-green-800 transition shadow-lg cursor-pointer"
            >
              🚀 Bắt đầu quay ({students.length} học sinh)
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ===== MÀN HÌNH CHƠI GAME =====
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-800">🎡 Vòng Quay May Mắn</h1>
          <button
            onClick={resetGame}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition font-medium cursor-pointer"
          >
            🔄 Quay lại
          </button>
        </div>

        {/* Info bar */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6 flex flex-wrap justify-between items-center gap-3">
          <div className="flex items-center gap-4">
            <span className="font-bold text-gray-700">📚 {subjectLabels[selectedSubject]}</span>
            <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
              👨👩👧👦 {students.length} học sinh
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-bold text-green-600 text-lg">⭐ Điểm: {score}</span>
          </div>
        </div>

        {/* Main content */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Vòng quay */}
          <div className="bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center">
            <WheelOfFortune
              items={students}
              onSpinComplete={handleSpinComplete}
            />
            
            {message && !showQuestion && (
              <div className={`mt-4 p-3 rounded-xl text-center w-full ${
                message.includes('✅') ? 'bg-green-100 text-green-800' :
                message.includes('❌') ? 'bg-red-100 text-red-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {message}
              </div>
            )}
          </div>

          {/* Câu hỏi */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            {showQuestion && question ? (
              <div>
                <div className="text-center mb-4">
                  <div className="text-sm text-blue-600 font-semibold">
                    👤 {selectedStudent} ơi, trả lời nào!
                  </div>
                  <div className="w-16 h-1 bg-blue-500 mx-auto mt-2 rounded-full"></div>
                </div>

                <div className="text-lg font-bold text-center mb-6 p-4 bg-gray-50 rounded-xl">
                  {question.question}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {question.options.map((opt: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(opt)}
                      className="p-4 bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 rounded-xl transition font-medium hover:scale-105 cursor-pointer"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-16">
                <div className="text-7xl mb-6">🎡</div>
                <p className="text-lg font-medium">Nhấn <span className="text-blue-600 font-bold">"QUAY THÔI!"</span> để bắt đầu</p>
                <p className="text-sm mt-2 text-gray-400">Vòng quay sẽ chọn ngẫu nhiên 1 học sinh</p>
                <p className="text-sm mt-1 text-gray-400">Sau đó trả lời câu hỏi để ghi điểm</p>
                <div className="mt-4 text-xs text-gray-400">
                  👨👩👧👦 {students.length} học sinh đang chờ
                </div>
              </div>
            )}

            {/* Hiển thị message khi có lỗi */}
            {message && !showQuestion && !message.includes('🎯') && (
              <div className={`mt-4 p-3 rounded-xl text-center ${
                message.includes('✅') ? 'bg-green-100 text-green-800' :
                message.includes('❌') ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
