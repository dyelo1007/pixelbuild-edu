// src/services/quizService.ts

import API from "@/utils/api";
import type { IQuiz, NewQuizPayload } from "../types/quiz.types"; // Import from your shared types file

export const fetchStudentQuizzes = async (): Promise<IQuiz[]> => {
  const response = await API.get("/quizzes/student");
  return Array.isArray(response.data) ? response.data : [];
};
export const createQuiz = async (quizData: NewQuizPayload): Promise<IQuiz> => {
  // POST /api/quizzes
  const response = await API.post("/quizzes", quizData);
  return response.data;
};

export const fetchQuizzes = async (): Promise<IQuiz[]> => {
  // GET /api/quizzes
  const response = await API.get("/quizzes");
  // Ensure the return is always an array to prevent crashes
  return Array.isArray(response.data) ? response.data : [];
};

export const fetchQuizById = async (id: string): Promise<IQuiz> => {
  // GET /api/quizzes/:id
  const response = await API.get(`/quizzes/${id}`);
  return response.data;
};

export const updateQuiz = async (
  id: string,
  quizData: NewQuizPayload
): Promise<IQuiz> => {
  // PUT /api/quizzes/:id
  const response = await API.put(`/quizzes/${id}`, quizData);
  return response.data;
};

export const deleteQuiz = async (id: string): Promise<{ message: string }> => {
  // DELETE /api/quizzes/:id
  const response = await API.delete(`/quizzes/${id}`);
  return response.data;
};

// It now only sends the answers. The backend will calculate the score.
export const submitQuiz = async (quizId: string, answers: string[]) => {
  // POST /api/quizzes/:quizId/submit
  const response = await API.post(`/quizzes/${quizId}/submit`, { answers });
  return response.data; // This will return the final result from the server
};

export const fetchAvailableStudentQuizzes = async (): Promise<IQuiz[]> => {
  // This re-uses the existing student endpoint for quizzes
  const response = await API.get("/quizzes/student");
  return Array.isArray(response.data) ? response.data : [];
};
