// src/pages/Register.tsx
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import API from "../utils/api";
import FormInput from "../components/auth/FormInput";
import AuthLayout from "../components/auth/AuthLayout";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

// 1) Schema (make secretCode truly optional; empty string -> undefined)
const schema = yup
  .object({
    username: yup.string().required("Username is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup
      .string()
      .required("Password is required")
      .min(8, "Must be at least 8 characters")
      .matches(/[A-Z]/, "Must contain an uppercase letter")
      .matches(/[a-z]/, "Must contain a lowercase letter")
      .matches(/[0-9]/, "Must contain a number")
      .matches(/[!@#$%^&*(),.?":{}|<>]/, "Must contain a special character"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], "Passwords must match")
      .required("Confirm Password is required"),
    secretCode: yup
      .string()
      .transform((v) => (v === "" ? undefined : v))
      .optional(),
  })
  .required();

// 2) Form value type
type RegisterFormData = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  secretCode?: string; // optional property
};

type ApiMessage = { message: string };

const Register = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    // 3) Pass all three generics so resolver exactly matches your form type
    //    Also tell TS the schema outputs RegisterFormData
    resolver: yupResolver<RegisterFormData, unknown, RegisterFormData>(
      schema as yup.ObjectSchema<RegisterFormData>
    ),
    // Default values help RHF keep controlled inputs stable
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      secretCode: "",
    },
  });

  // 4) Type the submit handler as SubmitHandler<RegisterFormData>
  const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
    try {
      const res = await API.post<ApiMessage>("/auth/register", data);
      toast.success(res.data.message ?? "Registration successful");
      setTimeout(
        () => navigate("/verify", { state: { email: data.email } }),
        1000
      );
    } catch (err) {
      const e = err as AxiosError<ApiMessage>;
      toast.error(e.response?.data?.message || "Registration failed");
    }
  };

  return (
    <AuthLayout title="Sign up" subtitle="Basta fill up mo lahat">
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
        <FormInput
          label="Secret Code (Admins only)"
          type="text"
          placeholder="Leave empty if you're a student"
          register={register("secretCode")}
          error={errors.secretCode?.message}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-neonblue text-white py-2 rounded hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {isSubmitting ? "Registering..." : "Register"}
        </button>

        <p className="text-center text-sm text-gray-400 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-neonblue hover:underline">
            Login
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Register;
