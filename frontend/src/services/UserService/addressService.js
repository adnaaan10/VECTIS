import api from "../api";

// Get all addresses
export const getAddresses = async () => {
  const response = await api.get("/addresses/");
  return response.data;
};

// Create a new address
export const createAddress = async (data) => {
  const response = await api.post("/addresses/", data);
  return response.data;
};

// Get a single address
export const getAddress = async (id) => {
  const response = await api.get(`/addresses/${id}/`);
  return response.data;
};

// Update an existing address
export const updateAddress = async (id, data) => {
  const response = await api.patch(`/addresses/${id}/`, data);
  return response.data;
};

// Delete an address
export const deleteAddress = async (id) => {
  const response = await api.delete(`/addresses/${id}/`);
  return response.data;
};

// Set an address as default
export const setDefaultAddress = async (id) => {
  const response = await api.patch(
    `/addresses/${id}/default/`
  );
  return response.data;
};
