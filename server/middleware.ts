import express from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

const logMethod =
  () =>
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const time = new Date();
    const msg = `${time.toTimeString()} | ${req.method} was sent to ${req.url}`;
    for (let i = 0; i < msg.length; i++) process.stdout.write("-");
    console.log("");
    console.log(msg);
    next();
  };

// Run everywhere besides the login page
const isAuth =
  () =>
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const token = jwt.verify(
        req.cookies.token,
        process.env.JWT_SECRET as string
      );
      if (token) {
        next();
      }
    } catch (error) {
      res
        .status(401)
        .json({
          message: "Unauthorized",
          action: "Redirect to client login page",
        });
    }
  };

// Run on restricted routes that involve read/write access to the database or user cookies/local storage
const isAuthAdmin = () => (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const token: any | JwtPayload = jwt.verify(req.cookies.token, process.env.JWT_SECRET as string);
    if (token && token.admin) {
      return next();
    }
    res.status(401).json({ message: "Unauthorized", action: "Redirect to 'unauthorized' page" });
  } catch (error) {
    res.status(404).json({ message: "Unauthorized", action: "Redirect to 404 page" });
  }
};

export { logMethod, isAuth };
