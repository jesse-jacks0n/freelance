import React, { useEffect, useState } from 'react';

const TimeAgo = ({ timestamp }) => {
    const [timeAgo, setTimeAgo] = useState('');

    useEffect(() => {
        const calculateTimeAgo = () => {
            const now = new Date();
            const postTime = new Date(timestamp);
            const timeDifference = now - postTime;

            const seconds = Math.floor(timeDifference / 1000);
            const minutes = Math.floor(seconds / 60);
            const hours = Math.floor(minutes / 60);
            const days = Math.floor(hours / 24);
            const weeks = Math.floor(days / 7);
            const months = Math.floor(days / 30);

            if (seconds < 60) {
                setTimeAgo(`${seconds} seconds ago`);
            } else if (minutes < 60) {
                setTimeAgo(`${minutes} minutes ago`);
            } else if (hours < 24) {
                setTimeAgo(`${hours} hours ago`);
            } else if (days < 7) {
                setTimeAgo(`${days} days ago`);
            } else if (weeks < 4) {
                setTimeAgo(`${weeks} weeks ago`);
            } else {
                setTimeAgo(`${months} months ago`);
            }
        };

        calculateTimeAgo();
    }, [timestamp]);

    return <p className="text-gray-600 px-2 py-1 w-fit rounded-full bg-gray-50 text-xs mr-2 font-medium  border border-gray-100">Posted {timeAgo}</p>;
};

export default TimeAgo;
