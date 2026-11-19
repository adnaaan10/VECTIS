import React, { useState,useEffect,useCallback } from "react";
import { Link,useNavigate,useLocation } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";
import PasswordInput from "../../components/common/PasswordInput";
import authBgImage from "../../assets/images/auth-bg.jpeg";
import EmailInput from "../../components/common/EmailInput";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { ArrowRight } from "lucide-react";
import Button from "../../components/common/Button";
import GoogleSignInButton from "../../components/common/GoogleSignInButton";
import { googleLogin } from "../../services/UserService/userService";

const Login = () => {

    const {login,updateUser} = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    
    const navigate = useNavigate();
    const location = useLocation();
    
    const [loading,setLoading] = useState(false);
    const [errors,setErrors] = useState({});
    const [unverifiedEmail, setUnverifiedEmail] = useState(null);
    const [googleLoading, setGoogleLoading] = useState(false);
    

    useEffect(() => {
      if (location.state?.message) {
        toast.success(location.state.message, {
          toastId:"password-change-success",
          autoClose: 4000,
        });

        // Clear the message so it doesn't appear again.
        navigate(location.pathname, {
          replace: true,
          state: null,
        });
      }
    }, [location, navigate]);

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

            if (response?.user?.role === "ADMIN") {
                navigate("/admin/customers", { replace: true });
            } else {
                navigate("/", { replace: true });
            }

        }catch (error) {

    const errorData = error.response?.data;

    if (errorData?.is_email_verified === false) {

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

  
  const handleGoogleSuccess = useCallback(async (credential) => {
    setGoogleLoading(true);

    try {
        const response = await googleLogin(credential);

        // Update the authenticated user in AuthContext.
        updateUser(response.user);

        toast.success("Google login successful!");

        navigate("/",{replace:true});

    } catch (error) {
        const errorMessage =
            error.response?.data?.message ||
            "Google authentication failed. Please try again.";

        toast.error(errorMessage);

    } finally {
        setGoogleLoading(false);
    }
  }, [updateUser, navigate]);

  const handleGoogleError = useCallback((message) => {
      toast.error(message || "Google authentication failed.");
  }, []);

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