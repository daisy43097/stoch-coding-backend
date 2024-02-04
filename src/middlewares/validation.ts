import * as express from 'express';
import {NextFunction, Request, Response} from "express";
import {validateOrReject} from "class-validator";

//after validateBody req.body.dto will has Dto Object
export function validateBody(Dto): express.RequestHandler {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dto = new Dto();
    Object.keys(req.body).forEach(key => {
      console.log('body keys-->>', key)
      if (key !== 'validatedData' && key!=='relations') {
        dto[key] = req.body[key]
      }
    })
    validateOrReject(dto).then(_ => {
      req.body.dto = dto;
      next();
    }).catch(errors => {
      console.log("validateBody errors!, ", errors);
      res.status(errors.statusCode).send(errors.message)
    });
  }
}