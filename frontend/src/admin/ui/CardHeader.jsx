const CardHeader = ({ icon, title, children }) => (
  <div className="card-header">
    {icon}
    <span className="card-title">{title}</span>
    {children}
  </div>
);

export default CardHeader;