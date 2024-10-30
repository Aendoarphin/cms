import express from "express";
import cors from "cors";
import { initializeApp } from "firebase/app";
import { Firestore, getFirestore, addDoc, collection } from "firebase/firestore";
import createCollection from "./scripts/createCollection";

/****************     addUser.tsx     *********************************/
const addUser = async() =>{
  try {
    const docRef = await addDoc(collection(db, "users"), {
      first: "Ada",
      last: "Lovelace",
      born: 1815
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
  
}

function checkFirebase(db_instance: Firestore) { 
  db_instance ? console.log("Firebase OK") : console.log("Firebase ERROR");
}


const app = express();
const corsOptions = {
  origin: ["http://localhost:5173"],
}
app.use(cors(corsOptions));

const firebaseConfig = {
  apiKey: "AIzaSyCh19EXcs-CwO0OaX9A2riD5kpN8de4Mg0",
  authDomain: "queueit-3fbb9.firebaseapp.com",
  projectId: "queueit-3fbb9",
  storageBucket: "queueit-3fbb9.appspot.com",
  messagingSenderId: "257368545155",
  appId: "1:257368545155:web:6d170515fc26f6378b08b6",
};

const firebase = initializeApp(firebaseConfig);
const db = getFirestore(firebase);

checkFirebase(db);

// TODO: set up basic routing

const router = express.Router();

router.all("*", (req, res, next) => {
  next();
});

app.get("/", (req, res) => {
  res.send("home/logon");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
})