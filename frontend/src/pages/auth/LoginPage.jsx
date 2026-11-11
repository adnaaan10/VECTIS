import React, { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";
import PasswordInput from "../../components/common/PasswordInput";
import authBgImage from "../../assets/images/auth-bg.jpeg";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login submitted:", formData);
    // Call your auth service here
  };

  return (
    <AuthLayout
      heading="LOG IN TO YOUR ACCOUNT"
      subheading="Welcome back! Enter your details to access your account."
      tagline="WELCOME BACK TO THE GAME."
      description="Log in to track your orders, manage your profile, and discover the latest football boots from VECTIS."
      imageSrc={authBgImage}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
            EMAIL ADDRESS <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email address"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
          />
        </div>

        {/* Password */}
        <PasswordInput
          label="PASSWORD"
          name="password"
          placeholder="Enter your password"
        />

        {/* Forgot Password */}
        <div className="flex justify-end mb-6">
          <Link
            to="/forgot-password"
            className="text-sm text-gray-600 hover:text-black underline transition-colors"
          >
            Forgot Password?
          </Link>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-black text-white py-3.5 text-sm font-semibold uppercase tracking-wider hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
        >
          LOG IN
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

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-gray-300" />
          <span className="px-4 text-xs text-gray-500 uppercase tracking-wider">
            or
          </span>
          <div className="flex-1 border-t border-gray-300" />
        </div>

        {/* Google Login */}
        <button
          type="button"
          className="w-full border border-gray-300 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-3"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          CONTINUE WITH GOOGLE
        </button>

        {/* Sign Up Link */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-black hover:underline"
          >
            SIGN UP
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Login;