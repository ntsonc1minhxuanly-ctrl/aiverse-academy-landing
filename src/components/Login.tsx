import React, { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Sparkles, User, Lock, ArrowRight, Compass } from "lucide-react";
import { motion } from "motion/react";
import { useUser } from "../context/UserContext";

interface LoginProps {
  onLoginSuccess: (user: any) => void;
  onNavigateToRegister: () => void;
}

export default function Login({ onLoginSuccess, onNavigateToRegister }: LoginProps) {
  const { login } = useUser();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Vui lòng nhập đầy đủ Email/Tên tài khoản và Mật khẩu.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const user = await login(username, password);
      onLoginSuccess(user);
    } catch (err: any) {
      setError(err.message || "Email/Tên đăng nhập hoặc mật khẩu sai!");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const user = await login("co_mai", "123");
      onLoginSuccess(user);
    } catch (err: any) {
      setError("Lỗi kết nối máy chủ. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decorations */}
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
          Chào mừng Thầy Cô quay trở lại!
        </h2>
        <p className="mt-2 text-center text-sm text-slate-500">
          Chuyển đổi số dạy học, kiến tạo trải nghiệm lớp học tương tác bằng AI.
        </p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10"
      >
        <Card className="bg-white/80 backdrop-blur-md shadow-xl border-slate-100 p-6 sm:p-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3.5 bg-red-50 text-red-700 text-xs rounded-xl border border-red-100 font-medium">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="username" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Địa chỉ Email hoặc Tên đăng nhập
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="h-4 w-4" />
                </div>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="co_mai@gvedm.edu.vn hoặc co_mai"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Mật khẩu
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center h-11"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                  <span>Đang đăng nhập...</span>
                </div>
              ) : (
                <span className="flex items-center">
                  Đăng nhập <ArrowRight className="ml-2 h-4 w-4" />
                </span>
              )}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100" />
              </div>
              <div className="relative flex justify-center text-xs text-slate-400">
                <span className="bg-white px-2">Hoặc thử ngay mà không cần tài khoản</span>
              </div>
            </div>

            <div className="mt-4 flex flex-col space-y-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleQuickLogin}
                className="w-full text-indigo-600 border-indigo-100 hover:bg-indigo-50 hover:border-indigo-200"
              >
                <Compass className="mr-2 h-4 w-4 text-indigo-500" /> Đăng nhập nhanh tài khoản mẫu
              </Button>
            </div>
          </div>

          <div className="mt-6 text-center text-sm">
            <span className="text-slate-500">Chưa có tài khoản? </span>
            <button
              onClick={onNavigateToRegister}
              className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline cursor-pointer"
            >
              Đăng ký ngay
            </button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
