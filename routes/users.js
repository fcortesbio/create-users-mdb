/**
 * User routes definition
 * Defines all API endpoints for user CRUD operations
 */

import express from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";

const router = express.Router();

// GET /api/users - Retrieve all users from database
router.get("/", getAllUsers);

// GET /api/users/:id - Retrieve a specific user by their ID
router.get("/:id", getUserById);

// POST /api/users - Create a new user account
router.post("/", createUser);

// PUT /api/users/:id - Update an existing user's information
router.put("/:id", updateUser);

// DELETE /api/users/:id - Remove a user from the database
router.delete("/:id", deleteUser);

export default router;
