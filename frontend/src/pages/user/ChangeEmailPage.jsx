
import { useEffect, useState } from "react";
import { Mail, ArrowLeft, ShieldCheck } from "lucide-react";
import { toast } from "react-toastify";

import AccountLayout from "../../components/user/profile/AccountLayout";
import OtpInput from "../../components/common/OtpInput";
import Button from "../../components/common/Button";

import {
    requestChangeEmail,
    verifyChangeEmail,
    resendChangeEmailOtp,
} from "../../services/auth/authService";

import { useAuth } from "../../context/AuthContext";


const ChangeEmailPage = () => {

    const { user, updateUser } = useAuth();

    const [stage, setStage] = useState("email");

    const [newEmail, setNewEmail] = useState("");
    const [otp, setOtp] = useState("");

    const [emailError, setEmailError] = useState("");
    const [otpError, setOtpError] = useState("");
    const [error, setError] = useState("");

    const [loading, setLoading] = useState(false);
    const [remainingSeconds, setRemainingSeconds] = useState(0);
    const [otpInputKey, setOtpInputKey] = useState(0);


    // Resend OTP countdown
    useEffect(() => {

        if (remainingSeconds <= 0) return;

        const timer = setInterval(() => {
            setRemainingSeconds((prev) => Math.max(prev - 1, 0));
        }, 1000);

        return () => clearInterval(timer);

    }, [remainingSeconds]);


    // Extract backend error messages
    const getErrorMessage = (data) => {

        if (typeof data === "string") return data;

        if (data?.detail) return data.detail;

        if (data?.message) return data.message;

        return "Something went wrong. Please try again.";
    };


    // Request email change OTP
    const handleEmailSubmit = async (e) => {

        e.preventDefault();

        setEmailError("");
        setError("");

        const normalizedEmail = newEmail.trim().toLowerCase();

        if (!normalizedEmail) {
            setEmailError("Please enter your new email address.");
            return;
        }

        if (normalizedEmail === user?.email?.toLowerCase()) {
            setEmailError("This is already your current email address.");
            return;
        }

        try {

            setLoading(true);

            const response = await requestChangeEmail({
                new_email: normalizedEmail,
            });

            setNewEmail(normalizedEmail);
            setOtp("");
            setOtpInputKey((prev) => prev + 1);

            setRemainingSeconds(60);
            setStage("otp");

            toast.success(
                response.message || "Verification OTP sent successfully."
            );

        } catch (err) {

            const data = err.response?.data;

            if (data?.new_email) {
                setEmailError(
                    Array.isArray(data.new_email)
                        ? data.new_email[0]
                        : data.new_email
                );
            } else {
                setError(getErrorMessage(data));
            }

        } finally {
            setLoading(false);
        }
    };


    // Verify email change OTP
    const handleVerifyOtp = async (e) => {

        e.preventDefault();

        setOtpError("");
        setError("");

        if (otp.length !== 6) {
            setOtpError("Please enter the complete 6-digit OTP.");
            return;
        }

        try {

            setLoading(true);

            const response = await verifyChangeEmail({
                otp,
            });

            // Update email in AuthContext immediately.
            updateUser({
                email: response.email,
            });

            toast.success(
                response.message || "Email address changed successfully."
            );

            // Reset page to email entry stage.
            setStage("email");
            setNewEmail("");
            setOtp("");
            setRemainingSeconds(0);

        } catch (err) {

            const data = err.response?.data;

            if (data?.otp) {
                setOtpError(
                    Array.isArray(data.otp)
                        ? data.otp[0]
                        : data.otp
                );
            } else {
                setError(getErrorMessage(data));
            }

        } finally {
            setLoading(false);
        }
    };


    // Resend OTP
    const handleResendOtp = async () => {

        setOtpError("");
        setError("");

        try {

            setLoading(true);

            const response = await resendChangeEmailOtp();

            setOtp("");
            setOtpInputKey((prev) => prev + 1);

            setRemainingSeconds(
                response.remaining_seconds ?? 60
            );

            toast.success(
                response.message || "OTP resent successfully."
            );

        } catch (err) {

            const data = err.response?.data;

            if (data?.remaining_seconds !== undefined) {
                setRemainingSeconds(data.remaining_seconds);
            }

            setError(getErrorMessage(data));

        } finally {
            setLoading(false);
        }
    };


    // Return to email entry stage
    const handleBack = () => {

        setStage("email");

        setOtp("");
        setOtpError("");
        setError("");
        setRemainingSeconds(0);

    };


    return (

        <AccountLayout
            breadcrumb="Change Email"
            heading="Change Email"
            description="Manage your account email address."
        >

            <div className="max-w-2xl pt-6">

                {/* Section Header */}
                <div className="mb-7 flex items-center gap-3">

                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-100">

                        {stage === "email" ? (
                            <Mail className="h-5 w-5 text-gray-700" />
                        ) : (
                            <ShieldCheck className="h-5 w-5 text-gray-700" />
                        )}

                    </div>

                    <div>

                        <h3 className="font-semibold text-gray-900">
                            {stage === "email"
                                ? "Update your email address"
                                : "Verify your new email"}
                        </h3>

                        <p className="text-sm text-gray-500">
                            {stage === "email"
                                ? "Enter the email address you want to use."
                                : `Enter the OTP sent to ${newEmail}`}
                        </p>

                    </div>

                </div>


                {/* Current Email */}
                <div className="mb-6 border border-gray-200 bg-gray-50 p-4">

                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Current Email
                    </p>

                    <p className="mt-1 text-sm font-medium text-gray-900">
                        {user?.email}
                    </p>

                </div>


                {/* Stage 1: Enter New Email */}
                {stage === "email" && (

                    <form
                        onSubmit={handleEmailSubmit}
                        className="space-y-5"
                    >

                        <div>

                            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-700">
                                New Email Address
                                <span className="ml-1 text-red-500">*</span>
                            </label>

                            <input
                                type="email"
                                name="new_email"
                                value={newEmail}
                                onChange={(e) => {
                                    setNewEmail(e.target.value);
                                    setEmailError("");
                                    setError("");
                                }}
                                placeholder="Enter your new email"
                                autoComplete="email"
                                required
                                className={`w-full rounded-sm border px-3 py-3 text-sm outline-none transition ${
                                    emailError
                                        ? "border-red-500 focus:ring-1 focus:ring-red-500"
                                        : "border-gray-300 focus:border-black focus:ring-1 focus:ring-black"
                                }`}
                            />

                            {emailError && (
                                <p className="mt-1 text-xs text-red-500">
                                    {emailError}
                                </p>
                            )}

                        </div>


                        {error && (
                            <div
                                role="alert"
                                className="bg-red-50 px-4 py-3 text-sm text-red-600"
                            >
                                {error}
                            </div>
                        )}


                        <div className="border-t border-gray-100 pt-5">

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full sm:w-auto"
                            >
                                {loading ? "Sending OTP..." : "Continue"}
                            </Button>

                        </div>

                    </form>

                )}


                {/* Stage 2: Verify OTP */}
                {stage === "otp" && (

                    <form
                        onSubmit={handleVerifyOtp}
                        className="space-y-5"
                    >

                        <div className="text-center">

                            <p className="text-sm text-gray-600">
                                We've sent a 6-digit verification code to
                            </p>

                            <p className="mt-1 text-sm font-semibold text-gray-900">
                                {newEmail}
                            </p>

                        </div>


                        <div className="pt-3">

                            <OtpInput
                                key={otpInputKey}
                                length={6}
                                onChange={(value) => {
                                    setOtp(value);
                                    setOtpError("");
                                    setError("");
                                }}
                            />

                            {otpError && (
                                <p className="mb-4 text-center text-xs text-red-500">
                                    {otpError}
                                </p>
                            )}

                        </div>


                        {error && (
                            <div
                                role="alert"
                                className="bg-red-50 px-4 py-3 text-sm text-red-600"
                            >
                                {error}
                            </div>
                        )}


                        {/* Resend OTP */}
                        <div className="text-center text-sm">

                            {remainingSeconds > 0 ? (

                                <p className="text-gray-500">
                                    Resend OTP in{" "}
                                    <span className="font-semibold text-black">
                                        {remainingSeconds}s
                                    </span>
                                </p>

                            ) : (

                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={handleResendOtp}
                                    disabled={loading}
                                    className="underline"
                                >
                                    {loading ? "Sending..." : "Resend OTP"}
                                </Button>

                            )}

                        </div>


                        {/* Verify Button */}
                        <div className="border-t border-gray-100 pt-5">

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full"
                            >
                                {loading ? "Verifying..." : "Verify & Update Email"}
                            </Button>

                        </div>


                        {/* Back Button */}
                        <button
                            type="button"
                            onClick={handleBack}
                            disabled={loading}
                            className="flex w-full items-center justify-center gap-2 text-sm text-gray-500 transition hover:text-black disabled:opacity-50"
                        >
                            <ArrowLeft size={16} />
                            Change email address
                        </button>

                    </form>

                )}

            </div>

        </AccountLayout>

    );
};

export default ChangeEmailPage;
