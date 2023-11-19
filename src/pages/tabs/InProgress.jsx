import React, { useEffect, useState } from 'react';
import { get, ref } from 'firebase/database';
import { database } from '../../firebase';

const InProgress = () => {
    const [hiredApplicants, setHiredApplicants] = useState([]);

    const fetchUserDetails = async (userId) => {
        try {
            const userIdString = String(userId);
            const userRef = ref(database, `users/${userIdString}`);
            const userSnapshot = await get(userRef);

            if (userSnapshot.exists()) {
                const userData = userSnapshot.val();
                return { username: userData.username, email: userData.email };
            } else {
                return { username: 'Unknown User', email: 'Unknown Email' };
            }
        } catch (error) {
            return { username: 'Unknown User', email: 'Unknown Email' };
        }
    };


    const fetchHiredApplicants = async () => {
        try {
            const hiredApplicantsRef = ref(database, 'hiredApplicants');
            const hiredApplicantsSnapshot = await get(hiredApplicantsRef);

            if (hiredApplicantsSnapshot.exists()) {
                const hiredApplicantsData = await Promise.all(
                    Object.entries(hiredApplicantsSnapshot.val()).map(async ([userId, data]) => {
                        const userDetails = await fetchUserDetails(userId);

                        return {
                            userId,
                            username: userDetails.username,
                            email: userDetails.email,
                            jobTitle: data.jobTitle, // Use the job title directly from the data
                            deadline: data.deadline,
                        };
                    })
                );

                setHiredApplicants(hiredApplicantsData);
            } else {
                setHiredApplicants([]);
            }
        } catch (error) {
            console.error('Error fetching hired applicants:', error);
        }
    };


    useEffect(() => {
        fetchHiredApplicants();
    }, []);

    return (
        <div className="flex justify-center items-center h-full ">
            <div className=" w-1000 h-full">
                <h1 className="text-4xl font-bold mb-4">In Progress</h1>
                {hiredApplicants.length > 0 ? (
                    <ul>
                        {hiredApplicants.map((applicant) => (
                            <li key={applicant.userId} className="bg-white p-6 mb-4 rounded-md shadow-md">
                                <p className="text-lg font-semibold mb-2">
                                    <strong>User:</strong> {applicant.username}
                                </p>
                                <p className="text-gray-600 mb-2">
                                    <strong>Email:</strong> {applicant.email}
                                </p>
                                <p className="text-lg font-semibold mb-2">
                                    <strong>Job Title:</strong> {applicant.jobTitle}
                                </p>
                                <p className="text-gray-600">
                                    <strong>Deadline:</strong> {applicant.deadline}
                                </p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No hired applicants in progress</p>
                )}
            </div>
        </div>
    );
};

export default InProgress;
