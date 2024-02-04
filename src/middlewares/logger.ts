import express, {NextFunction, Request, Response} from "express";

export function logger(): express.RequestHandler {
  return async (req: Request, res: Response, next: NextFunction) => {
    console.log(
      `${new Date().toISOString()} - ${req.method} - ${req.url}`
    );

    next();
  }
}