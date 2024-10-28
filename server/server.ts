import express from "express";
import cors from "cors";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import createCollection from "./scripts/createCollection";

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

app.get("/api", (req, res) => {
  let usersCollection = createCollection(db, "users", {});
  res.send(usersCollection);
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
})