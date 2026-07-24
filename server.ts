import express from "express";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

// Path to file-based persistent database
const DB_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DB_DIR, "db.json");

// Ensure data folder exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

// Initial default state of db
interface DbState {
  users: any[];
  classrooms: any[];
  games: any[];
}

const defaultDb: DbState = {
  users: [
    {
      id: "u1",
      email: "co_mai@gvedm.edu.vn",
      username: "co_mai",
      fullName: "Cô Nguyễn Thị Mai",
      password: "123", // simplified password for local login
      role: "teacher"
    }
  ],
  classrooms: [
    {
      id: "c1",
      name: "Lớp 5A - Toán Học",
      grade: "Lớp 5",
      description: "Lớp học toán sáng tạo và đổi mới phương pháp tư duy toán học.",
      studentCount: 32,
      code: "MATH5A"
    },
    {
      id: "c2",
      name: "Lớp 4B - Khoa Học & Đời Sống",
      grade: "Lớp 4",
      description: "Thế giới tự nhiên kỳ thú, thực hành khoa học vui nhộn.",
      studentCount: 28,
      code: "SCI4B"
    }
  ],
  games: [
    {
      id: "g1",
      title: "Trắc Nghiệm Lịch Sử Lớp 5",
      type: "quiz",
      subject: "Lịch sử",
      grade: "Lớp 5",
      description: "Cùng ôn tập về lịch sử dựng nước và giữ nước của dân tộc.",
      content: {
        questions: [
          {
            id: "q1",
            question: "Ai là người lãnh đạo cuộc khởi nghĩa Hai Bà Trưng năm 40?",
            options: ["Trưng Trắc và Trưng Nhị", "Triệu Thị Trinh", "Ngô Quyền", "Lê Lợi"],
            correctAnswer: 0,
            explanation: "Cuộc khởi nghĩa Hai Bà Trưng (năm 40) do Trưng Trắc và Trưng Nhị lãnh đạo chống lại nhà Đông Hán."
          },
          {
            id: "q2",
            question: "Trận chiến Bạch Đằng lịch sử năm 938 do ai lãnh đạo?",
            options: ["Đinh Bộ Lĩnh", "Ngô Quyền", "Lê Hoàn", "Trần Hưng Đạo"],
            correctAnswer: 1,
            explanation: "Ngô Quyền đã lãnh đạo quân dân ta đánh bại quân Nam Hán trên sông Bạch Đằng năm 938, mở đầu kỷ nguyên độc lập."
          },
          {
            id: "q3",
            question: "Ai là người viết bản Tuyên ngôn Độc lập khai sinh nước Việt Nam Dân chủ Cộng hòa?",
            options: ["Chủ tịch Hồ Chí Minh", "Đại tướng Võ Nguyên Giáp", "Phan Bội Châu", "Nguyễn Trãi"],
            correctAnswer: 0,
            explanation: "Chủ tịch Hồ Chí Minh đã đọc bản Tuyên ngôn Độc lập vào ngày 2/9/1945 tại Quảng trường Ba Đình."
          }
        ]
      },
      createdBy: "Cô Nguyễn Thị Mai",
      createdAt: "2026-07-08T06:55:00.000Z"
    },
    {
      id: "g2",
      title: "Vòng Quay Từ Vựng Tiếng Anh",
      type: "wheel",
      subject: "Tiếng Anh",
      grade: "Mọi cấp lớp",
      description: "Vòng quay ngẫu nhiên để chọn từ vựng chủ đề Trái Cây cho học sinh đặt câu.",
      content: {
        wheelItems: [
          { id: "w1", text: "Apple (Quả táo)", color: "#EF4444" },
          { id: "w2", text: "Banana (Quả chuối)", color: "#F59E0B" },
          { id: "w3", text: "Orange (Quả cam)", color: "#F97316" },
          { id: "w4", text: "Watermelon (Dưa hấu)", color: "#10B981" },
          { id: "w5", text: "Strawberry (Dâu tây)", color: "#EC4899" },
          { id: "w6", text: "Pineapple (Quả dứa)", color: "#EAB308" },
          { id: "w7", text: "Mango (Quả xoài)", color: "#84CC16" },
          { id: "w8", text: "Grape (Quả nho)", color: "#8B5CF6" }
        ]
      },
      createdBy: "Cô Nguyễn Thị Mai",
      createdAt: "2026-07-08T06:55:00.000Z"
    },
    {
      id: "g3",
      title: "Thẻ Ghi Nhớ Địa Lý Châu Á",
      type: "flashcard",
      subject: "Địa lý",
      grade: "Lớp 5",
      description: "Thẻ ghi nhớ giúp nhớ nhanh thủ đô các quốc gia châu Á.",
      content: {
        flashcards: [
          { id: "f1", front: "Thủ đô của Việt Nam là gì?", back: "Hà Nội", hint: "Thành phố nghìn năm văn hiến." },
          { id: "f2", front: "Thủ đô của Nhật Bản là gì?", back: "Tokyo", hint: "Thành phố hoa anh đào nổi tiếng." },
          { id: "f3", front: "Thủ đô của Hàn Quốc là gì?", back: "Seoul", hint: "Nằm bên dòng sông Hàn thơ mộng." },
          { id: "f4", front: "Thủ đô của Thái Lan là gì?", back: "Bangkok", hint: "Được mệnh danh là xứ sở Chùa Vàng." }
        ]
      },
      createdBy: "Cô Nguyễn Thị Mai",
      createdAt: "2026-07-08T06:55:00.000Z"
    }
  ]
};

// Initialize Firebase Firestore
import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  query, 
  where, 
  deleteDoc 
} from "firebase/firestore";

let dbInstance: any = null;
const firebaseConfigPath = path.join(process.cwd(), "firebase-applet-config.json");

if (fs.existsSync(firebaseConfigPath)) {
  try {
    const firebaseConfig = JSON.parse(fs.readFileSync(firebaseConfigPath, "utf8"));
    const firebaseApp = initializeApp(firebaseConfig);
    dbInstance = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId || "(default)");
    console.log("Khởi tạo thành công Firestore trên Server-side!");
  } catch (err) {
    console.error("Lỗi khởi tạo Firebase trên server:", err);
  }
} else {
  console.log("CẢNH BÁO: Không tìm thấy file firebase-applet-config.json. Sử dụng local db làm fallback.");
}

// Fallback Helper read/write DB if Firebase is not active
function readDb(): DbState {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(defaultDb, null, 2), "utf8");
      return defaultDb;
    }
    const data = fs.readFileSync(DB_FILE, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Lỗi đọc database file:", err);
    return defaultDb;
  }
}

function writeDb(data: DbState) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.error("Lỗi ghi database file:", err);
  }
}

// Seed default data to Firestore if empty
async function seedDefaultData() {
  if (!dbInstance) return;
  try {
    // Seed default user
    const userRef = doc(dbInstance, "users", "u1");
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      await setDoc(userRef, {
        id: "u1",
        email: "co_mai@gvedm.edu.vn",
        username: "co_mai",
        fullName: "Cô Nguyễn Thị Mai",
        name: "Cô Nguyễn Thị Mai",
        password: "123",
        role: "teacher"
      });
      console.log("Đã seed tài khoản giáo viên mặc định lên Firestore.");
    }

    // Seed default classes
    const classesCollection = collection(dbInstance, "classes");
    const classesSnap = await getDocs(classesCollection);
    if (classesSnap.empty) {
      await setDoc(doc(dbInstance, "classes", "c1"), {
        id: "c1",
        name: "Lớp 5A - Toán Học",
        grade: "Lớp 5",
        subject: "Toán",
        description: "Lớp học toán sáng tạo và đổi mới phương pháp tư duy toán học.",
        studentCount: 32,
        code: "MATH5A",
        teacherId: "u1"
      });
      await setDoc(doc(dbInstance, "classes", "c2"), {
        id: "c2",
        name: "Lớp 4B - Khoa Học & Đời Sống",
        grade: "Lớp 4",
        subject: "Khoa học",
        description: "Thế giới tự nhiên kỳ thú, thực hành khoa học vui nhộn.",
        studentCount: 28,
        code: "SCI4B",
        teacherId: "u1"
      });
      console.log("Đã seed các lớp học mặc định lên Firestore.");
    }

    // Seed default games
    const gamesCollection = collection(dbInstance, "games");
    const gamesSnap = await getDocs(gamesCollection);
    if (gamesSnap.empty) {
      for (const game of defaultDb.games) {
        await setDoc(doc(dbInstance, "games", game.id), game);
      }
      console.log("Đã seed các game mặc định lên Firestore.");
    }
  } catch (err) {
    console.error("Lỗi seeding default data lên Firestore:", err);
  }
}

// Execute seeding
if (dbInstance) {
  seedDefaultData();
} else {
  readDb();
}

// Express config
app.use(express.json({ limit: "10mb" }));

// Initialize Gemini Client
const geminiApiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (geminiApiKey && geminiApiKey !== "MY_GEMINI_API_KEY") {
  ai = new GoogleGenAI({
    apiKey: geminiApiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
  console.log("Khởi tạo thành công Gemini Client với API key!");
} else {
  console.log("CẢNH BÁO: Không có GEMINI_API_KEY hợp lệ. Các chức năng AI sẽ giả lập.");
}

// REST API Endpoints

// AUTHENTICATION
app.post("/api/auth/register", async (req, res) => {
  const { email, username, fullName, password, role } = req.body;
  if (!email || !username || !fullName || !password) {
    return res.status(400).json({ error: "Vui lòng nhập đầy đủ các thông tin: Email, Tên đăng nhập, Họ tên và Mật khẩu!" });
  }

  // Simple email format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Địa chỉ email không hợp lệ!" });
  }

  const userId = "u_" + Date.now();
  const newUser = {
    id: userId,
    email: email.toLowerCase(),
    username: username,
    fullName,
    name: fullName,
    password,
    role: role || "teacher",
  };

  if (dbInstance) {
    try {
      const usersRef = collection(dbInstance, "users");
      
      // Check existing email
      const qEmail = query(usersRef, where("email", "==", email.toLowerCase()));
      const snapEmail = await getDocs(qEmail);
      if (!snapEmail.empty) {
        return res.status(400).json({ error: "Địa chỉ email này đã được sử dụng!" });
      }

      // Check existing username
      const qUser = query(usersRef, where("username", "==", username.toLowerCase()));
      const snapUser = await getDocs(qUser);
      if (!snapUser.empty) {
        return res.status(400).json({ error: "Tên đăng nhập đã tồn tại!" });
      }

      await setDoc(doc(dbInstance, "users", userId), newUser);
    } catch (err) {
      console.error("Lỗi đăng ký Firestore:", err);
      return res.status(500).json({ error: "Lỗi kết nối cơ sở dữ liệu đám mây!" });
    }
  } else {
    // Fallback to local db
    const db = readDb();
    const existingEmail = db.users.find((u) => u.email && u.email.toLowerCase() === email.toLowerCase());
    if (existingEmail) {
      return res.status(400).json({ error: "Địa chỉ email này đã được sử dụng!" });
    }
    const existingUser = db.users.find((u) => u.username && u.username.toLowerCase() === username.toLowerCase());
    if (existingUser) {
      return res.status(400).json({ error: "Tên đăng nhập đã tồn tại!" });
    }
    db.users.push(newUser);
    writeDb(db);
  }

  res.status(201).json({
    id: newUser.id,
    email: newUser.email,
    username: newUser.username,
    fullName: newUser.fullName,
    role: newUser.role,
  });
});

app.post("/api/auth/login", async (req, res) => {
  const { emailOrUsername, username, password } = req.body;
  const loginField = emailOrUsername || username;
  
  if (!loginField || !password) {
    return res.status(400).json({ error: "Vui lòng nhập Email hoặc Tên đăng nhập cùng Mật khẩu!" });
  }

  let user: any = null;

  if (dbInstance) {
    try {
      const usersRef = collection(dbInstance, "users");
      // Search by email
      const qEmail = query(usersRef, where("email", "==", loginField.toLowerCase()));
      const snapEmail = await getDocs(qEmail);
      if (!snapEmail.empty) {
        user = snapEmail.docs[0].data();
      } else {
        // Search by username
        const qUser = query(usersRef, where("username", "==", loginField.toLowerCase()));
        const snapUser = await getDocs(qUser);
        if (!snapUser.empty) {
          user = snapUser.docs[0].data();
        }
      }
    } catch (err) {
      console.error("Lỗi đăng nhập Firestore:", err);
      return res.status(500).json({ error: "Lỗi kết nối cơ sở dữ liệu đám mây!" });
    }
  } else {
    // Fallback to local
    const db = readDb();
    user = db.users.find((u) => {
      const isMatchField = (u.username && u.username.toLowerCase() === loginField.toLowerCase()) || 
                           (u.email && u.email.toLowerCase() === loginField.toLowerCase());
      return isMatchField;
    });
  }

  if (!user || user.password !== password) {
    return res.status(401).json({ error: "Email/Tên đăng nhập hoặc Mật khẩu không chính xác!" });
  }

  res.json({
    id: user.id,
    email: user.email || `${user.username}@gvedm.edu.vn`,
    username: user.username,
    fullName: user.fullName || user.name || "Người dùng",
    role: user.role,
  });
});

// CLASSROOM MANAGEMENT
app.get("/api/classes", async (req, res) => {
  if (dbInstance) {
    try {
      const snap = await getDocs(collection(dbInstance, "classes"));
      const list = snap.docs.map(doc => doc.data());
      return res.json(list);
    } catch (err) {
      console.error("Lỗi tải lớp học từ Firestore:", err);
    }
  }
  const db = readDb();
  res.json(db.classrooms);
});

app.post("/api/classes", async (req, res) => {
  const { name, grade, description, subject, teacherId } = req.body;
  if (!name) {
    return res.status(400).json({ error: "Thiếu tên lớp học!" });
  }

  const code = Math.random().toString(36).substring(2, 8).toUpperCase();
  const classId = "c_" + Date.now();
  const newClass = {
    id: classId,
    name,
    grade: grade || "Mọi khối lớp",
    subject: subject || "Chung",
    description: description || "",
    studentCount: 0,
    code,
    teacherId: teacherId || "u1"
  };

  if (dbInstance) {
    try {
      await setDoc(doc(dbInstance, "classes", classId), newClass);
    } catch (err) {
      console.error("Lỗi tạo lớp học trên Firestore:", err);
      return res.status(500).json({ error: "Lỗi lưu lớp học!" });
    }
  } else {
    const db = readDb();
    db.classrooms.push(newClass);
    writeDb(db);
  }

  res.status(201).json(newClass);
});

app.delete("/api/classes/:id", async (req, res) => {
  const { id } = req.params;

  if (dbInstance) {
    try {
      await deleteDoc(doc(dbInstance, "classes", id));
      return res.json({ success: true });
    } catch (err) {
      console.error("Lỗi xóa lớp học trên Firestore:", err);
      return res.status(500).json({ error: "Lỗi xóa lớp học!" });
    }
  } else {
    const db = readDb();
    const index = db.classrooms.findIndex((c) => c.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Không tìm thấy lớp học!" });
    }
    db.classrooms.splice(index, 1);
    writeDb(db);
    res.json({ success: true });
  }
});

// GAME MANAGEMENT
app.get("/api/games", async (req, res) => {
  if (dbInstance) {
    try {
      const snap = await getDocs(collection(dbInstance, "games"));
      const list = snap.docs.map(doc => doc.data());
      return res.json(list);
    } catch (err) {
      console.error("Lỗi lấy danh sách game từ Firestore:", err);
    }
  }
  const db = readDb();
  res.json(db.games);
});

app.post("/api/games", async (req, res) => {
  const { title, type, subject, grade, description, content, createdBy } = req.body;
  if (!title || !type || !content) {
    return res.status(400).json({ error: "Thiếu thông tin trò chơi học tập!" });
  }

  const gameId = "g_" + Date.now();
  const newGame = {
    id: gameId,
    title,
    type,
    subject: subject || "Chung",
    grade: grade || "Mọi khối lớp",
    description: description || "",
    content,
    createdBy: createdBy || "Giáo viên",
    createdAt: new Date().toISOString(),
  };

  if (dbInstance) {
    try {
      await setDoc(doc(dbInstance, "games", gameId), newGame);
    } catch (err) {
      console.error("Lỗi tạo game trên Firestore:", err);
      return res.status(500).json({ error: "Lỗi lưu trò chơi!" });
    }
  } else {
    const db = readDb();
    db.games.push(newGame);
    writeDb(db);
  }

  res.status(201).json(newGame);
});

app.delete("/api/games/:id", async (req, res) => {
  const { id } = req.params;

  if (dbInstance) {
    try {
      await deleteDoc(doc(dbInstance, "games", id));
      return res.json({ success: true });
    } catch (err) {
      console.error("Lỗi xóa game trên Firestore:", err);
      return res.status(500).json({ error: "Lỗi xóa trò chơi!" });
    }
  } else {
    const db = readDb();
    const index = db.games.findIndex((g) => g.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Không tìm thấy trò chơi học tập!" });
    }
    db.games.splice(index, 1);
    writeDb(db);
    res.json({ success: true });
  }
});

// GAME SESSIONS / RESULTS PERSISTENCE
app.post("/api/game_sessions", async (req, res) => {
  const { gameType, classId, quizId, results } = req.body;
  const sessionId = "s_" + Date.now();
  
  const newSession = {
    id: sessionId,
    gameType: gameType || "unknown",
    classId: classId || "",
    quizId: quizId || "",
    results: results || {},
    createdAt: new Date().toISOString()
  };

  if (dbInstance) {
    try {
      await setDoc(doc(dbInstance, "game_sessions", sessionId), newSession);
    } catch (err) {
      console.error("Lỗi tạo game session trên Firestore:", err);
      return res.status(500).json({ error: "Lỗi lưu phiên chơi game!" });
    }
  } else {
    // Keep local backup in db.json if needed
    const db = readDb();
    if (!db.hasOwnProperty("game_sessions")) {
      (db as any).game_sessions = [];
    }
    (db as any).game_sessions.push(newSession);
    writeDb(db);
  }

  res.status(201).json(newSession);
});

app.get("/api/game_sessions", async (req, res) => {
  if (dbInstance) {
    try {
      const snap = await getDocs(collection(dbInstance, "game_sessions"));
      const list = snap.docs.map(doc => doc.data());
      // Sort by createdAt descending
      list.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      return res.json(list);
    } catch (err) {
      console.error("Lỗi lấy game_sessions từ Firestore:", err);
    }
  }
  const db = readDb();
  const sessions = (db as any).game_sessions || [];
  sessions.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  res.json(sessions);
});


// AI GAME & LESSON GENERATION VIA GEMINI
app.post("/api/gemini/generate", async (req, res) => {
  const { prompt, type, subject, grade } = req.body;
  if (!prompt || !type) {
    return res.status(400).json({ error: "Yêu cầu cung cấp prompt và loại tài nguyên cần tạo!" });
  }

  console.log(`Bắt đầu tạo tài nguyên học tập bằng AI: loại ${type}, môn ${subject}, lớp ${grade}. Prompt: ${prompt}`);

  // Fallback if Gemini key is missing
  if (!ai) {
    console.log("Không có Gemini client. Sử dụng thuật toán tạo mẫu tự động.");
    const simulatedResponse = simulateGameContent(type, prompt, subject, grade);
    return res.json(simulatedResponse);
  }

  try {
    // Standard response schema based on type of game requested
    let responseSchema: any = {};

    if (type === "quiz" || type === "keoco") {
      responseSchema = {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "Tiêu đề trò chơi trắc nghiệm" },
          description: { type: Type.STRING, description: "Mô tả ngắn gọn về bài trắc nghiệm" },
          questions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING, description: "Nội dung câu hỏi trắc nghiệm" },
                options: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Chính xác 4 lựa chọn trả lời"
                },
                correctAnswer: { type: Type.INTEGER, description: "Chỉ mục (0-3) của đáp án đúng trong mảng options" },
                explanation: { type: Type.STRING, description: "Giải thích chi tiết vì sao đáp án đó đúng" }
              },
              required: ["question", "options", "correctAnswer"]
            }
          }
        },
        required: ["title", "description", "questions"]
      };
    } else if (type === "flashcard") {
      responseSchema = {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "Tiêu đề bộ thẻ ghi nhớ" },
          description: { type: Type.STRING, description: "Mô tả ngắn gọn" },
          flashcards: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                front: { type: Type.STRING, description: "Mặt trước thẻ (Câu hỏi, thuật ngữ hoặc khái niệm)" },
                back: { type: Type.STRING, description: "Mặt sau thẻ (Câu trả lời, định nghĩa hoặc giải nghĩa)" },
                hint: { type: Type.STRING, description: "Gợi ý nhỏ giúp học sinh dễ liên tưởng" }
              },
              required: ["front", "back"]
            }
          }
        },
        required: ["title", "description", "flashcards"]
      };
    } else if (type === "memory") {
      responseSchema = {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "Tiêu đề trò chơi lật hình trí nhớ" },
          description: { type: Type.STRING, description: "Mô tả trò chơi" },
          memoryItems: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                term: { type: Type.STRING, description: "Từ khóa hoặc Khái niệm chính (Ngắn gọn)" },
                definition: { type: Type.STRING, description: "Định nghĩa, ví dụ hoặc hình ảnh miêu tả phù hợp để ghép đôi" }
              },
              required: ["term", "definition"]
            }
          }
        },
        required: ["title", "description", "memoryItems"]
      };
    } else {
      // Lucky wheel or other lists
      responseSchema = {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "Tiêu đề vòng quay kỳ diệu" },
          description: { type: Type.STRING, description: "Mô tả" },
          wheelItems: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                text: { type: Type.STRING, description: "Nhãn hiển thị trên vòng quay" },
                color: { type: Type.STRING, description: "Mã màu Hex đẹp phù hợp như #EF4444, #F59E0B, #10B981, #3B82F6..." }
              },
              required: ["text", "color"]
            }
          }
        },
        required: ["title", "description", "wheelItems"]
      };
    }

    const systemInstruction = `Bạn là một chuyên gia thiết kế bài giảng đổi mới sáng tạo, chuyển đổi số giáo dục xuất sắc tại Việt Nam.
Hãy giúp giáo viên tạo ra nội dung học tập tương tác hấp dẫn dưới dạng trò chơi.
Nội dung phải chính xác 100% về mặt kiến thức sư phạm, phù hợp với chương trình giáo dục phổ thông mới của Bộ Giáo dục Việt Nam.
Ngôn ngữ sử dụng: TIẾNG VIỆT HOÀN TOÀN. 
Yêu cầu tạo loại trò chơi học tập: '${type}' cho Môn: ${subject || "Tự chọn"}, Lớp: ${grade || "Mọi lớp"}.
Hãy tạo tối thiểu 5 câu hỏi/thẻ/mục chất lượng cao và sáng tạo nhất dựa trên yêu cầu từ giáo viên.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Hãy tạo một trò chơi mang tính giáo dục sáng tạo dựa trên đề xuất này: "${prompt}"`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.8
      }
    });

    const text = response.text;
    if (text) {
      const parsedData = JSON.parse(text.trim());
      res.json(parsedData);
    } else {
      throw new Error("Không nhận được phản hồi từ mô hình AI.");
    }
  } catch (err: any) {
    console.error("Lỗi khi kết nối hoặc xử lý Gemini API:", err);
    // On error, return beautifully structured simulated content based on prompt
    const simulatedResponse = simulateGameContent(type, prompt, subject, grade);
    res.json(simulatedResponse);
  }
});

// SIMULATION ENGINE FOR FALLBACK & FAST LOCAL TESTING
function simulateGameContent(type: string, prompt: string, subject?: string, grade?: string) {
  const p = prompt.toLowerCase();
  const sub = subject || "Tổng hợp";
  const gr = grade || "Khối tiểu học";

  if (type === "quiz" || type === "keoco") {
    return {
      title: type === "keoco" ? `Kéo Co: ${prompt}` : `Trắc nghiệm: ${prompt}`,
      description: type === "keoco" 
        ? `Trò chơi kéo co đối kháng sôi động môn ${sub} thuộc ${gr}. Trả lời đúng để kéo cờ về phía mình!`
        : `Trò chơi trắc nghiệm sinh động môn ${sub} thuộc ${gr}. Được tạo tự động bởi trợ lý Giáo Viên Đổi Mới.`,
      questions: [
        {
          question: `Trọng tâm kiến thức nào quan trọng nhất liên quan đến "${prompt}"?`,
          options: [
            "Khám phá sáng tạo & Phương pháp chủ động",
            "Học thuộc lòng sách giáo khoa truyền thống",
            "Chép bài đầy đủ và làm bài tập rập khuôn",
            "Học tủ để thi cử điểm cao"
          ],
          correctAnswer: 0,
          explanation: "Đổi mới giáo dục nhấn mạnh phát triển phẩm chất, năng lực của người học thông qua các phương pháp dạy học tích cực, trải nghiệm và sáng tạo."
        },
        {
          question: "Phương pháp giáo dục STEM/STEAM hướng tới điều gì?",
          options: [
            "Học lý thuyết khoa học tách biệt thực tế",
            "Tích hợp Khoa học, Công nghệ, Kỹ thuật, Nghệ thuật và Toán học qua dự án thực tế",
            "Chỉ dành riêng cho học sinh giỏi tin học",
            "Giảm thời lượng tự học của học sinh"
          ],
          correctAnswer: 1,
          explanation: "STEAM giúp học sinh kết nối lý thuyết với giải quyết vấn đề thực tế, khuyến khích tư duy đa chiều và khả năng làm việc nhóm."
        },
        {
          question: "Cách tốt nhất để khuyến khích học sinh thảo luận sôi nổi trong lớp?",
          options: [
            "Gọi tên học sinh ngẫu nhiên và chấm điểm gắt gao",
            "Sử dụng các trò chơi khởi động và câu hỏi mở kích thích tư duy",
            "Yêu cầu cả lớp im lặng tuyệt đối trước khi phát biểu",
            "Đọc bài giải mẫu cho học sinh chép"
          ],
          correctAnswer: 1,
          explanation: "Trò chơi học tập và các câu hỏi mở phá vỡ khoảng cách, tạo không khí lớp học thân thiện và khuyến khích học sinh chủ động chia sẻ ý kiến."
        },
        {
          question: "Trong dạy học phát triển năng lực, vai trò của người giáo viên là gì?",
          options: [
            "Người truyền thụ kiến thức độc quyền duy nhất",
            "Người thiết kế, tổ chức, gợi mở và hỗ trợ hoạt động học tập",
            "Người kiểm soát kỷ luật lớp nghiêm khắc",
            "Người làm thay bài tập cho học sinh"
          ],
          correctAnswer: 1,
          explanation: "Giáo viên chuyển từ 'truyền thụ một chiều' sang vai trò huấn luyện viên, tạo môi trường để học sinh tự kiến tạo tri thức."
        },
        {
          question: "Công cụ đánh giá quá trình (Formative Assessment) có mục tiêu gì?",
          options: [
            "Xếp loại học lực học sinh cuối kỳ",
            "Đo lường sự tiến bộ hàng ngày để kịp thời điều chỉnh cách dạy và học",
            "Trừng phạt những học sinh lười học",
            "So sánh điểm số giữa các trường học"
          ],
          correctAnswer: 1,
          explanation: "Đánh giá quá trình giúp giáo viên biết học sinh đang gặp khó khăn ở đâu để hỗ trợ ngay lập tức, tối ưu hóa sự tiến bộ cá nhân."
        }
      ]
    };
  } else if (type === "flashcard") {
    return {
      title: `Thẻ ghi nhớ: ${prompt}`,
      description: `Bộ thẻ học nhanh chủ đề ${prompt} - Môn ${sub}.`,
      flashcards: [
        {
          front: "Phương pháp dạy học tích cực là gì?",
          back: "Là phương pháp giáo dục hướng tới hoạt động hóa, tích cực hóa hoạt động nhận thức của học sinh.",
          hint: "Đặt học sinh làm trung tâm của mọi bài học."
        },
        {
          front: "Kỹ năng thế kỷ 21 cốt lõi gồm những gì? (Mô hình 4Cs)",
          back: "Critical Thinking (Tư duy phản biện), Communication (Giao tiếp), Collaboration (Hợp tác), và Creativity (Sáng tạo).",
          hint: "Bốn chữ C thần thánh trong giáo dục hiện đại."
        },
        {
          front: "Flipped Classroom (Lớp học đảo ngược)",
          back: "Học sinh tự nghiên cứu bài giảng lý thuyết trước ở nhà qua video, thời gian lên lớp dùng để thảo luận và thực hành.",
          hint: "Đảo ngược quy trình truyền thống: Học ở nhà, làm bài ở lớp."
        },
        {
          front: "Trò chơi hóa (Gamification) trong dạy học",
          back: "Ứng dụng các yếu tố của trò chơi (điểm số, huy hiệu, bảng xếp hạng, thử thách) vào môi trường lớp học học tập thực tế.",
          hint: "Làm cho việc học trở nên lôi cuốn và phấn khích như chơi game."
        },
        {
          front: "Học tập dựa trên dự án (Project-Based Learning - PBL)",
          back: "Học sinh chủ động tìm hiểu một chủ đề sâu sắc bằng cách giải quyết một thử thách dài ngày và tạo ra sản phẩm thực tế.",
          hint: "Học qua hành động và sản phẩm có thật ngoài đời."
        }
      ]
    };
  } else if (type === "memory") {
    return {
      title: `Ghép cặp trí nhớ: ${prompt}`,
      description: `Ghép cặp thuật ngữ và định nghĩa chủ đề ${prompt}.`,
      memoryItems: [
        { term: "STEAM", definition: "Tích hợp Khoa học, Công nghệ, Kỹ thuật, Nghệ thuật, Toán học." },
        { term: "Kahoot / Quizizz", definition: "Công cụ trò chơi trắc nghiệm tương tác trực tuyến hấp dẫn." },
        { term: "Rubric", definition: "Bảng tiêu chí đánh giá kết quả học tập rõ ràng, khách quan." },
        { term: "Mindmap", definition: "Bản đồ tư duy giúp liên kết các ý tưởng trực quan bằng màu sắc." },
        { term: "Icebreaker", definition: "Trò chơi phá băng ngắn để tạo năng lượng tích cực đầu buổi học." },
        { term: "Padlet", definition: "Bảng trắng kỹ thuật số để học sinh cùng dán ý kiến đóng góp lên màn hình chung." }
      ]
    };
  } else {
    return {
      title: `Vòng quay: ${prompt}`,
      description: `Vòng quay may mắn đổi mới chủ đề ${prompt}.`,
      wheelItems: [
        { text: "Khám phá di sản", color: "#EF4444" },
        { text: "Thảo luận nhóm", color: "#F59E0B" },
        { text: "Thực hành STEAM", color: "#10B981" },
        { text: "Hùng biện 2 phút", color: "#3B82F6" },
        { text: "Giải câu đố vui", color: "#8B5CF6" },
        { text: "Trình diễn ý tưởng", color: "#EC4899" }
      ]
    };
  }
}

// SETUP VITE DEVELOPMENT MIDDLEWARE OR SERVER STATIC FILES IN PRODUCTION
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  if (!process.env.VERCEL) {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`[Giáo Viên Đổi Mới Server] Đang chạy tại http://localhost:${PORT}`);
    });
  }
}

if (!process.env.VERCEL) {
  startServer();
}

export default app;
