
import { useState } from "react";
import { LockKeyhole } from "lucide-react";
import { useNavigate } from "react-router-dom";

import AccountLayout from "../../components/user/profile/AccountLayout";
import PasswordInput from "../../components/common/PasswordInput";

import { changePassword } from "../../services/auth/authService";
import { useAuth } from "../../context/AuthContext";


const ChangePasswordPage = () => {

  const navigate = useNavigate();
  const { clearAuth } = useAuth();

  const [formData, setFormData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear the corresponding field error
    setFieldErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    setError("");
  };


  // Handle password change
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setFieldErrors({});

    if (formData.new_password !== formData.confirm_password) {
      setFieldErrors({
        confirm_password: "New password and confirmation do not match.",
      });
      return;
    }

    if (formData.current_password === formData.new_password) {
      setFieldErrors({
        new_password: "New password must be different from the current password.",
      });
      return;
    }

    try {
      setLoading(true);

      await changePassword(formData);

      // Clear authentication state and cookies
      clearAuth();

      navigate("/login", {
        replace: true,
        state: {
          message: "Password changed successfully. Please log in with your new password.",
        },
      });

    } catch (err) {

      const data = err.response?.data;

      if (data && typeof data === "object") {

        const errors = {};

        Object.entries(data).forEach(([field, messages]) => {
          if (
            ["current_password", "new_password", "confirm_password"].includes(field)
          ) {
            errors[field] = Array.isArray(messages)
              ? messages[0]
              : messages;
          }
        });

        if (Object.keys(errors).length > 0) {
          setFieldErrors(errors);
        } else {
          setError(
            data.detail ||
            data.message ||
            "Unable to change password. Please try again."
          );
        }

      } else {
        setError("Something went wrong. Please try again.");
      }

    } finally {
      setLoading(false);
    }
  };


  return (
    <AccountLayout
      breadcrumb="Change Password"
      heading="Change Password"
      description="Update your password to keep your account secure."
    >

      <div className="max-w-2xl pt-6">

        {/* Section heading */}
        <div className="mb-7 flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-100">
            <LockKeyhole className="h-5 w-5 text-gray-700" />
          </div>

          <div>
            <h3 className="font-semibold text-gray-900">
              Update your password
            </h3>

            <p className="text-sm text-gray-500">
              Enter your current and new password.
            </p>
          </div>

        </div>


        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Current password */}
          <PasswordInput
            label="Current Password"
            name="current_password"
            placeholder="Enter current password"
            value={formData.current_password}
            onChange={handleChange}
            error={fieldErrors.current_password}
          />


          {/* New password */}
          <PasswordInput
            label="New Password"
            name="new_password"
            placeholder="Enter new password"
            value={formData.new_password}
            onChange={handleChange}
            error={fieldErrors.new_password}
          />


          {/* Confirm password */}
          <PasswordInput
            label="Confirm New Password"
            name="confirm_password"
            placeholder="Re-enter new password"
            value={formData.confirm_password}
            onChange={handleChange}
            error={fieldErrors.confirm_password}
          />


          {/* General error */}
          {error && (
            <div
              role="alert"
              className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600"
            >
              {error}
            </div>
          )}


          {/* Submit button */}
          <div className="border-t border-gray-100 pt-5">

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>

          </div>

        </form>

      </div>

    </AccountLayout>
  );
};

export default ChangePasswordPage;
