import React, {useEffect, useState} from 'react';
import {onAuthStateChanged} from 'firebase/auth';
import {auth, database} from '../../firebase';
import {get, ref, update} from 'firebase/database';
import TimeAgo from "../components/TimeAgo";
import toast, { Toaster } from 'react-hot-toast';

export default function FreelancerDash() {
    const [user, setUser] = useState(null);
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
            if (authUser) {
                const userRef = ref(database, `users/${authUser.uid}`);
                const snapshot = await get(userRef);
                const userData = snapshot.val();
                const mergedUser = { ...authUser, ...userData };
                setUser(mergedUser);

                // Fetch jobs from different job categories
                const jobCategories = ['translation', 'retyping', 'documentConversion', 'logoDesign'];

                const allJobs = [];

                for (const category of jobCategories) {
                    const categoryJobsRef = ref(database, `jobs/${category}`);
                    const categoryJobsSnapshot = await get(categoryJobsRef);

                    if (categoryJobsSnapshot.exists()) {
                        const categoryJobsData = Object.entries(categoryJobsSnapshot.val()).map(([key, value]) => ({
                            id: key,
                            ...value,
                            category: category,
                        }));

                        allJobs.push(...categoryJobsData);
                    }
                }

                // Sort the jobs array based on timestamp in descending order
                const sortedJobs = allJobs.sort((a, b) => b.timestamp - a.timestamp);

                setJobs(sortedJobs);
                console.log('Sorted jobs:', sortedJobs);
            } else {
                setUser(null);
            }
        });

        return () => unsubscribe();
    }, []);

    const applyForJob = async (jobId) => {
        try {
            // Update the job in the database with the new applicant
            await update(ref(database, `jobs/${jobs.find((job) => job.id === jobId).category}/${jobId}/applicants`), {
                [user.uid]: true,
            });
            toast.success('Successfully applied!')
            console.log('Applied for the job successfully');
        } catch (error) {
            console.error('Error applying for the job:', error);
        }
    };

    return (
        <div className="flex flex-col min-h-screen mx-4 sm:mx-8 md:mx-16 lg:mx-16 xl:mx-24 2xl:mx-28">
            <div><Toaster/></div>
            <h2 className="text-xl font-bold mt-4">Recent Jobs</h2>
            {jobs.map((job) => (
                <div key={job.id} className="mt-4 p-4 border border-gray-200 drop-shadow-sm rounded-md bg-white">
                    <h3 className="text-lg font-medium mb-2 text-green-800">{job.jobTitle}</h3>
                    <p className="flex">
                        <p className="text-gray-600 px-2 py-1 w-fit rounded-full bg-gray-100 text-sm mr-2">{job.category} </p>
                        <p className="text-gray-600 px-2 py-1 w-fit rounded-full bg-gray-100 text-sm mr-2">Budget
                            Ksh. {job.price}</p>
                        <p className="text-gray-600 px-2 py-1 w-fit rounded-full bg-gray-100 text-sm mr-2">Level-{job.experienceLevel}</p>
                    </p>
                    {/*<p>Description</p>*/}
                    <p className="text-gray-800 px-2 py-1 my-2 font-light  rounded-lg bg-gray-50 text-sm border border-gray-100"
                       style={{minHeight: '50px'}}>Description : {job.jobDescription}</p>
                    <div className="flex items-center ">
                        <TimeAgo timestamp={job.timestamp}/>
                        <p className="text-sm font-light bg-gray-100 py-1 px-2 rounded-full">No of Applicants : 25</p>
                    </div>

                    {user && (
                        <button
                            className="border border-green-800 rounded-full hover:bg-green-800 hover:text-white py-1 px-3 text-green-800 text-sm drop-shadow-md cursor-pointer"
                            onClick={() => applyForJob(job.id)}
                            disabled={job.applicants && job.applicants[user.uid]}
                        >
                            Apply Job
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
}
