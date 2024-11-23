import express from "express";

const timeStamp = () => (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const time = new Date();
    console.log(time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds());
    next();
}

const logMethod = () => (req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.log(`${req.method} was sent to ${req.url}`);
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

export { logMethod, timeStamp, authenticate, authorize }