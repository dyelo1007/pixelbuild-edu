import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { login as loginAPI } from "../api/auth";
import FormInput from "../components/auth/FormInput";
import AuthLayout from "../components/auth/AuthLayout";
import toast from "react-hot-toast";

const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

type LoginFormData = yup.InferType<typeof schema>;

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({ resolver: yupResolver(schema) });

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    if (location.state?.error) {
      toast.error(location.state.error);
    }
  }, [location]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      const res = await loginAPI(data);
      login(res.data.token, res.data.user);
      navigate("/dashboard");
    } catch (err: any) {
      const message = err.response?.data?.message || "Login failed";

      if (message === "Please verify your email first") {
        toast.error("Please verify your email first");
        navigate("/verify", { state: { email: data.email } });
      } else {
        toast.error(message);
      }
    }
  };

  return (
    <AuthLayout title="Login" subtitle="Basta fill up mo 'to tangina">
      {apiError && (
        <p className="text-red-500 text-center text-sm mb-2">{apiError}</p>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormInput
          label="Email"
          type="email"
          placeholder="Enter your email"
          register={register("email")}
          error={errors.email?.message}
        />
        <div className="space-y-1">
          <FormInput
            label="Password"
            type="password"
            placeholder="Enter your password"
            register={register("password")}
            error={errors.password?.message}
            toggleVisibility
          />
          <div className="text-right">
            <a
              href="/forgot-password"
              className="text-sm text-primary hover:underline"
            >
              Forgot Password?
            </a>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-primary text-white py-2 rounded hover:bg-primary/80 transition"
        >
          Login
        </button>

        <button
          type="button"
          className="w-full flex justify-center items-center border border-primary mt-2 py-2 rounded hover:bg-primary/20 text-white gap-2"
        >
          <img src="/wala-pag-icon" alt="Google" className="w-5 h-5" />
          Login with Google
        </button>

        <p className="text-center text-sm text-gray-400 mt-4">
          Don’t have an account?{" "}
          <a href="/register" className="text-primary hover:underline">
            Sign-Up
          </a>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Login;
