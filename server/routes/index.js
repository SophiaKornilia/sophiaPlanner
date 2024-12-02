const express = require("express");
const userRoutes = require("./userRoutes");

const router = express.Router();

// Registrera användar-relaterade routes
router.use("/users", userRoutes);

module.exports = router;
