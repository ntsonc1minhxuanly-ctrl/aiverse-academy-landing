'use client'
import React, { useState, useEffect, useRef } from 'react'

// ============================
// MAIN GAME PAGE
// ============================
export default function RongNguGame() {
  // State
  const [isSleeping, setIsSleeping] = useState(true)
  const [noiseLevel, setNoiseLevel] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [gameStarted, setGameStarted] = useState(false)
  const [soundCount, setSoundCount] = useState(0)
  const [isCalming, setIsCalming] = useState(false)
  const [isSimulationMode, setIsSimulationMode] = useState(false)
  
  // Cảm biến âm thanh (dùng mic)
  const [isMicActive, setIsMicActive] = useState(false)
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null)
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null)
  const [dataArray, setDataArray] = useState<Uint8Array | null>(null)
  
  const animationRef = useRef<number | null>(null)
  const dragonRef = useRef<HTMLDivElement>(null)
  
  // Ngưỡng ồn
  const WAKE_THRESHOLD = 40
  const CALM_THRESHOLD = 20
  
  // ===== KHỞI TẠO MIC =====
  const startMic = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const context = new AudioContext()
      const source = context.createMediaStreamSource(stream)
      const analyserNode = context.createAnalyser()
      analyserNode.fftSize = 256
      source.connect(analyserNode)
      
      const data = new Uint8Array(analyserNode.frequencyBinCount)
      
      setAudioContext(context)
      setAnalyser(analyserNode)
      setDataArray(data)
      setIsMicActive(true)
      setIsSimulationMode(false)
      
      // Bắt đầu lắng nghe
      listenToMic(analyserNode, data, context)
      
      setAlertMessage('🎤 Đã kết nối mic! Để lớp yên tĩnh nào...')
      setShowAlert(true)
      setTimeout(() => setShowAlert(false), 2000)
      
    } catch (error) {
      console.error('Lỗi mic:', error)
      setAlertMessage('⚠️ Không thể truy cập mic! Đã tự động chuyển sang Chế độ Mô Phỏng (Thủ công).')
      setShowAlert(true)
      setIsMicActive(false)
      setIsSimulationMode(true)
      setTimeout(() => setShowAlert(false), 4000)
    }
  }
  
  // ===== LẮNG NGHE ÂM THANH =====
  const listenToMic = (analyserNode: AnalyserNode, data: Uint8Array, context: AudioContext) => {
    const updateLevel = () => {
      if (context.state === 'suspended') {
        context.resume()
      }
      
      analyserNode.getByteFrequencyData(data)
      let sum = 0
      for (let i = 0; i < data.length; i++) {
        sum += data[i]
      }
      const average = sum / data.length
      const level = Math.round((average / 255) * 100)
      
      setNoiseLevel(level)
      
      // Kiểm tra ngưỡng
      if (level > WAKE_THRESHOLD && isSleeping) {
        wakeDragon()
      } else if (level < CALM_THRESHOLD && !isSleeping && !isCalming) {
        calmDragon()
      }
      
      // Đếm tiếng ồn (nếu rồng đang thức)
      if (!isSleeping && level > WAKE_THRESHOLD) {
        setSoundCount(prev => prev + 1)
      }
      
      animationRef.current = requestAnimationFrame(updateLevel)
    }
    
    updateLevel()
  }
  
  // ===== ĐÁNH THỨC RỒNG =====
  const wakeDragon = () => {
    setIsSleeping(false)
    setIsCalming(false)
    setShowAlert(true)
    setAlertMessage('🐉 ROOOAAAAAR! Rồng thức dậy! Lớp ồn quá!')
    setSoundCount(prev => prev + 1)
    
    // Rung lắc màn hình
    document.body.style.animation = 'shake 0.5s'
    setTimeout(() => {
      document.body.style.animation = ''
    }, 500)
    
    setTimeout(() => setShowAlert(false), 3000)
  }
  
  // ===== LÀM RỒNG NGỦ LẠI =====
  const calmDragon = () => {
    if (isCalming) return
    setIsCalming(true)
    setShowAlert(true)
    setAlertMessage('😴 Rồng đang ngủ lại... Yên lặng nào!')
    
    // Đếm ngược 3s yên tĩnh để rồng ngủ lại
    let countdown = 3
    const interval = setInterval(() => {
      countdown -= 1
      setAlertMessage(`😴 Yên tĩnh ${countdown}s nữa rồng ngủ lại...`)
      
      if (countdown <= 0) {
        clearInterval(interval)
        setIsSleeping(true)
        setIsCalming(false)
        setSoundCount(0)
        setShowAlert(true)
        setAlertMessage('🛌 Rồng đã ngủ! Giữ yên lặng nhé!')
        setTimeout(() => setShowAlert(false), 2000)
      }
    }, 1000)
  }
  
  // ===== KÉO THẢ RỒNG =====
  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true)
  }
  
  const handleDragEnd = (e: React.DragEvent) => {
    setIsDragging(false)
    // Reset vị trí rồng
    if (dragonRef.current) {
      dragonRef.current.style.transform = 'translate(0, 0)'
    }
  }
  
  // ===== HÀM ĐIỀU CHỈNH TIẾNG ỒN MÔ PHỎNG =====
  const handleSimulationNoiseChange = (level: number) => {
    setNoiseLevel(level)
    if (level > WAKE_THRESHOLD && isSleeping) {
      wakeDragon()
    } else if (level < CALM_THRESHOLD && !isSleeping && !isCalming) {
      calmDragon()
    }
  }

  // ===== RESET GAME =====
  const resetGame = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
    if (audioContext && audioContext.state !== 'closed') {
      audioContext.close()
    }
    setIsMicActive(false)
    setIsSimulationMode(false)
    setGameStarted(false)
    setIsSleeping(true)
    setNoiseLevel(0)
    setSoundCount(0)
    setShowAlert(false)
    setAlertMessage('')
    setIsCalming(false)
    setAudioContext(null)
    setAnalyser(null)
    setDataArray(null)
  }
  
  // ===== CLEANUP =====
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      if (audioContext && audioContext.state !== 'closed') {
        audioContext.close()
      }
    }
  }, [audioContext])
  
  // ===== MÀN HÌNH CHỌN =====
  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-center text-indigo-800 mb-4 font-sans">
            🐉 RỒNG NGỦ
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Quản lý lớp học bằng mic - Rồng thức giấc khi ồn ào
          </p>
          
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
            <div className="text-8xl mb-6">
              {isSleeping ? '😴' : '🐉'}
            </div>
            
            <div className="bg-blue-50 p-4 rounded-xl mb-6">
              <h3 className="font-bold text-blue-800 mb-2">📌 Cách chơi:</h3>
              <ul className="text-sm text-left text-gray-700 space-y-2">
                <li>🎤 1. Cho phép <span className="font-bold">truy cập mic</span> khi trình duyệt hỏi</li>
                <li>🔇 2. Giữ <span className="font-bold">yên tĩnh</span> để rồng ngủ</li>
                <li>🔊 3. Nói to hoặc ồn ào → <span className="font-bold text-red-600">Rồng thức dậy!</span></li>
                <li>🤫 4. Yên lặng 3 giây → Rồng ngủ lại</li>
              </ul>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  setGameStarted(true)
                  startMic()
                }}
                className="flex-1 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-bold text-lg hover:from-indigo-600 hover:to-purple-700 transition shadow-lg cursor-pointer"
              >
                🎤 Sử dụng Microphone
              </button>
              <button
                onClick={() => {
                  setGameStarted(true)
                  setIsSimulationMode(true)
                  setIsMicActive(false)
                  setAlertMessage('🎛️ Đã bật Chế độ Mô Phỏng Thủ Công!')
                  setShowAlert(true)
                  setTimeout(() => setShowAlert(false), 2000)
                }}
                className="flex-1 py-4 bg-gradient-to-r from-slate-500 to-slate-700 text-white rounded-xl font-bold text-lg hover:from-slate-600 hover:to-slate-800 transition shadow-lg cursor-pointer"
              >
                🎛️ Chơi mô phỏng (Không cần mic)
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  // ===== MÀN HÌNH GAME =====
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-4 md:p-8">
      {/* Thêm CSS shake */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px) rotate(-2deg); }
          75% { transform: translateX(10px) rotate(2deg); }
        }
      `}} />
      
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-4 mb-6">
          <div className="flex justify-between items-center flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{isSleeping ? '😴' : '🐉'}</span>
              <div>
                <div className="font-bold text-gray-800">
                  {isSleeping ? 'Rồng đang ngủ...' : 'RỒNG THỨC DẬY!'}
                </div>
                <div className="text-sm text-gray-500">
                  Trạng thái: {isSleeping ? '🟢 Yên tĩnh' : '🔴 Ồn ào'}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="bg-gray-100 px-4 py-2 rounded-lg text-center">
                <div className="text-xs text-gray-500">Tiếng ồn</div>
                <div className="text-xl font-bold text-indigo-600">{noiseLevel}%</div>
              </div>
              <div className="bg-gray-100 px-4 py-2 rounded-lg text-center">
                <div className="text-xs text-gray-500">Lần thức</div>
                <div className="text-xl font-bold text-red-500">{soundCount}</div>
              </div>
              <button
                onClick={resetGame}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium text-sm cursor-pointer"
              >
                ⏹ Dừng
              </button>
            </div>
          </div>
          
          {/* Noise bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div 
                className={`h-full transition-all duration-300 ${
                  noiseLevel > WAKE_THRESHOLD ? 'bg-red-500' : 
                  noiseLevel > CALM_THRESHOLD ? 'bg-yellow-500' : 
                  'bg-green-500'
                }`}
                style={{ width: `${Math.min(noiseLevel, 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>🔇 Yên tĩnh</span>
              <span>🔊 Ồn</span>
            </div>
          </div>

          {/* Simulation controller */}
          {isSimulationMode && (
            <div className="mt-6 p-4 bg-indigo-50 rounded-xl border border-indigo-100 text-left">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-indigo-800">🎛️ Bộ điều khiển âm lượng mô phỏng (Thủ công):</span>
                <span className="text-sm font-semibold text-indigo-600 font-mono">{noiseLevel}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={noiseLevel}
                onChange={(e) => handleSimulationNoiseChange(Number(e.target.value))}
                className="w-full h-2 bg-indigo-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex flex-wrap gap-2 mt-3">
                <button
                  onClick={() => handleSimulationNoiseChange(10)}
                  className="px-3 py-1 text-xs bg-white text-gray-700 rounded border border-gray-200 hover:bg-gray-50 font-medium transition cursor-pointer"
                >
                  🤫 Yên tĩnh (10%)
                </button>
                <button
                  onClick={() => handleSimulationNoiseChange(35)}
                  className="px-3 py-1 text-xs bg-white text-gray-700 rounded border border-gray-200 hover:bg-gray-50 font-medium transition cursor-pointer"
                >
                  🗣️ Nói chuyện (35%)
                </button>
                <button
                  onClick={() => handleSimulationNoiseChange(60)}
                  className="px-3 py-1 text-xs bg-white text-gray-700 rounded border border-gray-200 hover:bg-gray-50 font-medium transition cursor-pointer"
                >
                  🔊 Ồn ào (60%)
                </button>
                <button
                  onClick={() => handleSimulationNoiseChange(90)}
                  className="px-3 py-1 text-xs bg-white text-gray-700 rounded border border-gray-200 hover:bg-gray-50 font-medium transition cursor-pointer"
                >
                  🔥 Quá ồn (90%)
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Dragon */}
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center relative overflow-hidden">
          <div 
            ref={dragonRef}
            className={`text-9xl transition-all duration-500 ${
              isSleeping ? 'scale-100' : 'scale-110 animate-bounce'
            }`}
            draggable
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            {isSleeping ? '😴' : '🐉'}
          </div>
          
          <div className="mt-4">
            {isSleeping ? (
              <div className="text-2xl text-green-600 font-bold">
                🛌 Zzz... Yên tĩnh quá!
              </div>
            ) : (
              <div className="text-2xl text-red-600 font-bold">
                🔥 ROOOAAAAAR! Ồn quá!
              </div>
            )}
          </div>
          
          {/* Alert */}
          {showAlert && (
            <div className={`mt-4 p-4 rounded-xl animate-pulse ${
              isSleeping ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {alertMessage}
            </div>
          )}
          
          {/* Mic status */}
          <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-3 pt-4 border-t border-gray-100 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <span className={`inline-block w-3 h-3 rounded-full ${
                isMicActive ? 'bg-green-500' : isSimulationMode ? 'bg-indigo-500 animate-pulse' : 'bg-red-500'
              }`}></span>
              <span>
                {isMicActive ? '🎤 Mic đang hoạt động' : isSimulationMode ? '🎛️ Chế độ mô phỏng thủ công đang bật' : '🔴 Mic chưa kết nối'}
              </span>
            </div>
            {!isMicActive && (
              <button
                onClick={startMic}
                className="px-3 py-1 bg-indigo-100 hover:bg-indigo-200 text-indigo-800 rounded-lg text-xs font-bold transition cursor-pointer"
              >
                🎤 Thử kết nối Microphone
              </button>
            )}
          </div>
        </div>
        
        {/* Control buttons */}
        <div className="mt-6 flex flex-wrap gap-3 justify-center">
          {!isSleeping && (
            <button
              onClick={calmDragon}
              disabled={isCalming}
              className="px-6 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition shadow-md disabled:bg-gray-400 cursor-pointer"
            >
              🤫 Làm rồng ngủ lại
            </button>
          )}
          
          <button
            onClick={() => {
              setIsSleeping(false)
              setShowAlert(true)
              setAlertMessage('🐉 Đánh thức rồng thủ công!')
              setTimeout(() => setShowAlert(false), 2000)
            }}
            className="px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition shadow-md cursor-pointer"
          >
            🔥 Đánh thức rồng
          </button>
        </div>
      </div>
    </div>
  )
}
