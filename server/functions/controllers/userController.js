const admin = require("firebase-admin");
// const bcrypt = require("bcrypt");
// const { doc, setDoc } = require("firebase-admin/firestore");

//registrera användare/teachers
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

// //registrera students
// exports.registerStudent = async (req, res) => {
//   try {
//     const { name, userName, password, role, teacherID } = req.body;

//     if (!name || !userName || !role || !password || !teacherID) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     // Initialisera Firebase Firestore
//     const db = admin.firestore();

//     const studentsRef = db.collection("students");
//     const existingUser = await studentsRef
//       .where("userName", "==", userName)
//       .get();

//     if (!existingUser.empty) {
//       return res.status(409).json({ message: "Användarnamnet är redan taget" });
//     }

//     //hasha lösenordet
//     const userPassword = password;
//     const hashedPassword = await bcrypt.hash(userPassword, 10);

//     //sparar data i firestore
//     const userDocRef = doc(db, "students", userName);
//     await setDoc(userDocRef, {
//       name,
//       userName,
//       role,
//       password: hashedPassword,
//       teacherID: teacherID,
//       createdAt: admin.firestore.FieldValue.serverTimestamp(),
//     });

//     res
//       .status(201)
//       .json({
//         message: "Student registered successfully!",
//         userName: userName,
//       });
//   } catch (error) {
//     console.error("Error registering student:", error);
//     res
//       .status(500)
//       .json({ message: "Internal server error", error: error.message });
//   }
// };
