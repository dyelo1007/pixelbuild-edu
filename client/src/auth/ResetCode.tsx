import API from "@/utils/api";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { AxiosError } from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useRef, useEffect } from "react";
import AuthLayout from "../components/auth/AuthLayout";
import toast from "react-hot-toast";

const schema = yup.object().shape({
  code: yup
    .string()
    .length(6, "Code must be 6 digits")
    .required("Code is required"),
});

type ResetCodeFormData = yup.InferType<typeof schema>;

const ResetCode = () => {
  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ResetCodeFormData>({ resolver: yupResolver(schema) });

  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (!email) {
      toast.error("Missing email. Please start the process again.");
      navigate("/forgot-password");
    }
  }, [email, navigate]);

  const onSubmit = async (data: ResetCodeFormData) => {
    try {
      await API.post("/auth/verify-reset-code", {
        email,
        code: data.code,
      });

      toast.success("Code verified successfully!");
      navigate("/reset-password", { state: { email, code: data.code } });
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      toast.error(error.response?.data?.message || "Invalid or expired code.");
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const value = e.target.value;
    if (!/^[0-9]?$/.test(value)) return;

    if (inputsRef.current[idx]) {
      inputsRef.current[idx]!.value = value;
    }

    if (value && idx < inputsRef.current.length - 1) {
      inputsRef.current[idx + 1]?.focus();
    }

    const code = inputsRef.current.map((input) => input?.value).join("");
    setValue("code", code, { shouldValidate: true });
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").trim().slice(0, 6);
    if (!/^\d{1,6}$/.test(paste)) return;

    paste.split("").forEach((char, idx) => {
      if (inputsRef.current[idx]) {
        inputsRef.current[idx]!.value = char;
      }
    });

    setValue("code", paste, { shouldValidate: true });
    inputsRef.current[Math.min(paste.length, 5)]?.focus();
  };

  const handleResend = async () => {
    try {
      setResending(true);
      await API.post("/auth/resend-reset-code", { email });
      toast.success("A new reset code was sent.");
    } catch {
      toast.error("Failed to resend reset code.");
    } finally {
      setResending(false);
    }
  };
  return (
    <AuthLayout
      title="Enter Reset Code"
      subtitle="Check your email for the 6-digit code"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex justify-between gap-2" onPaste={handlePaste}>
          {[...Array(6)].map((_, idx) => (
            <input
              key={idx}
              type="text"
              maxLength={1}
              onChange={(e) => handleInput(e, idx)}
              // ✅ FIX: Use curly braces {} to ensure the function returns void
              ref={(el) => {
                inputsRef.current[idx] = el;
              }}
              className="w-10 h-12 text-center text-neonblue dark:text-white text-xl bg-transparent border-2 border-neonblue rounded focus:outline-none focus:ring-2 focus:ring-primary"
            />
          ))}
        </div>
        {errors.code && (
          <p className="text-red-500 text-center text-sm">
            {errors.code.message}
          </p>
        )}
        <button
          type="submit"
          className="w-full bg-neonblue text-white py-2 rounded"
        >
          Verify Code
        </button>

        <button
          type="button"
          onClick={handleResend}
          disabled={resending}
          className="mt-1 w-full text-sm text-neonblue hover:underline text-center disabled:opacity-50"
        >
          {resending ? "Resending..." : "Resend Code"}
        </button>
      </form>
    </AuthLayout>
  );
};

export default ResetCode;
