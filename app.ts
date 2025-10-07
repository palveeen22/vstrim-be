import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./api/routes/route"; // ✅ Remove .ts extension
// import { authMiddleware } from "./api/middleware/auth";

// Load environment variables
dotenv.config();

// Define port
const PORT = process.env.APP_PORT || 3000;

// Initialize Express app
const app = express();

// Apply middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route for quick API check
app.get('/', (req, res) => {
  res.json({ 
    status: 'success',
    message: 'Vstrim API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint (important for Docker)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Apply authentication middleware (uncomment when ready)
// app.use(authMiddleware);

// Apply all routes from the centralized router
app.use(router);

// Debug: Log database URL (remove in production)
if (process.env.NODE_ENV === 'development') {
  console.log('Database URL:', process.env.DATABASE_URL_DOCKER ? 'Configured' : 'Not configured');
}

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
    path: req.path
  });
});

// Global error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    status: "error",
    message: process.env.NODE_ENV === 'production' 
      ? "Internal server error" 
      : err.message
  });
});

// Set up Telegram webhook handler
// TelegramBotSetup.setupWebhookHandler(app, '/telegram-webhook');

// Start the server
app.listen(PORT, () => {
  console.log(`⚡️ [server]: Server is running at http://localhost:${PORT}`);
  console.log(`📝 [server]: Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔥 [server]: Health check: http://localhost:${PORT}/health`);
});

// Handle graceful shutdown
process.on("SIGINT", () => {
  console.log('\n🛑 [server]: Shutting down server gracefully...');
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log('\n🛑 [server]: SIGTERM received, shutting down...');
  process.exit(0);
});

export default app;