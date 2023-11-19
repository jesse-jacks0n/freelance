import React, {useState} from 'react';
import FreelancerDash from "./tabs/freelancerDash";
import MyJobs from "./tabs/MyJobs";
import Portfolio from "./tabs/Portfolio";
import Profile from "./tabs/Profile";


export default function FreelancerBodyContent({ activeButton }) {
    let content;

    switch (activeButton) {
        case 'freelancerdash':
            content = <FreelancerDash />;
            break;
        case 'myprojects':
            content = <MyJobs />;
            break;
        case 'portfolio':
            content = <Portfolio />;
            break;
        case 'profile':
            content = <Profile />;
            break;

        default:
            content = null;
    }

    return <div className="relative">{content}</div>;
}