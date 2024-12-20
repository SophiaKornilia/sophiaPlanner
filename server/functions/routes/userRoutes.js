const express = require("express");
const {
  registerStudent,
  registerUser,
  login,
  logout,
  refreshToken,
  createLessonplan,
  getLessonplan,
  updateLessonplan,
  createStudentLessonplan,
  getStudent
} = require("../controllers/userController");

const { teacherMiddleware } = require("../middlewares/teacherMiddleware");
const { studentMiddleware } = require("../middlewares/studentMiddleware");

const router = express.Router();

router.post("/registerUser", registerUser);
router.post("/registerStudent", teacherMiddleware, registerStudent);
router.get("/getStudent", teacherMiddleware, getStudent);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refreshToken", refreshToken);
router.post("/createLessonplan", teacherMiddleware, createLessonplan);
router.post("/createStudentLessonplan", teacherMiddleware, createStudentLessonplan);
router.put("/updateLessonplan", teacherMiddleware, updateLessonplan);
router.get(
  "/getLessonplan",
  teacherMiddleware || studentMiddleware,
  getLessonplan
);

module.exports = router;
