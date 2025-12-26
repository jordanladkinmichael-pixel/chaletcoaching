import React from "react";
import { THEME } from "@/lib/theme";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

export type ToastType = "success" | "error" | "info";

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastProps {
  toast: Toast;
  onClose: (id: string) => void;
}

export function Toast({ toast, onClose }: ToastProps) {
  React.useEffect(() => {
    if (toast.duration !== 0) {
      const timer = setTimeout(() => {
        onClose(toast.id);
      }, toast.duration || 5000);
      return () => clearTimeout(timer);
    }
  }, [toast.id, toast.duration, onClose]);

  const getIcon = () => {
    switch (toast.type) {
      case "success":
        return <CheckCircle size={20} className="text-green-400" />;
      case "error":
        return <AlertCircle size={20} className="text-red-400" />;
      case "info":
        return <Info size={20} className="text-blue-400" />;
      default:
        return null;
    }
  };

  const getBackground = () => {
    switch (toast.type) {
      case "success":
        return "rgba(34, 197, 94, 0.1)";
      case "error":
        return "rgba(239, 68, 68, 0.1)";
      case "info":
        return "rgba(59, 130, 246, 0.1)";
      default:
        return THEME.card;
    }
  };

  return (
    <div
      className="flex items-start gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-sm"
      style={{
        background: getBackground(),
        borderColor: THEME.cardBorder,
      }}
    >
      {getIcon()}
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm">{toast.title}</div>
        {toast.message && (
          <div className="text-sm opacity-80 mt-1">{toast.message}</div>
        )}
      </div>
      <button
        onClick={() => onClose(toast.id)}
        className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity"
      >
        <X size={16} />
      </button>
    </div>
  );
}

export function ToastContainer({ toasts, onClose }: { toasts: Toast[]; onClose: (id: string) => void }) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={onClose} />
      ))}
    </div>
  );
}

