const admin = require("firebase-admin");
const bcrypt = require("bcrypt");
const axios = require("axios");
// const { getApiKey } = require("../config");

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
    // hämta variablar från body
    // starta databasen
    // kolla om användaren redan finns i tabellen -> finns return annars fortsätt
    // hasha lösenord
    // lägg till i db
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
  console.log("Start login process");
  // get info from frontend
  //check if user role is teacher or student
  // if teacher => log in with firebase (check how)
  //if student => check hashed password from database.
  //for student, start a session in local storage with a random id.
  const { identification, password } = req.body;

  try {
    //check if user is teacher of student

    console.log("Identification", identification);

    const userRecord = await admin.auth().getUserByEmail(identification);

    if (userRecord) {
      const email = identification;
      try {
        //login as teacher
        const apiKey = process.env.MY_SECRET_FIREBASE_API_KEY;
        console.log("API Key från Secrets:", apiKey);

        const firebaseAuthUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`;
        console.log(firebaseAuthUrl);

        const response = await axios.post(firebaseAuthUrl, {
          email: email,
          password: password,
          returnSecureToken: true,
        });

        // Hämta data från Firebase-svaret
        const { idToken, refreshToken, expiresIn, localId } = response.data;

        // Skicka svaret till frontend
        res.status(200).json({
          message: "Login successful",
          idToken,
          refreshToken,
          expiresIn,
          userId: localId,
        });
      } catch (error) {
        console.error(
          "Error logging in user:",
          error.response?.data?.error || error.message
        );
        res.status(400).json({
          message: "Login failed",
          error: error.message,
        });
      }

      // return res.status(200).json({
      //   message: "User found in Firebase Auth",
      //   user: {
      //     uid: userRecord.uid,
      //     email: "test20@gmail.com",
      //     displayName: userRecord.displayName,
      //     photoURL: userRecord.photoURL,
      //     providerData: userRecord.providerData,
      //   },
      // });
    } else {
      return res.status(404).json({ message: "User not found" });
    }

    // const db = admin.firestore();
    // const userRef = db.collection("users");
    // const isTeacher = await userRef.where("email", "==", identification).get();

    // if (!isTeacher.empty) {
    //   const user = isTeacher.docs[0].data();
    //   return res.status(200).json({
    //     message: "User db",
    //     user,
    //   });
    // } else {
    //   return res.status(404).json({ message: "User not found" });
    // }
    // if (!isTeacher.empty) {
    //   const teacherDoc = isTeacher.docs[0];
    //   const userData = teacherDoc.data(); // Detta är innehållet i dokumentet
    //   const userEmail = userData.email; // Här plockar vi ut email-fältet

    //   console.log(`User found: ${userEmail}`);

    //   try {
    //     //login as teacher
    //     const apiKey = process.env.MY_SECRET_FIREBASE_API_KEY;
    //     console.log("API Key från Secrets:", apiKey);

    //     const firebaseAuthUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`;
    //     console.log(firebaseAuthUrl);

    //     const response = await axios.post(firebaseAuthUrl, {
    //       email: userEmail,
    //       password: password,
    //       returnSecureToken: true,
    //     });

    //     // Hämta data från Firebase-svaret
    //     const { idToken, refreshToken, expiresIn, localId } = response.data;

    //     // Skicka svaret till frontend
    //     res.status(200).json({
    //       message: "Login successful",
    //       idToken,
    //       refreshToken,
    //       expiresIn,
    //       userId: localId,
    //     });
    //   } catch (error) {
    //     console.error(
    //       "Error logging in user:",
    //       error.response?.data?.error || error.message
    //     );
    //     res.status(400).json({
    //       message: "Login failed",
    //       error: error.message,
    //     });
    //   }
    // }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
