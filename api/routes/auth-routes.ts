import express from "express";
import tryCatch from "../../libs/try-catch";
import UserController from "../controllers/user-controller";

const router = express.Router();

router.get('/auth/user/:id', tryCatch(UserController.getProfile));
router.post('/auth/login', tryCatch(UserController.loginUser));
router.post('/auth/register', tryCatch(UserController.createUser));
router.post('/auth/check-username', tryCatch(UserController.checkUsername));
router.patch('/auth/profile/:id', tryCatch(UserController.verifyAccount));


export default router;