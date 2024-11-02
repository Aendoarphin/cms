import express from "express";
import cors from "cors";
import firebase from "firebase/compat/app";
import "firebase/firestore";

import { usersRouter } from "./routes/users";
import { ticketsRouter } from "./routes/tickets";
import { authRouter } from "./routes/auth";
import { rootRouter } from "./routes/root";

import { createCollection } from "./scripts/collection";

const app = express();

app.use(cors({origin: ["http://localhost:5173"]}));

// Routes
app.use("/", rootRouter);
app.use("/users", usersRouter);
app.use("/tickets", ticketsRouter);
app.use("/auth", authRouter);

// Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCh19EXcs-CwO0OaX9A2riD5kpN8de4Mg0",
  authDomain: "queueit-3fbb9.firebaseapp.com",
  projectId: "queueit-3fbb9",
  storageBucket: "queueit-3fbb9.appspot.com",
  messagingSenderId: "257368545155",
  appId: "1:257368545155:web:6d170515fc26f6378b08b6",
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
db ? console.log("Firebase OK") : console.log("Firebase ERROR");

app.listen(3000, () => {
  console.log("Server running on port 3000");
})