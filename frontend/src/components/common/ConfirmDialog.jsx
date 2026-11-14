
import { AlertTriangle } from "lucide-react";

const ConfirmDialog = ({
    open,
    title,
    message,
    confirmLabel,
    danger = true,
    busy = false,
    onCancel,
    onConfirm,
}) => {

    if (!open) return null;

    const handleOverlayClick = (event) => {
        if (event.target === event.currentTarget && !busy) {
            onCancel();
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
            onMouseDown={handleOverlayClick}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="confirm-dialog-title"
                aria-describedby="confirm-dialog-message"
                className="w-full max-w-sm rounded-sm border border-gray-200 bg-white p-6"
            >

                {/* Dialog content */}
                <div className="flex items-start gap-3">

                    <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                            danger
                                ? "bg-red-50 text-red-600"
                                : "bg-gray-100 text-gray-700"
                        }`}
                    >
                        <AlertTriangle className="h-5 w-5" />
                    </div>

                    <div>
                        <h3
                            id="confirm-dialog-title"
                            className="font-heading text-lg font-bold text-gray-900"
                        >
                            {title}
                        </h3>

                        <p
                            id="confirm-dialog-message"
                            className="mt-1 text-sm leading-relaxed text-gray-600"
                        >
                            {message}
                        </p>
                    </div>

                </div>


                {/* Dialog actions */}
                <div className="mt-6 flex justify-end gap-3">

                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={busy}
                        className="rounded-sm border border-gray-300 px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={busy}
                        className={`rounded-sm px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-white disabled:cursor-not-allowed disabled:opacity-60 ${
                            danger
                                ? "bg-red-600 hover:bg-red-700"
                                : "bg-black hover:bg-gray-800"
                        }`}
                    >
                        {busy ? "Processing..." : confirmLabel}
                    </button>

                </div>

            </div>
        </div>
    );
};

export default ConfirmDialog;
