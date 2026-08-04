import { createContext, useContext } from "react";
import useLocalStorage from "@/hooks/useLocalStorage";
import { currentUser } from "@/data/mockUser";

// -------------------------------------------------------------
// Simple client-side auth for the demo.
// The "session" is a user object persisted in localStorage.
// Swap `login` for a FastAPI / Firebase Auth call later —
// the rest of the app only talks to this context.
// -------------------------------------------------------------
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useLocalStorage("tv-auth-user", null);

  const login = (email) =>
    setUser({ ...currentUser, email: email || currentUser.email });

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/** useAuth() → { user, isAuthenticated, login, logout } */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
