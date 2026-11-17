import { useEffect, useState } from "react";
import { X } from "lucide-react";

const initialFormData = {
  address_type: "HOME",
  full_name: "",
  phone: "",
  address_line_1: "",
  address_line_2: "",
  landmark: "",
  city: "",
  state: "",
  postal_code: "",
  country: "India",
};

const AddressForm = ({
  address,
  onSubmit,
  onCancel,
  submitting = false,
}) => {
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (address) {
      setFormData({
        address_type: address.address_type || "HOME",
        full_name: address.full_name || "",
        phone: address.phone || "",
        address_line_1: address.address_line_1 || "",
        address_line_2: address.address_line_2 || "",
        landmark: address.landmark || "",
        city: address.city || "",
        state: address.state || "",
        postal_code: address.postal_code || "",
        country: address.country || "India",
      });
    } else {
      setFormData(initialFormData);
    }
  }, [address]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const inputClass =
    "w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black";

  const labelClass =
    "mb-2 block text-sm font-medium text-gray-700";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl sm:p-8">

        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {address ? "Edit Address" : "Add New Address"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Enter your delivery address details.
            </p>
          </div>

          <button
            type="button"
            onClick={onCancel}
            className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-black"
            aria-label="Close form"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Address type */}
          <div>
            <label className={labelClass}>
              Address Type
            </label>

            <div className="grid grid-cols-3 gap-3">
              {["HOME", "WORK", "OTHER"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      address_type: type,
                    }))
                  }
                  className={`rounded-lg border px-3 py-3 text-sm font-medium transition ${
                    formData.address_type === type
                      ? "border-black bg-black text-white"
                      : "border-gray-300 text-gray-600 hover:border-gray-500"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Full name and phone */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Full Name *</label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                className={inputClass}
                placeholder="Enter full name"
                maxLength={100}
                required
              />
            </div>

            <div>
              <label className={labelClass}>Phone Number *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={inputClass}
                placeholder="10-digit mobile number"
                maxLength={10}
                inputMode="numeric"
                pattern="[6-9][0-9]{9}"
                required
              />
            </div>
          </div>

          {/* Address lines */}
          <div>
            <label className={labelClass}>Address Line 1 *</label>
            <input
              type="text"
              name="address_line_1"
              value={formData.address_line_1}
              onChange={handleChange}
              className={inputClass}
              placeholder="House number, building, street"
              maxLength={255}
              required
            />
          </div>

          <div>
            <label className={labelClass}>Address Line 2</label>
            <input
              type="text"
              name="address_line_2"
              value={formData.address_line_2}
              onChange={handleChange}
              className={inputClass}
              placeholder="Area, locality (optional)"
              maxLength={255}
            />
          </div>

          <div>
            <label className={labelClass}>Landmark</label>
            <input
              type="text"
              name="landmark"
              value={formData.landmark}
              onChange={handleChange}
              className={inputClass}
              placeholder="Nearby landmark (optional)"
              maxLength={150}
            />
          </div>

          {/* City and state */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass}>City *</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className={inputClass}
                placeholder="Enter city"
                maxLength={100}
                required
              />
            </div>

            <div>
              <label className={labelClass}>State *</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className={inputClass}
                placeholder="Enter state"
                maxLength={100}
                required
              />
            </div>
          </div>

          {/* PIN code and country */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass}>PIN Code *</label>
              <input
                type="text"
                name="postal_code"
                value={formData.postal_code}
                onChange={handleChange}
                className={inputClass}
                placeholder="6-digit PIN code"
                maxLength={6}
                inputMode="numeric"
                pattern="[0-9]{6}"
                required
              />
            </div>

            <div>
              <label className={labelClass}>Country *</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">
            <button
              type="button"
              onClick={onCancel}
              disabled={submitting}
              className="rounded-lg border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting
                ? "Saving..."
                : address
                  ? "Save Changes"
                  : "Save Address"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddressForm;
