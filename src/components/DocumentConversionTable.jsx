import React, { useState, useEffect } from 'react';
import { get, ref, update, set, push } from 'firebase/database';
import { database } from '../firebase';
import { Paper, TextField, Button, CircularProgress } from '@mui/material';
import JobsTable from './JobsTable';

const DocumentConversionTable = () => {
    const [jobsData, setJobsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedJobs, setSelectedJobs] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const jobsRef = ref(database, 'jobs/documentConversion');
                const snapshot = await get(jobsRef);

                if (snapshot.exists()) {
                    const data = Object.entries(snapshot.val() || {}).map(([key, value]) => ({
                        id: key,
                        ...value,
                    }));

                    // Set the jobsData state with the fetched data
                    setJobsData(data);
                } else {
                    setJobsData([]);
                }
            } catch (error) {
                console.error('Error fetching data from Firebase Realtime Database:', error);
            } finally {
                setLoading(false);
            }
        };

        // Fetch data when the component mounts
        fetchData();
    }, []);

    const handleSearch = (event) => {
        const searchTerm = event.target.value.toLowerCase();

        if (!searchTerm) {
            // If search term is empty, fetch the original data
            fetchData();
        } else {
            // If there is a search term, filter the jobs
            const filteredJobs = jobsData.filter((job) =>
                job.jobTitle.toLowerCase().includes(searchTerm) ||
                job.jobDescription.toLowerCase().includes(searchTerm)
            );
            setJobsData(filteredJobs);
        }
    };



    const fetchData = async () => {
        try {
            const jobsRef = ref(database, 'jobs/documentConversion');
            const snapshot = await get(jobsRef);

            if (snapshot.exists()) {
                const data = Object.entries(snapshot.val() || {}).map(([key, value]) => ({
                    id: key,
                    ...value,
                }));

                // Set the jobsData state with the fetched data
                setJobsData(data);
            } else {
                setJobsData([]);
            }
        } catch (error) {
            console.error('Error fetching data from Firebase Realtime Database:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCheckboxChange = (jobId) => {
        setSelectedJobs((prevSelected) => {
            if (prevSelected.includes(jobId)) {
                return prevSelected.filter((id) => id !== jobId);
            } else {
                return [...prevSelected, jobId];
            }
        });
    };

    const handleMarkAsDone = async () => {
        try {
            // Update the jobStatus to 'done' for selected jobs
            await Promise.all(
                selectedJobs.map((jobId) =>
                    update(ref(database, `jobs/translation/${jobId}`), { jobStatus: 'done' })
                )
            );
            console.log('Selected jobs marked as done successfully');

            // Refetch data after marking as done
            fetchData();
        } catch (error) {
            console.error('Error marking selected jobs as done:', error);
        }
    };

    const handleDelete = async () => {
        try {
            // Move selected jobs to the 'deleted' collection
            await Promise.all(
                selectedJobs.map(async (jobId) => {
                    const jobRef = ref(database, `jobs/documentConversion/${jobId}`);
                    const jobSnapshot = await get(jobRef);

                    if (jobSnapshot.exists()) {
                        const jobsData = jobSnapshot.val();

                        // Write job data to 'deleted' collection
                        await push(ref(database, 'jobs/deleted'), jobsData);
                    }

                    // Remove selected jobs from the 'jobs' collection
                    await set(jobRef, null);
                })
            );

            console.log('Selected jobs moved to deleted successfully');

            // Refetch data after deleting
            fetchData();
        } catch (error) {
            console.error('Error deleting selected jobs:', error);
        }
    };

    return (
        <Paper className="my-2  mt-5 p-2 md:p-10 bg-white rounded-3xl">
            <div className="flex items-center justify-between rounded-lg text-xs">
                <div>
                    <Button
                        variant="contained"
                        color="success"
                        onClick={handleMarkAsDone}
                        disabled={selectedJobs.length === 0}
                        style={{ marginBottom: 10, fontSize: 12, marginRight: 10 }}
                    >
                        Mark as Done
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleDelete}
                        disabled={selectedJobs.length === 0}
                        style={{ marginBottom: 10, fontSize: 12 }}
                    >
                        Delete
                    </Button>
                </div>
            </div>

            <TextField
                label="Search"
                variant="outlined"
                size="small"
                fullWidth
                margin="dense"
                onChange={handleSearch}
            />

            {loading ? (
                <CircularProgress style={{ margin: '50px auto', display: 'block' }} />
            ) : (
                <JobsTable data={jobsData} selectedJobs={selectedJobs} handleCheckboxChange={handleCheckboxChange} />
            )}
        </Paper>
    );
};

export default DocumentConversionTable;
