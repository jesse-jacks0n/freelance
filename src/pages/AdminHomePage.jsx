import React, {useState} from 'react';
import Navbar from '../components/Navbar';
import BodyContent from "./BodyContent";

function AdminHomePage() {
    const [activeButton, setActiveButton] = useState('overview');

    const handleButtonClick = (buttonName) => {
        setActiveButton(buttonName);
    };

    return (
        <div
            className="home bg-gray-100 relative min-h-screen ">
            <Navbar
                activeButton={activeButton}
                handleButtonClick={handleButtonClick}
            />
            <BodyContent activeButton={activeButton}/>

        </div>
    );
}

export default AdminHomePage;
