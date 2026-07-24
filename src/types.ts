export interface User {
  id: string;
  email: string;
  username: string;
  fullName: string;
  role: "teacher" | "student";
}

export interface Classroom {
  id: string;
  name: string;
  grade: string;
  subject?: string;
  description?: string;
  studentCount: number;
  code: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // index of options
  explanation?: string;
}

export interface WheelItem {
  id: string;
  text: string;
  color: string;
}

export interface FlashcardItem {
  id: string;
  front: string;
  back: string;
  hint?: string;
}

export interface MemoryItem {
  id: string;
  term: string;
  definition: string;
}

export interface Game {
  id: string;
  title: string;
  type: "quiz" | "wheel" | "flashcard" | "memory" | "keoco";
  subject: string;
  grade: string;
  description: string;
  content: {
    questions?: QuizQuestion[];
    wheelItems?: WheelItem[];
    flashcards?: FlashcardItem[];
    memoryItems?: MemoryItem[];
  };
  createdBy: string;
  createdAt: string;
}
