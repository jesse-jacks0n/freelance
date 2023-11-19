import React, { useState, useEffect } from 'react';
import { get, ref, update } from 'firebase/database';
import { database } from '../../firebase';
import { Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { CircularProgress } from "@mui/material";
import {AiOutlineUser} from "react-icons/ai";

const fetchJobTitle = async (jobId, jobs) => {
    try {
        // Check if the jobId exists under the 'jobs' node
        const jobRef = ref(database, `jobs/${jobId}`);
        const jobSnapshot = await get(jobRef);

        if (jobSnapshot.exists()) {
            const jobData = jobSnapshot.val();
            return jobData.jobTitle;
        } else {
            // If not found directly, try to find it under a category
            for (const category of Object.keys(jobs)) {
                const categoryJobRef = ref(database, `jobs/${category}/${jobId}`);
                const categoryJobSnapshot = await get(categoryJobRef);

                if (categoryJobSnapshot.exists()) {
                    const categoryJobData = categoryJobSnapshot.val();
                    return categoryJobData.jobTitle;
                }
            }

            console.log('Job not found for jobId:', jobId);
            return 'Unknown Job';
        }
    } catch (error) {
        console.error('Error fetching job title:', error);
        return 'Unknown Job';
    }
};

const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};
const Workers = () => {
    const [jobs, setJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const [selectedApplicant, setSelectedApplicant] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [userDetails, setUserDetails] = useState(null);

    const viewDetails = async () => {
        if (selectedApplicant) {
            try {
                // Show CircularProgress while fetching data
                setUserDetails(null);

                // Fetch user details based on selectedApplicant.id
                const userDetailsSnapshot = await get(ref(database, `users/${selectedApplicant.id}`));

                if (userDetailsSnapshot.exists()) {
                    setUserDetails(userDetailsSnapshot.val());
                } else {
                    console.log('User details not found for user ID:', selectedApplicant.id);
                    setUserDetails(null);
                }
            } catch (error) {
                console.error('Error fetching user details:', error);
                setUserDetails(null);
            }
        }
    };
    // Function to fetch user data based on user ID
    const fetchUserData = async (userId) => {
        try {
            const userRef = ref(database, `users/${userId}`);
            const userSnapshot = await get(userRef);

            if (userSnapshot.exists()) {
                const userData = userSnapshot.val();
                return { username: userData.username, email: userData.email };
            } else {
                return { username: 'Unknown User', email: 'Unknown Email' };
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            return { username: 'Unknown User', email: 'Unknown Email' };
        }
    };
    const hireApplicant = async () => {
        if (selectedJob && selectedJob.jobTitle && selectedApplicant && selectedDate) {
            try {
                // Use the jobTitle directly from the selectedJob
                const jobTitle = selectedJob.jobTitle;

                // Parse the job ID from the selectedJob.id
                const jobId = selectedJob.id.split('-')[1]; // Assuming the job ID has a format like 'job-ID'

                // Create a new node for the hired applicant directly under 'hiredApplicants'
                const hiredApplicantPath = `hiredApplicants/${selectedApplicant.id}`;

                // Store the hired applicant data along with the job title
                await update(ref(database), {
                    [`${hiredApplicantPath}`]: {
                        jobId,
                        jobTitle,
                    },
                });

                // Find the actual path of the job using the job ID
                const jobPath = await findJobPathByJobId(jobId);

                // Get the path to the applicant under the 'applicants' node
                const applicantPath = `jobs/${selectedJob.category}/${selectedJob.id}/applicants/${selectedApplicant.id}`;

                // Retrieve the current applicants node
                const applicantsSnapshot = await get(ref(database, applicantPath));

                if (applicantsSnapshot.exists()) {
                    // Update the job in the database to mark the applicant as hired and store the deadline
                    await update(ref(database), {
                        [jobPath]: {
                            ...selectedJob, // Keep the existing job details
                            hiredApplicant: selectedApplicant.id,
                            deadline: selectedDate.toISOString(), // Convert to ISO format for consistent storage
                        },
                        [applicantPath]: false, // Set the value to false instead of removing the node
                    });
                }

                console.log('Hired the applicant successfully');
                closePopup(); // Close the modal after hiring

                // Refresh the workers page (you may need to implement a mechanism for this)
            } catch (error) {
                console.error('Error hiring the applicant:', error);
            }
        }
    };


// Function to find the actual path of the job based on the job ID
    const findJobPathByJobId = async (jobId) => {
        try {
            const jobsRef = ref(database, 'jobs');
            const jobsSnapshot = await get(jobsRef);

            if (jobsSnapshot.exists()) {
                for (const category of Object.keys(jobsSnapshot.val())) {
                    const categoryJobsRef = ref(database, `jobs/${category}`);
                    const categoryJobsSnapshot = await get(categoryJobsRef);

                    if (categoryJobsSnapshot.exists()) {
                        for (const actualJobId of Object.keys(categoryJobsSnapshot.val())) {
                            if (actualJobId.split('-')[1] === jobId) {
                                return `jobs/${category}/${actualJobId}`;
                            }
                        }
                    }
                }
            }

            console.log('Job not found for jobId:', jobId);
            return null;
        } catch (error) {
            console.error('Error finding job path by jobId:', error);
            return null;
        }
    };


    const handleHireButtonClick = (job, applicant) => {
        console.log('Clicked Hire button:', job, applicant);
        openPopup(job, applicant);
    };

    // Function to open the modal
    const openPopup = (job, applicant) => {
        console.log('Opening popup:', job, applicant);
        setSelectedJob(job);
        setSelectedApplicant(applicant);
        setIsModalOpen(true);
    };

    // Function to close the modal
    const closePopup = () => {
        setSelectedJob(null);
        setSelectedApplicant(null);
        setIsModalOpen(false);
    };

    useEffect(() => {
        // Fetch jobs when the component mounts
        const fetchJobs = async () => {
            try {
                setLoading(true);
                const jobsRef = ref(database, 'jobs');
                const jobsSnapshot = await get(jobsRef);

                if (jobsSnapshot.exists()) {
                    // Convert the jobs object to an array
                    const jobsData = Object.entries(jobsSnapshot.val()).map(([category, jobs]) => ({
                        category,
                        jobs: Object.entries(jobs).map(([id, value]) => ({
                            id,
                            ...value,
                        })),
                    }));

                    // Filter out jobs with no applicants
                    const filteredJobs = jobsData.map((jobCategory) => ({
                        category: jobCategory.category,
                        jobs: jobCategory.jobs.filter((job) => job.applicants && Object.keys(job.applicants).length > 0),
                    })).filter((jobCategory) => jobCategory.jobs.length > 0);

                    // Fetch usernames and emails for all applicants
                    const jobsWithUserdata = await Promise.all(
                        filteredJobs.map(async (jobCategory) => ({
                            category: jobCategory.category,
                            jobs: await Promise.all(
                                jobCategory.jobs.map(async (job) => ({
                                    ...job,
                                    applicants: await Promise.all(
                                        Object.keys(job.applicants).map(async (applicantId) => ({
                                            id: applicantId,
                                            ...await fetchUserData(applicantId),
                                        }))
                                    ),
                                }))
                            ),
                        }))
                    );

                    setJobs(jobsWithUserdata);
                } else {
                    // No jobs in the database
                    setJobs([]);
                }
            } catch (error) {
                console.error('Error fetching jobs:', error);
            } finally {
                setLoading(false); // Set loading to false after fetching data (whether successful or not)
            }
        };

        fetchJobs();
    }, [fetchJobTitle]); // Include fetchJobTitle as a dependency to avoid missing it in the useEffect dependencies array

    return (
        <div className="lg:mx-52 md:mx-20 mx-8 flex">
            {/* Left side - All Applicants */}
            <div className="flex-1 w-full mr-4">
                <h3 className="text-lg font-bold mb-2">All Applicants</h3>
                {loading ? (
                    <div className="flex mt-32 justify-center items-center">
                        <CircularProgress style={{display: 'block'}}/>
                    </div>
                ) : jobs.length > 0 ? (
                    <ul>
                        {jobs.map((jobCategory) => (
                            <div key={jobCategory.category} className="mb-4">
                                <h4 className="text-xl font-bold mb-2">
                                    {jobCategory.category.charAt(0).toUpperCase() + jobCategory.category.slice(1)} Job
                                </h4>
                                <ul>
                                    {jobCategory.jobs.map((job) => (
                                        <li key={job.id} className=" p-4 mb-2 rounded-md bg-white">
                                            {/* Display job details */}
                                            <p className="text-lg font-semibold mb-2">{job.jobTitle}</p>

                                            {/* Display applicants for the job */}
                                            <div>
                                                <ul>
                                                    {job.applicants.map((applicant) => (
                                                        <li key={applicant.id} className="mb-4">
                                                            <div
                                                                className="bg-gray-50 px-2 py-2 rounded-lg flex items-center justify-between">
                                                                {/* Avatar */}
                                                                <div className="flex items-center">
                                                                    <div className="bg-gray-200 rounded-full p-2 mr-2">
                                                                        <AiOutlineUser size={24} color="gray"/>
                                                                    </div>

                                                                    <div>
                                                                        <p>{applicant.username}</p>
                                                                        <p className="text-gray-600 font-light text-xs">
                                                                            {applicant.email}
                                                                        </p>
                                                                    </div>
                                                                </div>

                                                                <div>
                                                                    {/* View Details button for each applicant */}
                                                                    <button
                                                                        className=" text-gray-600 text-sm font-light py-1 px-3 rounded-md hover:bg-gray-200 ml-2"
                                                                        onClick={() => {
                                                                            setSelectedApplicant(applicant);
                                                                            viewDetails();
                                                                        }}
                                                                    >
                                                                       Details
                                                                    </button>
                                                                    <button
                                                                        className="bg-teal-500 text-white ml-2 text-sm py-1 px-3 rounded-md hover:bg-teal-700"
                                                                        onClick={() => handleHireButtonClick(job, applicant)}
                                                                    >
                                                                        Hire
                                                                    </button>


                                                                </div>

                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </ul>
                ) : (
                    <p>No jobs in the database</p>
                )}
            </div>
            {/* Right side - Empty div with border */}
            <div className=" flex flex-1 flex-col items-center w-full border py-4">
                <h3 className="text-lg font-bold mb-4">Applicant's Details</h3>
                {userDetails ? (
                    <div className="flex items-center mx-4 mt-3">
                        <div className="bg-white flex items-center rounded-lg p-4">
                            <div className="bg-gray-100 rounded-full p-4 mr-2 w-fit">
                                <AiOutlineUser size={150} color="gray"/>
                            </div>
                            <div className="flex flex-col">
                                <div className=" p-2 bg-gray-50 rounded-md">
                                    <p className="">{userDetails.username}</p>
                                    <p className="">{userDetails.email}</p>
                                </div>
                                <div
                                    className="mt-2 p-2 bg-gray-50 rounded-md"
                                ><p>{userDetails.Rapport}</p></div>
                            </div>
                        </div>


                    </div>


                ) : (
                  <p>No Details</p>
                )}
                {selectedJob && (
                    <div>
                        <h3 className="text-lg font-bold mb-2">Selected Job Description</h3>
                        <p>{selectedJob.jobDescription || 'No description'}</p>
                    </div>
                )}
            </div>

            {/* Modal for hiring */}
            {isModalOpen && selectedJob && (
                <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-md w-[400px]">
                        <h2 className="text-2xl font-bold mb-4">Hire for {selectedJob?.jobTitle}</h2>
                        <p className="text-lg">Applicant : {selectedApplicant?.username}</p>

                        {/* Date Picker */}
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700">Select Deadline:</label>
                            <DatePicker
                                selected={selectedDate}
                                onChange={(date) => setSelectedDate(date)}
                                className="mt-1 p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                            />
                        </div>

                        {/* Hire button */}
                        <div className="flex justify-between">
                            <button
                                className="mt-4 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring focus:border-blue-300"
                                onClick={closePopup}
                            >
                                Close
                            </button>
                            <button
                                className="mt-4 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring focus:border-blue-300"
                                onClick={hireApplicant}
                            >
                                Hire
                            </button>
                        </div>


                        {/* Close button */}

                    </div>
                </div>

            )}
        </div>
    );

};

export default Workers;
