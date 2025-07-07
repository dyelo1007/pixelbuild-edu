import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import { useAuth } from "./AuthContext";

const Register = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await API.post("/auth/register", form);
      // Optional: auto-login after register
      const loginRes = await API.post("/auth/login", {
        email: form.email,
        password: form.password,
      });
      login(loginRes.data.token, loginRes.data.user);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-24">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          required
          onChange={handleChange}
          className="border p-2"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          required
          onChange={handleChange}
          className="border p-2"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          required
          onChange={handleChange}
          className="border p-2"
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          required
          onChange={handleChange}
          className="border p-2"
        />
        <button type="submit" className="bg-green-600 text-white py-2 rounded">
          Register
        </button>
      </form>
      <p className="mt-4 text-sm">
        Already have an account?{" "}
        <a href="/login" className="text-blue-600">
          Login
        </a>
      </p>
    </div>
  );
};

export default Register;
