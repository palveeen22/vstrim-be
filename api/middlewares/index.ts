import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Extend the Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
        username?: string | null;
      };
    }
  }
}

// JWT Payload interface
interface JWTPayload {
  id: string;
  email?: string;
  iat?: number;
  exp?: number;
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // 1. Extract token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      res.status(401).json({
        status: 'error',
        message: 'No token provided. Please login.',
        data: null,
      });
      return;
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      res.status(401).json({
        status: 'error',
        message: 'Invalid token format',
        data: null,
      });
      return;
    }

    // 2. Verify JWT_SECRET exists
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      console.error('❌ JWT_SECRET is not configured');
      res.status(500).json({
        status: 'error',
        message: 'Server configuration error',
        data: null,
      });
      return;
    }

    // 3. Verify and decode token
    let decoded: JWTPayload;
    
    try {
      decoded = jwt.verify(token, jwtSecret) as JWTPayload;
    } catch (jwtError) {
      if (jwtError instanceof jwt.TokenExpiredError) {
        res.status(401).json({
          status: 'error',
          message: 'Token has expired. Please login again.',
          data: null,
        });
        return;
      }

      if (jwtError instanceof jwt.JsonWebTokenError) {
        res.status(401).json({
          status: 'error',
          message: 'Invalid token. Please login again.',
          data: null,
        });
        return;
      }

      throw jwtError; // Re-throw unexpected errors
    }

    // 4. Validate payload
    if (!decoded.id) {
      res.status(401).json({
        status: 'error',
        message: 'Invalid token payload',
        data: null,
      });
      return;
    }

    // 5. Fetch user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        name: true,
        username: true,
        image: true,
        bio: true,
        location: true,
      },
    });

    if (!user) {
      res.status(401).json({
        status: 'error',
        message: 'User not found. Account may have been deleted.',
        data: null,
      });
      return;
    }

    // 6. Attach user to request
    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      username: user.username,
    };

    // 7. Continue to next middleware
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    
    res.status(500).json({
      status: 'error',
      message: 'Authentication failed',
      data: null,
    });
  }
};

// Optional: Middleware for optional authentication (doesn't fail if no token)
export const optionalAuthenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      // No token provided, but that's okay for optional auth
      next();
      return;
    }

    const token = authHeader.split(' ')[1];
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret || !token) {
      next();
      return;
    }

    try {
      const decoded = jwt.verify(token, jwtSecret) as JWTPayload;

      if (decoded.id) {
        const user = await prisma.user.findUnique({
          where: { id: decoded.id },
          select: {
            id: true,
            email: true,
            name: true,
            username: true,
          },
        });

        if (user) {
          req.user = {
            id: user.id,
            email: user.email,
            name: user.name,
            username: user.username,
          };
        }
      }
    } catch (jwtError) {
      // Token invalid, but we continue without user
      console.warn('Optional auth - invalid token:', jwtError);
    }

    next();
  } catch (error) {
    console.error('Optional authentication error:', error);
    next(); // Continue anyway for optional auth
  }
};

// Helper function to generate JWT token
export const generateToken = (userId: string, email: string): string => {
  const jwtSecret = process.env.JWT_SECRET;
  
  if (!jwtSecret) {
    throw new Error('JWT_SECRET is not configured');
  }

  const payload: JWTPayload = {
    id: userId,
    email: email,
  };

  return jwt.sign(payload, jwtSecret, {
    expiresIn: '7d', // Token expires in 7 days
  });
};

// Helper function to generate refresh token (optional)
export const generateRefreshToken = (userId: string): string => {
  const jwtSecret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;
  
  if (!jwtSecret) {
    throw new Error('JWT_SECRET is not configured');
  }

  return jwt.sign({ id: userId }, jwtSecret, {
    expiresIn: '30d', // Refresh token expires in 30 days
  });
};