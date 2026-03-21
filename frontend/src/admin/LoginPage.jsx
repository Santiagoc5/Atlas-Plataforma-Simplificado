import { useState } from "react";
import { toast } from "react-toastify";
import { api } from "./api";
import { InputField } from "./ui/Field";
import Spinner from "./ui/Spinner";

/**
 * Página de autenticación para el Panel de Administración.
 * Recopila credenciales y las envía a la API para obtener los tokens de acceso.
 */
const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [pass, setPass]         = useState("");
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async () => {
    if (!username || !pass) return toast.error("Completa todos los campos");
    setLoading(true);
    try {
      const data = await api("/api/login/", { method: "POST", body: JSON.stringify({ username, password: pass }) });
      onLogin(data);
      toast.success(`Bienvenido, ${data.user.nombre}`);
    } catch (e) { toast.error(e?.error || "Credenciales incorrectas"); }
    finally { setLoading(false); }
  };

  return (
    <div className="login-page">
      <div className="login-glow" style={{ width: 500, height: 500, background: "var(--accent)", top: -180, right: -180 }} />
      <div className="login-glow" style={{ width: 350, height: 350, background: "#3b82f6", bottom: -100, left: -80 }} />
      <div className="login-card">
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 30, justifyContent: "center" }}>
          <img 
            src="/logo.png" 
            alt="Atlas Accesorios Logo" 
            style={{ height: "55px", width: "auto", objectFit: "contain" }} 
          />
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 800, textAlign: "center", marginBottom: 6 }}>
          Iniciar <span style={{ color: "var(--accent)" }}>Sesión</span>
        </h1>
        <p style={{ fontSize: 13, color: "var(--text2)", textAlign: "center", marginBottom: 26 }}>
          Acceso exclusivo para administradores
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <InputField label="Nombre de usuario" value={username} onChange={setUsername} placeholder="admin"    onKeyDown={e => e.key === "Enter" && handleSubmit()} />
          <InputField label="Contraseña" type="password"         value={pass}     onChange={setPass}     placeholder="••••••••" onKeyDown={e => e.key === "Enter" && handleSubmit()} />
          <button
            className="btn btn-primary"
            style={{ marginTop: 8, justifyContent: "center", height: 46, fontSize: 14, borderRadius: 13 }}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? <Spinner /> : "Ingresar al panel"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;