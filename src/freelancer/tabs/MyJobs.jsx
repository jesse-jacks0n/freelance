import React, { useEffect, useState } from 'react';
import { get, ref } from 'firebase/database';
import {auth, database, storage} from '../../firebase';
import { onAuthStateChanged } from "firebase/auth";
import {ref as storageReference,getDownloadURL} from "firebase/storage";
const MyJobs = () => {
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
            if (authUser) {
                try {
                    // Fetch jobs from the "hiredApplicants" collection for the authenticated user
                    const hiredApplicantsRef = ref(database, `hiredApplicants/${authUser.uid}`);
                    const hiredApplicantsSnapshot = await get(hiredApplicantsRef);

                    console.log('hiredApplicantsSnapshot.val():', hiredApplicantsSnapshot.val());

                    if (hiredApplicantsSnapshot.exists()) {
                        const jobsData = hiredApplicantsSnapshot.val();
                        setJobs([jobsData]);
                    } else {
                        setJobs([]);
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            }
        });

        return () => unsubscribe();
    }, []);

    console.log('Jobs:', jobs);

    return (
        <div className="mx-auto max-w-screen-2xl">
            <h1 className="mx-4">My Jobs</h1>
            <div className="mx-4 mt-4 p-4 border border-gray-200 drop-shadow-sm rounded-lg bg-white">
                <div>
                    {jobs.map((job, index) => (
                        <div key={index}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <p className="   text-green-900 text-md ">{job.jobTitle}</p>
                                </div>
                                <div className="flex items-center justify-center text-sm gap-2">
                                    <p>Attachment</p>
                                    {job.jobId && (
                                        <DownloadLink jobId={job.jobId}/>
                                    )}
                                </div>

                            </div>
                            <div className="flex flex-col bg-gray-100 p-2 mt-2 rounded-md">
                                <p className="text-sm font-light text-gray-900">Description: {job.jobDescription}</p>


                            </div>
                            <div className="flex justify-between mt-2 items-center">
                                <p className="text-md   font-medium text-green-900">Deadline
                                    <span
                                        className="bg-gray-100 text-sm px-2 py-1 ml-1 rounded-full">{new Date(job.deadline).toLocaleString()}</span>
                                </p>
                                <button className="bg-purple-600 text-white text-sm rounded-full py-1 px-2">
                                  <span className="">+</span> add submission
                                </button>

                            </div>

                        </div>
                    ))}
                </div>
            </div>
        </div>

    );
};
const DownloadLink = ({jobId}) => {
    const [fileDownloadURL, setFileDownloadURL] = useState(null);

    useEffect(() => {
        const fetchFileDownloadURL = async () => {
            try {
                const storageRef = storageReference(storage, `documents/${jobId}`);
                const downloadURL = await getDownloadURL(storageRef);
                setFileDownloadURL(downloadURL);
            } catch (error) {
                console.error('Error fetching file download URL:', error);
            }
        };

        fetchFileDownloadURL();
    }, [jobId]);

    return (
        <div className="bg-gray-200 p-2 rounded-full">
            <a href={fileDownloadURL} download>
                <img className="w-6 " src="/icons/paperclip.png" alt="icon"/>
            </a>
        </div>

    );
};
export default MyJobs;
