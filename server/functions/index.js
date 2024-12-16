const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const userRoutes = require("./routes/userRoutes");

admin.initializeApp({
  credential: admin.credential.cert(require("./serviceAccountKey.json")),
});

const app = express();
const allowedUrl = [
  "https://sophiaplanner.vercel.app", // Din live Vercel-URL
  "http://localhost:5173", // För lokal utveckling
];
app.use(cookieParser());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedUrl.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Viktigt för cookies
  })
);
app.use(express.json());
app.set("view engine", null);

console.log("CORS settings applied");

app.use("/api", userRoutes);

// Kontrollera om servern körs lokalt eller i Firebase Functions
// if (!process.env.FUNCTIONS_EMULATOR && process.env.NODE_ENV !== "production") {
//   const PORT = process.env.PORT || 3000;
//   app.listen(PORT, () => {
//     console.log(`Server is running locally on port ${PORT}`);
//   });
// }

//undefined och används inte ??
// const apiKey = process.env.MY_FIREBASE_API_KEY_ENV; // Hämta nyckeln från miljövariabeln
// console.log("Firebase API Key:", apiKey);

exports.server = functions.https.onRequest(app);
