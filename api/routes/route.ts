import express from "express";
import authRoutes from "./auth-routes";
import userRoutes from "./user-routes";
import quizRoutes from "./daily-quiz-routes";
import { authenticate } from "../middlewares/index";

// Import other route files as needed

const router = express.Router();

// Root route
router.get("/api", (req, res) => {
  res.json({
    message: "Welcome to Vstrim API",
    version: "1.0.0"
  });
});

// Register all routes
router.use("/api", authRoutes);

router.use("/api", userRoutes);

// Register all routes
router.use("/api", quizRoutes);


// Apply authentication middleware to all routes below this point
router.use("/api", authenticate);


export default router;