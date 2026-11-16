import React from "react";
import { X, CheckCircle2, AlertCircle, Info } from "lucide-react";

export default function Toast({ message, type = "info", onClose }) {
  const styles = {
    success: {
      bg: "bg-[#FFFFFF] border-[#D2D2D7]",
      icon: <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />,
    },
    error: {
      bg: "bg-[#FFFFFF] border-red-300",
      icon: <AlertCircle size={18} className="text-red-600 shrink-0" />,
    },
    warning: {
      bg: "bg-[#FFFFFF] border-amber-300",
      icon: <AlertCircle size={18} className="text-amber-600 shrink-0" />,
    },
    info: {
      bg: "bg-[#FFFFFF] border-[#D2D2D7]",
      icon: <Info size={18} className="text-[#0066CC] shrink-0" />,
    },
  };

  const current = styles[type] || styles.info;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg text-[#1D1D1F] text-[13px] font-medium max-w-md ${current.bg}`}
    >
      {current.icon}
      <span className="flex-1 leading-snug">{message}</span>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="text-[#6E6E73] hover:text-[#1D1D1F] p-1 rounded-md transition-colors"
          aria-label="Dismiss notification"
        >
          <X size={15} />
        </button>
      )}
    </div>
  );
}
