// auth/context/currentUser.tsx
import { createContext, useContext, useEffect, useState } from "react";
import API from "@/utils/api";
import { useAuth } from "../context/AuthContext";

export type CurrentUser = {
  id: string;
  username: string;
  email?: string;
  role?: string;
  bio?: string;
  image?: string;
};

type Ctx = {
  currentUser: CurrentUser | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<CurrentUser | null>>; // ✅ expose
  refreshCurrentUser: () => Promise<void>;                                  // ✅ expose
  loading: boolean;
};

const CurrentUserContext = createContext<Ctx | undefined>(undefined);

export const CurrentUserProvider = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, token } = useAuth();
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(false);

  const refreshCurrentUser = async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const res = await API.get("/user/me");
      setCurrentUser(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && token) refreshCurrentUser();
    else setCurrentUser(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, token]);

  return (
    <CurrentUserContext.Provider value={{ currentUser, setCurrentUser, refreshCurrentUser, loading }}>
      {children}
    </CurrentUserContext.Provider>
  );
};

export const useCurrentUser = () => {
  const ctx = useContext(CurrentUserContext);
  if (!ctx) throw new Error("useCurrentUser must be used inside CurrentUserProvider");
  return ctx;
};
