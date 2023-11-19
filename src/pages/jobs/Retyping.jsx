import React, { useState } from 'react';
import { toast } from 'react-toastify';
import {push, ref} from "firebase/database";
import {database} from "../../firebase";

const CompletedProjectsList = ({ projects }) => (
    <div>
        <h3 className="text-lg font-bold mb-2">Completed Projects</h3>
        <ul>
            {projects.map((project, index) => (
                <li key={index}>
                    {project.title}
                </li>
            ))}
        </ul>
    </div>
);

const Retyping = ({ onClose }) => {
    const [completedProjects, setCompletedProjects] = useState([
        { title: 'Word to PDF' },
        { title: 'Photo to PDF' },
        // Add more projects as needed
    ]);

    const [jobTitle, setJobTitle] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [selectedPrice, setSelectedPrice] = useState(0);

    const [experienceLevelOptions] = useState(['Beginner', 'Intermediate', 'Expert']); // Add more as needed
    const [selectedExperienceLevel, setSelectedExperienceLevel] = useState('');

    const handleJobSubmission = async (e) => {
        e.preventDefault();

        if (!jobTitle.trim() || !jobDescription.trim() || !selectedExperienceLevel) {
            toast.error('Please fill in all fields');
            return;
        }

        try {
            await push(ref(database, 'jobs/retyping'), {
                jobTitle: jobTitle,
                jobDescription: jobDescription,
                price: selectedPrice,
                experienceLevel: selectedExperienceLevel,
                jobStatus: 'active',
                timestamp: new Date().toString(),
            });

            toast.success('Job submitted successfully');

            console.log('Job Submitted:', { jobTitle, jobDescription, selectedPrice, selectedExperienceLevel });
            setCompletedProjects((prevProjects) => [
                ...prevProjects,
                { title: jobTitle },
            ]);

            setJobTitle('');
            setJobDescription('');
            setSelectedPrice(0);
            setSelectedExperienceLevel('');
        } catch (error) {
            console.error('Error submitting job:', error);
            toast.error('Error submitting job');
        }
    };
    return (
        <div className="flex flex-col min-w-full overflow-auto">
            <h2 className="text-xl font-medium mb-4">Retyping</h2>
            <div className="flex flex-col lg:flex-row ">
                <div className="w-full md:w-full lg:w-1/2 pr-4  lg:border-r border-gray-300">
                    <form onSubmit={handleJobSubmission} className="flex flex-col h-full justify-between ">
                        <label className="mx-2 text-sm" htmlFor="jobTitle">Job Title</label>
                        <input
                            className="border-1 border-orange-500 focus:outline-orange-300 p-2 mx-2 rounded-lg h-8"
                            type="text"
                            id="jobTitle"
                            value={jobTitle}
                            onChange={(e) => setJobTitle(e.target.value)}
                        />

                        <label className="mx-2 mt-2 text-sm" htmlFor="jobDescription">Job Description</label>
                        <textarea
                            className="border-1 border-orange-500 focus:outline-orange-400 mx-2 p-2 rounded-lg h-32 resize-none"
                            id="jobDescription"
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                        />
                        <label className="mx-2 text-sm mt-2" htmlFor="price">
                            Price
                        </label>
                        <input
                            className="border-1 py-5 border-orange-500 focus:outline-orange-300 px-2 mx-2 rounded-lg h-8"
                            type="number"
                            id="price"
                            value={selectedPrice}
                            onChange={(e) => setSelectedPrice(Math.max(0, parseInt(e.target.value)))}
                            placeholder="Enter price"
                            step={50}
                        />


                        <label className="mx-2 text-sm mt-2" htmlFor="experienceLevel">Experience Level</label>
                        <select
                            className="border-1  border-orange-500 focus:outline-orange-300  mx-2 rounded-lg h-10"
                            id="experienceLevel"
                            value={selectedExperienceLevel}
                            onChange={(e) => setSelectedExperienceLevel(e.target.value)}
                        >
                            <option value="" disabled>Select Experience Level</option>
                            {experienceLevelOptions.map((option) => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>

                        <button className="bg-orange-500 text-white rounded m-2 p-3 focus:bg-orange-400" type="submit">
                            Post Job
                        </button>
                    </form>
                </div>

                <div className="w-full md:w-1/2 pl-4 ">
                    <CompletedProjectsList projects={completedProjects}/>
                </div>
            </div>
        </div>
    );
};

export default Retyping;
