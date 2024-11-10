import { Router } from "express";
import { addUser, getUser, setUser, deleteUser } from "../scripts/user";
import { db } from "../server";

const usersRouter: Router = Router();

usersRouter.post("/new", async (req, res) => {
	await addUser(db, "users", req.body);
	res.send("POST was sent with data: " + req.body);
	console.log("POST was sent");
});

usersRouter.get("/:userId", async (req, res) => {
	const target = await getUser(db, "users", req.params.userId);
	res.json(target);
	console.log("GET was sent");
});

usersRouter.put("/update/:userId", async (req, res) => {
	if (req.body.userId === undefined) {
		const user = await getUser(db, "users", req.params.userId);
		if (user !== null) {
			await setUser(db, "users", req.params.userId, req.body);
			res.json({
				message: "user updated",
			});
		} else {
			res.json({ message: "user not found" });
		}
	} else {
		res.json({ message: "forbidden" });
	}
	console.log("PUT was sent");
});

usersRouter.delete("/delete/:userId", async (req, res) => {
    await deleteUser(db, "users", req.params.userId);
    res.json({ message: "DELETE was sent" });
    console.log("DELETE was sent");
});

export { usersRouter };
