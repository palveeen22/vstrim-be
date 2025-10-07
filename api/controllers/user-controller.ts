import { Request, Response } from "express";
import UserService, { CreateUserParams } from "../services/user-service";
import { generateToken, generateRefreshToken } from "../../libs/jwt";
import AppError from "../../libs/app-error";

class UserController {

  static async loginUser(req: Request, res: Response): Promise<Response> {
    try {
      const { identifier, password } = req.body;

      // Check if at least one identifier is provided
      if (!identifier) {
        return res.status(400).json({
          status: "error",
          data: null,
          message: "Either username or email is required"
        });
      }

      // Check if password is provided
      if (!password) {
        return res.status(400).json({
          status: "error",
          data: null,
          message: "Password is required"
        });
      }

      // Find user by username or email
      const user = await UserService.findUserByIdentifier(identifier);

      if (!user) {
        return res.status(404).json({
          status: "error",
          data: null,
          message: "User not found"
        });
      }

      // Verify password
      const isPasswordValid = await UserService.verifyPassword(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({
          status: "error",
          data: null,
          message: "Invalid password"
        });
      }

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;

      // Generate both access and refresh tokens
      const accessToken = generateToken(user.id);
      const refreshToken = generateRefreshToken(user.id);

      // Store refresh token in database (you'll need to add this to your UserService)
      await UserService.saveRefreshToken(user.id, refreshToken);

      console.log(userWithoutPassword, "<????");

      return res.status(200).json({
        status: "success",
        data: {
          user: userWithoutPassword,
          token: accessToken,
        },
        message: "User authenticated successfully"
      });

    } catch (error) {
      return res.status(error instanceof AppError ? error.statusCode : 500).json({
        status: "error",
        data: null,
        message: error instanceof Error ? error.message : "An unexpected error occurred"
      });
    }
  }

  static async createUser(req: Request, res: Response): Promise<Response> {
    try {
      const { name, email, password } = req.body;
      console.log(name, email, password, "<><>><>");

      // Ensure at least one identifier (username or email) is provided
      if (!email) {
        return res.status(400).json({
          status: "error",
          data: null,
          message: "Email is required"
        });
      }

      // Password is always required
      if (!password) {
        return res.status(400).json({
          status: "error",
          data: null,
          message: "Password is required"
        });
      }

      // Check if user exists with this username or email
      const existingUser = await UserService.findUserByIdentifier(email);

      if (existingUser) {
        return res.status(409).json({
          status: "error",
          data: null,
          message: "User with this email already exists"
        });
      }

      // ✅ Create user with correct field mapping - PERBAIKI INI
      const createParams: CreateUserParams = {
        email,
        password,
        name: name || null,
        isVerified: false
      };

      const newUser = await UserService.createUser(createParams);

      // Generate both tokens for new user
      const accessToken = generateToken(newUser.id);
      const refreshToken = generateRefreshToken(newUser.id);

      // Store refresh token
      await UserService.saveRefreshToken(newUser.id, refreshToken);

      // Return success response
      return res.status(201).json({
        status: "success",
        data: {
          user: newUser,
          token: accessToken,
          // refreshToken
        },
        message: "User created successfully"
      });
    } catch (error) {
      return res.status(error instanceof AppError ? error.statusCode : 500).json({
        status: "error",
        data: null,
        message: error instanceof Error ? error.message : "An unexpected error occurred"
      });
    }
  }
}

export default UserController;