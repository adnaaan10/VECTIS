
import React from "react";

const PhoneInput = ({ value, onChange, required = true }) => {

  const handleChange = (e) => {
    const digits = e.target.value.replace(/\D/g, "");

    onChange({
      ...e,
      target: {
        ...e.target,
        value: digits.slice(0, 10),
      },
    });
  };

  const isValid = /^[6-9]\d{9}$/.test(value);

  return (
    <div className="mb-3">
      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-700">
        PHONE NUMBER
        {required && <span className="text-red-500"> *</span>}
      </label>

      <div className="flex w-full">
        <input
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          value={value}
          onChange={handleChange}
          placeholder="Enter 10-digit phone number"
          required={required}
          maxLength={10}
          aria-invalid={value.length > 0 && !isValid}
          className="w-full rounded-sm border border-gray-300 px-3 py-2.5 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
        />
      </div>

      {value.length > 0 && !isValid && (
        <p className="mt-1 text-xs text-red-500">
          Enter a valid 10-digit Indian mobile number.
        </p>
      )}
    </div>
  );
};

export default PhoneInput;
