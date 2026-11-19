
import AccountLayout from "../../components/user/profile/AccountLayout";
import ProfileAvatar from "../../components/user/profile/ProfileAvatar";
import ProfileForm from "../../components/user/profile/ProfileForm";

const ProfilePage = () => {
    return (
        <AccountLayout
            breadcrumb="My Profile"
            heading="My Profile"
            description="Manage your personal information and profile details."
        >
            <ProfileAvatar />
            <ProfileForm />
        </AccountLayout>
    );
};

export default ProfilePage;
