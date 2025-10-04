import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/context/AuthContext";
import UserMenu from "./UserMenu";

type AuthButtonsProps = {
  isMobile?: boolean;
  onClose?: () => void;
  user?: { username: string; email: string; role?: string } | null;
};

const linkClass =
  "relative px-3 py-2 transition-all duration-200 text-neonblue hover:text-neonblue/70";
const activeClass =
  "after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-neonblue";

function AuthButtons({ onClose }: AuthButtonsProps) {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
    onClose?.();
  };

  const handleAccountSettings = () => {
    navigate("/account-settings");
    onClose?.();
  };

  if (token && user) {
    return (
      <UserMenu
        name={user.username || "User"}
        email={user.email || "user@example.com"}
        role={user.role}
        // avatarUrl={user.avatarUrl}
        onAccountSettings={handleAccountSettings}
        onLogout={handleLogout}
      />
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
