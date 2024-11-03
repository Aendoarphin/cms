import { Router } from "express";
import { addUser, getUser } from "../scripts/user";
import { db } from "../server";

const usersRouter: Router = Router();

usersRouter.post("/new", (req, res) => {
    addUser(db, "users", req.body);
    res.send("POST was sent with data: " + req.body);
    console.log("POST was sent")
})

usersRouter.get("/:userId", (req, res) => {
    const targetUser = getUser(db, "users", req.params.userId);
    res.json(targetUser);
    console.log("GET was sent")
});

export { usersRouter }