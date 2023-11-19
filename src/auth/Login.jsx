import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom'

import {signInWithEmailAndPassword} from 'firebase/auth';
import {auth, database} from "../firebase";
import {get, ref} from "firebase/database";

const LoginPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false); // State to manage loading
    const onLogin = (e) => {
        e.preventDefault();
        setLoading(true); // Set loading state to true on login
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;

                // Fetch additional user data from Realtime Database
                const userRef = ref(database, `users/${user.uid}`);
                const getUserData = async () => {
                    try {
                        const snapshot = await get(userRef);

                        if (snapshot.exists()) {
                            const userData = snapshot.val();
                            const isAdmin = userData.adminStatus || false;

                            if (isAdmin) {
                                // Redirect to admin home page if adminStatus is true
                                navigate("/adminHomePage");
                            } else {
                                // Redirect to freelancer dashboard if adminStatus is not true
                                navigate("/freelancerHomePage");
                            }
                        } else {
                            // Handle case where user data doesn't exist
                            console.error('User data not found');
                        }
                    } catch (error) {
                        console.error('Error fetching user data:', error);
                    } finally {
                        setLoading(false); // Reset loading state regardless of login success or failure
                    }
                };

                getUserData();
            })
            .catch((error) => {
                const errorMessage = error.message;
                console.log(errorMessage);
                alert(errorMessage);
                setLoading(false); // Reset loading state on login failure
            });
    };

    function goToSignup() {
        navigate("/signup")
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-full sm:w-80 mt-4 m-4 lg:w-96 sm:rounded-lg lg:rounded-xl">
                <h1 className="text-3xl mb-6 text-center">Welcome</h1>
                <form className="space-y-4">
                    <div>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div className="flex justify-end">
                        <a href="#!" className="text-blue-500 text-sm">Forgot password?</a>

                    </div>
                    <div className={"flex justify-center"}>
                        <button className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                onClick={onLogin}
                                disabled={loading}
                        > {loading ? 'Loading...' : 'Login'}
                        </button>
                    </div>
                </form>
                <div className="mt-6 text-center ">
                    <p className="text-sm sm:text-base text-gray-600 ">Don't have an account?
                        <button onClick={goToSignup}
                                className="hover:text-blue-700 px-2 hover:bg-transparent hover:border-none text-blue-500">
                            Signup
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );

};
export default LoginPage;
