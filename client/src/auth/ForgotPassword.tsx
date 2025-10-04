import API from "@/utils/api";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/auth/AuthLayout";
import FormInput from "../components/auth/FormInput";
import toast from "react-hot-toast";

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
});

type ForgotPasswordFormData = yup.InferType<typeof schema>;

const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({ resolver: yupResolver(schema) });

  const navigate = useNavigate();

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await API.post("/auth/forgot-password", data);

      toast.success("Reset code sent to your email.");
      navigate("/reset-code", { state: { email: data.email } });
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      toast.error(error.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <AuthLayout title="Forgot Password" subtitle="Enter your email to reset">
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
