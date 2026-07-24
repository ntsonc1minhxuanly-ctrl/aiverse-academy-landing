import React, { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Sparkles, User, Lock, ArrowLeft, ArrowRight, BookOpen, Mail } from "lucide-react";
import { motion } from "motion/react";
import { useUser } from "../context/UserContext";

interface RegisterProps {
  onRegisterSuccess: () => void;
  onNavigateToLogin: () => void;
}

export default function Register({ onRegisterSuccess, onNavigateToLogin }: RegisterProps) {
  const { register } = useUser();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"teacher" | "student">("teacher");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !username || !fullName || !password) {
      setError("Vui lòng điền đầy đủ tất cả các trường thông tin: Email, Tên tài khoản, Họ tên và Mật khẩu.");
      return;
    }

    // Simple email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Địa chỉ email không đúng định dạng!");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await register(email, username, fullName, password, role);

      setSuccess("Tạo tài khoản thành công! Thầy cô đang được chuyển sang đăng nhập.");
      setTimeout(() => {
        onRegisterSuccess();
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi đăng ký, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-30">
        <div className="absolute top-10 left-10 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="flex justify-center items-center space-x-2 text-indigo-600 mb-2">
          <div className="p-2 bg-indigo-100 rounded-2xl">
            <Sparkles className="h-8 w-8" />
          </div>
          <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent">
            GIÁO VIÊN ĐỔI MỚI
          </span>
        </div>
        <h2 className="text-center text-3xl font-extrabold text-slate-900 tracking-tight">
          Đăng ký tài khoản dạy học
        </h2>
        <p className="mt-2 text-center text-sm text-slate-500">
          Gia nhập cộng đồng đổi mới phương pháp giảng dạy thời đại số.
        </p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10"
      >
        <Card className="bg-white/80 backdrop-blur-md shadow-xl border-slate-100 p-6 sm:p-10">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-100 font-medium">
                {error}
              </div>
            )}

            {success && (
              <div className="p-3 bg-emerald-50 text-emerald-700 text-xs rounded-xl border border-emerald-100 font-medium">
                {success}
              </div>
            )}

            <div>
              <label htmlFor="reg-email" className="block text-sm font-semibold text-slate-700 mb-1">
                Địa chỉ Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <Input
                  id="reg-email"
                  name="email"
                  type="email"
                  placeholder="giao_vien_moi@gvedm.edu.vn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label htmlFor="fullName" className="block text-sm font-semibold text-slate-700 mb-1">
                Họ và tên giáo viên
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <BookOpen className="h-4 w-4" />
                </div>
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="Thầy Nguyễn Văn A"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label htmlFor="reg-username" className="block text-sm font-semibold text-slate-700 mb-1">
                Tên đăng nhập (Tài khoản)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="h-4 w-4" />
                </div>
                <Input
                  id="reg-username"
                  name="username"
                  type="text"
                  placeholder="thay_a"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label htmlFor="reg-password" className="block text-sm font-semibold text-slate-700 mb-1">
                Mật khẩu bảo mật
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <Input
                  id="reg-password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Vai trò trên hệ thống
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("teacher")}
                  className={`py-2 px-4 rounded-xl border text-sm font-medium transition-all cursor-pointer flex justify-center items-center ${
                    role === "teacher"
                      ? "bg-indigo-50 border-indigo-500 text-indigo-700 shadow-sm"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  🏫 Giáo viên
                </button>
                <button
                  type="button"
                  onClick={() => setRole("student")}
                  className={`py-2 px-4 rounded-xl border text-sm font-medium transition-all cursor-pointer flex justify-center items-center ${
                    role === "student"
                      ? "bg-indigo-50 border-indigo-500 text-indigo-700 shadow-sm"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  🎒 Học sinh
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center h-11 mt-2"
            >
              {loading ? "Đang xử lý..." : (
                <span className="flex items-center">
                  Đăng ký tài khoản <ArrowRight className="ml-2 h-4 w-4" />
                </span>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <button
              onClick={onNavigateToLogin}
              className="inline-flex items-center font-medium text-slate-500 hover:text-indigo-600 hover:underline cursor-pointer"
            >
              <ArrowLeft className="mr-1.5 h-4 w-4" /> Quay lại đăng nhập
            </button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
