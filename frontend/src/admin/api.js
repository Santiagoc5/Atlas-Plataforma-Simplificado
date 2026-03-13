import { toast } from "react-toastify";

export const BASE = () => `http://${window.location.hostname}:8000`;

export let _forceLogout = null;
export const setForceLogout = (fn) => { _forceLogout = fn; };

// Guard: evita que múltiples llamadas simultáneas disparen logout/toast varias veces
let _sessionExpired = false;
export const resetSessionExpired = () => { _sessionExpired = false; };

export const refreshAccessToken = async () => {
  const refresh = localStorage.getItem("refresh_token");
  if (!refresh) throw new Error("No refresh token");
  const res = await fetch(`${BASE()}/api/token/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });
  if (!res.ok) throw new Error("Refresh failed");
  const data = await res.json();
  localStorage.setItem("token", data.access);
  return data.access;
};

export const api = async (path, options = {}, token = null) => {
  const doRequest = async (tkn) => {
    const headers = { ...options.headers };
    if (tkn) headers.Authorization = `Bearer ${tkn}`;
    if (!(options.body instanceof FormData)) headers["Content-Type"] = "application/json";
    return fetch(`${BASE()}${path}`, { ...options, headers });
  };

  let res = await doRequest(token);

  if (res.status === 401 && token) {
    try { res = await doRequest(await refreshAccessToken()); }
    catch {
      // Solo la primera llamada que falla muestra el toast y hace logout
      if (!_sessionExpired) {
        _sessionExpired = true;
        toast.error("Sesión expirada.");
        _forceLogout?.(true);  // true = silent, no mostrar "Sesión cerrada"
      }
      throw new Error("expired");
    }
  }

  if (!res.ok) { throw await res.json().catch(() => ({})); }
  if (res.status === 204) return null;
  return res.json();
};