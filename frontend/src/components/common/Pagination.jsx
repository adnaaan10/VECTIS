
import { ChevronLeft, ChevronRight } from "lucide-react";


const buildPages = (current, total) => {

    if (total <= 7) {
        return Array.from({ length: total }, (_, i) => i + 1);
    }

    const pages = [1];

    if (current > 3) {
        pages.push("…");
    }

    for (
        let p = Math.max(2, current - 1);
        p <= Math.min(total - 1, current + 1);
        p++
    ) {
        pages.push(p);
    }

    if (current < total - 2) {
        pages.push("…");
    }

    pages.push(total);

    return pages;
};


const Pagination = ({
    page,
    totalPages,
    count,
    pageSize = 10,
    onChange,
}) => {

    if (!count || totalPages <= 0) return null;

    const currentPage = Math.min(
        Math.max(1, page),
        totalPages
    );

    const start = (currentPage - 1) * pageSize + 1;

    const end = Math.min(
        currentPage * pageSize,
        count
    );

    const pages = buildPages(currentPage, totalPages);


    return (
        <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-200 pt-5 sm:flex-row">

            {/* Customer count */}
            <p className="text-xs text-gray-500">

                Showing{" "}

                <span className="font-semibold text-gray-800">
                    {start}–{end}
                </span>

                {" "}of{" "}

                <span className="font-semibold text-gray-800">
                    {count}
                </span>

                {" "}customers

            </p>


            {/* Pagination controls */}
            <div className="flex items-center gap-1">

                {/* Previous */}
                <button
                    type="button"
                    onClick={() => onChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                    aria-label="Previous page"
                    className="flex h-8 w-8 items-center justify-center rounded-sm border border-gray-300 text-gray-600 hover:enabled:border-black disabled:opacity-40"
                >
                    <ChevronLeft className="h-4 w-4" />
                </button>


                {/* Page numbers */}
                {pages.map((p, i) =>

                    p === "…" ? (

                        <span
                            key={`ellipsis-${i}`}
                            className="px-2 text-sm text-gray-400"
                        >
                            …
                        </span>

                    ) : (

                        <button
                            key={p}
                            type="button"
                            onClick={() => onChange(p)}
                            aria-current={
                                p === currentPage ? "page" : undefined
                            }
                            className={`h-8 w-8 rounded-sm text-sm font-semibold transition-colors ${
                                p === currentPage
                                    ? "bg-black text-white"
                                    : "border border-gray-300 text-gray-600 hover:border-black"
                            }`}
                        >
                            {p}
                        </button>

                    )

                )}


                {/* Next */}
                <button
                    type="button"
                    onClick={() => onChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    aria-label="Next page"
                    className="flex h-8 w-8 items-center justify-center rounded-sm border border-gray-300 text-gray-600 hover:enabled:border-black disabled:opacity-40"
                >
                    <ChevronRight className="h-4 w-4" />
                </button>

            </div>

        </div>
    );
};

export default Pagination;
