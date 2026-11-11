import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";
import OtpInput from "../../components/common/OtpInput";
import authBgImage from "../../assets/images/auth-bg.jpeg";

const VerifyEmail = () => {
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(30);
  const navigate = useNavigate();

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleResend = () => {
    setTimer(30);
    console.log("Resending OTP...");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Verifying OTP:", otp);
    // navigate('/login');
  };

  const formatTime = (seconds) => {
    return `00:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  return (
    <AuthLayout
      tagline="STEP INTO YOUR GAME."
      description="One final step before you enter the world of premium football footwear."
      imageSrc={authBgImage}
      heading="VERIFY YOUR EMAIL"
      subheading="We've sent a 6-digit verification code to your registered email address. Enter the verification code to activate your VECTIS account."
      centerContent={true} // <-- This triggers the centering!
    >
      <form onSubmit={handleSubmit} className="font-body w-full flex flex-col items-center mt-4">
        
        {/* Email Icon */}
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>

        {/* OTP Input */}
        <OtpInput length={6} onChange={setOtp} />

        {/* Timer & Resend */}
        <div className="text-center mb-6">
          {timer > 0 ? (
            <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Resend code in{" "}
              <span className="font-bold text-black">{formatTime(timer)}</span>
            </p>
          ) : (
            <p className="text-xs text-gray-500">
              Didn't receive the code?{" "}
              <button
                type="button"
                onClick={handleResend}
                className="text-black font-bold underline hover:text-gray-700"
              >
                Resend OTP
              </button>
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-black text-white py-3 text-sm font-body font-semibold uppercase tracking-wider hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 rounded-sm mb-4"
        >
          VERIFY & CONTINUE
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </button>

        {/* Back Link */}
        <div className="text-center w-full">
          <Link
            to="/register"
            className="text-xs font-body text-gray-500 hover:text-black inline-flex items-center justify-center gap-1 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            BACK TO REGISTRATION
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default VerifyEmail;