const express = require("express");
const {
  registerStudent,
  registerUser,
  login,
  logout,
  refreshToken,
} = require("../controllers/userController");

const { teacherMiddleware } = require("../middlewares/teacherMiddleware");
const { studentMiddleware } = require("../middlewares/studentMiddleware");

const router = express.Router();

router.post("/registerUser", registerUser);
router.post("/registerStudent", teacherMiddleware, registerStudent);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refreshToken", refreshToken);

module.exports = router;
