import { useState, useEffect, useCallback } from "react";
import { api } from "../api";

/**
 * Hook genérico para realizar peticiones HTTP (GET) al backend.
 * Utiliza el wrapper de la API para administrar el token y expone el estado
 * de carga y los datos recibidos.
 */
const useFetch = (path, token) => {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    // Se ignoran errores aquí; cada pantalla decide si muestra estado vacío/toast.
    try { setData(await api(path, {}, token)); } catch {}
    finally { setLoading(false); }
  }, [path, token]);

  useEffect(() => { load(); }, [load]);

  return { data, loading, reload: load, setData };
};

export default useFetch;