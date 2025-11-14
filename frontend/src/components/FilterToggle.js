// FilterToggle.jsx
export default function FilterToggle({ label, icon, field, options, value, onChange }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(field, e.target.value)}
      style={{
        backgroundColor: "var(--card-background-color)",
        color: "var(--text-color)",
        border: "1px solid var(--border-color)",
        padding: "8px 12px",
        borderRadius: "6px",
        boxShadow: "0 2px 6px var(--shadow-color)",
      }}
    >
      <option value="">{label}</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
