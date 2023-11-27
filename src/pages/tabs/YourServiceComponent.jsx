import React from 'react';

const YourServiceComponent = ({ onClose, serviceName }) => {
    // You may fetch additional data for the selected service here if needed

    return (
        <div>
            <h2>{serviceName} Details</h2>
            {/* Render details specific to the selected service */}
            {/* Add additional details as needed based on your data structure */}
            <p>Service Name: {serviceName}</p>
            <p>Additional details...</p>
            <button onClick={onClose}>Close</button>
        </div>
    );
};

export default YourServiceComponent;
