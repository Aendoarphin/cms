import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config({path: "../.env"});

const generateToken = (userId: string) => {
    if (!process.env.TOKEN_SECRET) {
      throw new Error("TOKEN_SECRET not found");
    }
    return jwt.sign({ userId }, process.env.TOKEN_SECRET, { expiresIn: "1800s" });
  };

const authorizeToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) return res.sendStatus(401);
    jwt.verify(token, process.env.TOKEN_SECRET ?? '', (err: any, user: any) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  };

export { generateToken, authorizeToken };