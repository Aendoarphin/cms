import { Router } from "express";
import { db } from "../server";

const rootRouter: Router = Router();

rootRouter.get("/", (req, res) => {
    res.send("GET was sent")
    console.log("GET was sent")
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