import express from "express";
import tryCatch from "../../libs/try-catch";
import UserController from "../controllers/user-controller";

const router = express.Router();

router.post('/auth/login', tryCatch(UserController.loginUser));
router.post('/auth/register', tryCatch(UserController.createUser));

export default router;