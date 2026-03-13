import { useState, useEffect, useCallback } from "react";
import { api } from "../api";

const useFetch = (path, token) => {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try { setData(await api(path, {}, token)); } catch {}
    finally { setLoading(false); }
  }, [path, token]);

  useEffect(() => { load(); }, [load]);

  return { data, loading, reload: load, setData };
};

export default useFetch;