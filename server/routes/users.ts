import { Router } from "express";
import { addUser, getUser } from "../scripts/user";
import { db } from "../server";

const usersRouter: Router = Router();

usersRouter.post("/new", (req, res) => {
    addUser(db, "users", req.body);
    res.send("POST was sent with data: " + req.body);
    console.log("POST was sent")
})

usersRouter.get("/:userId", async(req, res) => {
    const target = await getUser(db, "users", req.params.userId)
    res.send(target);
    console.log("GET was sent")
});

export { usersRouter }