// FloatingLabelInput.jsx
import React from "react";

const FloatingLabelInput = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  onBlur,
  error,
  touched,
  ...rest
}) => (
  <div className="relative mb-2">
    <input
      type={type}
      name={name}
      id={name}
      autoComplete="off"
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      placeholder=" "
      className={`block w-full px-2 py-2 border-b-2 bg-transparent appearance-none focus:outline-none focus:ring-0 peer transition-all duration-200 ${error && touched ? "border-red-500" : "border-gray-300"}`}
      {...rest}
    />
    <label
  htmlFor={name}
  className={`
    absolute left-2 top-2 text-gray-400 text-sm pointer-events-none transition-all duration-200
    peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400
    peer-focus:-top-4 peer-focus:text-xs peer-focus:text-black
    ${value ? "-top-4 text-xs text-black" : ""}
  `}
>
  {label}
</label>
    {error && touched && <div className="text-xs text-red-500 mt-1">{error}</div>}
  </div>
);

export default FloatingLabelInput;