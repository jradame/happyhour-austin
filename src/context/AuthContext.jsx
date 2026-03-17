import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

const DEMO_USERS = [
  { uid: "1", email: "justin@happyhour.atx", displayName: "Justin Adame", password: "happyhour" }
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("hh_user");
    return saved ? JSON.parse(saved) : null;
  });

  const loginWithEmail = (email, password) => {
    const found = DEMO_USERS.find(u => u.email === email && u.password === password);
    if (found) {
      const u = { uid: found.uid, email: found.email, displayName: found.displayName };
      setUser(u);
      localStorage.setItem("hh_user", JSON.stringify(u));
      return Promise.resolve(u);
    }
    return Promise.reject(new Error("Invalid email or password."));
  };

  const signupWithEmail = (email, password) => {
    const exists = DEMO_USERS.find(u => u.email === email);
    if (exists) return Promise.reject(new Error("auth/email-already-in-use"));
    const u = { uid: Date.now().toString(), email, displayName: email.split("@")[0] };
    setUser(u);
    localStorage.setItem("hh_user", JSON.stringify(u));
    return Promise.resolve(u);
  };

  const loginWithGoogle = () => {
    const u = { uid: "google-1", email: "justin@happyhour.atx", displayName: "Justin Adame" };
    setUser(u);
    localStorage.setItem("hh_user", JSON.stringify(u));
    return Promise.resolve(u);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("hh_user");
    return Promise.resolve();
  };

  return (
    <AuthContext.Provider value={{ user, loading: false, loginWithEmail, signupWithEmail, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}