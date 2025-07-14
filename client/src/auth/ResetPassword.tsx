import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import AuthLayout from "../components/auth/AuthLayout";
import FormInput from "../components/auth/FormInput";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const schema = yup.object().shape({
  password: yup.string().min(6).required(),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match"),
});

const ResetPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const code = location.state?.code;
  const [error, setError] = useState("");

  useEffect(() => {
    if (!email || !code) {
      toast.error("Missing email. Please request a reset again.");
      navigate("/forgot-password");
    }
  }, [email, code, navigate]);

  const onSubmit = async (data: any) => {
    try {
      const { status, data: responseData } = await axios.post(
        "http://localhost:5000/api/auth/reset-password",
        {
          email,
          code,
          newPassword: data.password,
          confirmPassword: data.confirmPassword,
        }
      );

      if (status === 200) {
        toast.success(responseData.message || "Password reset successful!");
        navigate("/login", {
          state: { message: "Password reset successful. Please login." },
        });
      }
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Failed to reset password";
      toast.error(msg);
    }
  };

  return (
    <AuthLayout title="Reset Password" subtitle="Enter your new password">
      {error && <p className="text-red-500 text-center">{error}</p>}
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
          className="w-full bg-primary text-white py-2 rounded"
        >
          Reset Password
        </button>
      </form>
    </AuthLayout>
  );
};

export default ResetPassword;
