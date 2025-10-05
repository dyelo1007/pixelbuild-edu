import API from "@/utils/api";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useLocation, useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import AuthLayout from "../components/auth/AuthLayout";
import FormInput from "../components/auth/FormInput";
import { useEffect } from "react";
import toast from "react-hot-toast";

const schema = yup.object().shape({
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required"),
});

// Create a specific type for the form data from the schema
type ResetPasswordFormData = yup.InferType<typeof schema>;

const ResetPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({ resolver: yupResolver(schema) });

  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const code = location.state?.code;

  useEffect(() => {
    if (!email || !code) {
      toast.error("Missing reset details. Please try again.");
      navigate("/forgot-password");
    }
  }, [email, code, navigate]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      const res = await API.post("/auth/reset-password", {
        email,
        code,
        newPassword: data.password,
      });

      toast.success(res.data.message || "Password reset successful!");
      navigate("/login");
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      toast.error(error.response?.data?.message || "Failed to reset password");
    }
  };

  return (
    <AuthLayout title="Reset Password" subtitle="Enter your new password">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormInput
          label="New Password"
          type="password"
          placeholder="Enter new password"
          register={register("password")}
          error={errors.password?.message}
          toggleVisibility
        />
        <FormInput
          label="Confirm Password"
          type="password"
          placeholder="Confirm password"
          register={register("confirmPassword")}
          error={errors.confirmPassword?.message}
          toggleVisibility
        />
        <button
          type="submit"
          className="w-full bg-neonblue text-white py-2 rounded"
        >
          Reset Password
        </button>
      </form>
    </AuthLayout>
  );
};

export default ResetPassword;
