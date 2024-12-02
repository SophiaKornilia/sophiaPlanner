// const express = require("express");
// const admin = require("firebase-admin");
// const bcrypt = require("bcrypt");
// const router = express.Router();

// const db = admin.firestore();
// const saltRounds = 10;

// router.post("/", async (req, res) => {
//   try {
//     const { name, email, password, role } = req.body;

//     if (!name || !email || !password || !role) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     // Kontrollera om e-post redan finns
//     const userQuery = await db
//       .collection("users")
//       .where("email", "==", email)
//       .get();

//     if (!userQuery.empty) {
//       return res.status(400).json({ message: "Email already exists" });
//     }

//     const hashedPassword = await bcrypt.hash(password, saltRounds);

//     const newUserRef = db.collection("users").doc();
//     await newUserRef.set({
//       name,
//       email,
//       hashedPassword,
//       role,
//       createdAt: admin.firestore.Timestamp.now(),
//     });
//     res.status(200).json({ message: "User registered successfully!" });
//     console.log("the server data", name, email, hashedPassword, role);
//   } catch (error) {
//     console.error("Error registering user", error);
//     res
//       .status(500)
//       .json({ message: "Failed to register user", error: error.message });
//   }
// });

// module.exports = router;
const { auth, db } = require("../config/firebase-config"); // Anpassa sökvägen om nödvändigt
const { createUserWithEmailAndPassword } = require("firebase/auth");
const { doc, setDoc } = require("firebase/firestore");
const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");

router.post("/", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    //sparar ytterligare data i firestore
    const userDocRef = doc(db, "users", user.uid);
    await setDoc(userDocRef, {
      name,
      email,
      role,
      createdAt: new Date(),
    });

    res
      .status(201)
      .json({ message: "User registered successfully!", uis: user.uid });
  } catch (error) {
    console.error("Error registering user", error);
    res
      .status(500)
      .json({ message: "Failed to register user", error: error.message });
  }
});

module.exports = router;
