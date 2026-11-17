
import { MapPin, Home, Briefcase, MapPinned } from "lucide-react";

const AddressList = ({ addresses, onEdit, onDelete, onSetDefault }) => {

  const getAddressIcon = (type) => {
    switch (type) {
      case "HOME":
        return Home;
      case "WORK":
        return Briefcase;
      default:
        return MapPinned;
    }
  };

  if (!addresses || addresses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 px-6 py-16 text-center">
        <MapPin className="mb-4 h-10 w-10 text-gray-400" />

        <h3 className="text-lg font-semibold text-gray-900">
          No addresses saved yet
        </h3>

        <p className="mt-2 max-w-sm text-sm text-gray-500">
          Add your delivery address to make your next checkout faster.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

      {addresses.map((address) => {
        const AddressIcon = getAddressIcon(address.address_type);

        return (
          <div
            key={address.id}
            className="rounded-xl border border-gray-200 bg-white p-5 transition hover:border-gray-400"
          >
            <div className="flex items-start justify-between gap-3">

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                  <AddressIcon className="h-5 w-5 text-gray-700" />
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">
                    {address.address_type}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {address.full_name}
                  </p>
                </div>
              </div>

              {address.is_default && (
                <span className="rounded-full bg-black px-3 py-1 text-xs font-medium text-white">
                  Default
                </span>
              )}

            </div>

            <div className="mt-5 space-y-1 text-sm leading-6 text-gray-600">
              <p>{address.address_line_1}</p>

              {address.address_line_2 && (
                <p>{address.address_line_2}</p>
              )}

              {address.landmark && (
                <p>{address.landmark}</p>
              )}

              <p>
                {address.city}, {address.state} - {address.postal_code}
              </p>

              <p>{address.country}</p>

              <p className="pt-2 font-medium text-gray-800">
                Phone: {address.phone}
              </p>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-4 border-t border-gray-100 pt-4">

              <button
                type="button"
                onClick={() => onEdit(address)}
                className="text-sm font-semibold text-gray-800 hover:text-black"
              >
                Edit
              </button>

              <button
                type="button"
                onClick={() => onDelete(address)}
                className="text-sm font-semibold text-red-600 hover:text-red-700"
              >
                Delete
              </button>

              {!address.is_default && (
                <button
                  type="button"
                  onClick={() => onSetDefault(address.id)}
                  className="ml-auto text-sm font-semibold text-gray-800 underline underline-offset-4 hover:text-black"
                >
                  Set as default
                </button>
              )}

            </div>
          </div>
        );
      })}

    </div>
  );
};

export default AddressList;
