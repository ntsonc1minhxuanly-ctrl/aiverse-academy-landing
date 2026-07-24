import React, { useState, useEffect, useRef } from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "../../../src/components/ui/card";
import { Button } from "../../../src/components/ui/button";
import { Game } from "../../../src/types";
import { 
  ArrowLeft, Volume2, ShieldAlert, Award, Timer, VolumeX, 
  Settings, Play, Pause, RotateCcw, Flame, Sparkles, Coins
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface SleepingDragonGameProps {
  game?: Game;
  onBackToDashboard: () => void;
}

export default function SleepingDragonGame({ game, onBackToDashboard }: SleepingDragonGameProps) {
  // Configs
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [sensitivity, setSensitivity] = useState(50); // 1 to 100
  const [threshold, setThreshold] = useState(60); // 1 to 100
  const [noiseLevel, setNoiseLevel] = useState(15); // live noise level (0-100)
  
  // Game states
  const [dragonState, setDragonState] = useState<"sleeping" | "disturbed" | "awake" | "angry">("sleeping");
  const [coins, setCoins] = useState(5);
  const [maxCoins] = useState(5);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes work time
  const [timerRunning, setTimerRunning] = useState(false);
  const [consecutiveLoudTicks, setConsecutiveLoudTicks] = useState(0);
  const [gameEnded, setGameEnded] = useState(false);
  const [gameResult, setGameResult] = useState<"won" | "lost" | null>(null);

  // Audio Context refs for real mic analysis
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Sound effects simulator states
  const [testNoise, setTestNoise] = useState(15);

  // Timer Countdown loop
  useEffect(() => {
    if (!timerRunning || gameEnded) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleGameWin();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerRunning, gameEnded]);

  // Main monitoring loop
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isMonitoring && !gameEnded) {
      interval = setInterval(() => {
        // Read active level (from mic or test slider)
        const activeLevel = analyserRef.current ? noiseLevel : testNoise;
        
        // Apply sensitivity factor to raw input
        const adjustedLevel = Math.min(100, Math.round(activeLevel * (1 + (sensitivity - 50) / 100)));
        if (!analyserRef.current) {
          setNoiseLevel(adjustedLevel);
        }

        // Determine dragon status
        if (adjustedLevel > threshold) {
          setConsecutiveLoudTicks(prev => {
            const nextTicks = prev + 1;
            
            if (nextTicks >= 3) {
              setDragonState("angry");
              handleLoseCoin();
              return 0; // reset
            } else if (nextTicks === 2) {
              setDragonState("awake");
            } else {
              setDragonState("disturbed");
            }
            return nextTicks;
          });
        } else {
          setConsecutiveLoudTicks(0);
          setDragonState(adjustedLevel > threshold - 20 ? "disturbed" : "sleeping");
        }
      }, 500);
    } else {
      setNoiseLevel(0);
      setDragonState("sleeping");
    }

    return () => clearInterval(interval);
  }, [isMonitoring, testNoise, sensitivity, threshold, noiseLevel, gameEnded]);

  // Start Real Microphone Monitoring
  const startMic = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      streamRef.current = stream;

      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioContextClass();
      audioContextRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;
      source.connect(analyser);

      setIsMonitoring(true);
      setTimerRunning(true);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateVolume = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);

        // Calculate average volume
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const average = sum / bufferLength;
        
        // Map average (0-255) to level (0-100)
        const percentage = Math.min(100, Math.round((average / 120) * 100));
        setNoiseLevel(percentage);

        animationFrameRef.current = requestAnimationFrame(updateVolume);
      };

      updateVolume();
    } catch (err) {
      console.warn("Môi trường iframe hoặc người dùng từ chối quyền microphone. Bật chế độ giả lập thay thế.", err);
      // Fallback to manual simulator mode
      setIsMonitoring(true);
      setTimerRunning(true);
    }
  };

  const stopMic = () => {
    setIsMonitoring(false);
    setTimerRunning(false);
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    analyserRef.current = null;
  };

  const handleLoseCoin = () => {
    setCoins(prev => {
      const nextCoins = prev - 1;
      if (nextCoins <= 0) {
        handleGameLoss();
        return 0;
      }
      return nextCoins;
    });
  };

  const handleGameWin = () => {
    setGameEnded(true);
    setGameResult("won");
    stopMic();
  };

  const handleGameLoss = () => {
    setGameEnded(true);
    setGameResult("lost");
    stopMic();
  };

  const handleReset = () => {
    stopMic();
    setCoins(5);
    setTimeLeft(300);
    setGameEnded(false);
    setGameResult(null);
    setConsecutiveLoudTicks(0);
    setNoiseLevel(15);
    setTestNoise(15);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="space-y-6 w-full max-w-4xl mx-auto px-1 select-none">
      
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
          <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold rounded-md uppercase tracking-wider font-mono">
            Quản lý lớp học số • Rồng Ngủ
          </span>
          <h2 className="text-sm font-bold text-slate-800 mt-1">{game?.title || "Rồng Thần Say Giấc • Đo tiếng ồn"}</h2>
        </div>
        <div className="w-24"></div>
      </div>

      {gameEnded ? (
        /* GAME RESULT DISPLAY */
        <Card className="border-slate-100 shadow-xl p-8 text-center bg-white space-y-6 rounded-3xl max-w-md mx-auto">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto shadow-inner text-3xl">
            {gameResult === "won" ? "🏆" : "🐉🔥"}
          </div>
          <div className="space-y-1">
            <span className={`px-3 py-1 text-[10px] font-extrabold rounded-full font-mono uppercase ${
              gameResult === "won" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
            }`}>
              {gameResult === "won" ? "Hoàn thành nhiệm vụ" : "Rồng thần thức tỉnh!"}
            </span>
            <h3 className="text-xl font-black text-slate-900 pt-2">
              {gameResult === "won" ? "Lớp học siêu tập trung!" : "Lớp quá ồn rồi!"}
            </h3>
            <p className="text-xs text-slate-500">
              {gameResult === "won" 
                ? "Thầy cô và các em đã hoàn thành giờ học tự quản xuất sắc trong im lặng hoàn hảo."
                : "Tiếng ồn vượt quá giới hạn làm Rồng thần tỉnh giấc và thổi bay rương kho báu."}
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 grid grid-cols-2 gap-4">
            <div>
              <span className="block text-2xl font-black text-slate-800">{coins} / {maxCoins}</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase font-mono">Rương vàng giữ được</span>
            </div>
            <div>
              <span className="block text-2xl font-black text-slate-800">{formatTime(300 - timeLeft)}</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase font-mono">Thời gian tập trung</span>
            </div>
          </div>

          <div className="flex space-x-3 justify-center pt-2">
            <Button variant="outline" onClick={handleReset} className="h-10 rounded-xl flex-1 text-xs font-bold cursor-pointer">
              <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Thiết lập lại
            </Button>
            <Button onClick={onBackToDashboard} className="h-10 rounded-xl flex-1 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">
              Quay lại thư viện
            </Button>
          </div>
        </Card>
      ) : (
        /* GAMEPLAY INTERFACE */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Dragon Center stage - 7 columns */}
          <div className="lg:col-span-7 space-y-6">
            <Card className="border-slate-100 shadow-xl bg-white rounded-3xl p-6 flex flex-col items-center justify-between min-h-[380px] relative overflow-hidden">
              
              {/* Background coins status nest */}
              <div className="absolute top-4 left-4 flex items-center space-x-1.5 bg-amber-50 border border-amber-100 px-3 py-1.5 rounded-2xl shadow-sm">
                <Coins className="h-4.5 w-4.5 text-amber-500 fill-amber-500 animate-pulse" />
                <span className="text-xs font-black text-amber-950 font-mono">Vàng bảo vệ: {coins} / 5</span>
              </div>

              {/* Timer status */}
              <div className="absolute top-4 right-4 flex items-center space-x-1.5 bg-slate-100 px-3 py-1.5 rounded-2xl shadow-sm">
                <Timer className="h-4.5 w-4.5 text-slate-600" />
                <span className="text-xs font-black text-slate-800 font-mono">{formatTime(timeLeft)}</span>
              </div>

              {/* DRAGON GRAPHICS REPRESENTATION */}
              <div className="h-60 flex flex-col justify-center items-center mt-12 w-full">
                <AnimatePresence mode="wait">
                  {dragonState === "sleeping" && (
                    <motion.div
                      key="sleeping"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="text-center relative"
                    >
                      {/* Floating Sleep bubbles Zzz */}
                      <motion.span
                        animate={{ y: [-10, -35], x: [0, 15], opacity: [1, 0] }}
                        transition={{ repeat: Infinity, duration: 2.2 }}
                        className="absolute -top-10 right-2 text-2xl font-black text-blue-500 font-mono"
                      >
                        💤
                      </motion.span>
                      <motion.span
                        animate={{ y: [-15, -45], x: [10, -5], opacity: [0.8, 0] }}
                        transition={{ repeat: Infinity, duration: 2.6, delay: 0.8 }}
                        className="absolute -top-14 right-10 text-xl font-bold text-blue-400 font-mono"
                      >
                        zZ
                      </motion.span>
                      
                      {/* Sleeping dragon emoji */}
                      <div className="text-8xl filter drop-shadow-2xl animate-pulse">🐉</div>
                      <p className="text-xs font-bold text-emerald-600 mt-4 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100/50">
                        🟢 Rồng đang say giấc. Cả lớp hãy giữ trật tự nhé!
                      </p>
                    </motion.div>
                  )}

                  {dragonState === "disturbed" && (
                    <motion.div
                      key="disturbed"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="text-center relative"
                    >
                      <div className="text-8xl filter drop-shadow-2xl animate-bounce">🦎</div>
                      <p className="text-xs font-bold text-amber-600 mt-4 bg-amber-50 px-3 py-1 rounded-full border border-amber-100/50 animate-pulse">
                        🟡 Rồng khẽ động đậy cánh! Có chút tiếng ồn xì xào...
                      </p>
                    </motion.div>
                  )}

                  {dragonState === "awake" && (
                    <motion.div
                      key="awake"
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.05 }}
                      className="text-center relative"
                    >
                      <div className="text-8xl filter drop-shadow-2xl animate-shake">🦖</div>
                      <p className="text-xs font-bold text-orange-600 mt-4 bg-orange-50 px-3 py-1 rounded-full border border-orange-100/50">
                        🟠 Rồng đã mở to mắt nhìn! Lớp quá ồn!
                      </p>
                    </motion.div>
                  )}

                  {dragonState === "angry" && (
                    <motion.div
                      key="angry"
                      initial={{ opacity: 0, scale: 1.1 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.1 }}
                      className="text-center relative"
                    >
                      <div className="text-8xl filter drop-shadow-2xl animate-ping">🌋🦖🔥</div>
                      <p className="text-xs font-bold text-red-600 mt-4 bg-red-50 px-3 py-1 rounded-full border border-red-100/50 uppercase font-mono animate-bounce">
                        🔴 rồng thần phun lửa! Đã mất 1 rương rồng vàng!
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Noise Level live meter */}
              <div className="w-full space-y-2 pt-4 border-t border-slate-50">
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 font-mono uppercase">
                  <span>Mức độ ồn lớp học: {noiseLevel}%</span>
                  <span>Ngưỡng thức tỉnh: {threshold}%</span>
                </div>
                
                {/* Live audio bar */}
                <div className="w-full h-4.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50 shadow-inner relative">
                  <motion.div
                    animate={{ width: `${noiseLevel}%` }}
                    transition={{ type: "tween" }}
                    className={`h-full rounded-full ${
                      noiseLevel > threshold 
                        ? "bg-gradient-to-r from-red-500 to-rose-600" 
                        : noiseLevel > threshold - 20 
                        ? "bg-gradient-to-r from-yellow-400 to-amber-500" 
                        : "bg-gradient-to-r from-emerald-500 to-teal-500"
                    }`}
                  ></motion.div>
                  
                  {/* Threshold vertical indicator line */}
                  <div 
                    style={{ left: `${threshold}%` }}
                    className="absolute top-0 bottom-0 w-0.5 bg-red-600 border-l border-white/40 shadow-sm"
                  ></div>
                </div>
              </div>

              {/* Monitor control buttons */}
              <div className="flex space-x-3 w-full justify-center pt-2">
                {!isMonitoring ? (
                  <Button
                    onClick={startMic}
                    className="w-full max-w-xs h-11 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-bold cursor-pointer"
                  >
                    <Play className="h-4 w-4 mr-1.5" /> Bắt đầu giám sát học tập
                  </Button>
                ) : (
                  <Button
                    onClick={stopMic}
                    variant="outline"
                    className="w-full max-w-xs h-11 rounded-2xl text-xs font-bold cursor-pointer border-slate-200 hover:bg-slate-50"
                  >
                    <Pause className="h-4 w-4 mr-1.5 text-slate-500" /> Tạm dừng giám sát
                  </Button>
                )}
              </div>
            </Card>
          </div>

          {/* Configuration and test slider - 5 columns */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* NOISE SIMULATOR CONTROLLER (For iframe compatibility & demos) */}
            <Card className="border-slate-100 shadow-sm bg-white rounded-2xl">
              <CardHeader className="p-4 border-b border-slate-100 bg-slate-50/50 rounded-t-2xl">
                <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono flex items-center">
                  <Volume2 className="h-4 w-4 text-indigo-600 mr-1.5" /> Giả lập tiếng ồn lớp học
                </CardTitle>
                <CardDescription className="text-[10px] leading-relaxed pt-0.5">
                  Iframe có thể hạn chế Microphone. Hãy dùng thanh trượt này để giả lập hoặc kiểm tra tiếng ồn của các nhóm học sinh!
                </CardDescription>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-slate-600 font-semibold">
                    <span>Mức ồn giả lập:</span>
                    <span className="font-mono">{testNoise}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={testNoise}
                    onChange={(e) => setTestNoise(Number(e.target.value))}
                    disabled={!isMonitoring}
                    className="w-full accent-indigo-600 cursor-pointer h-2 bg-slate-100 rounded-lg appearance-none"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>Im lặng 🤫</span>
                    <span>Ồn ào 🔊</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={!isMonitoring}
                    onClick={() => setTestNoise(20)}
                    className="flex-1 rounded-xl text-[10px] h-8 cursor-pointer"
                  >
                    Trật tự (20%)
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={!isMonitoring}
                    onClick={() => setTestNoise(75)}
                    className="flex-1 rounded-xl text-[10px] h-8 cursor-pointer border-red-100 text-red-600 hover:bg-red-50"
                  >
                    Nói chuyện (75%)
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* SENSITIVITY CONFIGURATION */}
            <Card className="border-slate-100 shadow-sm bg-white rounded-2xl">
              <CardHeader className="p-4 border-b border-slate-100 bg-slate-50/50 rounded-t-2xl">
                <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono flex items-center">
                  <Settings className="h-4 w-4 text-indigo-600 mr-1.5" /> Điều chỉnh độ nhạy
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-5">
                
                {/* Sensitivity setting */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-slate-600 font-semibold">
                    <span>Độ nhạy Micro:</span>
                    <span className="font-mono">{sensitivity}%</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={sensitivity}
                    onChange={(e) => setSensitivity(Number(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer h-2 bg-slate-100 rounded-lg appearance-none"
                  />
                </div>

                {/* Awake Threshold setting */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-slate-600 font-semibold">
                    <span>Ngưỡng báo động:</span>
                    <span className="font-mono">{threshold}%</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="90"
                    value={threshold}
                    onChange={(e) => setThreshold(Number(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer h-2 bg-slate-100 rounded-lg appearance-none"
                  />
                </div>
              </CardContent>
            </Card>

          </div>

        </div>
      )}
    </div>
  );
}
