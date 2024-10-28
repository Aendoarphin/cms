import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const connect = async () => {
  
  const firebaseConfig = {
    apiKey: "AIzaSyCh19EXcs-CwO0OaX9A2riD5kpN8de4Mg0",
    authDomain: "queueit-3fbb9.firebaseapp.com",
    projectId: "queueit-3fbb9",
    storageBucket: "queueit-3fbb9.appspot.com",
    messagingSenderId: "257368545155",
    appId: "1:257368545155:web:6d170515fc26f6378b08b6",
  };

  try {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    console.log("Firebase OK");
    return db;
  } catch (error) {
    console.error("Error initializing Firebase app:", error);
    throw error;
  }
};

export default connect;