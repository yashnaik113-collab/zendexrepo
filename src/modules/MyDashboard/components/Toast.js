import React, { useState, useEffect } from 'react';
import { Snackbar, Alert, Slide } from '@mui/material';

const SlideTransition = (props) => <Slide {...props} direction="up" />;

const Toast = ({ open, message, severity = 'success', onClose, autoHideDuration = 4000 }) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      TransitionComponent={SlideTransition}
    >
      <Alert onClose={onClose} severity={severity} variant="filled" sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export const useToast = () => {
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  const showToast = (message, severity = 'success') => {
    setToast({ open: true, message, severity });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, open: false }));
  };

  const ToastComponent = () => (
    <Toast
      open={toast.open}
      message={toast.message}
      severity={toast.severity}
      onClose={hideToast}
    />
  );

  return { showToast, hideToast, ToastComponent };
};

export default Toast;
