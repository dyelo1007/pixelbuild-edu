import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "./context/AuthContext";
import { login as loginAPI } from "../api/auth";
import FormInput from "../components/auth/FormInput";
import AuthLayout from "../components/auth/AuthLayout";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import { AxiosError } from "axios";

const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

type LoginFormData = yup.InferType<typeof schema>;
type JWTPayload = {
  exp: number;
  iat: number;
  id: string;
  role: "admin" | "student";
};

const Login = () => {
  const {
    register,
    handleSubmit,

    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({ resolver: yupResolver(schema) });

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.error) {
      toast.error(location.state.error);
    }
  }, [location]);

  const onSubmit = async (data: LoginFormData) => {
    const toastId = toast.loading("Logging in...");
    try {
      const res = await loginAPI(data);
      const token: string = res.data.token;

      try {
        const decoded = jwtDecode<JWTPayload>(token);
        if (decoded?.exp) {
          localStorage.setItem("token_exp", String(decoded.exp));
        }
      } catch (e) {
        console.warn("Could not decode JWT to store exp:", e);
      }

      login(token, res.data.user);

      toast.success("Login successful!", { id: toastId, duration: 1000 });

      setTimeout(() => {
        if (res.data.user.role === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/home");
        }
      }, 800);
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      const message = error.response?.data?.message || "Login failed";

      // TODO: Future email verification — uncomment to re-enable
      // if (message === "Please verify your email first") {
      //   toast.error("Please verify your email first", { id: toastId });
      //   navigate("/verify", { state: { email: data.email } });
      // } else {
      toast.error(message, { id: toastId });
      // }
    }
  };

  return (
    <AuthLayout
      title="Login to Your Account"
      subtitle="Ready to continue your build journey?"
    >
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
            <Link
              to="/forgot-password"
              className="text-sm text-neonblue hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-neonblue text-black font-semibold py-2 rounded hover:bg-hoverprimary disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-neonblue hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Login;
