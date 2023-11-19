import React from 'react';
import { Checkbox, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

const JobsTable = ({ data, selectedJobs, handleCheckboxChange }) => {
    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell align="left">Select</TableCell>
                    <TableCell align="left">Title</TableCell>
                    <TableCell align="left">Description</TableCell>
                    <TableCell align="left">Date Created</TableCell>
                    <TableCell align="left">Status</TableCell>
                    {/* Add more columns as needed */}
                </TableRow>
            </TableHead>
            <TableBody>
                {data.map((job) => (
                    <TableRow key={job.id}>
                        <TableCell align="left">
                            <Checkbox
                                checked={selectedJobs && selectedJobs.includes(job.id)}
                                onChange={() => handleCheckboxChange(job.id)}
                            />
                        </TableCell>
                        <TableCell align="left">{job.jobTitle}</TableCell>
                        <TableCell align="left">{job.jobDescription}</TableCell>
                        <TableCell align="left">{job.timestamp}</TableCell>
                        <TableCell align="left">{job.jobStatus}</TableCell>
                        {/* Add more cells as needed */}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default JobsTable;
