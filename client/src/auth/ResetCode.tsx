import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import AuthLayout from "../components/auth/AuthLayout";
import toast from "react-hot-toast";

const ResetCode = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const [error, setError] = useState("");
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (!email) {
      toast.error("Missing email. Please request a reset again.");
      navigate("/forgot-password");
    }
  }, [email, navigate]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const value = e.target.value;
    if (!/^[0-9]?$/.test(value)) return;
    inputsRef.current[idx]!.value = value;
    if (value && idx < 5) inputsRef.current[idx + 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    const paste = e.clipboardData.getData("text").trim().slice(0, 6);
    if (!/^\d+$/.test(paste)) return;

    paste.split("").forEach((char, idx) => {
      if (inputsRef.current[idx]) {
        inputsRef.current[idx]!.value = char;
      }
    });
  };

  const handleSubmit = async () => {
    const code = inputsRef.current.map((input) => input?.value).join("");
    if (code.length !== 6)
      return toast.error("Please enter a valid 6-digit code.");

    try {
      await axios.post("http://localhost:5000/api/auth/verify-reset-code", {
        email,
        code,
      });
      toast.success("Code verified! Redirecting...");
      navigate("/reset-password", { state: { email, code } });
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Code verification failed");
    }
  };

  const handleResend = async () => {
    try {
      setResending(true);
      await axios.post("http://localhost:5000/api/auth/forgot-password", {
        email,
      });
      toast.success("A new reset code was sent to your email.");
    } catch (err: any) {
      toast.error("Failed to resend reset code.");
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthLayout
      title="Enter Reset Code"
      subtitle="We sent a 6-digit code to your email"
    >
      {error && <p className="text-red-500 text-center">{error}</p>}
      <div className="flex gap-2 justify-center mb-4" onPaste={handlePaste}>
        {[...Array(6)].map((_, idx) => (
          <input
            key={idx}
            type="text"
            maxLength={1}
            ref={(el) => (inputsRef.current[idx] = el)}
            onChange={(e) => handleInput(e, idx)}
            className="w-10 h-12 text-center border border-primary text-white bg-transparent rounded"
          />
        ))}
      </div>
      <button
        onClick={handleSubmit}
        className="w-full bg-primary text-white py-2 rounded"
      >
        Verify Code
      </button>
      <button
        onClick={handleResend}
        disabled={resending}
        className="mt-3 w-full text-sm text-primary hover:underline"
      >
        {resending ? "Resending..." : "Resend Code"}
      </button>
    </AuthLayout>
  );
};

export default ResetCode;
