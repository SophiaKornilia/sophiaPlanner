const express = require("express");
const {
  registerUser,
} = require("../controllers/userController");

const router = express.Router();

router.post("/registerUser", registerUser);
// router.post("/registerStudent", registerStudent);

module.exports = router;
