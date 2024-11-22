import { Router } from "express";
import { db } from "../server";
import { setDoc, getDoc, doc, deleteDoc } from "firebase/firestore";

const usersRouter: Router = Router();

usersRouter.post("/new", async (req, res) => {
	const userReference = doc(db, "users", req.body.id);
  const userSnapshot = await getDoc(userReference);
  if (userSnapshot.exists()) {
    console.log("User already exists");
		res.json({ message: "User already exists" });
  } else {
		await setDoc(userReference, req.body);
		const addedUser = await getDoc(userReference);
		res.json({ message: "User added", data: req.body, result: addedUser.data()});
  }
});

usersRouter.get("/:id", async (req, res) => {
	const docRef = doc(db, "users", req.params.id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    console.log(docSnap.data())
		res.json({ message: "User found", data: docSnap.data()})
  } else {
    console.log("User does not exist.")
		res.status(404).json({ message: `User ${req.params.id} not found` })
  }
});

usersRouter.put("/update/:id", async (req, res) => {
	  const docRef = doc(db, "users", req.params.id)
		const docSnap = await getDoc(docRef);
	  if (docSnap.exists()) {
			await setDoc(docRef, req.body, { merge: true });
			res.json({ message: `User ${req.params.id} updated`, data: req.body })
		} else {
			res.status(404).json({ message: `User ${req.params.id} not found` })
		}
});

usersRouter.delete("/delete/:id", async (req, res) => {
    const docRef = doc(db, "users", req.params.id);
	const docSnap = await getDoc(docRef);
	if (docSnap.exists()) {
		await deleteDoc(docRef);
		res.json({ message: `User ${req.params.id} deleted.` })
	} else {
		res.json({ message: `User ${req.params.id} does not exist. Nothing to delete.` })
	}
});

export { usersRouter };