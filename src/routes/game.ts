import {Router} from "express";
import {GameController} from "../controller/GameController";

const router = Router();

router.get('/start', GameController.startGame);
// router.post('/move', GameController.move);

export default router;