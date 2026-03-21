/**
 * Encabezado estandarizado para las tarjetas (Cards) del panel de administración.
 * Soporta un icono, título y elementos adicionales dinámicos (children) como barras de búsqueda.
 */
const CardHeader = ({ icon, title, children }) => (
  <div className="card-header">
    {icon}
    <span className="card-title">{title}</span>
    {children}
  </div>
);

export default CardHeader;