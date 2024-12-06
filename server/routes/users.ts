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
	CollectionReference,
	updateDoc,
} from "firebase/firestore";
import { v4 as uuid } from "uuid";
import bcrypt from "bcrypt";

const usersRouter: Router = Router();

async function checkUserExists(
	collectionRef: CollectionReference,
	fieldName: string,
	fieldValue: string
) {
	const querySnapshot = await getDocs(
		query(collectionRef, where(fieldName, "==", fieldValue))
	);
	if (querySnapshot.size > 0) {
		throw new Error(`User with ${fieldName} ${fieldValue} already exists`);
	}
}

usersRouter
	// CREATE NEW USER
	.post("/new", async (req, res) => {
		const { email, username, password } = req.body;
		const hash = await bcrypt.hash(password, 10);

		req.body.password = hash;

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

		await setDoc(newUserReference, {
			...req.body,
			created: new Date().toLocaleString(),
			updated: new Date().toLocaleString(),
		});
		const newUser = await getDoc(newUserReference);
		if (newUser.exists()) {
			res.status(201).json({ message: "User created", data: newUser.data() });
			return;
		}
		res.status(500).json({ message: "User creation failed" });
	})
	// GET ALL
	.get("/all", async (req, res) => {
		const allUsers: Array<Object> = [];
		const querySnapshot = await getDocs(collection(db, "users"));
		querySnapshot.forEach((doc) => {
			allUsers.push(JSON.parse(JSON.stringify(doc.data())));
		});
		res.status(200).json({ message: "All users", data: allUsers });
	});
// GET BY EMAIL
usersRouter
	.get("/", async (req, res) => {
		const { email } = req.query;

		if (email) {
			const querySnapshot = await getDocs(
				query(collection(db, "users"), where("email", "==", email))
			);
      const user = querySnapshot.docs[0].data()
			res.status(200).json({
				message: "User found",
				data: user,
			});
		} else {
			// handle error: no query parameter provided
			res.status(400).json({ message: "Missing query parameter" });
		}
	})
	// UPDATE
	.put("/update/:username", async (req, res) => {
		const q = query(
			collection(db, "users"),
			where("username", "==", req.params.username)
		);
		const querySnapshot = await getDocs(q);

		const targetUser = querySnapshot.docs.find((doc) => {
			return doc.data().username === req.params.username;
		});

		const allEmails: Array<string> = await (
			await getDocs(collection(db, "users"))
		).docs.map((doc) => doc.data().email);
		const allUsernames: Array<string> = await (
			await getDocs(collection(db, "users"))
		).docs.map((doc) => doc.data().username);

		if (allEmails.includes(req.body.email)) {
			res
				.status(400)
				.json({ message: `Email ${req.body.email} already exists.` });
			return;
		}

		if (allUsernames.includes(req.body.username)) {
			res
				.status(400)
				.json({ message: `Username ${req.body.username} already exists.` });
			return;
		}

		if (targetUser?.exists()) {
			// Check if 'created' field exists and if so, remove from body
			let newData = {};
			const creationDateTemp = targetUser.data().created;
			if (req.body.created) {
				delete req.body.created;
				newData = { ...req.body };
			}
			// Insert new data, initial creation date, and updated date
			await updateDoc(targetUser.ref, {
				...newData,
				created: creationDateTemp,
				updated: new Date().toLocaleString(),
			});
			res.status(200).json({ message: `User ${req.params.username} updated.` });
			return;
		}

		res.status(404).json({
			message: `User ${req.params.username} does not exist. Nothing to update.`,
		});
	})
	// DELETE
	.delete("/delete/:username", async (req, res) => {
		const q = query(
			collection(db, "users"),
			where("username", "==", req.params.username)
		);
		const querySnapshot = await getDocs(q);
		const targetUser = querySnapshot.docs.find((doc) => {
			return doc.data().username === req.params.username;
		});
		if (targetUser !== undefined && targetUser.exists()) {
			await deleteDoc(targetUser.ref);
			res.status(200).json({ message: `User ${req.params.username} deleted.` });
		} else {
			res.status(404).json({
				message: `User ${req.params.username} does not exist. Nothing to delete.`,
			});
		}
	});

export { usersRouter };
