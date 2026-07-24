import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "../types";

interface UserContextType {
  currentUser: User | null;
  loading: boolean;
  login: (emailOrUsername: string, password: string) => Promise<User>;
  register: (email: string, username: string, fullName: string, password: string, role: "teacher" | "student") => Promise<User>;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("gvedm_user");
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (err) {
        console.error("Lỗi phục hồi session:", err);
      }
    }
    setLoading(false);
  }, []);

  const login = async (emailOrUsername: string, password: string): Promise<User> => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ emailOrUsername, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Đăng nhập thất bại");
    }
    setCurrentUser(data);
    localStorage.setItem("gvedm_user", JSON.stringify(data));
    return data;
  };

  const register = async (
    email: string,
    username: string,
    fullName: string,
    password: string,
    role: "teacher" | "student"
  ): Promise<User> => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, username, fullName, password, role }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Đăng ký thất bại");
    }
    return data;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("gvedm_user");
  };

  return (
    <UserContext.Provider value={{ currentUser, loading, login, register, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
