
import { Eye, Ban, CheckCircle2 } from "lucide-react";


const getInitials = (customer) => {
    const first = customer.first_name?.[0] || "";
    const last = customer.last_name?.[0] || "";

    return (
        `${first}${last}`.toUpperCase() ||
        (customer.email?.[0] || "?").toUpperCase()
    );
};


const StatusBadge = ({ active }) => (
    <span
        className={`inline-flex items-center gap-1.5 rounded-sm px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest ${
            active
                ? "bg-gray-100 text-gray-700"
                : "bg-red-50 text-red-700"
        }`}
    >
        <span
            className={`h-1.5 w-1.5 rounded-full ${
                active ? "bg-gray-700" : "bg-red-600"
            }`}
        />

        {active ? "Active" : "Blocked"}
    </span>
);


const CustomerTable = ({
    rows = [],
    busyId,
    onBlock,
    onUnblock,
}) => {

    if (!rows.length) {
        return (
            <div className="rounded-sm border border-gray-200 bg-white py-16 text-center">

                <p className="text-sm font-semibold text-gray-700">
                    No customers found
                </p>

                <p className="mt-1 text-xs text-gray-500">
                    Try adjusting your search or filters.
                </p>

            </div>
        );
    }


    return (
        <div className="overflow-x-auto rounded-sm border border-gray-200 bg-white">

            <table className="w-full min-w-[820px] text-left">

                {/* Table heading */}
                <thead>
                    <tr className="border-b border-gray-200 bg-gray-50 text-[10px] uppercase tracking-widest text-gray-500">

                        <th className="px-5 py-3 font-bold">
                            Customer
                        </th>

                        <th className="px-5 py-3 font-bold">
                            Email
                        </th>

                        <th className="px-5 py-3 font-bold">
                            Phone
                        </th>

                        <th className="px-5 py-3 font-bold">
                            Account Status
                        </th>

                        <th className="px-5 py-3 text-right font-bold">
                            Action
                        </th>

                    </tr>
                </thead>


                {/* Customer records */}
                <tbody className="divide-y divide-gray-100">

                    {rows.map((customer) => {

                        const busy = busyId === customer.id;

                        return (

                            <tr
                                key={customer.id}
                                className="transition-colors hover:bg-gray-50"
                            >

                                {/* Customer name and avatar */}
                                <td className="px-5 py-4">

                                    <div className="flex items-center gap-3">

                                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black text-xs font-bold text-white">
                                            {getInitials(customer)}
                                        </span>

                                        <span className="text-sm font-semibold text-gray-900">
                                            {customer.first_name} {customer.last_name}
                                        </span>

                                    </div>

                                </td>


                                {/* Email */}
                                <td className="px-5 py-4 text-sm text-gray-600">
                                    {customer.email}
                                </td>


                                {/* Phone */}
                                <td className="px-5 py-4 text-sm text-gray-600">
                                    {customer.phone || "—"}
                                </td>


                                {/* Account status */}
                                <td className="px-5 py-4">
                                    <StatusBadge active={customer.is_active} />
                                </td>


                                {/* Actions */}
                                <td className="px-5 py-4">

                                    <div className="flex items-center justify-end gap-2">
                                        
                                        {/* Block / Unblock */}
                                        {customer.is_active ? (

                                            <button
                                                type="button"
                                                onClick={() => onBlock(customer)}
                                                disabled={busy}
                                                className="flex items-center gap-1 rounded-sm bg-red-600 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                                            >
                                                <Ban className="h-3.5 w-3.5" />

                                                {busy ? "Processing..." : "Block"}
                                            </button>

                                        ) : (

                                            <button
                                                type="button"
                                                onClick={() => onUnblock(customer)}
                                                disabled={busy}
                                                className="flex items-center gap-1 rounded-sm bg-black px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                                            >
                                                <CheckCircle2 className="h-3.5 w-3.5" />

                                                {busy ? "Processing..." : "Unblock"}
                                            </button>

                                        )}

                                    </div>

                                </td>

                            </tr>

                        );

                    })}

                </tbody>

            </table>

        </div>
    );
};

export default CustomerTable;
