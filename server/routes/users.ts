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
import jwt from "jsonwebtoken";

const usersRouter: Router = Router();

const docExists = async (
  collectionRef: CollectionReference,
  fieldName: string,
  fieldValue: string
) => {
  const querySnapshot = await getDocs(
    query(collectionRef, where(fieldName, "==", fieldValue))
  );
  if (querySnapshot.size > 0) {
    return true;
  }
  return false;
};

usersRouter

  // CREATE USER ###########################################################
  .post("/new", async (req, res) => {
    let message = "";
    const { email, username, password } = req.body;
    const hash = await bcrypt.hash(password, 10);

    req.body.password = hash;

    if (!email || !username || email === "" || username === "") {
      message = "Email and username are required";
      res.status(400).json({ message });
      return;
    }

    const emailExists = await docExists(
      collection(db, "users"),
      "email",
      email
    );
    const usernameExists = await docExists(
      collection(db, "users"),
      "username",
      username
    );

    if (emailExists || usernameExists) {
      message = "Email or username already exists";
      res.status(400).json({ message });
      return;
    }

    const newUserRef = doc(db, "users", uuid());
		const userDoc = await getDoc(newUserRef);
    const jwtToken = jwt.sign(JSON.parse(JSON.stringify(req.body)), process.env.JWT_SECRET as string, { expiresIn: "1h" });

    await setDoc(newUserRef, {
      token: jwtToken,
			docId: userDoc.id,
      ...req.body,
      created: new Date().toLocaleString(),
      updated: new Date().toLocaleString(),
    });
    const newUser = await getDoc(newUserRef);
    if (newUser.exists()) {
      res.cookie("token", jwtToken, { httpOnly: true });
      res.setHeader("Authorization", `Bearer ${jwtToken}`);
      res.status(201).json({ message: "User created", data: newUser.data() });
      return;
    }
    res.status(500).json({ message: "User creation failed" });
  })

  // READ ALL ###################################################################
  .get("/all", async (req, res) => {
    const allUsers: Array<Object> = [];
    const querySnapshot = await getDocs(collection(db, "users"));
    querySnapshot.forEach((doc) => {
      allUsers.push(JSON.parse(JSON.stringify(doc.data())));
    });
    res.status(200).json({ message: "All users", data: allUsers });
  })

  // READ BY EMAIL ##############################################################
  .get("/", async (req, res) => {
    const { username, email } = req.query;
    let emailExists = await docExists(
      collection(db, "users"),
      "email",
      email as string
    );

    if (emailExists) {
      const targetUser = await getDocs(
        query(collection(db, "users"), where("email", "==", email))
      );
      const user = targetUser.docs.map((doc) => doc.data())[0];
      res
        .status(200)
        .json(user);
      return;
    }

    res.status(404).json({ message: "User not found" });
  })
  // UPDATE ####################################################################
  .put("/update/:username", async (req, res) => {
    const q = query(
      collection(db, "users"),
      where("username", "==", req.params.username)
    );
    const querySnapshot = await getDocs(q);

    const targetUser = querySnapshot.docs.find((doc) => {
      return doc.data().username === req.params.username;
    });

    const allEmails: Array<string> = (
      await getDocs(collection(db, "users"))
    ).docs.map((doc) => doc.data().email);
    const allUsernames: Array<string> = (
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
      // Check for overrides in body, and update new data
      let newData = {};
      const creationDateTemp = targetUser.data().created;
      if (req.body.created || req.body.updated) {
        delete req.body.created;
        delete req.body.updated;
        newData = { ...req.body };
      }
      if (req.body.password) {
        const hash = await bcrypt.hash(req.body.password, 10);
        newData = { ...req.body, password: hash };
      }
      await updateDoc(targetUser.ref, {
        ...newData,
        created: creationDateTemp,
        updated: new Date().toLocaleString(),
      });
      res.status(200).json({
        message: `User ${req.params.username} updated.`,
        newInfo: newData,
      });
      return;
    }

    res.status(404).json({
      message: `User ${req.params.username} does not exist. Nothing to update.`,
    });
  })

  // DELETE ####################################################################
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
