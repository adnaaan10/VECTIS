import React from "react";

const PhoneInput = ({ value, onChange, required = true }) => {
  return (
    <div className="mb-3">
      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">
        PHONE NUMBER <span className="text-red-500">*</span>
      </label>
      <div className="flex w-full">
        <input
          type="tel"
          value={value}
          onChange={onChange}
          placeholder="Enter your phone number"
          required={required}
          className="flex-1 px-3 py-2.5 border border-gray-300 rounded-r-sm text-sm font-body focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors placeholder:text-gray-400"
        />
      </div>
    </div>
  );
};

export default PhoneInput;