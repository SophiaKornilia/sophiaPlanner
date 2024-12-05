const express = require("express");
const {
  registerUser,
  loginUser,
  logOut,
  registerStudent,
  getStudents,
  createGroup,
  getGroups
} = require("../controllers/userController");

const router = express.Router();

router.use("/register", registerUser);
router.use("/login", loginUser);
router.use("/logout", logOut);
router.use("/registerStudent", registerStudent);
router.use("/getStudents", getStudents);
router.use("/createGroup", createGroup);
router.use("/getGroups", getGroups);
module.exports = router;
