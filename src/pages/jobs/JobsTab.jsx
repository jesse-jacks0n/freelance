import React, { useState } from 'react';
import TranslationTable from "../../components/TranslationTable";
import LogoDesignTable from "../../components/LogoDesignTable";
import RetypingTable from "../../components/RetypingTable";
import DocumentConversionTable from "../../components/DocumentConversionTable";

const Tabs = ({ children }) => {
    const [activeTab, setActiveTab] = useState(0);

    const handleTabClick = (index) => {
        setActiveTab(index);
    };

    return (
        <div>
            <div className="flex">
                {React.Children.map(children, (child, index) => (
                    <div
                        className={`cursor-pointer rounded-md hover:bg-gray-200 mr-2 px-4 py-2 ${
                            activeTab === index ? 'bg-teal-500 text-white rounded-md hover:bg-teal-400' : ''
                        }`}
                        onClick={() => handleTabClick(index)}
                    >
                        {child.props.label}
                    </div>
                ))}
            </div>
            <div className="mt-4">
                {React.Children.toArray(children)[activeTab]}
            </div>
        </div>
    );
};

const TabPanel = ({ children }) => <div>{children}</div>;

const YourJobsTabs = () => (
    <div>
        <h2 className="text-xl mb-2 font-md mt-4">Your Jobs</h2>
        <Tabs>
            <TabPanel label="Translation Jobs">
                <TranslationTable />
            </TabPanel>
            <TabPanel label="Logo Design Jobs">
                <LogoDesignTable />
            </TabPanel>
            <TabPanel label="Retyping Jobs">
                <RetypingTable />
            </TabPanel>
            <TabPanel label="Document Conversion Jobs">
                <DocumentConversionTable />
            </TabPanel>
        </Tabs>
    </div>
);


export default YourJobsTabs;
