'use client'
import React, { useState, useEffect } from 'react'
import { getActiveQuestionBank, Question } from '@/app/data/questionBank'
import { motion, AnimatePresence } from 'motion/react'
import { Plus, Trash2, Edit2, Check, X, AlertCircle, BookOpen, ChevronLeft, Save, Star } from 'lucide-react'
import { Button } from '@/src/components/ui/button'

const SUBJECT_LABELS: Record<string, { label: string, emoji: string, color: string, bg: string, border: string }> = {
  math: { label: 'Toán học', emoji: '📘', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
  vietnamese: { label: 'Tiếng Việt', emoji: '📗', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
  english: { label: 'Tiếng Anh', emoji: '📕', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100' },
  history: { label: 'Lịch sử', emoji: '📒', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
  geography: { label: 'Địa lý', emoji: '📙', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100' },
  science: { label: 'Khoa học', emoji: '🔬', color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
}

export default function ManageQuestions() {
  const [activeSubject, setActiveSubject] = useState('math')
  const [questionsMap, setQuestionsMap] = useState<Record<string, Question[]>>({})
  const [editingQuestionId, setEditingQuestionId] = useState<number | null>(null)
  
  // Form States
  const [questionText, setQuestionText] = useState('')
  const [options, setOptions] = useState(['', '', '', ''])
  const [correctAnswer, setCorrectAnswer] = useState('')
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy')
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  // Load questions on mount
  useEffect(() => {
    const bank = getActiveQuestionBank()
    setQuestionsMap(bank)
  }, [])

  // Calculate statistics dynamically
  const stats = Object.keys(SUBJECT_LABELS).reduce((acc, key) => {
    const list = questionsMap[key] || []
    const easy = list.filter(q => q.difficulty === 'easy').length
    const medium = list.filter(q => q.difficulty === 'medium').length
    const hard = list.filter(q => q.difficulty === 'hard').length
    acc[key] = { total: list.length, easy, medium, hard }
    return acc
  }, {} as Record<string, { total: number, easy: number, medium: number, hard: number }>)

  const grandTotal = Object.values(stats).reduce((sum, s) => sum + s.total, 0)
  const grandEasy = Object.values(stats).reduce((sum, s) => sum + s.easy, 0)
  const grandMedium = Object.values(stats).reduce((sum, s) => sum + s.medium, 0)
  const grandHard = Object.values(stats).reduce((sum, s) => sum + s.hard, 0)

  // Auto-fill form when editing
  const handleStartEdit = (q: Question) => {
    setEditingQuestionId(q.id)
    setQuestionText(q.question)
    setOptions([...q.options])
    setCorrectAnswer(q.correctAnswer)
    setDifficulty(q.difficulty)
    setErrorMessage('')
    setSuccessMessage('')
  }

  // Clear form
  const handleCancelEdit = () => {
    setEditingQuestionId(null)
    setQuestionText('')
    setOptions(['', '', '', ''])
    setCorrectAnswer('')
    setDifficulty('easy')
    setErrorMessage('')
  }

  // Save changes to localStorage and local state
  const saveToStorage = (updatedMap: Record<string, Question[]>) => {
    localStorage.setItem('custom_question_bank', JSON.stringify(updatedMap))
    setQuestionsMap(updatedMap)
    
    // Dispatch a storage/custom event so other parts of the SPA can sync if needed
    window.dispatchEvent(new Event('storage'))
  }

  // Handle Create / Update Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')

    // Validations
    if (!questionText.trim()) {
      setErrorMessage('⚠️ Nội dung câu hỏi không được trống!')
      return
    }
    if (options.some(opt => !opt.trim())) {
      setErrorMessage('⚠️ Vui lòng điền đầy đủ cả 4 phương án trả lời!')
      return
    }
    if (!correctAnswer.trim()) {
      setErrorMessage('⚠️ Vui lòng chọn hoặc điền đáp án đúng trùng khớp với một trong các lựa chọn!')
      return
    }

    // Ensure correctAnswer matches one of the options
    const matchFound = options.some(opt => opt.trim().toLowerCase() === correctAnswer.trim().toLowerCase())
    if (!matchFound) {
      setErrorMessage('⚠️ Đáp án đúng phải trùng với một trong bốn phương án lựa chọn ở trên!')
      return
    }

    // Match exact casing of the selected option for consistency
    const exactOption = options.find(opt => opt.trim().toLowerCase() === correctAnswer.trim().toLowerCase()) || correctAnswer

    const currentSubjectList = questionsMap[activeSubject] || []

    if (editingQuestionId !== null) {
      // Update
      const updatedList = currentSubjectList.map(q => {
        if (q.id === editingQuestionId) {
          return {
            ...q,
            question: questionText.trim(),
            options: options.map(o => o.trim()),
            correctAnswer: exactOption.trim(),
            difficulty,
          }
        }
        return q
      })

      const updatedMap = {
        ...questionsMap,
        [activeSubject]: updatedList
      }

      saveToStorage(updatedMap)
      setSuccessMessage('🎉 Đã cập nhật câu hỏi thành công!')
      handleCancelEdit()
    } else {
      // Create
      const newId = Date.now()
      const newQ: Question = {
        id: newId,
        question: questionText.trim(),
        options: options.map(o => o.trim()),
        correctAnswer: exactOption.trim(),
        subject: SUBJECT_LABELS[activeSubject]?.label || activeSubject,
        grade: '5', // default grade
        difficulty,
      }

      const updatedList = [...currentSubjectList, newQ]
      const updatedMap = {
        ...questionsMap,
        [activeSubject]: updatedList
      }

      saveToStorage(updatedMap)
      setSuccessMessage('🎉 Đã thêm câu hỏi mới thành công!')
      handleCancelEdit()
    }
  }

  // Delete Question
  const handleDelete = (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa câu hỏi này khỏi ngân hàng câu hỏi?')) return

    const currentSubjectList = questionsMap[activeSubject] || []
    const updatedList = currentSubjectList.filter(q => q.id !== id)

    const updatedMap = {
      ...questionsMap,
      [activeSubject]: updatedList
    }

    saveToStorage(updatedMap)
    setSuccessMessage('🗑️ Đã xóa câu hỏi thành công!')
  }

  const currentQuestions = questionsMap[activeSubject] || []

  const goBackToDashboard = () => {
    window.history.pushState(null, "", "/dashboard")
    window.dispatchEvent(new PopStateEvent("popstate"))
  }

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto space-y-6 animate-fadeIn">
      {/* Top Banner and Navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1.5">
          <button
            onClick={goBackToDashboard}
            className="flex items-center space-x-1 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors bg-white px-3 py-1.5 rounded-xl border border-slate-100 shadow-sm cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Quay lại trang chủ</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            📚 Quản lý ngân hàng câu hỏi
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Dành cho giáo viên: Toàn quyền thêm, sửa, xóa các câu hỏi học thuật phục vụ hoạt động lớp học.
          </p>
        </div>
      </div>

      {/* Thống kê nhanh số lượng và độ khó */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Tổng số */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Tổng số câu hỏi</p>
            <h3 className="text-2xl font-black text-slate-800 font-mono mt-0.5">{grandTotal}</h3>
          </div>
        </div>

        {/* Card 2: Dễ */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <Check className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Nhận biết (Dễ)</p>
            <div className="flex items-baseline space-x-2 mt-0.5">
              <span className="text-2xl font-black text-slate-800 font-mono">{grandEasy}</span>
              <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded-full font-mono">
                {grandTotal > 0 ? Math.round((grandEasy / grandTotal) * 100) : 0}%
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Vừa */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Star className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Thông hiểu (Vừa)</p>
            <div className="flex items-baseline space-x-2 mt-0.5">
              <span className="text-2xl font-black text-slate-800 font-mono">{grandMedium}</span>
              <span className="text-[10px] text-amber-600 font-bold bg-amber-50 px-1.5 py-0.5 rounded-full font-mono">
                {grandTotal > 0 ? Math.round((grandMedium / grandTotal) * 100) : 0}%
              </span>
            </div>
          </div>
        </div>

        {/* Card 4: Khó */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
            <AlertCircle className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Vận dụng (Khó)</p>
            <div className="flex items-baseline space-x-2 mt-0.5">
              <span className="text-2xl font-black text-slate-800 font-mono">{grandHard}</span>
              <span className="text-[10px] text-rose-600 font-bold bg-rose-50 px-1.5 py-0.5 rounded-full font-mono">
                {grandTotal > 0 ? Math.round((grandHard / grandTotal) * 100) : 0}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Chi tiết thống kê phân bổ theo môn và độ khó */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b border-slate-50 pb-3">
          <h2 className="text-xs font-bold text-slate-400 font-mono uppercase tracking-wider flex items-center gap-1.5">
            📊 Phân bổ câu hỏi theo từng môn & độ khó học thuật
          </h2>
          <span className="text-[10px] font-mono bg-blue-50 text-blue-700 font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
            SỐ LIỆU ĐỒNG BỘ LOCALSTORAGE
          </span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[10px] text-slate-400 uppercase bg-slate-50 font-mono">
              <tr>
                <th scope="col" className="px-4 py-3 rounded-l-xl">Chủ đề môn học</th>
                <th scope="col" className="px-4 py-3 text-center">Tổng câu hỏi</th>
                <th scope="col" className="px-4 py-3 text-center text-emerald-600 bg-emerald-50/20">Nhận biết (Dễ)</th>
                <th scope="col" className="px-4 py-3 text-center text-amber-600 bg-amber-50/20">Thông hiểu (Vừa)</th>
                <th scope="col" className="px-4 py-3 text-center text-rose-600 bg-rose-50/20">Vận dụng (Khó)</th>
                <th scope="col" className="px-4 py-3 text-right rounded-r-xl pr-6">Tỷ lệ trong kho</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {Object.entries(SUBJECT_LABELS).map(([key, meta]) => {
                const subjectStats = stats[key] || { total: 0, easy: 0, medium: 0, hard: 0 }
                const contribution = grandTotal > 0 ? Math.round((subjectStats.total / grandTotal) * 100) : 0
                return (
                  <tr key={key} className="hover:bg-slate-50/40 transition-colors">
                    <td className="px-4 py-3.5 font-bold text-slate-800 flex items-center gap-2">
                      <span className="text-base">{meta.emoji}</span>
                      <span>{meta.label}</span>
                    </td>
                    <td className="px-4 py-3.5 text-center font-black font-mono text-slate-700">
                      {subjectStats.total}
                    </td>
                    <td className="px-4 py-3.5 text-center font-mono font-bold text-emerald-600 bg-emerald-50/10">
                      {subjectStats.easy} <span className="text-[9px] text-slate-400 font-normal">({subjectStats.total > 0 ? Math.round((subjectStats.easy / subjectStats.total) * 100) : 0}%)</span>
                    </td>
                    <td className="px-4 py-3.5 text-center font-mono font-bold text-amber-600 bg-amber-50/10">
                      {subjectStats.medium} <span className="text-[9px] text-slate-400 font-normal">({subjectStats.total > 0 ? Math.round((subjectStats.medium / subjectStats.total) * 100) : 0}%)</span>
                    </td>
                    <td className="px-4 py-3.5 text-center font-mono font-bold text-rose-600 bg-rose-50/10">
                      {subjectStats.hard} <span className="text-[9px] text-slate-400 font-normal">({subjectStats.total > 0 ? Math.round((subjectStats.hard / subjectStats.total) * 100) : 0}%)</span>
                    </td>
                    <td className="px-4 py-3.5 text-right pr-6">
                      <div className="flex items-center justify-end space-x-2">
                        <span className="font-mono text-slate-600 font-bold">{contribution}%</span>
                        <div className="w-16 bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div className={`h-full ${meta.color.replace('text', 'bg')}`} style={{ width: `${contribution}%` }}></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Select Subject Tabs */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4.5 shadow-sm">
        <h2 className="text-xs font-bold text-slate-400 font-mono uppercase tracking-wider mb-3 flex items-center gap-1">
          <BookOpen className="h-3.5 w-3.5" /> Chủ đề môn học
        </h2>
        <div className="flex flex-wrap gap-2">
          {Object.entries(SUBJECT_LABELS).map(([key, meta]) => {
            const count = questionsMap[key]?.length || 0
            const isActive = activeSubject === key
            return (
              <button
                key={key}
                onClick={() => {
                  setActiveSubject(key)
                  handleCancelEdit()
                }}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-100'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-100'
                }`}
              >
                <span>{meta.emoji}</span>
                <span>{meta.label}</span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${isActive ? 'bg-blue-700 text-blue-100' : 'bg-slate-200 text-slate-500'}`}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Dual Panel Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Add / Edit Question (5 columns) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-50">
              <h3 className="font-bold text-slate-800 flex items-center gap-1.5 text-sm">
                {editingQuestionId !== null ? <Edit2 className="h-4 w-4 text-amber-500" /> : <Plus className="h-4 w-4 text-green-500" />}
                {editingQuestionId !== null ? 'Chỉnh sửa Câu hỏi' : 'Thêm Câu hỏi mới'}
              </h3>
              {editingQuestionId !== null && (
                <button
                  onClick={handleCancelEdit}
                  className="p-1 hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded transition cursor-pointer"
                  title="Hủy chỉnh sửa"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Question Text */}
              <div className="space-y-1">
                <label className="block font-bold text-slate-600">Câu hỏi ({SUBJECT_LABELS[activeSubject]?.label})</label>
                <textarea
                  rows={2}
                  placeholder="Ví dụ: 12 + 15 = ?"
                  className="w-full rounded-xl border border-slate-200 p-3 bg-slate-50/50 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all resize-none"
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  required
                />
              </div>

              {/* 4 Options Grid */}
              <div className="space-y-2">
                <label className="block font-bold text-slate-600">Các phương án lựa chọn</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {options.map((opt, idx) => (
                    <div key={idx} className="relative flex items-center">
                      <span className="absolute left-3 font-mono font-bold text-slate-400 select-none">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <input
                        type="text"
                        placeholder={`Phương án ${String.fromCharCode(65 + idx)}`}
                        className="w-full pl-8 pr-3 py-2 bg-slate-50/50 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all text-xs"
                        value={opt}
                        onChange={(e) => {
                          const newOpts = [...options]
                          newOpts[idx] = e.target.value
                          setOptions(newOpts)
                        }}
                        required
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Correct Answer & Difficulty Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block font-bold text-slate-600">Đáp án ĐÚNG</label>
                  <select
                    className="w-full h-9.5 rounded-xl border border-slate-200 bg-white px-2 text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={correctAnswer}
                    onChange={(e) => setCorrectAnswer(e.target.value)}
                    required
                  >
                    <option value="">-- Chọn phương án đúng --</option>
                    {options.map((opt, idx) => (
                      opt.trim() && (
                        <option key={idx} value={opt}>
                          {String.fromCharCode(65 + idx)}. {opt}
                        </option>
                      )
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-slate-600">Mức độ nhận thức</label>
                  <select
                    className="w-full h-9.5 rounded-xl border border-slate-200 bg-white px-2 text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as any)}
                  >
                    <option value="easy">Nhận biết (Dễ)</option>
                    <option value="medium">Thông hiểu (Vừa)</option>
                    <option value="hard">Vận dụng (Khó)</option>
                  </select>
                </div>
              </div>

              {/* Status messages */}
              {errorMessage && (
                <div className="p-3 rounded-xl bg-red-50 text-red-700 font-medium flex items-start gap-1.5 border border-red-100">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {successMessage && (
                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700 font-medium flex items-start gap-1.5 border border-emerald-100">
                  <Check className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* Actions */}
              <div className="pt-2 flex gap-2">
                {editingQuestionId !== null && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancelEdit}
                    className="flex-1 h-10 rounded-xl text-xs font-bold"
                  >
                    Hủy bỏ
                  </Button>
                )}
                <Button
                  type="submit"
                  className="flex-grow h-10 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Save className="h-4 w-4" />
                  <span>{editingQuestionId !== null ? 'Lưu cập nhật' : 'Thêm vào ngân hàng'}</span>
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Right List: Display Current Questions (7 columns) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4 min-h-[400px]">
            <div className="flex justify-between items-center pb-2 border-b border-slate-50">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                📝 Danh sách câu hỏi hiện có ({SUBJECT_LABELS[activeSubject]?.label})
              </h3>
              <span className="text-[10px] font-mono text-slate-400 font-bold bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100">
                TỔNG SỐ: {currentQuestions.length} CÂU
              </span>
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1 custom-scrollbar">
              {currentQuestions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center text-slate-400 space-y-2">
                  <BookOpen className="h-10 w-10 text-slate-300" />
                  <p className="text-xs font-semibold">Chưa có câu hỏi nào trong chủ đề này.</p>
                  <p className="text-[10px] text-slate-400">Hãy điền biểu mẫu bên cạnh để kiến tạo câu hỏi đầu tiên!</p>
                </div>
              ) : (
                currentQuestions.map((q, idx) => {
                  let diffColor = "bg-green-50 text-green-700 border-green-100"
                  let diffLabel = "Dễ"
                  if (q.difficulty === "medium") {
                    diffColor = "bg-amber-50 text-amber-700 border-amber-100"
                    diffLabel = "Vừa"
                  } else if (q.difficulty === "hard") {
                    diffColor = "bg-rose-50 text-rose-700 border-rose-100"
                    diffLabel = "Khó"
                  }

                  return (
                    <motion.div
                      key={q.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-2xl border border-slate-100 hover:border-slate-200 bg-slate-50/20 shadow-inner space-y-2.5 relative group"
                    >
                      {/* Delete & Edit Floating Overlay on hover */}
                      <div className="absolute right-3 top-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleStartEdit(q)}
                          className="p-1.5 bg-white text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg border border-slate-100 shadow-sm transition cursor-pointer"
                          title="Sửa câu hỏi"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(q.id)}
                          className="p-1.5 bg-white text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-slate-100 shadow-sm transition cursor-pointer"
                          title="Xóa câu hỏi"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {/* Header Question */}
                      <div className="flex items-start gap-2 pr-16 text-xs">
                        <span className="font-bold text-slate-400 font-mono mt-0.5 shrink-0">
                          {idx + 1}.
                        </span>
                        <p className="font-bold text-slate-800 leading-relaxed">
                          {q.question}
                        </p>
                      </div>

                      {/* Options List */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pl-5">
                        {q.options.map((opt, oIdx) => {
                          const isCorrect = opt === q.correctAnswer
                          return (
                            <div
                              key={oIdx}
                              className={`px-3 py-1.5 rounded-lg border text-[11px] flex items-center justify-between ${
                                isCorrect
                                  ? 'bg-emerald-50/50 border-emerald-200 text-emerald-800 font-bold'
                                  : 'bg-white border-slate-100 text-slate-500'
                              }`}
                            >
                              <span className="truncate">
                                {String.fromCharCode(65 + oIdx)}. {opt}
                              </span>
                              {isCorrect && <Check className="h-3 w-3 text-emerald-600 shrink-0 ml-1" />}
                            </div>
                          )
                        })}
                      </div>

                      {/* Footer difficulty badge */}
                      <div className="flex items-center gap-2 pl-5 pt-1">
                        <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold border ${diffColor}`}>
                          {diffLabel}
                        </span>
                        <span className="text-[9px] text-slate-400 font-mono">
                          ID: {q.id}
                        </span>
                      </div>
                    </motion.div>
                  )
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
