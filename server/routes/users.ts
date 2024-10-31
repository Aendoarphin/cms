import { Router } from "express";

const usersRouter: Router = Router();

usersRouter.get("/:id", (req, res) => {
    res.send(req.params);
});

export { usersRouter }