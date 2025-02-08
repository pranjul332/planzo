import React from "react";

export function Dialog({ open, children, onOpenChange }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={() => onOpenChange(false)}
      />
      <div className="relative bg-white rounded-lg w-full max-w-md mx-4">
        {children}
      </div>
    </div>
  );
}

export function DialogContent({ children, className = "", ...props }) {
  return (
    <div className={`p-6 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function DialogHeader({ children, className = "", ...props }) {
  return (
    <div className={`mb-4 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function DialogTitle({ children, className = "", ...props }) {
  return (
    <h2 className={`text-xl font-bold ${className}`} {...props}>
      {children}
    </h2>
  );
}

export function DialogDescription({ children, className = "", ...props }) {
  return (
    <p className={`text-sm text-gray-500 ${className}`} {...props}>
      {children}
    </p>
  );
}
