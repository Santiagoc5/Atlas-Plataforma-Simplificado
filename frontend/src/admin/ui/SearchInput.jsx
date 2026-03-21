import { Search } from "lucide-react";

/**
 * Componente de entrada de texto optimizado visualmente para búsquedas.
 * Incluye un ícono decorativo posicionado dentro del campo.
 */
const SearchInput = ({ value, onChange, placeholder }) => (
  <div className="search-wrap">
    <div className="search-icon"><Search size={15} /></div>
    <input
      className="input"
      placeholder={placeholder}
      value={value}
      onChange={e => onChange(e.target.value)}
    />
  </div>
);

export default SearchInput;