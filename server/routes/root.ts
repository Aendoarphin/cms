import { Router } from "express";

const rootRouter: Router = Router();

rootRouter.get("/", (req, res) => {
    res.send("logon");
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