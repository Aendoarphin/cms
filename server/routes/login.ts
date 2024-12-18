import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Router } from "express";
import { collection, getDocs } from "firebase/firestore";
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

  const targetUser = allUsers.find((user) => user.email === req.query.email);

  if (targetUser !== undefined) {
    const isUser = await bcrypt.compare(
      req.body.password,
      targetUser.password as string
    );
    if (isUser) {
      const newToken = jwt.sign(targetUser, process.env.JWT_SECRET as string);
      res.cookie("token", newToken, {
        httpOnly: true,
        // secure: true,
      });
      res.setHeader("Authorization", `Bearer ${newToken}`);
      res
        .status(200)
        .json({ message: "Login successful", cookies: req.cookies });
      return;
    }
  }
  res.status(401).json({ message: "Login failed", extra: !targetUser ? "User not found" : undefined });
});

export { loginRouter };
