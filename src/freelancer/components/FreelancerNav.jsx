import React, {useEffect, useState} from "react";
import {MessageRounded, MoreVert, NotificationsActiveRounded} from "@mui/icons-material";
import SignOutButton from "../../components/SignoutButton";
import {onAuthStateChanged} from "firebase/auth";
import {auth, database} from "../../firebase";
import {get, ref} from "firebase/database";
import {Avatar, Button, Menu, MenuItem} from "@mui/material";


export default function FreelancerNav({activeButton, handleBtnClick}) {
    const [user, setUser] = useState(null);
    const userName = user && user.username ? user.username.toUpperCase() : '';
    const [anchorEl, setAnchorEl] = useState(null);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
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
    return (
        <div className="navbar bg-gray-50 sticky top-0 z-10 w-full">
            <div className="wrapper flex justify-between items-center mx-4 sm:mx-8 md:mx-4 lg:mx-10 xl:mx-16 2xl:mx-24">
                <div className="logo text-white text-lg">
                    <p className={"text-black mx-4"}>LOGO</p>

                </div>
                <div
                    className=" shadow-sm p-1 mt-2 mb-2 nav-content gap-2 bg-white rounded-md flex justify-center items-center text-sm ">
                    <button
                        className={`py-2 px-4 rounded-md ${activeButton === "freelancerdash" ? "bg-teal-500 text-white" : "text-gray-600 hover:bg-gray-200 hover:text-gray-600"}`}
                        onClick={() => handleBtnClick("freelancerdash")}
                    >
                        Dashboard
                    </button>
                    <button
                        className={`py-2 px-6 rounded-md ${activeButton === "myprojects" ? "bg-teal-500 text-white" : "text-gray-600 hover:bg-gray-200 hover:text-gray-600"}`}
                        onClick={() => handleBtnClick("myprojects")}
                    >
                        My Jobs
                    </button>
                    <button
                        className={`py-2 px-6 rounded-md ${activeButton === "portfolio" ? "bg-teal-500 text-white" : "text-gray-600 hover:bg-gray-200 hover:text-gray-600"}`}
                        onClick={() => handleBtnClick("portfolio")}
                    >
                        Portfolio
                    </button>
                    <button
                        className={`py-2 px-6 rounded-md ${activeButton === "profile" ? "bg-teal-500 text-white" : "text-gray-600 hover:bg-gray-200 hover:text-gray-600"}`}
                        onClick={() => handleBtnClick("profile")}
                    >
                        Profile
                    </button>

                </div>

                <div className="profile-container flex justify-center gap-2 items-center ">

                    <div
                        className="w-10 h-10 rounded-full flex border items-center justify-center bg-white drop-shadow-sm">
                        <NotificationsActiveRounded
                            className="text-gray-600"/>
                    </div>
                    <div
                        className="w-10 h-10 rounded-full border flex items-center justify-center bg-white drop-shadow-sm">
                        <MessageRounded
                            className="text-gray-600"/>
                    </div>
                    <h1 className="text-lg font-medium">Hi, {userName}</h1>
                    <Avatar
                    />
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


        </div>
    );
}
