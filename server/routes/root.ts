import { Router } from "express";
import { db } from "../server";
import { sign } from "jsonwebtoken";

const rootRouter: Router = Router();

rootRouter
    .get("/", (req, res) => {
        res.send("home");
    })

export { rootRouter }