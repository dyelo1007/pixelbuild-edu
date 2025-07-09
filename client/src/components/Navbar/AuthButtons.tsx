import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

type AuthButtonsProps = {
  isMobile?: boolean;
  onClose?: () => void;
};

const linkClass =
  "relative px-3 py-2 transition-all duration-200 text-white hover:text-primary";
const activeClass =
  "after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-primary";

function AuthButtons({ isMobile = false, onClose }: AuthButtonsProps) {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
    onClose?.();
  };

  if (token && user) {
    return (
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 px-4 py-1 rounded w-fit"
      >
        Logout
      </button>
    );
  }

  return (
    <>
      <NavLink
        to="/login"
        onClick={onClose}
        className={({ isActive }) =>
          `${linkClass} ${isActive ? activeClass : ""}`
        }
      >
        Login
      </NavLink>
      <NavLink
        to="/register"
        onClick={onClose}
        className={({ isActive }) =>
          `${linkClass} ${isActive ? activeClass : ""}`
        }
      >
        Signup
      </NavLink>
    </>
  );
}

export default AuthButtons;
