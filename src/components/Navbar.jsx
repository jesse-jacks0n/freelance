import React, {useState} from "react";
import {MessageRounded, MoreVert, NotificationsActiveRounded} from "@mui/icons-material";
import SignOutButton from "./SignoutButton";
import {Avatar, Menu, MenuItem} from "@mui/material";


export default function Navbar({ activeButton, handleButtonClick }) {
    const [anchorEl, setAnchorEl] = useState(null);
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
            <div className=" shadow-sm p-1 mt-2 mb-2 nav-content gap-2 bg-white rounded-md flex justify-center items-center text-sm ">
                <button
                    className={`py-2 px-4 rounded-md ${activeButton === "overview" ? "bg-teal-500 text-white" : "text-gray-600 hover:bg-gray-200 hover:text-gray-600"}`}
                    onClick={() => handleButtonClick("overview")}
                >
                    Overview
                </button>
                <button
                    className={`py-2 px-6 rounded-md ${activeButton === "workers" ? "bg-teal-500 text-white" : "text-gray-600 hover:bg-gray-200 hover:text-gray-600"}`}
                    onClick={() => handleButtonClick("workers")}
                >
                    Workers
                </button>
                <button
                    className={`py-2 px-6 rounded-md ${activeButton === "inprogress" ? "bg-teal-500 text-white" : "text-gray-600 hover:bg-gray-200 hover:text-gray-600"}`}
                    onClick={() => handleButtonClick("inprogress")}
                >
                    In Progress
                </button>
                <button
                    className={`py-2 px-6 rounded-md ${activeButton === "submissions" ? "bg-teal-500 text-white" : "text-gray-600 hover:bg-gray-200 hover:text-gray-600"}`}
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
    );
}
