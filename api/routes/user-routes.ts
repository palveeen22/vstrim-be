import { authenticate } from './../middlewares/index';
import express from "express";
import tryCatch from "../../libs/try-catch";
import UserController from "../controllers/user-controller";

const router = express.Router();

router.get('/users', tryCatch(UserController.fetchAllUsers));
router.get('/users/profile/:id', authenticate, UserController.getProfile);
router.patch('/users/:id/profile-setup', authenticate, UserController.completeProfileSetup);


export default router;