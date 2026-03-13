import { useState } from "react";
import { toast } from "react-toastify";
import { resetSessionExpired } from "../api";

const useSession = () => {
  const [session, setSession] = useState(() => {
    try {
      const u = localStorage.getItem("atlas_session");
      const t = localStorage.getItem("token");
      return u && t ? { user: JSON.parse(u), token: t } : null;
    } catch { return null; }
  });

  const login = (data) => {
    resetSessionExpired();  // ← limpia el guard para la nueva sesión
    localStorage.setItem("atlas_session", JSON.stringify(data.user));
    localStorage.setItem("token", data.token);
    localStorage.setItem("refresh_token", data.refresh);
    setSession({ user: data.user, token: data.token });
  };

  const logout = (silent = false) => {
    localStorage.clear();
    setSession(null);
    if (!silent) toast.success("Sesión cerrada");
  };

  return { session, login, logout };
};

export default useSession;