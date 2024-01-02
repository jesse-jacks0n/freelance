// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "###########################",
    authDomain: "###########################",
    projectId: "###########################",
    storageBucket: "###########################",
    messagingSenderId: "###########################",
    appId: "###########################",
    measurementId: "###########################"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
// Initialize Firebase Realtime Database and get a reference to the service
export const provider = new GoogleAuthProvider();


export const database = getDatabase(app);

export const storage = getStorage(app);

getAnalytics(app);
