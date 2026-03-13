// Field: contenedor genérico (label + cualquier input + error)
export const Field = ({ label, error, children }) => (
  <div className="fg">
    <label className="flabel">{label}</label>
    {children}
    {error && <span style={{ fontSize: 11, color: "var(--danger)" }}>{error}</span>}
  </div>
);

// InputField: Field + <input> ya configurado
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