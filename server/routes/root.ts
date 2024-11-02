import { Router } from "express";
import { addUser } from "../scripts/user";
import { db } from "../server";

const rootRouter: Router = Router();

rootRouter.get("/", (req, res) => {
    const { userName, userId, userPw, userEmail, userRole } = req.body;
    addUser(db, "users", userName, userId, userPw, userEmail, userRole);
});

rootRouter.delete("/logout", (req, res) => {
    // get reference to sessions collection
    // get reference to userId
    // find session and delete it
})

rootRouter.get("/dashboard", (req, res) => {
    // get reference to sessions collection
    // get reference to userId
    // user session exists
        // send to dashboard
    // user session not exists
        // redirect to login
});

export { rootRouter }