const express = require("express");
const {
  registerStudent,
  registerUser,
  login,
  logout,
  refreshToken,
} = require("../controllers/userController");

const router = express.Router();

router.post("/registerUser", registerUser);
router.post("/registerStudent", registerStudent);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refreshToken", refreshToken);

module.exports = router;
