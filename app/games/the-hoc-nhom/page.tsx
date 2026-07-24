'use client'
import React, { useState, useEffect } from 'react'
import { getRandomQuestionsBySubject, subjectLabels, subjectList } from '@/app/data/questionBank'

// ============================
// COMPONENT FLASHCARD
// ============================
function Flashcard({ 
  question, 
  onFlip, 
  isFlipped,
  onNext,
  onPrev,
  currentIndex,
  totalCards
}: {
  question: any
  onFlip: () => void
  isFlipped: boolean
  onNext: () => void
  onPrev: () => void
  currentIndex: number
  totalCards: number
}) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Số thẻ */}
      <div className="text-center text-sm text-gray-500 mb-4">
        Thẻ {currentIndex + 1}/{totalCards}
      </div>

      {/* Flashcard */}
      <div 
        className="relative w-full aspect-[4/3] cursor-pointer perspective-1000"
        onClick={onFlip}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div 
          className={`relative w-full h-full transition-all duration-500 transform-style-3d ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* Mặt trước - câu hỏi */}
          <div className={`absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl shadow-2xl p-8 flex items-center justify-center backface-hidden ${
            isFlipped ? 'hidden' : 'flex'
          }`}>
            <div className="text-center text-white">
              <div className="text-sm text-blue-200 mb-4">📝 Câu hỏi</div>
              <div className="text-2xl font-bold mb-4">{question?.question || '...'}</div>
              <div className="text-sm text-blue-200">
                👆 Nhấn vào thẻ để lật
              </div>
            </div>
          </div>

          {/* Mặt sau - đáp án */}
          <div className={`absolute inset-0 bg-gradient-to-br from-green-500 to-green-700 rounded-2xl shadow-2xl p-8 flex items-center justify-center backface-hidden ${
            isFlipped ? 'flex' : 'hidden'
          }`}>
            <div className="text-center text-white rotate-y-180">
              <div className="text-sm text-green-200 mb-4">✅ Đáp án</div>
              <div className="text-2xl font-bold mb-4">{question?.correctAnswer || '...'}</div>
              <div className="text-sm text-green-200 flex gap-2 justify-center">
                <span className="bg-green-600 px-3 py-1 rounded-full text-xs">
                  {question?.difficulty === 'easy' ? '⭐ Dễ' : 
                   question?.difficulty === 'medium' ? '⭐⭐ TB' : '⭐⭐⭐ Khó'}
                </span>
                <span className="bg-green-600 px-3 py-1 rounded-full text-xs">
                  {question?.subject}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Control buttons */}
      <div className="flex justify-between items-center gap-4 mt-6">
        <button
          onClick={onPrev}
          disabled={currentIndex === 0}
          className="px-6 py-3 bg-gray-200 rounded-xl font-bold hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ◀ Trước
        </button>
        
        <div className="flex gap-3">
          <button
            onClick={onFlip}
            className="px-6 py-3 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 transition"
          >
            {isFlipped ? '🔍 Xem câu hỏi' : '💡 Xem đáp án'}
          </button>
        </div>
        
        <button
          onClick={onNext}
          disabled={currentIndex === totalCards - 1}
          className="px-6 py-3 bg-gray-200 rounded-xl font-bold hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Sau ▶
        </button>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / totalCards) * 100}%` }}
        />
      </div>
    </div>
  )
}

// ============================
// COMPONENT TẠO BỘ THẺ
// ============================
function CreateFlashcardSet({ 
  onSave 
}: { 
  onSave: (data: { title: string, subject: string, cards: any[] }) => void 
}) {
  const [title, setTitle] = useState('')
  const [subject, setSubject] = useState('math')
  const [cardCount, setCardCount] = useState(10)
  const [difficulty, setDifficulty] = useState('all')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      alert('Vui lòng nhập tên bộ thẻ!')
      return
    }
    
    // Lấy câu hỏi ngẫu nhiên theo môn
    const questions = getRandomQuestionsBySubject(subject, cardCount)
    
    // Lọc theo độ khó nếu cần
    let filteredQuestions = questions
    if (difficulty !== 'all') {
      filteredQuestions = questions.filter(q => q.difficulty === difficulty)
      if (filteredQuestions.length === 0) {
        alert('Không có đủ câu hỏi với độ khó này! Vui lòng chọn ít hơn.')
        return
      }
    }
    
    onSave({
      title,
      subject,
      cards: filteredQuestions
    })
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">📝 Tạo bộ thẻ mới</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tên bộ thẻ
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="VD: Từ vựng Tiếng Anh lớp 3"
            className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Môn học
          </label>
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {subjectList.map(s => (
              <option key={s} value={s}>{subjectLabels[s]}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Số lượng câu hỏi
          </label>
          <select
            value={cardCount}
            onChange={(e) => setCardCount(Number(e.target.value))}
            className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {[5, 10, 15, 20, 30, 50].map(num => (
              <option key={num} value={num}>{num} thẻ</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Độ khó
          </label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tất cả</option>
            <option value="easy">⭐ Dễ</option>
            <option value="medium">⭐⭐ Trung bình</option>
            <option value="hard">⭐⭐⭐ Khó</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-bold hover:from-blue-600 hover:to-purple-700 transition shadow-lg"
        >
          🚀 Tạo bộ thẻ
        </button>
      </form>
    </div>
  )
}

// ============================
// MAIN GAME PAGE
// ============================
export default function TheHocNhom() {
  const [flashcardSets, setFlashcardSets] = useState<{
    id: string
    title: string
    subject: string
    cards: any[]
    createdAt: string
  }[]>([])
  
  const [selectedSet, setSelectedSet] = useState<any>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [showCreate, setShowCreate] = useState(false)

  // Load saved sets từ localStorage
  useEffect(() => {
    const saved = localStorage.getItem('flashcardSets')
    if (saved) {
      try {
        setFlashcardSets(JSON.parse(saved))
      } catch (e) {
        console.error('Lỗi load dữ liệu:', e)
      }
    }
  }, [])

  // Save sets vào localStorage
  const saveSets = (newSets: any[]) => {
    localStorage.setItem('flashcardSets', JSON.stringify(newSets))
    setFlashcardSets(newSets)
  }

  // ===== TẠO BỘ THẺ MỚI =====
  const handleCreateSet = (data: { title: string, subject: string, cards: any[] }) => {
    const newSet = {
      id: Date.now().toString(),
      title: data.title,
      subject: data.subject,
      cards: data.cards,
      createdAt: new Date().toLocaleDateString('vi-VN')
    }
    
    const updated = [...flashcardSets, newSet]
    saveSets(updated)
    setShowCreate(false)
    
    // Tự động mở bộ thẻ vừa tạo
    setSelectedSet(newSet)
    setCurrentIndex(0)
    setIsFlipped(false)
  }

  // ===== XÓA BỘ THẺ =====
  const deleteSet = (id: string) => {
    if (confirm('Bạn có chắc muốn xóa bộ thẻ này?')) {
      const updated = flashcardSets.filter(set => set.id !== id)
      saveSets(updated)
      if (selectedSet?.id === id) {
        setSelectedSet(null)
      }
    }
  }

  // ===== FLIP CARD =====
  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  // ===== NEXT/PREV CARD =====
  const handleNext = () => {
    if (currentIndex < selectedSet.cards.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setIsFlipped(false)
    }
  }

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setIsFlipped(false)
    }
  }

  // ===== MÀN HÌNH CHÍNH =====
  if (!selectedSet) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-center text-blue-800 mb-4">
            📚 THẺ HỌC NHÓM
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Tạo và học với các bộ thẻ ghi nhớ
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {/* List bộ thẻ */}
            <div className="md:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800">📚 Bộ thẻ của bạn</h2>
                  <button
                    onClick={() => setShowCreate(!showCreate)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium"
                  >
                    {showCreate ? '✖ Đóng' : '➕ Tạo mới'}
                  </button>
                </div>

                {showCreate && (
                  <div className="mb-6">
                    <CreateFlashcardSet onSave={handleCreateSet} />
                  </div>
                )}

                {flashcardSets.length === 0 ? (
                  <div className="text-center text-gray-500 py-12">
                    <div className="text-6xl mb-4">📚</div>
                    <p>Chưa có bộ thẻ nào</p>
                    <p className="text-sm">Nhấn "Tạo mới" để bắt đầu</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {flashcardSets.map(set => (
                      <div
                        key={set.id}
                        className="flex justify-between items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition cursor-pointer"
                        onClick={() => {
                          setSelectedSet(set)
                          setCurrentIndex(0)
                          setIsFlipped(false)
                        }}
                      >
                        <div>
                          <div className="font-semibold text-gray-800">{set.title}</div>
                          <div className="text-sm text-gray-500">
                            {subjectLabels[set.subject] || set.subject} • {set.cards.length} thẻ • {set.createdAt}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteSet(set.id)
                            }}
                            className="text-red-500 hover:text-red-700 font-medium text-sm px-3 py-1"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quick stats */}
            <div>
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="font-bold text-gray-800 mb-4">📊 Thống kê</h3>
                <div className="space-y-3">
                  <div className="flex justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="text-gray-600">📚 Tổng bộ thẻ</span>
                    <span className="font-bold text-blue-600">{flashcardSets.length}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-green-50 rounded-lg">
                    <span className="text-gray-600">📝 Tổng thẻ</span>
                    <span className="font-bold text-green-600">
                      {flashcardSets.reduce((sum, set) => sum + set.cards.length, 0)}
                    </span>
                  </div>
                  <div className="flex justify-between p-3 bg-purple-50 rounded-lg">
                    <span className="text-gray-600">📖 Môn học</span>
                    <span className="font-bold text-purple-600">
                      {new Set(flashcardSets.map(s => s.subject)).size}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ===== MÀN HÌNH HỌC =====
  const currentCard = selectedSet.cards[currentIndex]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-4 mb-6">
          <div className="flex justify-between items-center flex-wrap gap-3">
            <div>
              <h2 className="text-xl font-bold text-gray-800">{selectedSet.title}</h2>
              <div className="text-sm text-gray-500">
                {subjectLabels[selectedSet.subject] || selectedSet.subject} • {selectedSet.cards.length} thẻ
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setSelectedSet(null)
                  setCurrentIndex(0)
                  setIsFlipped(false)
                }}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition font-medium"
              >
                ← Danh sách
              </button>
              <button
                onClick={() => {
                  // Shuffle cards
                  const shuffled = [...selectedSet.cards].sort(() => Math.random() - 0.5)
                  setSelectedSet({ ...selectedSet, cards: shuffled })
                  setCurrentIndex(0)
                  setIsFlipped(false)
                }}
                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition font-medium"
              >
                🔀 Xáo trộn
              </button>
            </div>
          </div>
        </div>

        {/* Flashcard */}
        {currentCard && (
          <Flashcard
            question={currentCard}
            isFlipped={isFlipped}
            onFlip={handleFlip}
            onNext={handleNext}
            onPrev={handlePrev}
            currentIndex={currentIndex}
            totalCards={selectedSet.cards.length}
          />
        )}

        {/* Navigation hints */}
        <div className="text-center text-sm text-gray-500 mt-4">
          <kbd className="px-2 py-1 bg-gray-200 rounded">←</kbd> / <kbd className="px-2 py-1 bg-gray-200 rounded">→</kbd> Chuyển thẻ • 
          <kbd className="px-2 py-1 bg-gray-200 rounded mx-1">Space</kbd> Lật thẻ
        </div>
      </div>
    </div>
  )
}
