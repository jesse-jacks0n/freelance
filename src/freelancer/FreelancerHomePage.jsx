import React, {useState} from 'react';
import FreelancerNav from "./components/FreelancerNav";
import FreelancerBodyContent from "./FreelancerBodyContent";

function FreelancerHomePage(){
    const [activeBtn, setActiveButton] = useState('freelancerdash');

    const handleBtnClick = (buttonName) => {
        setActiveButton(buttonName);
    };

    return (
        <div
            className="home bg-gray-100 relative min-h-screen ">
            <FreelancerNav
                activeButton={activeBtn}
                handleBtnClick={handleBtnClick}
            />
            <FreelancerBodyContent activeButton={activeBtn}/>

        </div>
    );
}

export default FreelancerHomePage;