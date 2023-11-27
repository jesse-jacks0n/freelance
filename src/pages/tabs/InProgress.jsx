import React, { useEffect, useState } from 'react';
import { get, ref } from 'firebase/database';
import {database, storage} from '../../firebase';
import {AiOutlineUser} from "react-icons/ai";
import {ref as storageReference,getDownloadURL} from "firebase/storage";

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

                        // Fetch the download URL of the file from Firebase Storage
                        const storageRef = storageReference(storage, `documents/${data.jobId}`);
                        const fileDownloadURL = await getDownloadURL(storageRef);

                        return {
                            userId,
                            username: userDetails.username,
                            email: userDetails.email,
                            jobTitle: data.jobTitle, // Use the job title directly from the data
                            deadline: data.deadline,
                            fileDownloadURL: fileDownloadURL,
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
                            <li key={applicant.userId}
                                className="bg-white p-6 mb-4 rounded-md shadow-md border border-gray-100">
                                <div className="flex items-center justify-between">
                                    <p className="text-lg font-medium mb-2 text-green-800">
                                        Job: {applicant.jobTitle}
                                    </p>
                                    <a href={applicant.fileDownloadURL} download> <img className="w-8 mb-2" src="/icons/pdf.png" alt="icon"/>
                                    </a>
                                </div>

                                <div className="flex items-center mb-2 bg-gray-50 rounded-md p-2">
                                <div className="bg-gray-200 rounded-full p-2 mr-2 ">
                                        <AiOutlineUser size={24} color="gray"/>
                                    </div>

                                    <div>
                                        <p>{applicant.username}</p>
                                        <p className="text-gray-600 font-light text-xs">
                                            {applicant.email}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center">
                                    <p className="text-gray-600">
                                        Deadline: {new Date(applicant.deadline).toLocaleString()}
                                    </p>
                                    <button className="bg-orange-600 text-white text-sm rounded-md py-1 px-2">
                                        Extend Deadline
                                    </button>
                                </div>

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
