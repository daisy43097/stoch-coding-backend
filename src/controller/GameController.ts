import {NextFunction, Request, Response} from "express";
import Game from "../models/Game";
import logger from "../helper/wLogger";

export class GameController {
  static async startGame(request: Request, response: Response, next: NextFunction) {
    try {
      const game = new Game();
      await game.save();
      logger.info('New game started', { gameId: game._id });
      response.status(201).send({rs: true, data: {gameId: game._id}});
    } catch (e) {
      logger.error('Error starting a new game ', e);
      response.status(500).send({rs: false, message: e.message});
    }
  }

}