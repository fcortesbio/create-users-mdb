/**
 * User controller functions
 * Contains all business logic for user CRUD operations
 * Handles validation, error responses, and database interactions
 */

import User from "../models/User.js";

/**
 * Retrieve all users from database
 * Excludes password field from response for security
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getAllUsers = async (req, res) => {
  try {
    // Find all users but exclude password field
    const users = await User.find().select("-password");
    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

/**
 * Retrieve a specific user by their ID
 * @param {Object} req - Express request object (contains user ID in params)
 * @param {Object} res - Express response object
 */
export const getUserById = async (req, res) => {
  try {
    // Find user by ID, excluding password
    const user = await User.findById(req.params.id).select("-password");

    // Return 404 if user doesn't exist
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

/**
 * Create a new user account
 * Validates uniqueness of username and email
 * Automatically hashes password before saving
 * @param {Object} req - Express request object (contains user data in body)
 * @param {Object} res - Express response object
 */
export const createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user with same email or username already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email or username already exists",
      });
    }

    // Create new user (password will be hashed by pre-save middleware)
    const user = new User({ username, email, password });
    await user.save();

    // Remove password from response for security
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: userResponse,
    });
  } catch (error) {
    // Handle validation errors specifically
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        error: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

/**
 * Update an existing user's information
 * Validates uniqueness of username/email (excluding current user)
 * Only updates provided fields
 * @param {Object} req - Express request object (contains user ID and update data)
 * @param {Object} res - Express response object
 */
export const updateUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const userId = req.params.id;

    // Verify user exists before updating
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check for duplicate username/email among other users
    if (username || email) {
      const duplicateUser = await User.findOne({
        _id: { $ne: userId }, // Exclude current user from duplicate check
        $or: [
          ...(username ? [{ username }] : []),
          ...(email ? [{ email }] : []),
        ],
      });

      if (duplicateUser) {
        return res.status(400).json({
          success: false,
          message: "Username or email already exists",
        });
      }
    }

    // Update only provided fields
    if (username) user.username = username;
    if (email) user.email = email;
    if (password) user.password = password; // Will be hashed automatically

    await user.save();

    // Remove password from response for security
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
      success: true,
      message: "User updated successfully",
      data: userResponse,
    });
  } catch (error) {
    // Handle validation errors
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        error: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

/**
 * Delete a user from the database
 * @param {Object} req - Express request object (contains user ID in params)
 * @param {Object} res - Express response object
 */
export const deleteUser = async (req, res) => {
  try {
    // Find and delete user in one operation
    const user = await User.findByIdAndDelete(req.params.id);

    // Return 404 if user doesn't exist
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
