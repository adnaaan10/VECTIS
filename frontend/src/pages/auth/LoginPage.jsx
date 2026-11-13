import React, { useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";
import PasswordInput from "../../components/common/PasswordInput";
import authBgImage from "../../assets/images/auth-bg.jpeg";
import EmailInput from "../../components/common/EmailInput";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { ArrowRight } from "lucide-react";
import Button from "../../components/common/Button";

const Login = () => {

    const {login} = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    
    const navigate = useNavigate()
    const [loading,setLoading] = useState(false);
    const [errors,setErrors] = useState({});
    const [unverifiedEmail, setUnverifiedEmail] = useState(null);
    

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setUnverifiedEmail(null);
        setErrors({});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        setUnverifiedEmail(null);

        try{
            const payload ={
                "email":formData.email.trim().toLowerCase(),
                "password":formData.password
            }

            const response = await login(payload);

            toast.success("Logined Successful",{
                    position: "top-right",
                    autoClose: 4000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                }
            )

            console.log("Login submitted:", response);

            if (response.user.role === "ADMIN") {
                navigate("/admin/dashboard", { replace: true });
            } else {
                navigate("/", { replace: true });
            }

        }catch (error) {
    console.log("FULL ERROR:", error);
    console.log("STATUS:", error.response?.status);
    console.log("RESPONSE DATA:", error.response?.data);
    console.log(
        "EMAIL VERIFIED:",
        error.response?.data?.is_email_verified
    );

    const errorData = error.response?.data;

    if (errorData?.is_email_verified === false) {
        console.log("UNVERIFIED EMAIL DETECTED");

        setUnverifiedEmail(errorData.email);
        toast.error(errorData.message);

        return;
    }

    toast.error(
        errorData?.message || "Login failed. Please check your credentials."
    );
} finally {
  setLoading(false);
          }   
    }

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
            <EmailInput
                label="EMAIL ADDRESS"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                error={errors.email}
            />
        </div>

        {/* Password */}
        <PasswordInput
          label="PASSWORD"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
          error={errors.password}
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
        <Button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 uppercase tracking-wider rounded-sm flex items-center justify-center gap-2"
        >
            {loading ? "LOGGING IN..." : "LOG IN"}

            {!loading && (
                <ArrowRight className="h-4 w-4" />
            )}
        </Button>

        {unverifiedEmail && (
            <div className="mt-4 rounded-sm border border-amber-200 bg-amber-50 p-4">
                <p className="text-sm font-semibold text-gray-900">
                    Email Verification Required
                </p>

                <p className="mt-1 text-xs leading-relaxed text-gray-600">
                    Your email address has not been verified yet.
                    Please verify your email to access your VECTIS account.
                </p>

                <button
                    type="button"
                    onClick={() =>
                        navigate("/verify-email", {
                            state: { email: unverifiedEmail,
                              resendOtp:true,
                             },
                        })
                    }
                    className="mt-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-black underline underline-offset-4 hover:text-gray-600"
                >
                    Verify Email
                    <ArrowRight className="h-3.5 w-3.5" />
                </button>
            </div>
        )}

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-gray-300" />
          <span className="px-4 text-xs text-gray-500 uppercase tracking-wider">
            or
          </span>
          <div className="flex-1 border-t border-gray-300" />
        </div>

        {/* Google Login */}
        <Button
          type="button"
          variant="secondary"
          className="w-full py-3 border border-gray-300 rounded-sm bg-white text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-3"
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
      </Button>
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