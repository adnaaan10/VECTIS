import React, { useState,useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AuthLayout from "../../layouts/AuthLayout";
import PasswordInput from "../../components/common/PasswordInput";
import PhoneInput from "../../components/common/PhoneInput";
import authBgImage from "../../assets/images/auth-bg.jpeg";
import { registerUser } from "../../services/auth/authService";
import EmailInput from "../../components/common/EmailInput";
import Button from "../../components/common/Button";
import { googleLogin } from "../../services/UserService/userService";
import GoogleSignInButton from "../../components/common/GoogleSignInButton";
import { useAuth } from "../../context/AuthContext";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });

  const navigate = useNavigate();
  const {updateUser} = useAuth();
  const [googleLoading,setGoogleLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    
    // Clear specific field error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleGoogleSuccess = useCallback(async (credential)=>{
    setGoogleLoading(true);

    try{
      const response = await googleLogin(credential);

      updateUser(response.user);

      toast.success("Google login successful!");

      navigate("/",{replace:true});
    }catch(err){
      const errorMessage = err.response?.data?.message || "Google authentication failed. Please try again."

      toast.error(errorMessage);

    }finally{
      setGoogleLoading(false);
    }

  },[updateUser,navigate])

  const handleGoogleError = useCallback((message)=>{
    toast.error(message || "Google authentication failed");
  },[])

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setErrors({});

    try {
      const payload = {
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone,
        password: formData.password,
        confirm_password: formData.confirmPassword,
      };

      const response = await registerUser(payload);

      console.log("Registration successful:", response);

      toast.success("Account created successfully! Please check your email to verify.", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      navigate("/verify-email", {
        state: {
          email: response.email || payload.email,
        },
      });

    } catch (error) {
      console.error("Registration error:", error.response?.data);

      if (error.response?.data) {
       
        setErrors(error.response.data);
        
        const errorMessage = error.response.data.message || "Registration failed. Please check your details.";
        toast.error(errorMessage, { position: "top-right" });
      } else {
        toast.error("Network error. Please check your connection.", { position: "top-right" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      heading="CREATE YOUR ACCOUNT"
      subheading="Join VECTIS and find your perfect pair."
      tagline="STEP INTO YOUR GAME."
      description="Create your account and discover football boots built for every level of the game."
      imageSrc={authBgImage}
    >
      <form onSubmit={handleSubmit} className="space-y-3 font-body">
        {/* First Name & Last Name (2 Columns) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">
              FIRST NAME <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Enter your first name"
              required
              className={`w-full px-3 py-2.5 border rounded-sm text-sm font-body focus:outline-none focus:ring-1 transition-colors placeholder:text-gray-400 ${
                errors.first_name ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-black focus:ring-black"
              }`}
            />
            {errors.first_name && <p className="text-xs text-red-500 mt-1">{errors.first_name}</p>}
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">
              LAST NAME <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Enter your last name"
              required
              className={`w-full px-3 py-2.5 border rounded-sm text-sm font-body focus:outline-none focus:ring-1 transition-colors placeholder:text-gray-400 ${
                errors.last_name ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-black focus:ring-black"
              }`}
            />
            {errors.last_name && <p className="text-xs text-red-500 mt-1">{errors.last_name}</p>}
          </div>
        </div>

        {/* Email Address */}
        <div>
          <EmailInput
            label="EMAIL ADDRESS"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email address"
            error={errors.email}
          />
        </div>

        {/* Phone Number */}
        <PhoneInput
          value={formData.phone}
          onChange={(e) => handleChange({ target: { name: "phone", value: e.target.value } })}
        />
        {errors.phone && <p className="text-xs text-red-500 -mt-2 mb-2">{errors.phone}</p>}

        {/* Password & Confirm Password */}
        <PasswordInput
          label="PASSWORD"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Create a password"
          error={errors.password}
        />
        <PasswordInput
          label="CONFIRM PASSWORD"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm your password"
          error={errors.confirm_password}
        />

        {/* Terms & Conditions Checkbox */}
        <div className="flex items-start mt-2 mb-4">
          <input
            id="agree-terms"
            name="agreeTerms"
            type="checkbox"
            checked={formData.agreeTerms}
            onChange={handleChange}
            required
            className="h-4 w-4 mt-0.5 text-black border-gray-300 rounded focus:ring-black cursor-pointer"
          />
          <label htmlFor="agree-terms" className="ml-2 text-xs font-body text-gray-600 cursor-pointer leading-tight">
            I agree to the{" "}
            <Link to="/terms" className="text-black font-semibold underline hover:text-gray-700">
              Terms & Conditions
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-black font-semibold underline hover:text-gray-700">
              Privacy Policy
            </Link>
            .
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-3 text-sm font-body font-semibold uppercase tracking-wider hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 rounded-sm"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              CREATING ACCOUNT...
            </>
          ) : (
            <>
              CREATE ACCOUNT
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>

        {/* Divider */}
        <div className="flex items-center my-3">
          <div className="flex-1 border-t border-gray-300" />
          <span className="px-4 text-xs font-body text-gray-500 uppercase tracking-wider font-medium">
            or
          </span>
          <div className="flex-1 border-t border-gray-300" />
        </div>

        {/* Google Login */}
        <div className={googleLoading ? "pointer-events-none opacity-50" : ""}>
            <GoogleSignInButton
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
            />
        </div>

        {googleLoading && (
            <p className="text-center text-xs text-gray-500">
                Signing in with Google...
            </p>
        )}

        {/* Login Link */}
        <p className="text-center text-xs font-body text-gray-600 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="font-heading font-bold text-black hover:underline">
            LOG IN
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Register;