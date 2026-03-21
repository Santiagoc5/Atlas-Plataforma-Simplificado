import { useState, useEffect, useCallback } from "react";
import { X } from "lucide-react";
import { api } from "../api";
import SearchInput from "../ui/SearchInput";

/**
 * Componente híbrido de búsqueda y selección múltiple de vehículos.
 * Realiza peticiones predictivas al backend mientras se escribe
 * y retorna la lista de vehículos compatibles seleccionados.
 */
const VehicleSelector = ({ token, selected, onChange }) => {
  const [query, setQuery]     = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const search = useCallback(async (q) => {
    if (q.length < 2) { setResults([]); return; }
    setLoading(true);
    try {
      const data = await api(`/api/admin/vehiculos/?q=${encodeURIComponent(q)}`, {}, token);
      setResults(data.filter(v => !selected.find(s => s.id_vehiculo === v.id_vehiculo)));
    } finally { setLoading(false); }
  }, [token, selected]);

  useEffect(() => {
    const t = setTimeout(() => search(query), 300);
    return () => clearTimeout(t);
  }, [query, search]);

  const handleSelect = (v) => {
    onChange([...selected, v]);
    setQuery("");
    setResults([]);
  };

  return (
    <div>
      <SearchInput
        value={query}
        onChange={setQuery}
        placeholder="Buscar vehículos compatibles..."
      />

      {loading && (
        <p style={{ fontSize: 12, color: "var(--text3)", padding: "4px 0" }}>
          Buscando...
        </p>
      )}

      {results.length > 0 && (
        <div style={{
          background: "var(--bg3)", border: "1px solid var(--border2)",
          borderRadius: 8, margin: "8px 0", overflow: "hidden",
        }}>
          {results.slice(0, 6).map(v => (
            <div
              key={v.id_vehiculo}
              style={{ padding: "9px 14px", cursor: "pointer", fontSize: 13, transition: "background .15s" }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              onClick={() => handleSelect(v)}
            >
              {v.nombre_completo}
            </div>
          ))}
        </div>
      )}

      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
        {selected.length === 0
          ? <p style={{ fontSize: 12, color: "var(--text3)" }}>Sin vehículos asociados</p>
          : selected.map(v => (
              <span
                key={v.id_vehiculo}
                className="badge badge-info"
                style={{ cursor: "pointer" }}
                onClick={() => onChange(selected.filter(s => s.id_vehiculo !== v.id_vehiculo))}
              >
                {v.nombre_completo} <X size={10} />
              </span>
            ))
        }
      </div>
    </div>
  );
};

export default VehicleSelector;