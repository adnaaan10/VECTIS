import { useState } from "react";
import { toast } from "react-toastify";

import { useAuth } from "../../../context/AuthContext";
import { completeUserProfile } from "../../../services/UserService/userService";
import ProfileCompletionModal from "./ProfileCompletionModal";

const ProfileCompletionHandler = () => {

    const {
        user,
        requiresProfileCompletion,
        updateUser,
    } = useAuth();

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleSubmit = async (data) => {

        setLoading(true);
        setErrors({});

        try {
            const response = await completeUserProfile(data);

            // Update AuthContext with the completed profile.
            updateUser(response.user);

            toast.success("Your profile has been completed successfully!");

        } catch (error) {

            const errorData = error.response?.data;

            if (errorData && typeof errorData === "object") {
                setErrors(errorData);
            }

            toast.error(
                errorData?.message ||
                "Unable to complete your profile. Please try again."
            );

        } finally {
            setLoading(false);
        }
    };

    if (!requiresProfileCompletion) {
        return null;
    }

    return (
        <ProfileCompletionModal
            user={user}
            onSubmit={handleSubmit}
            loading={loading}
            errors={errors}
        />
    );
};

export default ProfileCompletionHandler;
