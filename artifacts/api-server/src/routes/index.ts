import { Router, type IRouter } from "express";
import healthRouter from "./health";
import algorithmsRouter from "./algorithms";

const router: IRouter = Router();

router.use(healthRouter);
router.use(algorithmsRouter);

export default router;
