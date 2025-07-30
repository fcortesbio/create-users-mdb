import express from "express";

const router = express.Router();

// GET /api/users - Get all users
router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Users route working",
    data: []
  });
});

// POST /api/users - Create a new user
router.post("/", (req, res) => {
  res.json({
    success: true,
    message: "User creation endpoint",
    data: req.body
  });
});

// GET /api/users/:id - Get user by ID
router.get("/:id", (req, res) => {
  res.json({
    success: true,
    message: `Get user with ID: ${req.params.id}`,
    data: null
  });
});

// PUT /api/users/:id - Update user by ID
router.put("/:id", (req, res) => {
  res.json({
    success: true,
    message: `Update user with ID: ${req.params.id}`,
    data: req.body
  });
});

// DELETE /api/users/:id - Delete user by ID
router.delete("/:id", (req, res) => {
  res.json({
    success: true,
    message: `Delete user with ID: ${req.params.id}`
  });
});

export default router;
