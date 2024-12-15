const admin = require("firebase-admin");
const bcrypt = require("bcrypt");
const axios = require("axios");
const crypto = require("crypto");
const { strict } = require("assert");

// registrera användare/teachers
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    console.log("Request body:", req.body);

    const validRoles = ["teacher"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    // Kontrollera obligatoriska fält baserat på rollen
    if (role === "teacher" && (!name || !email || !password)) {
      return res
        .status(400)
        .json({ message: "Missing required fields for teacher" });
    }

    // Initialisera Firebase Firestore
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
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        // Svara på lyckad registrering
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
    console.error("Error registering user", error);
    res
      .status(500)
      .json({ message: "Failed to register user", error: error.message });
  }
};

exports.registerStudent = async (req, res) => {
  try {
    // katodo: (vilket id ska användas? koppla till riktigt teacherId?)
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

exports.login = async (req, res) => {
  //katodo tacherId, how to fetch an connect
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

      if (userRecord) {
        //login as teacher
        const apiKey = process.env.MY_SECRET_FIREBASE_API_KEY;
        console.log("API Key från Secrets:", apiKey);

        const firebaseAuthUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`;
        console.log(firebaseAuthUrl);

        const response = await axios.post(firebaseAuthUrl, {
          email: identification,
          password: password,
          returnSecureToken: true,
        });

        // Hämta data från Firebase-svaret
        const { idToken, refreshToken, expiresIn, localId } = response.data;
        //katodo: secure: "true" och sameSite: "None" för live
        res.cookie("idToken", idToken, {
          httpOnly: true,
          secure: true,
          sameSite: "None",
          maxAge: parseInt(expiresIn) * 1000,
        });

        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: "None",
          maxAge: 30 * 24 * 60 * 60 * 1000, //30 dagar
        });

        // Skicka svaret till frontend
        res.status(200).json({
          message: "Teacher login successful",
          user: {
            uderId: userRecord.uid,
            email: userRecord.email,
            role: "teacher",
          },
          expiresIn: parseInt(expiresIn),
        });
        // res.status(200).json({
        //   message: "Teacher login successful",
        //   idToken,
        //   refreshToken,
        //   expiresIn,
        //   userId: localId,
        // });
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

      // Skapa ett sessionId och session
      const sessionId = crypto.randomUUID();
      console.log("Session ID generated:", sessionId);
      // 1 dag framåt
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

      res.cookie("sessionId", sessionId, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 24 * 60 * 60 * 1000, // 1 dag
      });

      // Returnera sessionsinformation
      return res.status(200).json({
        message: "Student login successful",
        user: {
          userName: student.userName,
          name: student.name,
          role: student.role,
        },
        expiresIn: 24 * 60 * 60, // 1 dag i sekunder
      });
      // return res.status(200).json({
      //   message: "Login successful",
      //   sessionId: sessionId,
      //   user: {
      //     userName: student.userName,
      //     name: student.name,
      //     role: student.role,
      //   },
      // });
    } else {
      return res.status(404).json({ message: "No users found" });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.logout = async (req, res) => {
  //checka vilken roll
  //if teacher så logga ut med firebase
  //idToken och uid/userId fås vid inloggning
  const { identification, userId, sessionId } = req.body;

  // if (!userId || !sessionId || !identification) {
  //   return res.status(400).json({ message: "Missing required fields" });
  // }
  const db = admin.firestore();

  try {
    console.log("first try");

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

    //logout Student

    //det ska skickas med från body
    console.log("userName", identification, "sessionid", sessionId);

    const sessionRef = db.collection("sessions").doc(sessionId);
    const sessionDoc = await sessionRef.get();

    if (!sessionDoc.exists) {
      return res.status(404).json({ message: "Session not found" });
    }

    //kolla om sessionsId är giltigt och aktiv
    const sessionData = sessionDoc.data();
    console.log("Session data:", sessionData);

    if (new Date(sessionData.expiresAt.toDate()) < new Date()) {
      return res.status(401).json({ message: "Session expired" });
    }

    //kolla att det är samma student som är inloggad som raderar den

    // Skickas från klienten
    if (sessionData.studentId !== identification) {
      return res.status(403).json({ message: "Unauthorized request" });
    }

    //radera session
    await sessionRef.delete();
    console.log("Session deleted:", sessionId);

    //gör ett cron job som raderar utgångna sessioner baserat på expiresAt katodo - i egen funktion

    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }

  //om student så logga ut med att döda session och ta bort från databasen.
};

exports.refreshToken = async (req, res) => {
  //hämta cookies från frontend
  const refreshToken = req.cookies?.refreshToken;

  //kollar om token inte finns
  if (!refreshToken) {
    return res.status(401).json({
      message: "Refresh token missing",
    });
  }

  const apiKey = process.env.MY_SECRET_FIREBASE_API_KEY;

  try {
    const response = await axios.post(
      `https://securetoken.googleapis.com/v1/token?key=${apiKey}`,
      {
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }
    );

    const { id_token: newIdToken, expires_in: expiresIn } = response.data;

    res.cookie("idToken", newIdToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: parseInt(expiresIn) * 1000,
    });

    res.status(200).json({ message: "Token refreshed successfully" });
  } catch (error) {
    console.error("Token refresh error:", error.message);
    return res.status(500).json({ message: "Could not refresh token" });
  }
};
