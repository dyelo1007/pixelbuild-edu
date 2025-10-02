import API from "@/utils/api";
import type { IChallenge } from "@/types/challenge.types";

// This is the payload for submitting a completed challenge
export interface ChallengeAttemptPayload {
  challengeId: string;
  scores: {
    puzzleId: string;
    score: number;
  }[];
}

export interface ChallengePayload {
  title: string;
  description: string;
  puzzles: string[];
  visible: boolean;
}

// Fetches a summary of all visible challenges
export const fetchVisibleChallenges = async (): Promise<IChallenge[]> => {
  const response = await API.get("/challenges");
  return response.data;
};

// Fetches a single challenge with its puzzles populated, and any existing attempt
export const fetchChallengeById = async (
  id: string
): Promise<{ challenge: IChallenge; attempt: any }> => {
  const response = await API.get(`/challenges/${id}`);
  return response.data;
};

// Submits the final scores for a challenge attempt
export const submitChallengeAttempt = async (
  payload: ChallengeAttemptPayload
) => {
  const response = await API.post("/challenges/submit", payload);
  return response.data;
};

// --- Admin Functions ---
// (We will add the admin-related functions here later when we build the admin UI)
export const fetchAllChallengesForAdmin = async (): Promise<IChallenge[]> => {
  const response = await API.get("/challenges/admin/all");
  return response.data;
};

export const createChallenge = async (payload: any): Promise<IChallenge> => {
  const response = await API.post("/challenges", payload);
  return response.data;
};

export const updateChallenge = async (
  id: string,
  payload: any
): Promise<IChallenge> => {
  const response = await API.put(`/challenges/${id}`, payload);
  return response.data;
};

export const deleteChallenge = async (
  id: string
): Promise<{ message: string }> => {
  const response = await API.delete(`/challenges/${id}`);
  return response.data;
};

export const fetchChallengeResults = async (id: string): Promise<any> => {
  const response = await API.get(`/challenges/${id}/results`);
  return response.data;
};
