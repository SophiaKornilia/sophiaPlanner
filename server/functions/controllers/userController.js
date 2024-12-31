const admin = require("firebase-admin");
const bcrypt = require("bcrypt");
const axios = require("axios");
const crypto = require("crypto");
const { strict } = require("assert");

// Funktion för att registrera en ny användare (lärare)
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role, gdpr } = req.body;
    console.log("Request body:", req.body);

    const validRoles = ["teacher"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    if (role === "teacher" && (!name || !email || !password || gdpr !== true)) {
      return res
        .status(400)
        .json({ message: "Missing required fields for teacher" });
    }

    const db = admin.firestore();
    let userRecord;

    if (role === "teacher") {
      // lägg till läraren i auth och firebase
      try {
        userRecord = await admin.auth().createUser({
          email,
          password,
          displayName: name,
        });

        //sparar ytterligare data i firestore
        const userDocRef = db.collection("users").doc(userRecord.uid);
        await userDocRef.set({
          name,
          role,
          gdpr,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        res.status(201).json({
          message: "User registered successfully!",
          uid: userRecord.uid,
        });
      } catch (error) {
        //ta bort data i authentication om firestore misslyckades att registrera.
        if (userRecord) {
          await admin.auth().deleteUser(userRecord.uid);
        }
        throw error;
      }
    }
  } catch (error) {
    if (error.code === "auth/email-already-exists") {
      console.error("User already exists", error);
      res
        .status(400)
        .json({ message: "User already exists", error: error.message });
    } else {
      console.error("Error registering user", error);
      res
        .status(500)
        .json({ message: "Failed to register user", error: error.message });
    }
  }
};

// Funktion för att registrera en ny student
exports.registerStudent = async (req, res) => {
  try {
    const { password, userName, name, role, teacherId } = req.body;
    const db = admin.firestore();
    const studentRef = db.collection("students");
    const studenExists = await studentRef
      .where("userName", "==", userName)
      .get();
    if (!studenExists.empty) {
      return res.status(409).json({ message: "Användarnamnet är redan taget" });
    }
    const userPassword = password;
    const hashedPassword = await bcrypt.hash(userPassword, 10);
    await db
      .collection("students")
      .doc("/" + userName + "/")
      .create({
        userName: userName,
        name: name,
        role: role,
        password: hashedPassword,
        teacherId: teacherId,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    return res.status(200).json({
      message: "Student registered successfully!",
      userName: userName,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Funktion för att hantera inloggning för både lärare och studenter
exports.login = async (req, res) => {
  console.log("Start login process");
  const { identification, password } = req.body;
  console.log("Identification", identification);

  if (!identification || !password) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const db = admin.firestore();

  try {
    //check if user is teacher of student
    try {
      const userRecord = await admin.auth().getUserByEmail(identification);
      let teacherName = null;
      let teacherRole = null;

      if (userRecord) {
        //login as teacher
        const apiKey = process.env.MY_SECRET_FIREBASE_API_KEY;
        console.log("API Key från Secrets:", apiKey);

        const firebaseAuthUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`;
        console.log("firebaseAuthUrl", firebaseAuthUrl);

        const response = await axios.post(firebaseAuthUrl, {
          email: identification,
          password: password,
          returnSecureToken: true,
        });

        console.log("Firebase respons data", response.data);

        const { idToken, refreshToken, expiresIn } = response.data;

        console.log("tokens osv", idToken, "refresh", refreshToken);

        const teacherRef = db.collection("users").doc(userRecord.uid);
        const teacherDoc = await teacherRef.get();

        if (teacherDoc.exists) {
          const teacher = teacherDoc.data();
          teacherName = teacher.name;
          teacherRole = teacher.role;

          console.log("teacherDoc", teacherName, teacherRole);
        }

        return res.status(200).json({
          message: "Teacher login successful",
          user: {
            userId: userRecord.uid,
            email: userRecord.email,
          },
          teacherName,
          teacherRole,
          idToken,
          refreshToken,
          expiresIn: parseInt(expiresIn),
        });
      }
    } catch (error) {
      console.log(
        "Teacher login failed or user not found in Firebase Auth:",
        error.message
      );
    }

    console.log("The  code is here! ");

    //Check if student exists and login
    const studentRef = db.collection("students");
    const isStudent = await studentRef
      .where("userName", "==", identification)
      .get();

    console.log("isStudent", isStudent);

    if (!isStudent.empty) {
      const student = isStudent.docs[0].data();
      console.log("student first", student);

      const isPasswordValid = await bcrypt.compare(password, student.password);

      console.log("password", isPasswordValid);

      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const sessionId = crypto.randomUUID();
      console.log("Session ID generated:", sessionId);

      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
      const sessionRef = db.collection("sessions").doc(sessionId);

      await sessionRef.set({
        studentId: student.userName,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        expiresAt: expiresAt,
        role: "student",
        ip: req.ip,
        userAgent: req.headers["user-agent"],
      });

      return res.status(200).json({
        message: "Student login successful",
        user: {
          userName: student.userName,
          name: student.name,
          role: student.role,
          identifier: student.userName,
        },
        sessionId,
        expiresIn: 24 * 60 * 60, // 1 dag i sekunder
      });
    } else {
      return res.status(404).json({ message: "No users found" });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Logout-funktion för både lärare och studenter
exports.logout = async (req, res) => {
  const { identification, userId, sessionId } = req.body;

  const db = admin.firestore();

  try {
    try {
      console.log("second try");
      const userRecord = await admin.auth().getUserByEmail(identification);

      if (userRecord) {
        await admin.auth().revokeRefreshTokens(userId);

        const userMetaData = await admin.auth().getUser(userId);

        const tokensRevokedAt =
          new Date(userMetaData.tokensValidAfterTime).getTime() / 1000;

        console.log(`Tokens revoked at: ${tokensRevokedAt}`);
        return res.status(200).json({
          message: "Teacher successfully loged out",
        });
      }
    } catch (error) {
      console.log(
        "Teacher login failed or user not found in Firebase Auth:",
        error.message
      );
    }

    console.log("userName", identification, "sessionid", sessionId);

    const sessionRef = db.collection("sessions").doc(sessionId);
    const sessionDoc = await sessionRef.get();

    if (!sessionDoc.exists) {
      return res.status(404).json({ message: "Session not found" });
    }

    const sessionData = sessionDoc.data();
    console.log("Session data:", sessionData);

    if (new Date(sessionData.expiresAt.toDate()) < new Date()) {
      return res.status(401).json({ message: "Session expired" });
    }

    if (sessionData.studentId !== identification) {
      return res.status(403).json({ message: "Unauthorized request" });
    }

    await sessionRef.delete();
    console.log("Session deleted:", sessionId);

    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Funktion för att uppdatera token med hjälp av refreshToken
exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({
      message: "RefreshToken missing",
    });
  }

  try {
    const apiKey = process.env.MY_SECRET_FIREBASE_API_KEY;
    const response = await axios.post(
      `https://securetoken.googleapis.com/v1/token?key=${apiKey}`,
      {
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }
    );
    console.log("Firebase refresh token response:", response.data);

    const { id_token, refresh_token, expires_in } = response.data;

    res.status(200).json({
      idToken: id_token,
      refreshToken: refresh_token,
      expiresIn: expires_in,
    });
  } catch (error) {
    console.error("Token refresh error:", error.message);
    return res.status(500).json({ message: "Could not refresh token" });
  }
};

/** Lektionsplaneringar */
// Funktion för att skapa en ny lektionsplanering
exports.createLessonplan = async (req, res) => {
  const { title, content, userId } = req.body;

  if (!title || !content || !userId) {
    return res
      .status(400)
      .json({ error: "Title, content and userId are required" });
  }

  const db = admin.firestore();
  const lessonRef = db.collection("lessonplans");
  try {
    const newLesson = await lessonRef.add({
      title: title,
      content: content,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      authorId: userId,
    });

    res.status(201).json({
      message: "Lesson plan created successfully",
      lessonId: newLesson.id,
      userId,
    });
  } catch (error) {
    console.error("Error creating lesson plan:", error);
    res.status(500).json({ error: "Failed to create lesson plan" });
  }
};

// Funktion för att skapa lektionsplaneringar och koppla till specifika studenter
exports.createStudentLessonplan = async (req, res) => {
  const { lessonId, studentIds } = req.body;

  if (!lessonId || !Array.isArray(studentIds) || studentIds.length === 0) {
    return res
      .status(400)
      .json({ error: "Lesson ID and a list of student IDs are required" });
  }

  const db = admin.firestore();
  const lessonRef = db.collection("lessonplans").doc(lessonId);

  try {
    // Hämta den skapade lektionsplaneringen
    const lessonDoc = await lessonRef.get();
    if (!lessonDoc.exists) {
      return res.status(404).json({ error: "Master lesson plan not found" });
    }

    const masterPlan = lessonDoc.data();

    // Skapa kopior för varje student
    const batch = db.batch();
    const studentLessonPlansRef = db.collection("studentLessonPlans");

    studentIds.forEach((studentId) => {
      const newStudentPlanRef = studentLessonPlansRef.doc();
      batch.set(newStudentPlanRef, {
        title: masterPlan.title,
        content: masterPlan.content,
        studentId: studentId,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    });

    // Utför batch-operationen
    await batch.commit();

    res.status(201).json({
      message: "Student lesson plans created successfully",
      assignedStudents: studentIds,
    });
  } catch (error) {
    console.error("Error creating student lesson plans:", error);
    res.status(500).json({ error: "Failed to create student lesson plans" });
  }
};

// Funktion för att skapa en utkast till lektionsplanering
exports.createLessonplanDraft = async (req, res) => {
  const { title, content, userId } = req.body;

  if (!title || !content || !userId) {
    return res
      .status(400)
      .json({ error: "Title, content and userId are required" });
  }

  const db = admin.firestore();
  const lessonRef = db.collection("lessonplansDraft");

  try {
    //kolla om det redan finns en likadan lessonplan
    const existingDraftQuery = await lessonRef
      .where("title", "==", title)
      .where("authorId", "==", userId)
      .get();

    if (!existingDraftQuery.empty) {
      return res.status(409).json({
        error: "A draft with the same title already exists for this user.",
      });
    }

    //Skapa ny lessonplanDraft
    const newLesson = await lessonRef.add({
      title: title,
      content: content,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      authorId: userId,
    });

    res.status(201).json({
      message: "Draft for lesson plan was created successfully",
      lessonId: newLesson.id,
    });
  } catch (error) {
    console.error("Error creating lesson plan draft:", error);
    res.status(500).json({ error: "Failed to create draft for lessonplan" });
  }
};

exports.createStudentLessonplan = async (req, res) => {
  const { lessonId, studentIds, authorId } = req.body;
  console.log("from body", lessonId, studentIds, authorId);

  if (
    !lessonId ||
    !authorId ||
    !Array.isArray(studentIds) ||
    studentIds.length === 0
  ) {
    return res.status(400).json({
      error: "Lesson ID, authorId and a list of student IDs are required",
    });
  }

  const db = admin.firestore();
  const lessonRef = db.collection("lessonplans").doc(lessonId);
  const studentLessonRef = db.collection("studentLessonPlans");

  try {
    const lessonDoc = await lessonRef.get();
    if (!lessonDoc.exists) {
      return res.status(404).json({ error: "Master lesson plan not found" });
    }

    const masterPlan = lessonDoc.data();
    for (const studentId of studentIds) {
      const existingPlanQuery = await studentLessonRef
        .where("title", "==", masterPlan.title)
        .where("studentId", "==", studentId)
        .where("teacherId", "==", authorId)
        .get();

      if (!existingPlanQuery.empty) {
        return res.status(409).json({
          error: `A lesson plan with the title "${masterPlan.title}" already exists for student ID ${studentId}.`,
        });
      }
    }

    const batch = db.batch();

    studentIds.forEach((studentId) => {
      const newStudentPlanRef = studentLessonRef.doc();
      batch.set(newStudentPlanRef, {
        title: masterPlan.title,
        content: masterPlan.content,
        studentId: studentId,
        teacherId: authorId,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    });
    console.log("steg 7");
    // Utför batch-operationen
    await batch.commit();
    console.log("steg 8");

    res.status(201).json({
      message: "Student lesson plans created successfully",
      assignedStudents: studentIds,
    });
  } catch (error) {
    console.error("Error creating student lesson plans:", error);
    res.status(500).json({ error: "Failed to create student lesson plans" });
  }
};

// Funktion för att hämta en lärarens lektionsplaneringar
exports.getLessonplan = async (req, res) => {
  const db = admin.firestore();
  const { authorId } = req.query; // Hämta authorId från query-parametern

  if (!authorId) {
    return res.status(400).json({ error: "Author ID is required" });
  }

  try {
    const snapshot = await db
      .collection("lessonplans")
      .where("authorId", "==", authorId)
      .get();

    if (snapshot.empty) {
      return res
        .status(200)
        .json({ message: "No lesson plans found.", lessonplans: [] });
    }

    const lessonplans = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({ lessonplans });
  } catch (error) {
    console.error("Error fetching lesson plans:", error);
    res.status(500).json({ error: "Failed to fetch lesson plans." });
  }
};

/*Elever*/
// Funktion för att hämta studenter kopplade till en specifik lärare
exports.getStudent = async (req, res) => {
  const { teacherId } = req.query;
  db = admin.firestore();
  if (!teacherId) {
    return res.status(400).json({ error: "Teacher ID is required." });
  }
  try {
    const snapshot = await db
      .collection("students")
      .where("teacherId", "==", teacherId)
      .get();

    if (snapshot.empty) {
      return res
        .status(404)
        .json({ message: "No students found for this teacher." });
    }

    console.log("snapshot", snapshot);
    console.log(
      "Query Result:",
      snapshot.docs.map((doc) => doc.data())
    );
    console.log("Query Snapshot Empty?", snapshot.empty);

    // Omvandla dokument till en array med objekt
    const students = snapshot.docs.map((doc) => ({
      id: doc.id, // Lägg till dokumentets ID
      ...doc.data(), // Lägg till själva dokumentets data
    }));

    res.status(200).json({
      message: "Fetching students successfylly",
      students: students,
    });
  } catch (error) {
    console.error("Error fetching student:", error);
    res.status(500).json({ error: "Failed fetch students" });
  }
};

/*Verifiering*/
// Funktion för att verifiera en lärares identitet och roll
exports.verifyTeacher = async (req, res) => {
  try {
    const db = admin.firestore();

    const teacherRef = db.collection("users").doc(req.user.uid);
    const teacherDoc = await teacherRef.get();

    if (!teacherDoc.exists) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    const teacherData = teacherDoc.data();

    const userRecord = await admin.auth().getUser(req.user.uid);

    res.status(200).json({
      uid: req.user.uid,
      role: "teacher",
      name: teacherData.name,
      identification: userRecord.email,
    });
  } catch (error) {
    console.error("Error verifying teacher:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Funktion för att verifiera en elevs identitet och roll
exports.verifyStudent = async (req, res) => {
  try {
    const db = admin.firestore();

    const studentRef = db.collection("students").doc(req.user.uid);
    const studentDoc = await studentRef.get();

    if (!studentDoc.exists) {
      return res.status(404).json({ message: "Student not found" });
    }

    const studentData = studentDoc.data();

    res.status(200).json({
      uid: req.user.uid,
      role: "student",
      name: studentData.name, // Hämtas från Firestore
      identification: studentData.identification, // Hämtas från Firestore
    });
  } catch (error) {
    console.error("Error verifying student:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

/*Elevplaneringar*/
// Funktion för att hämta en students lektionsplaneringar
exports.getStudentLessonPlans = async (req, res) => {
  const { uid } = req.user; // studentId från middleware
  console.log("UID received:", uid);
  const db = admin.firestore();

  try {
    const lessonPlansRef = db
      .collection("studentLessonPlans")
      .where("studentId", "==", uid);
    const snapshot = await lessonPlansRef.get();
    console.log("Snapshot size:", snapshot.size);

    if (snapshot.empty) {
      return res.status(200).json({ lessonPlans: [] }); // Inga planeringar
    }

    const lessonPlans = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({ lessonPlans });
  } catch (error) {
    console.error("Error fetching student lesson plans:", error.message);
    res.status(500).json({ error: "Failed to fetch lesson plans." });
  }
};
