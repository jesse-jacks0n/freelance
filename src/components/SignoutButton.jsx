import React from 'react';
import {auth} from "../firebase";
import {signOut} from "firebase/auth";
import {useNavigate} from "react-router-dom";
const SignOutButton = () => {
    const navigate = useNavigate();
    const handleLogout = () => {
        signOut(auth)
            .then(() => {
                // Sign-out successful.
                navigate("/");
                console.log("Signed out successfully");
            })
            .catch((error) => {
                // An error happened.
                console.error("Sign-out error:", error);
            });
    };
    return (
        <button className="text-black" onClick={handleLogout}>
            Sign Out
        </button>
    );
};

export default SignOutButton;