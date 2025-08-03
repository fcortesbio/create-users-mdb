/**
 * User model definition with Mongoose schema
 * Includes validation, password hashing, and comparison methods
 */

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

/**
 * User schema definition with validation rules
 */
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true, // Ensures no duplicate usernames
      trim: true, // Removes whitespace from beginning and end
      minlength: 3, // Minimum 3 characters
      maxlength: 30, // Maximum 30 characters
    },
    email: {
      type: String,
      required: true,
      unique: true, // Ensures no duplicate emails
      trim: true, // Removes whitespace
      lowercase: true, // Converts to lowercase before saving
      // Email validation regex pattern
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    password: {
      type: String,
      required: true,
      minlength: 6, // Minimum 6 characters for security
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  },
);

/**
 * Pre-save middleware to hash passwords before storing in database
 * Only hashes if password is new or modified
 */
userSchema.pre("save", async function (next) {
  // Skip hashing if password hasn't been modified
  if (!this.isModified("password")) return next();

  try {
    // Generate salt and hash the password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * Instance method to compare provided password with stored hash
 * @param {string} candidatePassword - Plain text password to compare
 * @returns {boolean} - True if passwords match, false otherwise
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Create and export the User model
const User = mongoose.model("User", userSchema);

export default User;
