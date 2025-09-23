// src/pages/Register.tsx
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import API from "../utils/api";
import FormInput from "../components/auth/FormInput";
import AuthLayout from "../components/auth/AuthLayout";
import toast from "react-hot-toast";

const schema = yup.object().shape({
  username: yup.string().required("Username is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Must be at least 8 characters")
    .matches(/[A-Z]/, "Must contain an uppercase letter")
    .matches(/[a-z]/, "Must contain a lowercase letter")
    .matches(/[0-9]/, "Must contain a number")
    .matches(/[!@#$%^&*(),.?\":{}|<>]/, "Must contain a special character"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required"),

  secretCode: yup.string().optional(),
});

type RegisterFormData = yup.InferType<typeof schema>;

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({ resolver: yupResolver(schema) });

  const [apiError, setApiError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const res = await API.post("/auth/register", data);
      toast.success(res.data.message);
      setTimeout(() => {
        navigate("/verify", { state: { email: data.email } });
      }, 1000);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <AuthLayout title="Sign up" subtitle="Basta fill up mo lahat">
      {apiError && (
        <p className="text-red-500 text-center text-sm mb-2">{apiError}</p>
      )}
      {success && (
        <p className="text-green-500 text-center text-sm mb-2">{success}</p>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormInput
          label="Username"
          type="text"
          placeholder="Enter your username"
          register={register("username")}
          error={errors.username?.message}
        />
        <FormInput
          label="Email"
          type="email"
          placeholder="Enter your email"
          register={register("email")}
          error={errors.email?.message}
        />
        <FormInput
          label="Password"
          type="password"
          placeholder="Create a password"
          register={register("password")}
          error={errors.password?.message}
          toggleVisibility
        />
        <FormInput
          label="Confirm Password"
          type="password"
          placeholder="Confirm your password"
          register={register("confirmPassword")}
          error={errors.confirmPassword?.message}
          toggleVisibility
        />

        {/* ✅ Secret Code field (optional) */}
        <FormInput
          label="Secret Code (Admins only)"
          type="text"
          placeholder="Leave empty if you're a student"
          register={register("secretCode")}
          error={errors.secretCode?.message}
        />

        <button
          type="submit"
          className="w-full bg-neonblue text-white py-2 rounded hover:bg-primary/80 transition"
        >
          Register
        </button>

        <p className="text-center text-sm text-gray-400 mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-neonblue hover:underline">
            Login
          </a>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Register;
