// components/ui/toast.jsx

import React, { useState, useEffect } from "react";

// Toast context to manage toasts across the application
export const ToastContext = React.createContext({
  toast: () => {},
  closeToast: () => {},
});

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  // Function to add a new toast
  const toast = ({
    title,
    description,
    variant = "default",
    duration = 5000,
  }) => {
    const id = Date.now();
    setToasts((prevToasts) => [
      ...prevToasts,
      { id, title, description, variant, duration },
    ]);
    return id;
  };

  // Function to close a toast
  const closeToast = (id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast, closeToast }}>
      {children}
      <ToastContainer toasts={toasts} closeToast={closeToast} />
    </ToastContext.Provider>
  );
};

// Custom hook to use toast
export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

// Toast container component
const ToastContainer = ({ toasts, closeToast }) => {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} closeToast={closeToast} />
      ))}
    </div>
  );
};

// Individual toast component
const Toast = ({ toast, closeToast }) => {
  const { id, title, description, variant, duration } = toast;

  useEffect(() => {
    if (duration !== Infinity) {
      const timer = setTimeout(() => {
        closeToast(id);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [id, duration, closeToast]);

  // Different styles based on variant
  const variantStyles = {
    default: "bg-gray-800 text-white",
    success: "bg-green-600 text-white",
    error: "bg-red-600 text-white",
    warning: "bg-yellow-500 text-white",
    destructive: "bg-red-600 text-white",
  };

  const baseStyles = "rounded-md shadow-lg p-4 flex items-start gap-3 relative";

  return (
    <div
      className={`${baseStyles} ${
        variantStyles[variant] || variantStyles.default
      } animate-fade-in-down`}
      role="alert"
    >
      <div className="flex-1">
        {title && <h4 className="font-medium">{title}</h4>}
        {description && (
          <p className="text-sm mt-1 opacity-90">{description}</p>
        )}
      </div>
      <button
        onClick={() => closeToast(id)}
        className="text-white opacity-70 hover:opacity-100"
        aria-label="Close"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
};

// Animation classes (you need to add these to your tailwind.config.js if you're using Tailwind)
// Add to tailwind.config.js:
// module.exports = {
//   theme: {
//     extend: {
//       animation: {
//         'fade-in-down': 'fadeInDown 0.3s ease-out forwards',
//       },
//       keyframes: {
//         fadeInDown: {
//           '0%': { opacity: '0', transform: 'translateY(-10px)' },
//           '100%': { opacity: '1', transform: 'translateY(0)' },
//         },
//       },
//     },
//   },
// };
