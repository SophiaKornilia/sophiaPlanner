const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
// const { registerUser } = require("./controllers/userController");

admin.initializeApp({
  credential: admin.credential.cert(require("./serviceAccountKey.json")),
});

const app = express();
app.use(cors());
app.use(express.json());
console.log("CORS settings applied");

const apiKey = process.env.MY_FIREBASE_API_KEY_ENV; // Hämta nyckeln från miljövariabeln
console.log("Firebase API Key:", apiKey);

app.post("/registerUser", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: name,
    });
    const user = { uid: userRecord.uid, email: userRecord.email };

    //sparar ytterligare data i firestore
    const db = admin.firestore();
    const userDocRef = db.collection("users").doc(user.uid);
    await userDocRef.set({
      name,
      email,
      role,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res
      .status(201)
      .json({ message: "User registered successfully!", uid: userRecord.uid });
  } catch (error) {
    console.error("Error registering user", error);
    res
      .status(500)
      .json({ message: "Failed to register user", error: error.message });
  }
});

exports.server = functions.https.onRequest(app);

// app.post("/register", registerUser);