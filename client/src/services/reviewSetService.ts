import API from "@/utils/api";
import type { IReviewSet } from "@/types/review.types";

export type ReviewSetPayload = Omit<
  IReviewSet,
  "_id" | "studentId" | "createdAt" | "updatedAt"
>;

// Fetches all sets for the current logged-in student
export const fetchMyReviewSets = async (): Promise<IReviewSet[]> => {
  const response = await API.get("/review-sets");
  return response.data;
};

// Fetches a single review set by its ID
export const fetchReviewSetById = async (id: string): Promise<IReviewSet> => {
  const response = await API.get(`/review-sets/${id}`);
  return response.data;
};

// Creates a new review set
export const createReviewSet = async (
  setData: ReviewSetPayload
): Promise<IReviewSet> => {
  const response = await API.post("/review-sets", setData);
  return response.data;
};

// Updates an existing review
export const updateReviewSet = async (
  id: string,
  setData: ReviewSetPayload
): Promise<IReviewSet> => {
  const response = await API.put(`/review-sets/${id}`, setData);
  return response.data;
};

// Deletes a review
export const deleteReviewSet = async (
  id: string
): Promise<{ message: string }> => {
  const response = await API.delete(`/review-sets/${id}`);
  return response.data;
};
