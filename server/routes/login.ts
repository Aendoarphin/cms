import dotenv from "dotenv";
import { Router } from "express";
import bcrypt from "bcrypt";
import { collection, getDocs } from "firebase/firestore";
import jwt from "jsonwebtoken";

import { db } from "../server";
dotenv.config({ path: "../.env" });

const loginRouter: Router = Router();

interface User {
	email: string;
  password: string;
}

loginRouter.get("/", async (req, res) => {
	const allUsers: Array<User> = [];
	const querySnapshot = await getDocs(collection(db, "users"));
	querySnapshot.forEach((doc) => {
		allUsers.push(JSON.parse(JSON.stringify(doc.data())));
	});

  const targetUser = allUsers.find((user) => user.email === req.query.email)
  const password = targetUser?.password

  let isUser = false

  if (targetUser !== undefined) {
    isUser = await bcrypt.compare(req.body.password, password as string);
  }

  if (isUser) {
    // create jwt
    const token = jwt.sign(JSON.parse(JSON.stringify(targetUser)), process.env.JWT_SECRET as string, { expiresIn: "1m" });
    res.cookie("token", token, { httpOnly: true });
    res.status(200).json({ message: "Login successful", cookies: req.cookies });
  } else {
    res.status(401).json({ message: "Login failed" });
  }
});

export { loginRouter };
