/**
 * Contenedor genérico para campos de formulario.
 * Define la estructura visual estándar: etiqueta (label), espacio para el input y mensaje de error.
 */
export const Field = ({ label, error, children }) => (
  <div className="fg">
    <label className="flabel">{label}</label>
    {children}
    {error && <span style={{ fontSize: 11, color: "var(--danger)" }}>{error}</span>}
  </div>
);

/**
 * Campo de texto común empaquetado. 
 * Combina el contenedor estructural 'Field' con un input de texto estándar.
 */
export const InputField = ({ label, error, value, onChange, ...props }) => (
  <Field label={label} error={error}>
    <input
      className="input"
      value={value}
      onChange={e => onChange(e.target.value)}
      onWheel={e => e.target.blur()}
      {...props}
    />
  </Field>
);