import jwt, { SignOptions } from 'jsonwebtoken';

// Access token configuration
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
// Shorter for security
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m'; 

// Refresh token configuration  
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

// Generate access token (short-lived)
export const generateToken = (userId: string): string => {
  return jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN as string
  } as SignOptions);
};

// Generate refresh token (long-lived)
export const generateRefreshToken = (userId: string): string => {
  return jwt.sign({ id: userId }, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES_IN as string
  } as SignOptions);
};

// Verify access token
export const verifyToken = (token: string): any => {
  return jwt.verify(token, JWT_SECRET);
};

// Verify refresh token
export const verifyRefreshToken = (token: string): any => {
  return jwt.verify(token, JWT_REFRESH_SECRET);
};

// Decode token without verification (useful for expired tokens)
export const decodeToken = (token: string): any => {
  return jwt.decode(token);
};