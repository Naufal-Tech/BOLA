/* eslint-disable react/prop-types */
const FormRow = ({
  type,
  name,
  labelText,
  options,
  value,
  onChange,
  placeholder,
  required,
}) => {
  const isCheckbox = type === "checkbox";

  return (
    <div className="form-row">
      <label htmlFor={name} className="form-label">
        {labelText || name}
      </label>
      {isCheckbox ? (
        <input
          type="checkbox"
          id={name}
          name={name}
          checked={value}
          onChange={onChange}
          required={required}
        />
      ) : type === "select" ? (
        <select
          id={name}
          name={name}
          className="form-input"
          value={value || ""}
          onChange={onChange}
          placeholder={placeholder || ""}
          required={required}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          id={name}
          name={name}
          placeholder={placeholder || ""}
          className="form-input"
          value={
            type === "text" && Array.isArray(value) ? value.join(", ") : value
          }
          onChange={onChange}
          required={required}
        />
      )}
    </div>
  );
};

export default FormRow;
