import React, {useState, useEffect} from "react";
import {onAuthStateChanged, ref as authReference} from "firebase/auth";
import {get, ref as databaseReference, set} from "firebase/database";
import {auth, database} from "../../firebase";
import {Avatar} from "@mui/material";

export default function Profile() {
    const [user, setUser] = useState(null);
    const [authUser, setAuthUser] = useState(null);  // Add this state variable
    const [phoneNumber, setPhoneNumber] = useState("");
    const [Rapport, setRapport] = useState("");

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    // Fetch user details from the "users" collection for the authenticated user
                    const userRef = databaseReference(database, `users/${user.uid}`);
                    const userSnapshot = await get(userRef);

                    if (userSnapshot.exists()) {
                        setUser(userSnapshot.val());
                        setPhoneNumber(userSnapshot.val().phoneNumber || "");
                        setRapport(userSnapshot.val().Rapport || "");
                    }

                    // Set authUser state
                    setAuthUser(user);
                } catch (error) {
                    console.error('Error fetching user details:', error);
                }
            }
        });

        return () => unsubscribe();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            // Update user details in the "users" collection
            const userRef = databaseReference(database, `users/${authUser.uid}`);
            await set(userRef, {
                ...user,
                phoneNumber,
                Rapport,
            });

            console.log('User details updated successfully!');
        } catch (error) {
            console.error('Error updating user details:', error);
        }
    };
    return (
        <div>
            <h2>My Profile</h2>

            {user && (
            <div className="flex flex-col items-center justify-center">
                {/* Display User Avatar */}
                <div className="w-72 h-72 rounded-full bg-gray-200 flex items-center justify-center">

                </div>

                {/* User Details Form */}
                <form onSubmit={handleSubmit} className="flex flex-col w-400">
                    {/* Phone Number */}
                    <div className="flex flex-col">
                        <label htmlFor="phoneNumber">Phone Number:</label>
                        <input
                            className="border-1 border-teal-500 focus:outline-teal-300 p-2 mx-2 rounded-lg h-8"
                            type="tel"
                            id="phoneNumber"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                    </div>

                    {/* About Me */}
                    <div className="flex flex-col">
                        <label htmlFor="aboutMe">About Me:</label>
                        <textarea
                            className="border-1 border-teal-500 focus:outline-teal-300 mx-2 p-2 rounded-lg h-32 resize-none"
                            id="aboutMe"
                            value={Rapport}
                            onChange={(e) => setRapport(e.target.value)}
                        />
                    </div>

                    {/* Submit Button */}
                    <div>
                        <button className="bg-teal-500 text-white rounded m-2 p-3" type="submit">Update Info</button>
                    </div>
                </form>
            </div>
            )}
        </div>
    );
}
