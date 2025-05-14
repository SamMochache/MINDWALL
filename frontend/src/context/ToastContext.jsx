import React, { createContext, useState, useCallback, useContext } from 'react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, variant = 'success') => {
    setToast({ message, variant });
    setTimeout(() => setToast(null), 4000); // auto-dismiss after 4s
  }, []);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      {toast && (
        <div
          className={`toast-container position-fixed bottom-0 end-0 p-3`}
          style={{ zIndex: 9999 }}
        >
          <div className={`toast show align-items-center text-white bg-${toast.variant} border-0`}>
            <div className="d-flex">
              <div className="toast-body">
                {toast.message}
              </div>
              <button type="button" className="btn-close btn-close-white me-2 m-auto" onClick={() => setToast(null)} />
            </div>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
