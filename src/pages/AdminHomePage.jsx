import React, {useState} from 'react';
import Navbar from '../components/Navbar';
import BodyContent from "./BodyContent";
import {Toaster} from "react-hot-toast";


const divStyle = {
    backgroundImage: 'url(/images/bg.png)',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat'
};
function AdminHomePage() {
    const [activeButton, setActiveButton] = useState('overview');

    const handleButtonClick = (buttonName) => {
        setActiveButton(buttonName);
    };

    return (
        <div
            className="home bg-gray-50  relative min-h-screen "
            // style={divStyle}
        >
            <div><Toaster/></div>
            <Navbar
                activeButton={activeButton}
                handleButtonClick={handleButtonClick}
            />
            <BodyContent activeButton={activeButton}/>

        </div>
    );
}

export default AdminHomePage;
