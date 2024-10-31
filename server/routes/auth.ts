import { Router } from "express";

const authRouter: Router = Router();

authRouter.get("/:id", (req, res) => {
    res.send(req.params);
});

export { authRouter }