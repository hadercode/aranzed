import React from "react";
import { X } from "lucide-react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "full" | string;
}

const sizeClasses: Record<string, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-3xl",
  xl: "max-w-4xl",
  "2xl": "max-w-5xl",
  "3xl": "max-w-6xl",
  full: "max-w-7xl",
};

export function Modal({ isOpen, onClose, title, children, size = "md" }: ModalProps) {
  if (!isOpen) return null;

  const maxWidthClass = sizeClasses[size] || "max-w-md";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className={`bg-[var(--color-surface-card)] w-full ${maxWidthClass} rounded-3xl p-6 shadow-2xl border border-[var(--color-border)] relative max-h-[90vh] overflow-y-auto`}>
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer"
          aria-label="Cerrar modal"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6">
          {title}
        </h2>

        {children}
      </div>
    </div>
  );
}
