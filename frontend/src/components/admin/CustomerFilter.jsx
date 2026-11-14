
import { Search, X } from "lucide-react";

const STATUS = ["ALL", "ACTIVE", "BLOCKED"];

const CustomerFilters = ({
    search,
    onSearch,
    status,
    onStatus,
    onClear,
}) => {

    const hasActiveFilters = search.trim() !== "" || status !== "ALL";

    const chip = (s) =>
        `rounded-sm px-4 py-2 text-[11px] font-bold uppercase tracking-widest transition-colors ${
            status === s
                ? "bg-black text-white"
                : "border border-gray-300 bg-white text-gray-600 hover:border-black hover:text-black"
        }`;

    return (
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            {/* Search */}
            <div className="relative w-full max-w-md">

                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                <input
                    type="text"
                    value={search}
                    onChange={(e) => onSearch(e.target.value)}
                    placeholder="Search by customer name or email"
                    aria-label="Search customers by name or email"
                    className="w-full rounded-sm border border-gray-300 py-2.5 pl-9 pr-3 text-sm focus:border-black focus:outline-none"
                />

            </div>


            {/* Status filters and clear */}
            <div className="flex flex-wrap items-center gap-2">

                {STATUS.map((s) => (

                    <button
                        key={s}
                        type="button"
                        onClick={() => onStatus(s)}
                        aria-pressed={status === s}
                        className={chip(s)}
                    >
                        {s === "ALL"
                            ? "All"
                            : s === "ACTIVE"
                                ? "Active"
                                : "Blocked"}
                    </button>

                ))}


                {/* Clear filters */}
                <button
                    type="button"
                    onClick={onClear}
                    disabled={!hasActiveFilters}
                    className="flex items-center gap-1 rounded-sm px-3 py-2 text-[11px] font-bold uppercase tracking-widest text-gray-500 hover:text-black disabled:cursor-not-allowed disabled:opacity-40"
                >
                    <X className="h-3.5 w-3.5" />
                    Clear Filters
                </button>

            </div>

        </div>
    );
};

export default CustomerFilters;
