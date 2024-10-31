import { Router } from "express";

const ticketsRouter: Router = Router();

ticketsRouter.get("/:id", (req, res) => {
    res.send(req.params);
});

export { ticketsRouter }