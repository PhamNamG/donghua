'use client'

import { ToastContainer } from 'react-toastify';

const ToastContainerCusTomsmer = () => {
    return (
        <ToastContainer
            autoClose={2500}
            hideProgressBar
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss={false}
            draggable={false}
            pauseOnHover
            closeButton
        />
    );
};

export default ToastContainerCusTomsmer; 