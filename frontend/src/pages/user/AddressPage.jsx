
import { useCallback, useEffect, useState } from "react";
import { Plus } from "lucide-react";

import AccountLayout from "../../components/user/profile/AccountLayout";
import AddressList from "../../components/user/address/AddressList";
import AddressForm from "../../components/user/address/AddressForm";

import {
    getAddresses,
    createAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
} from "../../services/UserService/addressService";


const getErrorMessage = (err) => {
    const data = err.response?.data;

    if (typeof data?.detail === "string") {
        return data.detail;
    }

    if (typeof data?.message === "string") {
        return data.message;
    }

    if (data && typeof data === "object") {
        const firstError = Object.values(data).flat()[0];

        if (typeof firstError === "string") {
            return firstError;
        }
    }

    return "Something went wrong. Please try again.";
};


const AddressPage = () => {

    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);


    // Fetch addresses
    const fetchAddresses = useCallback(async () => {
        try {
            setError("");

            const data = await getAddresses();
            setAddresses(data);

        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }, []);


    useEffect(() => {
        fetchAddresses();
    }, [fetchAddresses]);


    // Open add address form
    const handleAddAddress = () => {
        setSelectedAddress(null);
        setError("");
        setSuccess("");
        setIsFormOpen(true);
    };


    // Open edit address form
    const handleEdit = (address) => {
        setSelectedAddress(address);
        setError("");
        setSuccess("");
        setIsFormOpen(true);
    };


    // Close address form
    const handleCloseForm = () => {
        if (submitting) return;

        setIsFormOpen(false);
        setSelectedAddress(null);
    };


    // Create or update address
    const handleSaveAddress = async (formData) => {
        try {
            setSubmitting(true);
            setError("");
            setSuccess("");

            if (selectedAddress) {
                await updateAddress(selectedAddress.id, formData);
                setSuccess("Address updated successfully.");
            } else {
                await createAddress(formData);
                setSuccess("Address added successfully.");
            }

            setIsFormOpen(false);
            setSelectedAddress(null);

            await fetchAddresses();

        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setSubmitting(false);
        }
    };


    // Set default address
    const handleSetDefault = async (id) => {
        try {
            setError("");
            setSuccess("");

            await setDefaultAddress(id);

            setSuccess("Default address updated successfully.");

            await fetchAddresses();

        } catch (err) {
            setError(getErrorMessage(err));
        }
    };


    // Delete address
    const handleDelete = async (address) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this address?"
        );

        if (!confirmed) return;

        try {
            setError("");
            setSuccess("");

            await deleteAddress(address.id);

            setSuccess("Address deleted successfully.");

            await fetchAddresses();

        } catch (err) {
            setError(getErrorMessage(err));
        }
    };


    return (
        <>
            <AccountLayout
                breadcrumb="My Addresses"
                heading="My Addresses"
                description="Manage your saved delivery addresses."
            >

                {/* Address Heading and Add Button */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 py-6">

                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                            Saved Addresses
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                            {addresses.length} saved address(es)
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleAddAddress}
                        className="flex items-center gap-2 bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
                    >
                        <Plus className="h-4 w-4" />
                        Add New Address
                    </button>

                </div>


                {/* Success Message */}
                {success && (
                    <div
                        role="status"
                        className="mt-5 bg-green-50 px-4 py-3 text-sm text-green-700"
                    >
                        {success}
                    </div>
                )}


                {/* Error Message */}
                {error && (
                    <div
                        role="alert"
                        className="mt-5 bg-red-50 px-4 py-3 text-sm text-red-600"
                    >
                        {error}
                    </div>
                )}


                {/* Address List */}
                <div className="pt-6">

                    {loading ? (
                        <div className="py-16 text-center text-sm text-gray-500">
                            Loading your addresses...
                        </div>
                    ) : (
                        <AddressList
                            addresses={addresses}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onSetDefault={handleSetDefault}
                        />
                    )}

                </div>

            </AccountLayout>


            {/* Add/Edit Address Modal */}
            {isFormOpen && (
                <AddressForm
                    address={selectedAddress}
                    onSubmit={handleSaveAddress}
                    onCancel={handleCloseForm}
                    submitting={submitting}
                />
            )}
        </>
    );
};

export default AddressPage;
