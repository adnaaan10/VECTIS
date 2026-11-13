
import React, { useState, useEffect, useRef} from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ArrowRight, Loader2, Mail, Clock } from "lucide-react";
import { toast } from "react-toastify";


import AuthLayout from "../../layouts/AuthLayout";
import OtpInput from "../../components/common/OtpInput";
import authBgImage from "../../assets/images/auth-bg.jpeg";
import {
  verifyEmailOtp,
  resendEmailOtp,
} from "../../services/auth/authService";

const VerifyEmail = () => {
    const [otp, setOtp] = useState("");
    const [timer, setTimer] = useState(60);
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [error, setError] = useState("");
    const [resendLimitReached, setResendLimitReached] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const resendTriggered = useRef(false);


    const email = location.state?.email;

  
    useEffect(() => {
        if (timer <= 0) return;

        const interval = setInterval(() => {
        setTimer((prev) => Math.max(prev - 1, 0));
        }, 1000);

        return () => clearInterval(interval);
    }, [timer]);


    useEffect(() => {
        if (!email) {
        navigate("/register", { replace: true });
        }
    }, [email, navigate]);


    useEffect(() => {
        if (!email || !location.state?.resendOtp || resendTriggered.current) {
            return;
        }

        resendTriggered.current = true;

        const sendOtp = async () => {
            try {
                const response = await resendEmailOtp({ email });

                setTimer(response.remaining_seconds);

                toast.success(response.message);
            } catch (error) {
                const data = error.response?.data;

                if (data?.remaining_seconds !== undefined) {
                    setTimer(data.remaining_seconds);
                }

                if (data?.message?.includes("Maximum resend limit")) {
                    setResendLimitReached(true);
                }

                toast.error(data?.message || "Unable to send OTP.");
            }
        };

        sendOtp();
    }, [email, location.state,]);

    const getErrorMessage = (data) => {
        if (typeof data === "string") return data;

        if (Array.isArray(data)) return data[0];

        if (data?.message) return getErrorMessage(data.message);

        if (data && typeof data === "object") {
        const firstValue = Object.values(data)[0];
        return getErrorMessage(firstValue);
        }

        return "Something went wrong. Please try again.";
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (otp.length !== 6) {
        setError("Please enter the complete 6-digit OTP.");
        return;
        }

        setLoading(true);
        setError("");

        try {
        const response = await verifyEmailOtp({
            email,
            otp,
        });

        toast.success(
            response.message || "Email verified successfully!"
        );

        navigate("/login", { replace: true });

        } catch (error) {
        console.error("OTP verification error:", error.response?.data);

        const message = getErrorMessage(
            error.response?.data
        );

        setError(message);
        toast.error(message);

        } finally {
        setLoading(false);
        }
    };

    const handleResend = async () => {
        setResendLoading(true);
        try {
            const response = await resendEmailOtp({ email });

            setOtp("");
            setError("");
            setTimer(response.remaining_seconds);

            toast.success(response.message);

        } catch (error) {
            const data = error.response?.data;

            if (data?.message?.includes("Maximum resend limit")) {
                setResendLimitReached(true);
            }

            if (data?.remaining_seconds !== undefined) {
                setTimer(data.remaining_seconds);
            }

            toast.error(data?.message || "Unable to resend OTP.");
        }finally{
            setResendLoading(false);
        }
    };

    const formatTime = (seconds) => {
        return `00:${seconds < 10 ? `0${seconds}` : seconds}`;
    };

    if (!email) return null;

    return (
        <AuthLayout
        tagline="STEP INTO YOUR GAME."
        description="One final step before you enter the world of premium football footwear."
        imageSrc={authBgImage}
        heading="VERIFY YOUR EMAIL"
        subheading="We've sent a 6-digit verification code to your registered email address. Enter the verification code to activate your VECTIS account."
        centerContent={true}
        >
        <form
            onSubmit={handleSubmit}
            className="font-body w-full flex flex-col items-center mt-4"
        >
            {/* Email Icon */}
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Mail className="h-6 w-6 text-gray-700" />
            </div>

            {/* Email Address */}
            <p className="text-xs text-gray-500 mb-6 text-center">
            Verification code sent to{" "}
            <span className="font-semibold text-black">
                {email}
            </span>
            </p>

            {/* OTP Input */}
            <OtpInput length={6} onChange={(value) => {
            setOtp(value);
            setError("");
            }} />

            {/* OTP Error */}
            {error && (
            <p className="text-xs text-red-500 mt-2 text-center">
                {error}
            </p>
            )}

            {/* Timer & Resend */}
            <div className="text-center my-6">
                {resendLimitReached ? (
                    <p className="text-xs text-red-500">
                        Maximum resend limit reached. Please try again later.
                    </p>
                ) : timer > 0 ? (
                    <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
                        <Clock className="h-3 w-3" />
                        Resend code in{" "}
                        <span className="font-bold text-black">
                            {formatTime(timer)}
                        </span>
                    </p>
                ) : (
                    <p className="text-xs text-gray-500">
                        Didn't receive the code?{" "}
                        <button
                            type="button"
                            onClick={handleResend}
                            disabled={resendLoading || resendLimitReached}
                            className="text-black font-bold underline hover:text-gray-700 disabled:opacity-50"
                        >
                            {resendLoading ? "Sending..." : "Resend OTP"}
                        </button>
                    </p>
                )}
            </div>

            {/* Verify Button */}
            <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="w-full bg-black text-white py-3 text-sm font-body font-semibold uppercase tracking-wider hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 rounded-sm mb-4"
            >
            {loading ? (
                <>
                <Loader2 className="h-4 w-4 animate-spin" />
                VERIFYING...
                </>
            ) : (
                <>
                VERIFY & CONTINUE
                <ArrowRight className="h-4 w-4" />
                </>
            )}
            </button>

            {/* Back Link */}
            <div className="text-center w-full">
            <Link
                to="/register"
                className="text-xs font-body text-gray-500 hover:text-black inline-flex items-center justify-center gap-1 transition-colors"
            >
                ← BACK TO REGISTRATION
            </Link>
            </div>
        </form>
        </AuthLayout>
    );
};

export default VerifyEmail;
