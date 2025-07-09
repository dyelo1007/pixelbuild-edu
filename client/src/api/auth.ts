import API from "../utils/api";

export const login = (data: { email: string; password: string }) =>
  API.post("/auth/login", data);

export const register = (data: {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}) => API.post("/auth/register", data);
