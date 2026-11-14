
import { useEffect, useState, useCallback, useRef } from "react";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";

import {
    getCustomers,
    blockCustomer,
    unblockCustomer,
} from "../../services/AdminCustomerService/AdminCustomerService";

import CustomerFilters from "../../components/admin/CustomerFilter";
import CustomerTable from "../../components/admin/CustomerTable";
import Pagination from "../../components/common/Pagination";
import ConfirmDialog from "../../components/common/ConfirmDialog";

const PAGE_SIZE = 10;

const Customers = () => {
    // Search and filter states
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [status, setStatus] = useState("ALL");
    const [page, setPage] = useState(1);

    // Customer data
    const [rows, setRows] = useState([]);
    const [count, setCount] = useState(0);

    // Loading and error states
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Prevent outdated requests from updating the UI
    const requestId = useRef(0);

    // Block / Unblock states
    const [busyId, setBusyId] = useState(null);

    const [dialog, setDialog] = useState({
        open: false,
        customer: null,
        action: null,
    });

    // Debounce search input
    useEffect(() => {
        // Invalidate any previous request immediately
        requestId.current += 1;

        const timer = setTimeout(() => {
            setDebouncedSearch(search.trim());
            setPage(1);
        }, 400);

        return () => clearTimeout(timer);
    }, [search]);

    // Fetch customers
    const fetchCustomers = useCallback(async ({ silent = false } = {}) => {
        const currentRequest = ++requestId.current;

        if (!silent) {
            setLoading(true);
        }

        setError("");

        try {
            const { data } = await getCustomers({
                search: debouncedSearch,
                status,
                page,
            });

            // Ignore outdated responses
            if (currentRequest !== requestId.current) return;

            const results = data.results || [];

            setRows(results);
            setCount(data.count || 0);

            // Handle an empty page after blocking/filtering
            if (results.length === 0 && page > 1) {
                setPage(page - 1);
            }
        } catch (err) {
            if (currentRequest !== requestId.current) return;

            const message =
                err?.response?.data?.detail ||
                err?.response?.data?.message ||
                err?.response?.data?.status ||
                "Failed to load customers.";

            setError(message);

            if (!silent) {
                toast.error(message);
            } else {
                toast.error(message);
            }
        } finally {
            if (currentRequest === requestId.current) {
                setLoading(false);
            }
        }
    }, [debouncedSearch, status, page]);

    // Fetch only after search debounce is complete
    useEffect(() => {
        if (search.trim() !== debouncedSearch) return;

        fetchCustomers();
    }, [search, debouncedSearch, fetchCustomers]);

    // Change status filter
    const changeStatus = (newStatus) => {
        setStatus(newStatus);
        setPage(1);
    };

    // Clear filters
    const clearFilters = () => {
        setSearch("");
        setDebouncedSearch("");
        setStatus("ALL");
        setPage(1);
    };

    // Open confirmation dialog
    const openDialog = (customer, action) => {
        setDialog({
            open: true,
            customer,
            action,
        });
    };

    // Close confirmation dialog
    const closeDialog = () => {
        if (busyId) return;

        setDialog({
            open: false,
            customer: null,
            action: null,
        });
    };

    // Confirm block / unblock
    const confirmAction = async () => {
        const { customer, action } = dialog;

        if (!customer || !action || busyId) return;

        setBusyId(customer.id);

        try {
            const apiFunction =
                action === "block"
                    ? blockCustomer
                    : unblockCustomer;

            const { data } = await apiFunction(customer.id);

            toast.success(
                data.message || `Customer ${action} successful.`
            );

            // Close dialog
            setDialog({
                open: false,
                customer: null,
                action: null,
            });

            // Refresh without showing the full-page loader
            await fetchCustomers({ silent: true });

        } catch (err) {
            const message =
                err?.response?.data?.message ||
                err?.response?.data?.detail ||
                `Failed to ${action} customer.`;

            toast.error(message);
        } finally {
            setBusyId(null);
        }
    };

    // Pagination
    const totalPages = Math.ceil(count / PAGE_SIZE);

    return (
        <div className="mx-auto max-w-7xl">

            {/* Page heading */}
            <div className="mb-8">
                <h1 className="font-heading text-3xl font-bold tracking-tight text-gray-900">
                    CUSTOMERS
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                    Manage registered customer accounts.
                </p>
            </div>

            {/* Search and filters */}
            <CustomerFilters
                search={search}
                onSearch={setSearch}
                status={status}
                onStatus={changeStatus}
                onClear={clearFilters}
            />

            {/* Error state */}
            {error ? (
                <div className="rounded-sm border border-red-200 bg-red-50 p-6 text-center">
                    <p className="text-sm font-semibold text-red-700">
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={() => fetchCustomers()}
                        className="mt-3 rounded-sm bg-black px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-white"
                    >
                        Retry
                    </button>
                </div>
            ) : loading ? (
                /* Loading state */
                <div className="flex items-center justify-center rounded-sm border border-gray-200 bg-white py-24 text-gray-500">
                    <Loader2 className="h-6 w-6 animate-spin" />
                </div>
            ) : (
                <>
                    {/* Customer table */}
                    <CustomerTable
                        rows={rows}
                        busyId={busyId}
                        onBlock={(customer) =>
                            openDialog(customer, "block")
                        }
                        onUnblock={(customer) =>
                            openDialog(customer, "unblock")
                        }
                    />

                    {/* Pagination */}
                    <div className="mt-6">
                        <Pagination
                            page={page}
                            totalPages={totalPages}
                            count={count}
                            pageSize={PAGE_SIZE}
                            onChange={(newPage) => {
                                if (
                                    newPage >= 1 &&
                                    newPage <= totalPages
                                ) {
                                    setPage(newPage);
                                }
                            }}
                        />
                    </div>
                </>
            )}

            {/* Block / Unblock confirmation dialog */}
            <ConfirmDialog
                open={dialog.open}
                danger={dialog.action === "block"}
                busy={!!busyId}
                title={
                    dialog.action === "block"
                        ? "Block this customer?"
                        : "Unblock this customer?"
                }
                message={
                    dialog.action === "block"
                        ? `This will prevent ${dialog.customer?.first_name} ${dialog.customer?.last_name} from logging in.`
                        : `This will restore login access for ${dialog.customer?.first_name} ${dialog.customer?.last_name}.`
                }
                confirmLabel={
                    dialog.action === "block"
                        ? "Block"
                        : "Unblock"
                }
                onCancel={closeDialog}
                onConfirm={confirmAction}
            />
        </div>
    );
};

export default Customers;
