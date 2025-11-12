import express from "express";
import tryCatch from "../../libs/try-catch";
import UserController from "../controllers/user-controller";

const router = express.Router();

router.get('/users', tryCatch(UserController.fetchAllUsers));
router.get('/profile/:id', tryCatch(UserController.getProfile));


export default router;