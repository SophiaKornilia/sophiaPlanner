const express = require("express");
const {
  registerUser,
  loginUser,
  logOut,
} = require("../controllers/userController");

const router = express.Router();

router.use("/register", registerUser);
router.use("/login", loginUser);
router.use("/logout", logOut);

module.exports = router;
