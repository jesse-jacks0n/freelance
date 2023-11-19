import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { get, ref } from 'firebase/database';
import { auth, database } from '../../firebase';
import TimeAgo from '../components/TimeAgo';

const MyJobs = () => {
    const [user, setUser] = useState(null);
    const [hiredJobs, setHiredJobs] = useState([]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
            if (authUser) {
                console.log('Authenticated user:', authUser);

                const userRef = ref(database, `users/${authUser.uid}`);
                const snapshot = await get(userRef);
                const userData = snapshot.val();
                const mergedUser = { ...authUser, ...userData };
                setUser(mergedUser);
                console.log('Merged user data:', mergedUser);

                // Fetch jobs where the current user is the hired applicant
                const hiredJobsRef = ref(database, `hiredApplicants/${authUser.uid}`);
                const hiredJobsSnapshot = await get(hiredJobsRef);

                if (hiredJobsSnapshot.exists()) {
                    const hiredJobsData = Object.entries(hiredJobsSnapshot.val())
                        .filter(([key, value]) => value === true) // Filter based on truthy values (user hired)
                        .map(([key, value]) => key); // Extract the job IDs

                    // Fetch details for each hired job
                    const jobsDetailsPromises = hiredJobsData.map(async (jobId) => {
                        const jobRef = ref(database, `jobs/translation/${jobId}`); // Adjust the path based on your data structure
                        const jobSnapshot = await get(jobRef);
                        if (jobSnapshot.exists()) {
                            return {
                                id: jobId,
                                ...jobSnapshot.val(),
                            };
                        }
                        return null;
                    });

                    const jobsDetails = await Promise.all(jobsDetailsPromises);
                    setHiredJobs(jobsDetails.filter(Boolean)); // Remove null values
                    console.log('Hired jobs data:', jobsDetails);
                } else {
                    setHiredJobs([]);
                    console.log('No hired jobs found.');
                }
            } else {
                setUser(null);
                setHiredJobs([]);
                console.log('User not authenticated.');
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <div className="flex flex-col min-h-screen mx-4 sm:mx-8 md:mx-16 lg:mx-16 xl:mx-24 2xl:mx-28">
            <h2 className="text-xl font-bold mt-4">My Hired Jobs</h2>
            {hiredJobs.map((hiredJob) => (
                <div key={hiredJob.id} className="mt-4 p-4 border border-gray-200 drop-shadow-sm rounded-md bg-white">
                    <h3 className="text-lg font-medium mb-2 text-green-800">{hiredJob.jobTitle}</h3>
                    <p className="text-gray-600 px-2 py-1 w-fit rounded-full bg-gray-100 text-sm mr-2">
                        Category: {hiredJob.categoryId}
                    </p>
                    {hiredJob.deadline && (
                        <p className="text-gray-700 px-2 py-1 my-2 w-fit rounded-lg bg-gray-50 text-sm">
                            Deadline: {new Date(hiredJob.deadline).toLocaleString()}
                        </p>
                    )}
                </div>
            ))}
        </div>
    );
};

export default MyJobs;
