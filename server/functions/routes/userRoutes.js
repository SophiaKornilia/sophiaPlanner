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
  getStudent,
  verifyStudent,
  verifyTeacher,
  getStudentLessonPlans,
  createLessonplanDraft
} = require("../controllers/userController");

const { teacherMiddleware } = require("../middlewares/teacherMiddleware");
const { studentMiddleware } = require("../middlewares/studentMiddleware");

const router = express.Router();

router.post("/registerUser", registerUser);
router.post("/registerStudent", teacherMiddleware, registerStudent);
router.get("/getStudent", teacherMiddleware, getStudent);
router.post("/login", login);
router.post("/logout", logout);

router.post("/verifyTeacher", teacherMiddleware, verifyTeacher);
router.post("/verifyStudent", studentMiddleware, verifyStudent);

router.post("/refreshToken", refreshToken);

router.post("/createLessonplan", teacherMiddleware, createLessonplan);
router.post("/createLessonplanDraft", teacherMiddleware, createLessonplanDraft);
router.post(
  "/createStudentLessonplan",
  teacherMiddleware,
  createStudentLessonplan
);
router.put("/updateLessonplan", teacherMiddleware, updateLessonplan);
router.get("/getLessonplan", teacherMiddleware, getLessonplan);
router.get("/getStudentLessonPlans", studentMiddleware, getStudentLessonPlans);

module.exports = router;
