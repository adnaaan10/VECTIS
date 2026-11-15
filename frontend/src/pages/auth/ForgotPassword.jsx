
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { toast } from "react-toastify";

import AuthLayout from "../../layouts/AuthLayout";
import EmailInput from "../../components/common/EmailInput";
import Button from "../../components/common/Button";
import authBgImage from "../../assets/images/auth-bg.jpeg";
import { forgotPassword } from "../../services/auth/authService";

const ForgotPassword = () => {

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError("");

        try {
            const response = await forgotPassword({
                email: email.trim().toLowerCase(),
            });

            toast.success(response.message);
            setSubmitted(true);

        } catch (err) {

            const errorMessage =
                err.response?.data?.email?.[0] ||
                err.response?.data?.message ||
                "Unable to process your request. Please try again.";

            setError(errorMessage);
            toast.error(errorMessage);

        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            heading="FORGOT YOUR PASSWORD?"
            subheading="Don't worry. Enter your registered email address and we'll send you a password reset link."
            tagline="GET BACK IN THE GAME."
            description="Reset your VECTIS account password securely and continue discovering the latest football boots."
            imageSrc={authBgImage}
        >

            {submitted ? (

                <div className="space-y-6 text-center">

                    <div className="flex justify-center">
                        <CheckCircle2 className="h-14 w-14 text-green-600" />
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-lg font-bold text-gray-900">
                            CHECK YOUR EMAIL
                        </h2>

                        <p className="text-sm leading-relaxed text-gray-600">
                            If an eligible account exists, a password
                            reset link has been sent to your email address.
                            Please check your inbox.
                        </p>
                    </div>

                    <Link
                        to="/login"
                        className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-black underline underline-offset-4 hover:text-gray-600"
                    >
                        Back to Login
                        <ArrowRight className="h-4 w-4" />
                    </Link>

                </div>

            ) : (

                <form onSubmit={handleSubmit} className="space-y-5">

                    <EmailInput
                        label="EMAIL ADDRESS"
                        name="email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setError("");
                        }}
                        placeholder="Enter your registered email address"
                        error={error}
                    />

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 uppercase tracking-wider rounded-sm flex items-center justify-center gap-2"
                    >
                        {loading ? "SENDING..." : "SEND RESET LINK"}

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

export default ForgotPassword;
