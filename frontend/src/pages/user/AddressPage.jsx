
import { useCallback, useEffect, useState } from "react";
import { Plus } from "lucide-react";

import AccountSidebar from "../../components/user/profile/AccountSidebar";
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
    <div className="bg-white">

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <div className="mb-8 text-sm text-gray-500">
          Home / My Account / My Addresses
        </div>


        {/* Page heading */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            My Addresses
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Manage your saved delivery addresses.
          </p>
        </div>


        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">

          {/* Account sidebar */}
          <AccountSidebar />


          {/* Main content */}
          <main>

            {/* Address heading and Add button */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">

              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Saved Addresses
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {addresses.length} saved address(es)
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddAddress}
                className="flex items-center gap-2 rounded-lg bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
              >
                <Plus className="h-4 w-4" />
                Add New Address
              </button>

            </div>


            {/* Success message */}
            {success && (
              <div className="mb-5 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
                {success}
              </div>
            )}


            {/* Error message */}
            {error && (
              <div className="mb-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}


            {/* Loading state */}
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

          </main>

        </div>

      </div>


      {/* Add/Edit Address Modal */}
      {isFormOpen && (
        <AddressForm
          address={selectedAddress}
          onSubmit={handleSaveAddress}
          onCancel={handleCloseForm}
          submitting={submitting}
        />
      )}

    </div>
  );
};

export default AddressPage;
