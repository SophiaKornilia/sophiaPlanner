const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const userRoutes = require("./routes/userRoutes");
const { deleteExpiredSessions } = require("./cron/scheduledTask");

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

exports.server = functions.https.onRequest(app);



exports.deleteExpiredSessions = functions.https.onRequest(deleteExpiredSessions);


