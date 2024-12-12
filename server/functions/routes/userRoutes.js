const express = require("express");
const {
  registerStudent,
  registerUser,
  login
} = require("../controllers/userController");

const router = express.Router();

router.post("/registerUser", registerUser);
router.post("/registerStudent", registerStudent);
router.post("/login", login);

module.exports = router;
