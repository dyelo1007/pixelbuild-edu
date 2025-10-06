import API from "@/utils/api";

// Define the structure of a single activity item
export interface IActivity {
  _id: string;
  type: "Quiz" | "Challenge";
  title: string;
  score: string;
  date: string; // The date will be an ISO string from the backend
}

// Fetches the 5 most recent activities for the logged-in user
export const fetchUserActivity = async (): Promise<IActivity[]> => {
  const response = await API.get("/activity");
  return response.data;
};
