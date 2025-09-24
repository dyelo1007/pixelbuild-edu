// src/types/quiz.types.ts

// The structure of a single question
export interface IQuestion {
  question: string;
  options: string[];
  answer: string;
}

// The main quiz structure, matching your Mongoose model
export interface IQuiz {
  _id: string; // The database ID
  title: string;
  questions: IQuestion[];
  visible: boolean;
}

// The structure for the admin results view
export interface IQuizResult {
  student: {
    _id: string;
    name: string;
    email: string;
  };
  taken: boolean;
  score: number | null;
  submittedAt: string | null;
}
export type NewQuizPayload = Omit<IQuiz, "_id">;
