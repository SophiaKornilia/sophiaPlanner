const express = require("express");
const {
  registerStudent,
  registerUser,
  login,
  logout,
} = require("../controllers/userController");

const router = express.Router();

router.post("/registerUser", registerUser);
router.post("/registerStudent", registerStudent);
router.post("/login", login);
router.post("/logout", logout);

module.exports = router;
