import React, { useState, useRef, useEffect } from "react";

const OtpInput = ({ length = 6, onChange }) => {
    const [otp, setOtp] = useState(new Array(length).fill(""));
    const inputRefs = useRef([]);

    useEffect(() => {
    if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
    }
    }, []);

    const handleChange = (index, e) => {
        const value = e.target.value;

        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];

        newOtp[index] = value.slice(-1);

        setOtp(newOtp);
        onChange(newOtp.join(""));

        if (value && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
        inputRefs.current[index - 1].focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();

        const pastedData = e.clipboardData
            .getData("text")
            .replace(/\D/g, "")
            .slice(0, length);

        if (!pastedData) return;

        const newOtp = [...otp];

        pastedData.split("").forEach((char, index) => {
            newOtp[index] = char;
        });

        setOtp(newOtp);
        onChange(newOtp.join(""));

        const focusIndex = Math.min(pastedData.length, length - 1);

        inputRefs.current[focusIndex]?.focus();
    };

  return (
    <div className="flex justify-center gap-3 mb-6">
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          autoComplete={index === 0 ? "one-time-code" : "off"}
          className={`w-12 h-14 text-center text-xl font-bold font-body border rounded-sm focus:outline-none focus:ring-2 focus:ring-black transition-all ${
            digit ? "border-black bg-gray-50" : "border-gray-300 bg-white"
          }`}
        />
      ))}
    </div>
  );
};

export default OtpInput;