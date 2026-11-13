import React from "react";

const EmailInput = ({
  label = "EMAIL ADDRESS",
  name = "email",
  value,
  onChange,
  placeholder = "Enter your email address",
  required = true,
  error,
  disabled = false,
}) => {
  return (
    <div className="mb-3">
      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      <input
        type="email"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`w-full px-3 py-2.5 border rounded-sm text-sm font-body focus:outline-none focus:ring-1 transition-colors placeholder:text-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed ${
          error
            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
            : "border-gray-300 focus:border-black focus:ring-black"
        }`}
      />
      
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default EmailInput;