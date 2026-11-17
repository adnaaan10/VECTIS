
import { useState,useEffect } from "react";
import { Edit3, Save, X } from "lucide-react";

import { useAuth } from "../../../context/AuthContext";
import { updateUserProfile } from "../../../services/UserService/userService";

const ProfileForm = () => {

    const { user, updateUser } = useAuth();

    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        first_name: user?.first_name || "",
        last_name: user?.last_name || "",
        phone: user?.phone || "",
    });

    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState("");


    useEffect(() => {
        if (user) {
            setFormData({
                first_name: user.first_name || "",
                last_name: user.last_name || "",
                phone: user.phone || "",
            });
        }
    }, [
        user?.first_name,
        user?.last_name,
        user?.phone,
    ]);

    // Handle input changes
    const handleChange = (event) => {

        const { name, value } = event.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));

        setSuccess("");
    };


    // Enable editing
    const handleEdit = () => {

        setFormData({
            first_name: user?.first_name || "",
            last_name: user?.last_name || "",
            phone: user?.phone || "",
        });

        setErrors({});
        setSuccess("");
        setIsEditing(true);
    };


    // Cancel editing
    const handleCancel = () => {

        setFormData({
            first_name: user?.first_name || "",
            last_name: user?.last_name || "",
            phone: user?.phone || "",
        });

        setErrors({});
        setIsEditing(false);
    };


    // Frontend validation
    const validateForm = () => {

        const newErrors = {};

        const firstName = formData.first_name.trim();
        const lastName = formData.last_name.trim();
        const phone = formData.phone.trim();

        if (!firstName) {
            newErrors.first_name = "First name is required.";
        }

        if (!lastName) {
            newErrors.last_name = "Last name is required.";
        }

        if (!/^[6-9]\d{9}$/.test(phone)) {
            newErrors.phone = "Enter a valid 10-digit mobile number.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };


    // Save profile
    const handleSubmit = async (event) => {

        event.preventDefault();

        if (!validateForm()) return;

        setSaving(true);
        setErrors({});
        setSuccess("");

        const payload = {
            first_name: formData.first_name.trim(),
            last_name: formData.last_name.trim(),
            phone: formData.phone.trim(),
        };

        try {

            const response = await updateUserProfile(payload);

            // Synchronize updated profile with AuthContext
            updateUser({
                first_name: response.first_name,
                last_name: response.last_name,
                phone: response.phone,
            });

            setFormData({
                first_name: response.first_name,
                last_name: response.last_name,
                phone: response.phone,
            });

            setIsEditing(false);
            setSuccess("Profile updated successfully.");

        } catch (error) {

            const responseErrors = error.response?.data;

            if (responseErrors && typeof responseErrors === "object") {

                const fieldErrors = {};

                ["first_name", "last_name", "phone"].forEach((field) => {
                    if (responseErrors[field]) {
                        fieldErrors[field] = Array.isArray(responseErrors[field])
                            ? responseErrors[field][0]
                            : responseErrors[field];
                    }
                });

                if (Object.keys(fieldErrors).length > 0) {
                    setErrors(fieldErrors);
                } else {
                    setErrors({
                        general:
                            responseErrors.message ||
                            responseErrors.non_field_errors?.[0] ||
                            "Unable to update profile.",
                    });
                }

            } else {
                setErrors({
                    general: "Unable to update profile. Please try again.",
                });
            }

        } finally {
            setSaving(false);
        }
    };


    // Reusable input field
    const renderField = (label, name, value, error, type = "text") => (

        <div>
            <label
                htmlFor={name}
                className="mb-2 block text-[10px] font-semibold uppercase tracking-widest text-gray-500"
            >
                {label}
            </label>

            <input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={handleChange}
                disabled={!isEditing || saving}
                className={`w-full border px-4 py-3 text-sm text-black outline-none transition-colors ${
                    error
                        ? "border-red-500"
                        : isEditing
                            ? "border-gray-400 focus:border-black"
                            : "border-gray-200 bg-gray-50"
                } disabled:cursor-not-allowed`}
            />

            {error && (
                <p className="mt-1 text-xs text-red-600">
                    {error}
                </p>
            )}
        </div>
    );


    return (
        <section className="py-7">

            {/* Section header */}
            <div className="mb-7 flex items-center justify-between">

                <div>
                    <h3 className="text-sm font-semibold uppercase tracking-widest">
                        Personal Information
                    </h3>

                    <p className="mt-1 text-xs text-gray-500">
                        Manage your personal account details.
                    </p>
                </div>

                {!isEditing && (
                    <button
                        type="button"
                        onClick={handleEdit}
                        className="inline-flex items-center gap-2 border border-black px-4 py-2.5 text-[10px] font-semibold uppercase tracking-widest transition-colors hover:bg-black hover:text-white"
                    >
                        <Edit3 size={13} />
                        Edit Profile
                    </button>
                )}

            </div>


            <form onSubmit={handleSubmit}>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                    {renderField(
                        "First Name",
                        "first_name",
                        formData.first_name,
                        errors.first_name
                    )}

                    {renderField(
                        "Last Name",
                        "last_name",
                        formData.last_name,
                        errors.last_name
                    )}


                    {/* Email - Always read-only */}
                    <div>

                        <label
                            htmlFor="email"
                            className="mb-2 block text-[10px] font-semibold uppercase tracking-widest text-gray-500"
                        >
                            Email Address
                        </label>

                        <div className="flex flex-col gap-2 sm:flex-row">

                            <input
                                id="email"
                                type="email"
                                value={user?.email || ""}
                                disabled
                                className="w-full border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600"
                            />

                            <span className={`flex shrink-0 items-center justify-center gap-1 text-[10px] font-semibold uppercase tracking-wider ${
                                user?.is_email_verified
                                    ? "text-green-700"
                                    : "text-red-600"
                            }`}>
                                {user?.is_email_verified
                                    ? "Verified"
                                    : "Not verified"}
                            </span>

                        </div>

                    </div>


                    {renderField(
                        "Contact Telephone",
                        "phone",
                        formData.phone,
                        errors.phone,
                        "tel"
                    )}

                </div>


                {/* General error */}
                {errors.general && (
                    <p role="alert" className="mt-5 text-sm text-red-600">
                        {errors.general}
                    </p>
                )}


                {/* Success message */}
                {success && (
                    <p role="status" className="mt-5 text-sm text-green-700">
                        {success}
                    </p>
                )}


                {/* Edit actions */}
                {isEditing && (
                    <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-gray-200 pt-6">

                        <button
                            type="submit"
                            disabled={saving}
                            className="inline-flex items-center gap-2 bg-black px-6 py-3 text-[10px] font-semibold uppercase tracking-widest text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <Save size={14} />
                            {saving ? "Saving..." : "Save Changes"}
                        </button>

                        <button
                            type="button"
                            onClick={handleCancel}
                            disabled={saving}
                            className="inline-flex items-center gap-2 border border-gray-300 px-6 py-3 text-[10px] font-semibold uppercase tracking-widest text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                        >
                            <X size={14} />
                            Cancel
                        </button>

                    </div>
                )}

            </form>

        </section>
    );
};

export default ProfileForm;
