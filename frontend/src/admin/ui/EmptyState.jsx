/**
 * Componente visual para indicar que no hay datos disponibles (Listas vacías o sin resultados).
 * Muestra un ícono centrado y un texto descriptivo.
 */
const EmptyState = ({ icon, text }) => (
  <div className="empty">
    {icon}
    <p>{text}</p>
  </div>
);

export default EmptyState;