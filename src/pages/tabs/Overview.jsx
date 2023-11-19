import React, {useEffect, useState} from 'react';
import ServiceModal from "../../services/ServiceModal";
import Translation from "../jobs/Translation";
import {Link} from "@mui/material";
import LogoDesign from "../jobs/LogoDesign";
import Retyping from "../jobs/Retyping";
import DocumentConversion from "../jobs/DocumentConversion";
import {auth, database} from "../../firebase";
import {ref, get} from "firebase/database";
import {onAuthStateChanged} from "firebase/auth";
import YourJobsTabs from "../jobs/JobsTab";

const Overview = () => {

    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedService, setSelectedService] = useState(null);
    const [user, setUser] = useState(null); // Initialize user state

    const userName = user && user.username ? user.username.toUpperCase() : '';
    useEffect(() => {
        // Use Firebase auth state observer to get the current user
        const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
            if (authUser) {
                // Fetch additional user data from Realtime Database
                const userRef = ref(database, `users/${authUser.uid}`);
                const snapshot = await get(userRef);
                const userData = snapshot.val();

                // Merge auth and database user data
                const mergedUser = {...authUser, ...userData};
                setUser(mergedUser);
            } else {
                // User is signed out
                setUser(null);
            }
        });

        // Cleanup the observer when the component unmounts
        return () => unsubscribe();
    }, []);


    const openModal = (service) => {
        setModalOpen(true);
        setSelectedService(service);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedService(null);
    };
    const divStyle = {
        backgroundImage: 'url("/images/overview.jpg")',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
    };
    return (
        <div

            className="flex flex-col min-h-screen mx-4  sm:mx-8 md:mx-4 lg:mx-10 xl:mx-16 2xl:mx-24">
            <h1 className="text-3xl mt-4 font-bold">Welcome {userName}</h1>

            <section className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Service Overview</h2>
                <div className="flex flex-wrap -mx-2">
                    {/* Translation Card */}
                    <div className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 px-2 mb-4">
                        <Link
                            to="/translation"
                            className="p-4 bg-white rounded-md shadow-md flex cursor-pointer hover:bg-gray-50"
                            onClick={() => openModal('Translation')}
                            style={{textDecoration: 'none'}}
                        >
                            <div className="image w-28 mr-4">
                                <img src="/icons/translate.png" alt="Translation Icon"/>
                            </div>
                            <div className="card-content text-black no-underline">
                                <h3 className="text-lg font-bold mb-2 text-black no-underline">Translation</h3>
                                <p>projects completed: {/* Display the actual number */}</p>
                                <p>Latest updates: {/* Display the latest updates */}</p>
                            </div>
                        </Link>
                    </div>

                    {/* Logo Designing Card */}
                    <div className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 px-2 mb-4">
                        <Link
                            to="/logodesign"
                            className="p-4 bg-white rounded-lg shadow-md flex cursor-pointer hover:bg-gray-50"
                            onClick={() => openModal('LogoDesign')}
                            style={{textDecoration: 'none'}}
                        >
                            <div className="image w-28 mr-4">
                                <img src="/icons/creative.png" alt="Logo Designing Icon"/>
                            </div>
                            <div className="card-content text-black no-underline">
                                <h3 className="text-lg font-bold mb-2">Logo Designing</h3>
                                <p>projects completed: {/* Display the actual number */}</p>
                                <p>Latest updates: {/* Display the latest updates */}</p>
                            </div>
                        </Link>
                    </div>

                    {/* Retyping Card */}
                    <div className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 px-2 mb-4">
                        <Link
                            to="/retyping"
                            className="p-4 bg-white rounded-lg shadow-md flex cursor-pointer hover:bg-gray-50"
                            onClick={() => openModal('Retyping')}
                            style={{textDecoration: 'none'}}
                        >
                            <div className="image w-28 mr-4">
                                <img src="/icons/typing.png" alt="Retyping Icon"/>
                            </div>
                            <div className="card-content text-black no-underline">
                                <h3 className="text-lg font-bold mb-2">Retyping</h3>
                                <p>projects completed: {/* Display the actual number */}</p>
                                <p>Latest updates: {/* Display the latest updates */}</p>
                            </div>
                        </Link>
                    </div>

                    {/* Document Conversion Card */}
                    <div className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 px-2 mb-4">
                        <Link
                            to="/documentconversion"
                            className="p-4 bg-white rounded-lg shadow-md flex cursor-pointer hover:bg-gray-50"
                            onClick={() => openModal('DocumentConversion')}
                            style={{textDecoration: 'none'}}
                        >
                            <div className="image w-28 mr-4">
                                <img src="/icons/conversion.png" alt="Document Conversion Icon"/>
                            </div>
                            <div className="card-content text-black no-underline">
                                <h3 className="text-lg font-bold mb-2">Document Conversion</h3>
                                <p>projects completed: {/* Display the actual number */}</p>
                                <p>Latest updates: {/* Display the latest updates */}</p>
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Service Modals */}
                {isModalOpen && (
                    <ServiceModal onClose={closeModal}>
                        {selectedService === 'Translation' && <Translation onClose={closeModal}/>}
                        {selectedService === 'LogoDesign' && <LogoDesign onClose={closeModal}/>}
                        {selectedService === 'Retyping' && <Retyping onClose={closeModal}/>}
                        {selectedService === 'DocumentConversion' && <DocumentConversion onClose={closeModal}/>}
                        {/* Add other service pages here */}
                    </ServiceModal>
                )}

            </section>

            <YourJobsTabs/>
        </div>
    );
}
export default Overview;