import { useEffect, useState } from "react";
import { UserRound, Phone, ArrowRight } from "lucide-react";
import Button from "../../common/Button";

const ProfileCompletionModal = ({
    user,
    onSubmit,
    loading = false,
    errors = {},
}) => {
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        phone: "",
    });

    useEffect(() => {
        if (user) {
            setFormData({
                first_name: user.first_name || "",
                last_name: user.last_name || "",
                phone: user.phone || "",
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        onSubmit({
            first_name: formData.first_name.trim(),
            last_name: formData.last_name.trim(),
            phone: formData.phone.trim(),
        });
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">

            <div className="w-full max-w-md bg-white rounded-sm shadow-2xl p-6 sm:p-8">

                {/* Heading */}
                <div className="mb-7">
                    <div className="w-12 h-12 bg-gray-100 flex items-center justify-center mb-5">
                        <UserRound className="w-6 h-6 text-black" />
                    </div>

                    <p className="text-xs font-semibold tracking-[0.2em] text-gray-500 uppercase mb-2">
                        ONE LAST STEP
                    </p>

                    <h2 className="text-2xl font-bold tracking-tight text-black">
                        Complete Your Profile
                    </h2>

                    <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                        Add your contact details to complete your VECTIS
                        account and get ready for the game.
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* First Name */}
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wide text-gray-700 mb-1">
                            First Name
                        </label>

                        <input
                            type="text"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                            required
                            maxLength={100}
                            placeholder="Enter your first name"
                            className="w-full px-3 py-3 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-black"
                        />

                        {errors.first_name && (
                            <p className="text-xs text-red-500 mt-1">
                                {errors.first_name}
                            </p>
                        )}
                    </div>

                    {/* Last Name */}
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wide text-gray-700 mb-1">
                            Last Name
                        </label>

                        <input
                            type="text"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                            required
                            maxLength={100}
                            placeholder="Enter your last name"
                            className="w-full px-3 py-3 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-black"
                        />

                        {errors.last_name && (
                            <p className="text-xs text-red-500 mt-1">
                                {errors.last_name}
                            </p>
                        )}
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wide text-gray-700 mb-1">
                            Phone Number
                        </label>

                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                maxLength={10}
                                placeholder="Enter 10-digit mobile number"
                                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-black"
                            />
                        </div>

                        {errors.phone && (
                            <p className="text-xs text-red-500 mt-1">
                                {errors.phone}
                            </p>
                        )}
                    </div>

                    {/* Submit */}
                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 mt-3 uppercase tracking-wider rounded-sm flex items-center justify-center gap-2"
                    >
                        {loading
                            ? "SAVING PROFILE..."
                            : "COMPLETE PROFILE"}

                        {!loading && (
                            <ArrowRight className="w-4 h-4" />
                        )}
                    </Button>

                </form>
            </div>
        </div>
    );
};

export default ProfileCompletionModal;
