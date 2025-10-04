import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "./context/AuthContext";
import { login as loginAPI } from "../api/auth";
import FormInput from "../components/auth/FormInput";
import AuthLayout from "../components/auth/AuthLayout";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";


const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

type LoginFormData = yup.InferType<typeof schema>;
type JWTPayload = { exp: number; iat: number; id: string };


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
    const token: string = res.data.token;

    // decode and persist expiry (for auto-logout)
    try {
      const decoded = jwtDecode<JWTPayload>(token);
      if (decoded?.exp) {
        localStorage.setItem("token_exp", String(decoded.exp));
      }
    } catch (e) {
      // non-fatal: proceed without saving exp if decode fails
      console.warn("Could not decode JWT to store exp:", e);
    }

    // your existing login state handler
    login(token, res.data.user);

    // navigate by role
    if (res.data.user.role === "admin") {
      navigate("/admin-dashboard");
    } else {
      navigate("/home");
    }
  } catch (err: any) {
    const message = err?.response?.data?.message || "Login failed";
    if (message === "Please verify your email first") {
      toast.error("Please verify your email first");
      navigate("/verify", { state: { email: data.email } });
    } else {
      toast.error(message);
    }
  }
};

  return (
    <AuthLayout title="Login" subtitle="Fill up the required details.">
      {apiError && (
        <p className="text-red-500 text-center text-sm mb-2">{apiError}</p>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 ">
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
              className="text-sm text-neonblue hover:underline"
            >
              Forgot Password?
            </a>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-neonblue text-white py-2 rounded hover:bg-neonblue/80 transition"
        >
          Login
        </button>

        <p className="text-center text-sm text-gray-400 mt-4">
          Don’t have an account?{" "}
          <a href="/register" className="text-neonblue hover:underline">
            Sign-Up
          </a>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Login;
