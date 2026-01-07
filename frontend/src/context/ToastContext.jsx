import React, { createContext, useContext, useState, useCallback } from "react";
import Toast from "../components/Toast";

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { ...toast, id }]);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    ({ type = "info", title, message, duration = 4000 }) => {
      return addToast({ type, title, message, duration });
    },
    [addToast]
  );

  const success = useCallback(
    (message, title = "Berhasil") => {
      return showToast({ type: "success", title, message });
    },
    [showToast]
  );

  const error = useCallback(
    (message, title = "Error") => {
      return showToast({ type: "error", title, message, duration: 5000 });
    },
    [showToast]
  );

  const info = useCallback(
    (message, title = "Informasi") => {
      return showToast({ type: "info", title, message });
    },
    [showToast]
  );

  const warning = useCallback(
    (message, title = "Peringatan") => {
      return showToast({ type: "warning", title, message });
    },
    [showToast]
  );

  const value = {
    showToast,
    success,
    error,
    info,
    warning,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-container">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            id={toast.id}
            type={toast.type}
            title={toast.title}
            message={toast.message}
            duration={toast.duration}
            onClose={removeToast}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};
