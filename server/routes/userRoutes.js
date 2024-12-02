const express = require("express");
const {
  registerUser,
  loginUser,
  logOut,
  registerStudent,
} = require("../controllers/userController");

const router = express.Router();

router.use("/register", registerUser);
router.use("/login", loginUser);
router.use("/logout", logOut);
router.use("/registerStudent", registerStudent);
module.exports = router;
