import express from "express";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";

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

const isAuth =
  () =>
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    // IMPLEMENT RBAC
  };

export { logMethod, isAuth };
