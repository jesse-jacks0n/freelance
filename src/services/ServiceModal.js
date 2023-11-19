import React from 'react';
import {Close} from "@mui/icons-material";

const ServiceModal = ({ onClose, children }) => (
    <div className="fixed top-0 left-0 w-full  h-full flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
        <div
            style={{ maxHeight: '600px' }}
            className="flex relative w-3/4 lg:w-1000 mt-10 mx-20 bg-white p-8 rounded-lg shadow-md overflow-auto">
            <Close
                className="absolute top-2 right-2 bg-gray-200 rounded-full cursor-pointer"
                onClick={onClose}
                style={{ fontSize: '3rem', padding: '0.5rem' }}
            />
            {children}
        </div>
    </div>
);

export default ServiceModal;
