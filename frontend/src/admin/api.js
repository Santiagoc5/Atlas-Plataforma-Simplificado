import { toast } from "react-toastify";

/**
 * Utilidades y configuración centralizada para consumir la API del backend.
 * Incluye un wrapper 'api' para inyectar automáticamente el token JWT
 * y manejar la renovación del token (refresh token) al interceptar código 401.
 */

// Resuelve base URL del backend según host actual del navegador.
export const BASE = () => `http://${window.location.hostname}:8000`;

// Callback inyectable para forzar cierre de sesión desde cualquier request.
export let _forceLogout = null;
export const setForceLogout = (fn) => { _forceLogout = fn; };

// Evita múltiples toasts/logout cuando varias requests fallan al mismo tiempo.
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
  // Wrapper único para requests autenticadas/no autenticadas.
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
      // Solo la primera llamada notifica y dispara logout para evitar ruido.
      if (!_sessionExpired) {
        _sessionExpired = true;
        toast.error("Sesión expirada.");
        _forceLogout?.(true);  // true => logout silencioso (sin toast de cierre).
      }
      throw new Error("expired");
    }
  }

  if (!res.ok) { throw await res.json().catch(() => ({})); }
  if (res.status === 204) return null;
  return res.json();
};