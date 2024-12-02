const express = require("express");
const {registerUser} = require("../controllers/userController");

const router = express.Router();

router.use("/register", registerUser);

module.exports = router;
