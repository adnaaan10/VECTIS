
import { useEffect, useRef, useState } from "react";
import { Camera, Trash2, Upload, X } from "lucide-react";

import { useAuth } from "../../../context/AuthContext";
import {
    uploadUserAvatar,
    removeUserAvatar,
} from "../../../services/UserService/userService";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
];

const ProfileAvatar = () => {

    const { user, updateUser } = useAuth();

    const fileInputRef = useRef(null);

    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const [uploading, setUploading] = useState(false);
    const [removing, setRemoving] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Create and clean up image preview URL
    useEffect(() => {

        if (!selectedFile) {
            setPreviewUrl(null);
            return;
        }

        const objectUrl = URL.createObjectURL(selectedFile);

        setPreviewUrl(objectUrl);

        return () => {
            URL.revokeObjectURL(objectUrl);
        };

    }, [selectedFile]);


    // User initials
    const initials = `${user?.first_name?.charAt(0) || ""}${user?.last_name?.charAt(0) || ""}`
        .toUpperCase();


    // Validate selected image
    const handleFileChange = (event) => {

        const file = event.target.files?.[0];

        if (!file) return;

        setError("");
        setSuccess("");

        if (!ALLOWED_TYPES.includes(file.type)) {
            setError("Only JPG, PNG and WEBP images are allowed.");
            event.target.value = "";
            return;
        }

        if (file.size > MAX_FILE_SIZE) {
            setError("Image size must not exceed 5 MB.");
            event.target.value = "";
            return;
        }

        setSelectedFile(file);
    };


    // Cancel selected image
    const handleCancel = () => {

        setSelectedFile(null);
        setError("");
        setSuccess("");

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };


    // Upload or replace avatar
    const handleUpload = async () => {

        if (!selectedFile) return;

        setUploading(true);
        setError("");
        setSuccess("");

        try {

            const response = await uploadUserAvatar(selectedFile);

            updateUser({
                avatar_url: response.avatar_url,
            });

            setSelectedFile(null);

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }

            setSuccess(response.message);

        } catch (error) {

            setError(
                error.response?.data?.avatar?.[0] ||
                error.response?.data?.message ||
                "Unable to upload profile picture. Please try again."
            );

        } finally {
            setUploading(false);
        }
    };


    // Remove existing avatar
    const handleRemove = async () => {

        setRemoving(true);
        setError("");
        setSuccess("");

        try {

            const response = await removeUserAvatar();

            updateUser({
                avatar_url: null,
            });

            setSelectedFile(null);

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }

            setSuccess(response.message);

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Unable to remove profile picture. Please try again."
            );

        } finally {
            setRemoving(false);
        }
    };


    const currentAvatar = previewUrl || user?.avatar_url;

    return (
        <section className="border-b border-gray-200 py-7">

            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

                {/* Avatar and user details */}
                <div className="flex items-center gap-5">

                    <div className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border border-gray-200 bg-gray-100">

                        {currentAvatar ? (
                            <img
                                src={currentAvatar}
                                alt="Profile"
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <span className="text-2xl font-semibold text-gray-500">
                                {initials || "U"}
                            </span>
                        )}

                    </div>

                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider">
                            Profile Photo
                        </h3>

                        <p className="mt-1 text-xs text-gray-500">
                            Upload a profile picture for your account.
                        </p>

                        <p className="mt-1 text-[10px] uppercase tracking-wider text-gray-400">
                            JPG, PNG or WEBP · Maximum 5 MB
                        </p>
                    </div>

                </div>


                {/* Avatar actions */}
                <div className="flex flex-wrap items-center gap-3">

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleFileChange}
                        className="hidden"
                    />

                    {!selectedFile ? (
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading || removing}
                            className="inline-flex items-center gap-2 bg-black px-5 py-3 text-[10px] font-semibold uppercase tracking-widest text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <Camera size={14} />
                            Change Photo
                        </button>
                    ) : (
                        <>
                            <button
                                type="button"
                                onClick={handleUpload}
                                disabled={uploading || removing}
                                className="inline-flex items-center gap-2 bg-black px-5 py-3 text-[10px] font-semibold uppercase tracking-widest text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <Upload size={14} />
                                {uploading ? "Uploading..." : "Confirm Upload"}
                            </button>

                            <button
                                type="button"
                                onClick={handleCancel}
                                disabled={uploading}
                                className="inline-flex items-center gap-2 border border-gray-300 px-4 py-3 text-[10px] font-semibold uppercase tracking-widest text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                            >
                                <X size={14} />
                                Cancel
                            </button>
                        </>
                    )}

                    {user?.avatar_url && !selectedFile && (
                        <button
                            type="button"
                            onClick={handleRemove}
                            disabled={uploading || removing}
                            className="inline-flex items-center gap-2 border border-gray-300 px-4 py-3 text-[10px] font-semibold uppercase tracking-widest text-red-600 transition-colors hover:border-red-200 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <Trash2 size={14} />
                            {removing ? "Removing..." : "Remove"}
                        </button>
                    )}

                </div>

            </div>


            {/* Error message */}
            {error && (
                <p
                    role="alert"
                    className="mt-4 text-xs font-medium text-red-600"
                >
                    {error}
                </p>
            )}


            {/* Success message */}
            {success && (
                <p
                    role="status"
                    className="mt-4 text-xs font-medium text-green-700"
                >
                    {success}
                </p>
            )}

        </section>
    );
};

export default ProfileAvatar;
