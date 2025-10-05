import API from "@/utils/api";

// Define the structure of the stats data
export interface IAdminStats {
  totalStudents: number;
  totalQuizzes: number;
  totalChallenges: number;
}

// Define the structure of a single activity item
export interface IAdminActivity {
  _id: string;
  type: "New Student" | "New Quiz" | "New Challenge";
  title: string;
  date: string;
}

// Fetches the statistics for the admin dashboard
export const fetchAdminStats = async (): Promise<IAdminStats> => {
  const response = await API.get("/dashboard/stats");
  return response.data;
};

// Fetches the recent activity feed for the admin dashboard
export const fetchRecentActivity = async (): Promise<IAdminActivity[]> => {
  const response = await API.get("/dashboard/activity");
  return response.data;
};
