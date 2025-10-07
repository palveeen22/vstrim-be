import { User } from '@prisma/client';
import prisma from '../../prisma'
import AppError from "../../libs/app-error";
import * as bcrypt from 'bcrypt';
import RedisClient from '../../libs/redis-client';

export interface CreateUserParams {
  name: string | null;
  email: string;
  password: string;
  username?: string;
  dateOfBirth?: Date | null;
  location?: string | null;
  bio?: string;
  isVerified?: boolean;
  createdAt?: Date;
}

class UserService {

  static async findUserByIdentifier(identifier?: string) {
    // If both are provided, we use OR condition
    if (identifier) {
      return await prisma.user.findFirst({
        where: {
          OR: [
            { username: identifier },
            { email: identifier }
          ]
        }
      });
    }

    // If only username provided
    if (identifier) {
      return await prisma.user.findUnique({
        where: {
          username: identifier
        }
      });
    }

    // If only email provided
    if (identifier) {
      return await prisma.user.findUnique({
        where: {
          email: identifier
        }
      });
    }

    return null;
  }

  static async createUser(params: CreateUserParams): Promise<Omit<User, 'password'>> {
    console.log(params, "<");
    // Validate that at least one identifier is provided
    if (!params.email) {
      throw new Error("Email must be provided");
    }

    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(params.password, 10);

    const userData: any = {
      password: hashedPassword,
      isVerified: params.isVerified ?? false,
    };

    // Only add fields that are provided (not undefined)
    if (params.email !== undefined) userData.email = params.email;
    if (params.username !== undefined) userData.username = params.username;
    if (params.name !== undefined) userData.name = params.name;
    if (params.dateOfBirth !== undefined) userData.dateOfBirth = params.dateOfBirth;
    if (params.location !== undefined) userData.location = params.location;
    if (params.bio !== undefined) userData.bio = params.bio;

    // Create the user with the constructed data object
    const user = await prisma.user.create({
      data: userData,
      select: {
        id: true,
        name: true,
        email: true,
        dateOfBirth: true,
        image: true,
        createdAt: true,
        bio: true,
        username: true,
        location: true,
        isVerified: true
      }
    });

    return user;
  }

  static async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      console.error('Password verification error:', error);
      return false;
    }
  }

  static async saveRefreshToken(userId: string, refreshToken: string): Promise<void> {
    try {
      console.log(`Saving refresh token for user: ${userId}`);

      // Get Redis client
      const redisClient = await RedisClient.getInstance();

      // Create refresh token data
      const tokenData = JSON.stringify({
        token: refreshToken,
        userId: userId,
        createdAt: new Date().toISOString()
      });

      // Store refresh token in Redis with 7 days expiration (604800 seconds)
      const redisKey = `refresh_token:${userId}:${refreshToken.slice(-8)}`; // Use last 8 chars as identifier
      await redisClient.set(redisKey, tokenData, { EX: 604800 }); // 7 days

      console.log(`Refresh token stored in Redis with key: ${redisKey}`);
    } catch (error) {
      console.error('Error saving refresh token:', error);
      throw new AppError(500, "Failed to save refresh token", 500);
    }
  }
}

export default UserService;