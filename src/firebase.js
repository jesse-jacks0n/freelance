// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyC_vmhMFGu_dY9jHyNTiz1yutl5qWMfc2o",
    authDomain: "freelance-9e75b.firebaseapp.com",
    projectId: "freelance-9e75b",
    storageBucket: "freelance-9e75b.appspot.com",
    messagingSenderId: "722485129496",
    appId: "1:722485129496:web:3b46a60ab374242bf72e6d",
    measurementId: "G-YZTXB4YQE6"
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
