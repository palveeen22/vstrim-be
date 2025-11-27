import express from "express";
import tryCatch from "../../libs/try-catch";
import UserController from "../controllers/user-controller";
import { DataController } from "../controllers/data-controller";

const router = express.Router();

router.get('/all', tryCatch(DataController.fetchAll));
router.get('/auth/user/:id', tryCatch(UserController.getProfile));
router.post('/auth/login', tryCatch(UserController.loginUser));
router.post('/auth/register', tryCatch(UserController.createUser));
router.post('/auth/refresh', tryCatch(UserController.refreshToken));
router.post('/auth/check-username', tryCatch(UserController.checkUsername));

export default router;