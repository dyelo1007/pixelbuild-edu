// src/auth/context/currentUser.tsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import API from "@/utils/api";
import { useAuth } from "../context/AuthContext"; // whatever exposes token/isAuthenticated

type CurrentUser = {
  _id: string;
  username: string;
  email: string;
  role: string;
  bio?: string;
  image?: string;
};

type Ctx = {
  user: CurrentUser | null;
  loading: boolean;
  setUser: (u: CurrentUser | null) => void;
  refresh: () => Promise<void>;
};

const CurrentUserContext = createContext<Ctx | undefined>(undefined);

export const CurrentUserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token, isAuthenticated } = useAuth(); // or however you expose this
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    // ✅ Do nothing if not authenticated — prevents login loop
    if (!isAuthenticated || !token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const res = await API.get("/user/me"); // must return user JSON
      setUser(res.data);
    } catch (err: any) {
      // ✅ Swallow 401s — don't navigate here
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // only re-run when auth state or token changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, token]);

  const value = useMemo(
    () => ({ user, loading, setUser, refresh: load }),
    [user, loading]
  );

  return (
    <CurrentUserContext.Provider value={value}>
      {children}
    </CurrentUserContext.Provider>
  );
};

export const useCurrentUser = () => {
  const ctx = useContext(CurrentUserContext);
  if (!ctx) throw new Error("useCurrentUser must be used within CurrentUserProvider");
  return ctx;
};
