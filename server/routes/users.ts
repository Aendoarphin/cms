// USER MANAGEMENT
import { Router } from "express";
import { db } from "../server";
import {
  setDoc,
  getDoc,
  getDocs,
  doc,
  collection,
  deleteDoc,
  query,
  where,
  CollectionReference
} from "firebase/firestore";
import { v4 as uuid } from "uuid";

const usersRouter: Router = Router();

async function checkUserExists(collectionRef: CollectionReference, fieldName: string, fieldValue: string) {
  const querySnapshot = await getDocs(query(collectionRef, where(fieldName, "==", fieldValue)));
  if (querySnapshot.size > 0) {
    throw new Error(`User with ${fieldName} ${fieldValue} already exists`);
  }
}

usersRouter.post("/new", async (req, res) => {
  const { email, username } = req.body;

  if (!email || !username) {
    throw new Error("Email and username are required");
  }

  try {
    await checkUserExists(collection(db, "users"), "email", email);
    await checkUserExists(collection(db, "users"), "username", username);
  } catch (error: Error | any) {
    console.error(error);
    res.status(400).json({ message: error.message });
    return;
  }

  const newUserReference = doc(db, "users", uuid());

  // Auto filled properties
  const time = new Date();
  const now = time.toDateString() + " " + time.toTimeString();
  req.body.created = now
  req.body.updated = now

  await setDoc(newUserReference, req.body);
  const newUser = await getDoc(newUserReference);
  if (newUser.exists()) {
    res.json({ message: "User created", data: newUser.data() });
    return;
  }
  res.status(500).json({ message: "User creation failed" });
});

usersRouter.get("/all", async (req, res) => {
  const allUsers: Array<Object> = [];
  const querySnapshot = await getDocs(collection(db, "users"));
  querySnapshot.forEach((doc) => {
    allUsers.push(JSON.parse(JSON.stringify(doc.data())));
  });
  res.json({ message: "All users", data: allUsers });
});

usersRouter.get("/:id", async (req, res) => {
  const docRef = doc(db, "users", req.params.id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    console.log(docSnap.data());
    res.json({ message: "User found", data: docSnap.data() });
  } else {
    console.log("User does not exist.");
    res.status(404).json({ message: `User ${req.params.id} not found` });
  }
});

usersRouter.put("/update/:id", async (req, res) => {
  const docRef = doc(db, "users", req.params.id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    if (req.body.id !== undefined) {
      res.statusCode = 403;
      res.json("Cannot update ID");
    } else {
      await setDoc(docRef, req.body, { merge: true });
      res.json({ message: `User ${req.params.id} updated`, data: req.body });
    }
  } else {
    res.status(404).json({ message: `User ${req.params.id} not found` });
  }
});

usersRouter.delete("/delete/:id", async (req, res) => {
  const docRef = doc(db, "users", req.params.id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    await deleteDoc(docRef);
    res.json({ message: `User ${req.params.id} deleted.` });
  } else {
    res.json({
      message: `User ${req.params.id} does not exist. Nothing to delete.`,
    });
  }
});

export { usersRouter };
