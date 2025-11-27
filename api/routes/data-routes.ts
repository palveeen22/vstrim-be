import { authenticate } from './../middlewares/index';
import express from "express";
import { DataController } from "../controllers/data-controller";

const router = express.Router();

router.get('/values', authenticate, DataController.fetchAll);

export default router;