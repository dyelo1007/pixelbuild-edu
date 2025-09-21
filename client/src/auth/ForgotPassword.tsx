import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/auth/AuthLayout";
import FormInput from "../components/auth/FormInput";
import { useState } from "react";
import toast from "react-hot-toast";

const schema = yup.object().shape({
  email: yup.string().email().required(),
});

const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (data: any) => {
    try {
      await axios.post("http://localhost:5000/api/auth/forgot-password", data);
      toast.success("Reset code sent to your email.");
      navigate("/reset-code", { state: { email: data.email } });
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <AuthLayout title="Forgot Password" subtitle="Enter your email to reset">
      {error && <p className="text-red-500 text-center">{error}</p>}
      {success && <p className="text-green-500 text-center">{success}</p>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormInput
          label="Email"
          type="email"
          placeholder="Enter your email"
          register={register("email")}
          error={errors.email?.message}
        />
        <button
          type="submit"
          className="w-full bg-neonblue text-white py-2 rounded"
        >
          Send Reset Code
        </button>
      </form>
    </AuthLayout>
  );
};

export default ForgotPassword;
