import React, {useEffect, useState} from "react";
import {MessageRounded, MoreVert, NotificationsActiveRounded} from "@mui/icons-material";
import SignOutButton from "./SignoutButton";
import {Avatar, Menu, MenuItem} from "@mui/material";
import {onAuthStateChanged} from "firebase/auth";
import {auth, database} from "../firebase";
import {get, ref} from "firebase/database";


export default function Navbar({ activeButton, handleButtonClick }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const [user, setUser] = useState(null);
    const profilePic = user && user.profilePic ? user.profilePic : 'default-profile-pic.jpg';
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
            if (authUser) {
                const userRef = ref(database, `users/${authUser.uid}`);
                const snapshot = await get(userRef);
                const userData = snapshot.val();
                const mergedUser = {...authUser, ...userData};
                setUser(mergedUser);

            } else {
                setUser(null);
            }
        });

        return () => unsubscribe();
    }, []);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <div className="navbar bg-gray-50 sticky top-0 px-1  flex justify-between items-center z-10 w-full">
            <div className="logo text-white text-lg">
                <p className={"text-black mx-4"}>Logo</p>

            </div>
            <div className=" shadow-md p-1 mt-2 mb-2 nav-content gap-2 bg-white rounded-full flex justify-center items-center text-sm ">
                <button
                    className={`py-2 px-4 rounded-full ${activeButton === "overview" ? "bg-teal-500 text-white" : "text-gray-600 hover:bg-gray-200 hover:text-gray-600"}`}
                    onClick={() => handleButtonClick("overview")}
                >
                    Overview
                </button>
                <button
                    className={`py-2 px-6 rounded-full ${activeButton === "workers" ? "bg-teal-500 text-white" : "text-gray-600 hover:bg-gray-200 hover:text-gray-600"}`}
                    onClick={() => handleButtonClick("workers")}
                >
                    Workers
                </button>
                <button
                    className={`py-2 px-6 rounded-full ${activeButton === "inprogress" ? "bg-teal-500 text-white" : "text-gray-600 hover:bg-gray-200 hover:text-gray-600"}`}
                    onClick={() => handleButtonClick("inprogress")}
                >
                    In Progress
                </button>
                <button
                    className={`py-2 px-6 rounded-full ${activeButton === "submissions" ? "bg-teal-500 text-white" : "text-gray-600 hover:bg-gray-200 hover:text-gray-600"}`}
                    onClick={() => handleButtonClick("submissions")}
                >
                    Submissions
                </button>

            </div>

            <div className="profile-container flex items-center">

                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-200 ml-4">
                    <NotificationsActiveRounded/>
                </div>
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-200 mx-4">
                    <MessageRounded/>
                </div>
                <img className="w-8 rounded-full "
                     src={profilePic} alt="img"/>
                <div>
                    <MoreVert
                        aria-controls="simple-menu"
                        aria-haspopup="true"
                        onClick={handleClick}
                        className=" text-gray-600 rounded-full  items-center"
                    >
                    </MoreVert>
                    <Menu
                        id="simple-menu"
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={handleClose}>
                            <SignOutButton/>
                        </MenuItem>
                    </Menu>
                </div>
            </div>

        </div>
    );
}
