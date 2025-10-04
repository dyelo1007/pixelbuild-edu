import API from "@/utils/api";
import type { IPuzzle, PuzzlePayload } from "@/types/puzzle.types";

// --- Student Function ---
// Fetches all puzzles that are visible and not yet attempted
export const fetchVisiblePuzzles = async (): Promise<IPuzzle[]> => {
  const response = await API.get("/puzzles");
  return response.data;
};

// Submits an attempt for a single puzzle
export const submitPuzzleAttempt = async (
  puzzleId: string,
  build: Record<string, string>
) => {
  const response = await API.post("/puzzles/submit", { puzzleId, build });
  return response.data;
};

// --- Admin Functions ---
// Fetches all puzzles for the admin management list
export const fetchAllPuzzlesForAdmin = async (): Promise<IPuzzle[]> => {
  const response = await API.get("/puzzles/admin/all");
  return response.data;
};

// Fetches one puzzle with all details (for editing)
export const fetchPuzzleById = async (id: string): Promise<IPuzzle> => {
  const response = await API.get(`/puzzles/${id}`);
  return response.data;
};

// Creates a new puzzle
export const createPuzzle = async (
  puzzleData: PuzzlePayload
): Promise<IPuzzle> => {
  const response = await API.post("/puzzles", puzzleData);
  return response.data;
};

// Updates an existing puzzle
export const updatePuzzle = async (
  id: string,
  puzzleData: PuzzlePayload
): Promise<IPuzzle> => {
  const response = await API.put(`/puzzles/${id}`, puzzleData);
  return response.data;
};

// Deletes a puzzle
export const deletePuzzle = async (
  id: string
): Promise<{ message: string }> => {
  const response = await API.delete(`/puzzles/${id}`);
  return response.data;
};

// Fetches the results for a specific puzzle
export const fetchPuzzleResults = async (id: string) => {
  const response = await API.get(`/puzzles/${id}/results`);
  return response.data;
};
