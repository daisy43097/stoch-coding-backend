import {Router} from "express";
import name from "./name";
const routes = Router()

routes.use('/name', name);

export default routes