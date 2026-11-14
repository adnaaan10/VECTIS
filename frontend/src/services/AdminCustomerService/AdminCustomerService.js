import api from "../api";

const BASE = "/admin/users/";

export const getCustomers = ({
  search = "",
  status = "ALL",
  page = 1,
} = {}) => {
  const params = { page };

  if (search.trim()) {
    params.search = search.trim();
  }

  if (status && status !== "ALL") {
    params.status = status;
  }

  return api.get(BASE, { params });
};

export const blockCustomer = (userId) =>
  api.patch(`${BASE}${userId}/block/`);

export const unblockCustomer = (userId) =>
  api.patch(`${BASE}${userId}/unblock/`);
