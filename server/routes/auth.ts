import { Router } from "express";

const authRouter: Router = Router();

authRouter.all("/verify", (req, res) => {
    // get reference to collection of users
    // check if user in collection
    // user in collection
        // user session exists
            // break
        // user session not exists
            // add document to sessions collection
    // user not in collection
        // return prompt for make account
});

export { authRouter }