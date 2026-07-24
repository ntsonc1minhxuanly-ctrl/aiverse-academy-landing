import React, { useState, useEffect, useRef } from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "../../../src/components/ui/card";
import { Button } from "../../../src/components/ui/button";
import { Input } from "../../../src/components/ui/input";
import { Game } from "../../../src/types";
import { ArrowLeft, RotateCw, Plus, Trash2, HelpCircle, Trophy, Settings, Volume2, Play } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface LuckyWheelGameProps {
  game?: Game;
  onBackToDashboard: () => void;
}

const DEFAULT_ITEMS = [
  { text: "Lê Văn Tám", color: "#3b82f6" },
  { text: "Nguyễn Thị Mai", color: "#ef4444" },
  { text: "Trần Đức Nam", color: "#10b981" },
  { text: "Phạm Hồng Hạnh", color: "#f59e0b" },
  { text: "Đỗ Gia Bảo", color: "#8b5cf6" },
  { text: "Nguyễn Minh Anh", color: "#ec4899" },
  { text: "Hoàng Gia Huy", color: "#14b8a6" },
  { text: "Phan Thanh Trúc", color: "#f97316" }
];

export default function LuckyWheelGame({ game, onBackToDashboard }: LuckyWheelGameProps) {
  // Try to use dynamic game items if wheel items exist, else defaults
  const initialItems = game?.content?.wheelItems?.map((item: any, idx: number) => ({
    text: item.text,
    color: item.color || ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#14b8a6", "#f97316"][idx % 8]
  })) || DEFAULT_ITEMS;

  const [items, setItems] = useState(initialItems);
  const [newItemText, setNewItemText] = useState("");
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [winner, setWinner] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const requestRef = useRef<number | null>(null);

  useEffect(() => {
    drawWheel(rotationAngle);
  }, [items, rotationAngle]);

  const drawWheel = (currentAngle: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) - 15;

    ctx.clearRect(0, 0, width, height);

    const sliceAngle = (2 * Math.PI) / items.length;

    // Draw slices
    items.forEach((item, index) => {
      const startAngle = index * sliceAngle + currentAngle;
      const endAngle = startAngle + sliceAngle;

      // Draw Pie Slice
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = item.color;
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#ffffff";
      ctx.stroke();

      // Draw Text on slice
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startAngle + sliceAngle / 2);
      ctx.textAlign = "right";
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 12px sans-serif";
      
      // Handle text length overflow
      let textToShow = item.text;
      if (textToShow.length > 15) textToShow = textToShow.slice(0, 13) + "...";
      ctx.fillText(textToShow, radius - 20, 5);
      ctx.restore();
    });

    // Outer ring border
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.lineWidth = 6;
    ctx.strokeStyle = "#1e293b"; // slate-800
    ctx.stroke();

    // Small inner circle (pin/hub)
    ctx.beginPath();
    ctx.arc(centerX, centerY, 25, 0, 2 * Math.PI);
    ctx.fillStyle = "#1e293b";
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#ffffff";
    ctx.stroke();

    // Center icon or star
    ctx.font = "16px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#ffffff";
    ctx.fillText("⭐️", centerX, centerY);
  };

  const handleSpin = () => {
    if (isSpinning || items.length === 0) return;

    setIsSpinning(true);
    setWinner(null);

    const spinDuration = 3500; // ms
    const startTime = performance.now();
    
    // Choose random final velocity
    const baseRotation = 10 * 2 * Math.PI; // at least 10 spins
    const extraRotation = Math.random() * 2 * Math.PI;
    const targetRotation = rotationAngle + baseRotation + extraRotation;

    const animateSpin = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / spinDuration, 1);
      
      // Ease out cubic deceleration
      const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
      const currentAngle = rotationAngle + (targetRotation - rotationAngle) * easeOutCubic(progress);

      setRotationAngle(currentAngle);

      if (progress < 1) {
        requestRef.current = requestAnimationFrame(animateSpin);
      } else {
        // Calculate selected item
        const finalAngle = currentAngle % (2 * Math.PI);
        const sliceAngle = (2 * Math.PI) / items.length;
        
        // 12 o'clock pointer is at angle -Math.PI / 2
        let winningIndex = Math.floor((-Math.PI / 2 - finalAngle) / sliceAngle) % items.length;
        if (winningIndex < 0) winningIndex += items.length;

        const winItem = items[winningIndex].text;
        setWinner(winItem);
        setHistory(prev => [winItem, ...prev.slice(0, 4)]);
        setIsSpinning(false);
      }
    };

    requestRef.current = requestAnimationFrame(animateSpin);
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemText.trim()) return;

    const colors = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#14b8a6", "#f97316"];
    const newColor = colors[items.length % colors.length];

    setItems([...items, { text: newItemText.trim(), color: newColor }]);
    setNewItemText("");
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 2) {
      alert("Cần có ít nhất 2 phương án hoặc tên để vận hành vòng quay!");
      return;
    }
    const updated = items.filter((_, idx) => idx !== index);
    setItems(updated);
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
          <span className="px-2.5 py-0.5 bg-indigo-100 text-indigo-800 text-[10px] font-extrabold rounded-md uppercase tracking-wider font-mono">
            Vòng Quay Kì Diệu • Lựa chọn ngẫu nhiên
          </span>
          <h2 className="text-sm font-bold text-slate-800 mt-1">{game?.title || "Vòng quay May Mắn Học Tập"}</h2>
        </div>
        <div className="w-24"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* WHEEL DISPLAY CONTAINER - 7 Columns */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <Card className="border-slate-100 shadow-xl bg-white p-6 rounded-3xl w-full flex flex-col items-center justify-center relative overflow-hidden">
            
            {/* The Pointer (Arrow indicator at 12 o'clock) */}
            <div className="absolute top-[28px] left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
              <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[28px] border-t-slate-800 filter drop-shadow"></div>
              <div className="w-2 h-2 bg-white rounded-full -mt-4"></div>
            </div>

            {/* Canvas Wheel rendering */}
            <div className="relative p-2 bg-slate-50/80 rounded-full border border-slate-100 shadow-inner flex items-center justify-center mt-6">
              <canvas 
                ref={canvasRef} 
                width={360} 
                height={360} 
                className="rounded-full shadow-lg max-w-full"
              />
            </div>

            {/* Winner Toast */}
            <div className="h-20 flex items-center justify-center mt-4 w-full">
              <AnimatePresence mode="wait">
                {winner ? (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="p-4 bg-gradient-to-r from-yellow-100 to-amber-100 border border-yellow-200 rounded-2xl shadow-md text-center max-w-xs"
                  >
                    <span className="text-[10px] font-black text-amber-800 uppercase tracking-widest block font-mono">
                      🎉 KẾT QUẢ VÒNG QUAY 🎉
                    </span>
                    <span className="text-base font-black text-amber-950 mt-1 block">
                      {winner}
                    </span>
                  </motion.div>
                ) : isSpinning ? (
                  <div className="flex items-center space-x-2 text-slate-400">
                    <div className="w-3 h-3 bg-indigo-500 rounded-full animate-ping"></div>
                    <span className="text-xs font-semibold font-mono uppercase tracking-wider animate-pulse">
                      Đang quay kì diệu...
                    </span>
                  </div>
                ) : (
                  <p className="text-xs font-medium text-slate-400 text-center">
                    Bấm "QUAY NGAY" để chọn ngẫu nhiên một phương án!
                  </p>
                )}
              </AnimatePresence>
            </div>

            <Button
              onClick={handleSpin}
              disabled={isSpinning || items.length === 0}
              className="w-full max-w-xs h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-sm font-black tracking-widest shadow-lg shadow-indigo-100 cursor-pointer flex items-center justify-center uppercase"
            >
              <Play className="h-4 w-4 mr-2 text-indigo-100 fill-indigo-100" /> Quay ngay
            </Button>
          </Card>
        </div>

        {/* CONTROLS & SETTINGS PANEL - 5 Columns */}
        <div className="lg:col-span-5 space-y-6">
          {/* Slices list config */}
          <Card className="border-slate-100 shadow-md bg-white rounded-2xl">
            <CardHeader className="p-4.5 border-b border-slate-100 bg-slate-50/50 rounded-t-2xl">
              <CardTitle className="text-sm font-extrabold text-slate-800 flex items-center">
                <Settings className="h-4 w-4 text-indigo-600 mr-1.5" /> Điều Chỉnh Vòng Quay
              </CardTitle>
              <CardDescription className="text-[11px] leading-relaxed pt-0.5">
                Chỉnh sửa danh sách các ô trên vòng quay bài học, tên học sinh hoặc phần thưởng.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4.5 space-y-4">
              
              {/* Form add items */}
              <form onSubmit={handleAddItem} className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Thêm phương án..."
                  value={newItemText}
                  onChange={(e) => setNewItemText(e.target.value)}
                  className="h-9.5 text-xs rounded-xl"
                  disabled={isSpinning}
                />
                <Button 
                  type="submit" 
                  disabled={isSpinning}
                  className="h-9.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                </Button>
              </form>

              {/* Scrollable list items */}
              <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1">
                {items.map((item, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-2 bg-slate-50 hover:bg-slate-100/70 border border-slate-100 rounded-xl transition-all"
                  >
                    <div className="flex items-center space-x-2">
                      <div className="w-3.5 h-3.5 rounded-md shadow-sm" style={{ backgroundColor: item.color }}></div>
                      <span className="text-xs font-semibold text-slate-700">{item.text}</span>
                    </div>
                    <button
                      type="button"
                      disabled={isSpinning}
                      onClick={() => handleRemoveItem(index)}
                      className="p-1 text-slate-300 hover:text-red-500 rounded transition-colors cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* SPIN HISTORY */}
          <Card className="border-slate-100 shadow-sm bg-white rounded-2xl">
            <CardHeader className="p-4 border-b border-slate-100 bg-slate-50/50 rounded-t-2xl">
              <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
                Lịch sử quay gần đây
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {history.length === 0 ? (
                <p className="text-center text-[11px] text-slate-400 py-4">Chưa có lượt quay nào được thực hiện.</p>
              ) : (
                <div className="space-y-1.5">
                  {history.map((winnerName, idx) => (
                    <div 
                      key={idx}
                      className="flex items-center justify-between text-xs p-2.5 bg-slate-50/50 rounded-xl border border-slate-100 font-medium"
                    >
                      <span className="text-slate-700">{winnerName}</span>
                      <span className="text-[9px] bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded font-bold font-mono">
                        Lượt #{history.length - idx}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
