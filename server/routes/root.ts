import { Router } from "express";

const rootRouter: Router = Router();

rootRouter.get("/", (req, res) => {
    res.send("logon");
});

rootRouter.get("/dashboard", (req, res) => {
    res.send("dashboard");
});

export { rootRouter }