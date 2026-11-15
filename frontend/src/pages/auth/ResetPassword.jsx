
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "react-toastify";

import AuthLayout from "../../layouts/AuthLayout";
import PasswordInput from "../../components/common/PasswordInput";
import Button from "../../components/common/Button";
import authBgImage from "../../assets/images/auth-bg.jpeg";
import { resetPassword } from "../../services/auth/authService";

const ResetPassword = () => {

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const token = searchParams.get("token");

    const [formData, setFormData] = useState({
        new_password: "",
        confirm_password: "",
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setErrors({});

        if (!token) {
            toast.error("Invalid or missing password reset link.");
            return;
        }

        if (formData.new_password !== formData.confirm_password) {
            setErrors({
                confirm_password: "Passwords do not match.",
            });
            return;
        }

        setLoading(true);

        try {
            const response = await resetPassword({
                token,
                new_password: formData.new_password,
                confirm_password: formData.confirm_password,
            });

            toast.success(
                response.message || "Password reset successfully."
            );

            setSubmitted(true);

        } catch (error) {

            const errorData = error.response?.data;

            const backendErrors = {
                new_password: errorData?.new_password?.[0] || "",
                confirm_password: errorData?.confirm_password?.[0] || "",
                token: errorData?.token?.[0] || "",
            };

            const hasFieldErrors = Object.values(backendErrors).some(Boolean);

            if (hasFieldErrors) {
                setErrors(backendErrors);
            } else {
                toast.error(
                    errorData?.detail ||
                    errorData?.message ||
                    "Unable to reset password. Please try again."
                );
            }

        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            heading={
                submitted
                    ? "PASSWORD RESET SUCCESSFUL"
                    : "RESET YOUR PASSWORD"
            }
            subheading={
                submitted
                    ? "Your VECTIS account password has been updated."
                    : "Create a new password to regain access to your account."
            }
            tagline="GET BACK IN THE GAME."
            description="Secure your VECTIS account and get ready to discover your next pair of football boots."
            imageSrc={authBgImage}
            centerContent={submitted}
        >

            {submitted ? (

                <div className="space-y-6 text-center">

                    <div className="flex justify-center">
                        <CheckCircle2 className="h-14 w-14 text-green-600" />
                    </div>

                    <p className="text-sm leading-relaxed text-gray-600">
                        Your password has been changed successfully.
                        You can now log in using your new password.
                    </p>

                    <Button
                        type="button"
                        onClick={() => navigate("/login", { replace: true })}
                        className="w-full py-3.5 uppercase tracking-wider rounded-sm flex items-center justify-center gap-2"
                    >
                        GO TO LOGIN
                        <ArrowRight className="h-4 w-4" />
                    </Button>

                </div>

            ) : !token ? (

                <div className="space-y-5 text-center">

                    <div className="flex justify-center">
                        <AlertCircle className="h-14 w-14 text-red-500" />
                    </div>

                    <p className="text-sm leading-relaxed text-gray-600">
                        This password reset link is invalid or missing.
                        Please request a new password reset link.
                    </p>

                    <Link
                        to="/forgot-password"
                        className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-black underline underline-offset-4"
                    >
                        REQUEST NEW LINK
                        <ArrowRight className="h-4 w-4" />
                    </Link>

                </div>

            ) : (

                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* New Password */}
                    <PasswordInput
                        label="NEW PASSWORD"
                        name="new_password"
                        value={formData.new_password}
                        onChange={handleChange}
                        placeholder="Enter your new password"
                        error={errors.new_password}
                    />

                    {/* Confirm Password */}
                    <PasswordInput
                        label="CONFIRM NEW PASSWORD"
                        name="confirm_password"
                        value={formData.confirm_password}
                        onChange={handleChange}
                        placeholder="Confirm your new password"
                        error={errors.confirm_password}
                    />

                    {/* Token Error */}
                    {errors.token && (
                        <p className="text-xs text-red-500">
                            {errors.token}
                        </p>
                    )}

                    {/* Submit */}
                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 uppercase tracking-wider rounded-sm flex items-center justify-center gap-2"
                    >
                        {loading ? "RESETTING PASSWORD..." : "RESET PASSWORD"}

                        {!loading && (
                            <ArrowRight className="h-4 w-4" />
                        )}
                    </Button>

                    <p className="text-center text-sm text-gray-600">
                        Remember your password?{" "}
                        <Link
                            to="/login"
                            className="font-semibold text-black hover:underline"
                        >
                            LOG IN
                        </Link>
                    </p>

                </form>

            )}

        </AuthLayout>
    );
};

export default ResetPassword;
