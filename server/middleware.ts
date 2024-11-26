import express from "express";

const logMethod = () => (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const time = new Date();
    const msg = `${time.toTimeString()} | ${req.method} was sent to ${req.url}`
    for (let i = 0; i < msg.length; i++) process.stdout.write("-");
    console.log("");
    console.log(msg);
    next();
  }

const authenticate = () => (req: express.Request, res: express.Response, next: express.NextFunction) => {
    // logic to authenticate user
    next();
  }

const authorize = () => (req: express.Request, res: express.Response, next: express.NextFunction) => {
    // logic to authorize user
    next();
  }

export { logMethod, authenticate, authorize }