import { Request, Response } from "express";
import UserService, { CreateUserParams } from "../services/user-service";
import { generateToken, generateRefreshToken } from "../../libs/jwt";
import AppError from "../../libs/app-error";

class UserController {

  static async fetchAllUsers(req: Request, res: Response): Promise<Response> {
    try {
      const users = await UserService.findAllUsers();

      if (!users || users.length === 0) {
        return res.status(404).json({
          status: "error",
          data: null,
          message: "There are no users found"
        });
      }

      return res.status(200).json({
        status: "success",
        message: null,
        data: { users }
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        data: null,
        message: error instanceof Error ? error.message : "An unexpected error occurred"
      });
    }
  }

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

      // Validate required fields
      if (!email) {
        return res.status(400).json({
          status: "error",
          data: null,
          message: "Email is required"
        });
      }

      if (!password) {
        return res.status(400).json({
          status: "error",
          data: null,
          message: "Password is required"
        });
      }

      if (!name) {
        return res.status(400).json({
          status: "error",
          data: null,
          message: "Name is required"
        });
      }

      // Basic password validation
      if (password.length < 8) {
        return res.status(400).json({
          status: "error",
          data: null,
          message: "Password must be at least 8 characters"
        });
      }

      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          status: "error",
          data: null,
          message: "Invalid email format"
        });
      }

      // Check if user exists
      const existingUser = await UserService.findUserByIdentifier(email);

      if (existingUser) {
        return res.status(409).json({
          status: "error",
          data: null,
          message: "User with this email already exists"
        });
      }

      // Create user (basic info only)
      const createParams: CreateUserParams = {
        email,
        password,
        name,
        isVerified: false
      };

      const newUser = await UserService.createUser(createParams);

      // Generate tokens
      const accessToken = generateToken(newUser.id);
      const refreshToken = generateRefreshToken(newUser.id);

      await UserService.saveRefreshToken(newUser.id, refreshToken);

      return res.status(201).json({
        status: "success",
        data: {
          user: newUser,
          token: accessToken,
          refreshToken,
          requiresProfileSetup: !newUser.onboardingCompleted
        },
        message: "Registration successful. Please complete your profile."
      });
    } catch (error) {
      console.error('Create user error:', error);

      return res.status(error instanceof AppError ? error.statusCode : 500).json({
        status: "error",
        data: null,
        message: error instanceof Error ? error.message : "An unexpected error occurred"
      });
    }
  }

  static async updateProfile(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const {
        name,
        username,
        bio,
        dateOfBirth,
        image,
      } = req.body;

      // Validate user ID
      if (!id) {
        return res.status(400).json({
          status: "error",
          data: null,
          message: "User ID is required"
        });
      }

      // Parse dateOfBirth if provided
      const parsedDateOfBirth = dateOfBirth ? new Date(dateOfBirth) : undefined;

      // Validate date is not in the future
      if (parsedDateOfBirth && parsedDateOfBirth > new Date()) {
        return res.status(400).json({
          status: "error",
          data: null,
          message: "Date of birth cannot be in the future"
        });
      }

      // Validate age (optional - must be 18+)
      if (parsedDateOfBirth) {
        const age = new Date().getFullYear() - parsedDateOfBirth.getFullYear();
        if (age < 18) {
          return res.status(400).json({
            status: "error",
            data: null,
            message: "You must be at least 18 years old"
          });
        }
      }

      // Update user profile
      const updatedUser = await UserService.updateUser(id, {
        name,
        username,
        bio,
        dateOfBirth: parsedDateOfBirth,
        image,
      });

      if (!updatedUser) {
        return res.status(404).json({
          status: "error",
          data: null,
          message: "User not found"
        });
      }

      return res.status(200).json({
        status: "success",
        data: {
          user: updatedUser
        },
        message: "Profile updated successfully"
      });

    } catch (error) {
      console.error('Update profile error:', error);

      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          status: "error",
          data: null,
          message: error.message
        });
      }

      return res.status(500).json({
        status: "error",
        data: null,
        message: error instanceof Error ? error.message : "An unexpected error occurred"
      });
    }
  }

  static async checkUsername(req: Request, res: Response): Promise<Response> {
    try {
      const { username } = req.body;

      // Validate username is provided
      if (!username) {
        return res.status(400).json({
          status: "error",
          data: null,
          message: "Username is required"
        });
      }

      // Validate username format
      if (username.length < 3 || username.length > 20) {
        return res.status(400).json({
          status: "error",
          data: null,
          message: "Username must be between 3 and 20 characters"
        });
      }

      const validUsernameRegex = /^[a-zA-Z0-9_]+$/;
      if (!validUsernameRegex.test(username)) {
        return res.status(400).json({
          status: "error",
          data: null,
          message: "Username can only contain letters, numbers, and underscores"
        });
      }

      // Check if user exists
      const user = await UserService.findUserByIdentifier(username);

      if (user) {
        // Username is taken
        return res.status(200).json({
          status: "success",
          data: { available: false },
          message: "Username is already taken"
        });
      }

      // Username is available
      return res.status(404).json({
        status: "error",
        data: { available: true },
        message: "User not found"
      });

    } catch (error) {
      console.error('Check username error:', error);
      return res.status(error instanceof AppError ? error.statusCode : 500).json({
        status: "error",
        data: null,
        message: error instanceof Error ? error.message : "An unexpected error occurred"
      });
    }
  }

  static async verifyAccount(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const {
        name,
        username,
        bio,
        location,
        mood,
        reasons,
        dateOfBirth,
        image,
      } = req.body;

      // Validate user ID
      if (!id) {
        return res.status(400).json({
          status: "error",
          data: null,
          message: "User ID is required"
        });
      }

      // Parse dateOfBirth if provided
      const parsedDateOfBirth = dateOfBirth ? new Date(dateOfBirth) : undefined;

      // Validate date is not in the future
      if (parsedDateOfBirth && parsedDateOfBirth > new Date()) {
        return res.status(400).json({
          status: "error",
          data: null,
          message: "Date of birth cannot be in the future"
        });
      }

      // Update user profile
      const updatedUser = await UserService.verifyUser(id, {
        name,
        username,
        bio,
        location,
        mood,
        reasons,
        dateOfBirth: parsedDateOfBirth,
        image,
        isVerified: true
      });

      if (!updatedUser) {
        return res.status(404).json({
          status: "error",
          data: null,
          message: "User not found"
        });
      }

      return res.status(200).json({
        status: "success",
        data: {
          updatedUser
        },
        message: "Profile updated successfully"
      });

    } catch (error) {
      console.error('Update profile error:', error);

      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          status: "error",
          data: null,
          message: error.message
        });
      }

      return res.status(500).json({
        status: "error",
        data: null,
        message: error instanceof Error ? error.message : "An unexpected error occurred"
      });
    }
  }

  static async getProfile(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      // Validate user ID
      if (!id) {
        return res.status(400).json({
          status: "error",
          data: null,
          message: "User ID is required"
        });
      }

      const user = await UserService.findUserById(id);


      return res.status(200).json({
        status: "success",
        user,
        message: "Profile updated successfully"
      });

    } catch (error) {
      console.error('Update profile error:', error);

      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          status: "error",
          data: null,
          message: error.message
        });
      }

      return res.status(500).json({
        status: "error",
        data: null,
        message: error instanceof Error ? error.message : "An unexpected error occurred"
      });
    }
  }
}

export default UserController;