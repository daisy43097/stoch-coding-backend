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

  static async move(request: Request, response: Response, next: NextFunction) {
    const {gameId, cellNum, player} = request.body;
    try {
      const game = await Game.findById(gameId);

      if (!game) {
        logger.error(`Game id ${gameId} not found`);
        throw({status: 404, message: `Game id ${gameId} not found` })
      }

      // check if is an invalid placement
      if (game.board[cellNum]) {
        logger.warn(`${game._id} - Cell ${cellNum} is already taken`);
        throw({status: 400, message: `Cell ${cellNum} is already taken` })
      }

      logger.info(`${game._id} - Successful placement`);
      game.board[cellNum] = player;

      // TODO: check for winning

      game.save();

      response.status(200).send({
        rs: true,
        data: {
          board: game.board,
          nextPlayer: game.currentPlayer,
          winner: game.winner,
          isTie: game.isTie,
        }
      })

    } catch (e) {
      const {message} = e;
      if (message !== undefined) {
        response.status(e.status).send({rs: false, message});
      } else {
        logger.error(`${gameId} - Error making a move.`, e);
        response.status(500).send({rs: false, message: e});
      }
    }
  }
}