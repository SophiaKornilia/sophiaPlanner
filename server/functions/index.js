const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
// const { registerUser } = require("./controllers/userController");

const userRoutes = require("./routes/userRoutes");

admin.initializeApp({
  credential: admin.credential.cert(require("./serviceAccountKey.json")),
});

const app = express();
app.use(cors());
app.use(express.json());
console.log("CORS settings applied");

app.use("/api", userRoutes);

//undefined och används inte ??
const apiKey = process.env.MY_FIREBASE_API_KEY_ENV; // Hämta nyckeln från miljövariabeln
console.log("Firebase API Key:", apiKey);

exports.server = functions.https.onRequest(app);

// app.post("/register", registerUser);
