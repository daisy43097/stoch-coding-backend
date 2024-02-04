import {NextFunction, Request, Response} from "express";
import Game from "../models/Game";
import logger from "../helper/wLogger";
import {checkWinner} from "../helper/util";
import {PLAYER} from "../helper/const";

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

      logger.info(`${game._id} - Successful placement for ${player}`);
      game.board[cellNum] = player;

      const winner = checkWinner(game.board);

      if (winner) {
        logger.info(`${game._id} - Game won by ${winner}`);
        game.winner = winner;
      } else {
        // check for tie in a game
        const isTie = !game.board.includes(null);
        if (isTie) {
          logger.warn(`${game._id} - Game is in a tie!`);
          game.isTie = true;
        } else {
          // update currentPlayer
          game.currentPlayer = player === PLAYER.x ? PLAYER.o : PLAYER.x;
        }
      }

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