import React, { useState } from 'react';
import {storage} from '../firebase';
import {ref,uploadBytes} from "firebase/storage";

const PdfUpload = () => {
    const [file, setFile] = useState(null);
    const [url, setUrl] = useState("");
    const [progress, setProgress] = useState(0);

    const handleChange = e => {
        if (e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {

        const storageRef = ref(storage, `documents`);

        try {
            uploadBytes(storageRef,file).then((snapshot) => {
                alert("File uploaded successfully");
            });


        } catch (e) {
            console.log("error", e);
        }

    };

    return (
        <div>
            <progress value={progress} max="100" />
            <br />
            <input type="file" onChange={handleChange} />
            <button onClick={handleUpload}>Upload</button>
            <br />
            {url}
        </div>
    );
};

export default PdfUpload;