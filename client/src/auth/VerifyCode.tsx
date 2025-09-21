import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";

type FormData = {
  email: string;
  code: string;
};

const VerifyCode = () => {
  const { register, handleSubmit, setValue } = useForm<FormData>();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resending, setResending] = useState(false);

  const email = location.state?.email || "";
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!email) {
      navigate("/login", {
        state: { error: "Verification email missing. Please login again." },
      });
    }
  }, [email, navigate]);

  const onSubmit = async (data: FormData) => {
    try {
      const code = inputsRef.current.map((input) => input?.value).join("");
      const res = await axios.post(
        "http://localhost:5000/api/auth/verify-code",
        {
          email,
          code,
        }
      );

      toast.success(res.data.message);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Verification failed");
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const value = e.target.value;
    if (!/^[0-9]?$/.test(value)) return;

    inputsRef.current[idx]!.value = value;

    if (value && idx < inputsRef.current.length - 1) {
      inputsRef.current[idx + 1]?.focus();
    }

    const code = inputsRef.current.map((input) => input?.value).join("");
    setValue("code", code);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const paste = e.clipboardData.getData("text").trim().slice(0, 6);
    if (!/^\d+$/.test(paste)) return;

    paste.split("").forEach((char, idx) => {
      if (inputsRef.current[idx]) {
        inputsRef.current[idx]!.value = char;
      }
    });

    const newCode = paste.slice(0, 6);
    setValue("code", newCode);
    inputsRef.current[Math.min(paste.length, 5)]?.focus();
  };

  const resendCode = async () => {
    try {
      setResending(true);
      await axios.post("http://localhost:5000/api/auth/resend-code", { email });
      toast.success("A new verification code was sent.");
    } catch {
      toast.error("Failed to resend code.");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-lightbgfill dark:bg-darkbg bg-[url('/assets/hex-pattern.svg')] bg-cover bg-center rounded-2xl">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="border-2 border-neonblue rounded-xl px-10 py-8 w-full max-w-md backdrop-blur-md bg-lightbgfill dark:bg-darkbg/70 shadow-md"
      >
        <input type="hidden" value={email} {...register("email")} />
        <input type="hidden" {...register("code")} />

        <div className="flex justify-center mb-4">
          <img src="/logo.svg" alt="logo" className="w-10 h-10" />
        </div>

        <h2 className="dark:text-white text-neonblue text-2xl font-bold text-center">
          Verify Your Email
        </h2>
        <p className="dark:text-gray-300 text-neonblue/70 text-center mb-6">
          Enter the 6-digit code
        </p>

        {error && (
          <p className="text-red-500 text-center text-sm mb-2">{error}</p>
        )}
        {success && (
          <p className="text-green-500 text-center text-sm mb-2">{success}</p>
        )}

        <div className="flex justify-between gap-2 mb-6" onPaste={handlePaste}>
          {[...Array(6)].map((_, idx) => (
            <input
              key={idx}
              type="text"
              maxLength={1}
              onChange={(e) => handleInput(e, idx)}
              ref={(el) => (inputsRef.current[idx] = el)}
              className="w-10 h-12 text-center text-neonblue dark:text-white text-xl bg-transparent border-2 border-neonblue rounded focus:outline-none focus:ring-2 focus:ring-primary"
            />
          ))}
        </div>

        <button
          type="submit"
          className="w-full bg-neonblue text-white py-2 rounded hover:bg-neonblue/80 transition"
        >
          Verify
        </button>

        <button
          type="button"
          onClick={resendCode}
          disabled={resending}
          className="mt-4 w-full text-sm text-neonblue hover:underline text-center"
        >
          {resending ? "Resending..." : "Resend Code"}
        </button>
      </form>
    </div>
  );
};

export default VerifyCode;
