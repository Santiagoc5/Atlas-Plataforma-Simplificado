import { useState } from "react";
import { X } from "lucide-react";

/**
 * Componente de input especializado para capturar múltiples valores (etiquetas o características).
 * Permite agregar presionando 'Enter' o ',' (coma), y eliminar mediante un botón 'X'.
 */
const TagsInput = ({ value, onChange }) => {
  const [input, setInput] = useState("");

  const tags = value
    ? value.split(",").map(t => t.trim()).filter(Boolean)
    : [];

  const add = () => {
    const t = input.trim();
    if (!t) return;
    onChange([...tags, t].join(", "));
    setInput("");
  };

  const remove = (i) => onChange(tags.filter((_, j) => j !== i).join(", "));

  return (
    <div
      className="tags-wrap"
      onClick={e => e.currentTarget.querySelector("input")?.focus()}
    >
      {tags.map((t, i) => (
        <span key={i} className="tag-chip">
          {t}
          <button onClick={() => remove(i)}><X size={10} /></button>
        </span>
      ))}
      <input
        className="tags-input"
        value={input}
        placeholder="Agregar característica..."
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => {
          if (e.key === "Enter" || e.key === ",") { e.preventDefault(); add(); }
        }}
      />
    </div>
  );
};

export default TagsInput;