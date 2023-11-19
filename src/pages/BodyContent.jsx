import React, {useState} from 'react';
import Overview from "./tabs/Overview";
import Workers from "./tabs/Workers";
import InProgress from "./tabs/InProgress";
import Submissions from "./tabs/Submissions";

export default function BodyContent({activeButton}) {
    const [activeB] = useState('Approved');
    const [activeBA] = useState('Active');
    let content;



    switch (activeButton) {
        case 'overview':
            content = <Overview/>;
            break;
        case 'workers':
            content = <Workers
                activeBtn={activeB}
            />;
            break;
        case 'inprogress':
            content = <InProgress  activeBtn={activeBA}/>;
            break;
        case 'submissions':
            content = <Submissions/>;
            break;


        default:
            content = null;
    }

    return <div className="body-content  relative">{content}</div>;
}