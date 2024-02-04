import { Router } from "express";
import {NameController} from "../controller/NameController";
import {validateBody} from "../middlewares/validation";
import {getNameByPageDTO} from "../entity/dto/NameDTO";
import {logger} from "../middlewares/logger";

const router = Router();

router.get('/test', NameController.test);
// move get all up to be above get by id endpoint
// get names by offset pagination
router.get('/all', logger(), NameController.getAll);

// get names by cursor pagination
router.post('/nameByPage', validateBody(getNameByPageDTO), NameController.getNameByPage);

router.post('/add', NameController.add);
router.put('/:id', NameController.update);
router.get('/:id', NameController.get);
router.delete('/:id', NameController.delete);


export default router