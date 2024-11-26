const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
const PORT = 3000;
app.use(
  cors({
    origin: "http://localhost:5173", // Din frontend-URL
    methods: ["GET", "POST"], // Tillåt endast dessa metoder
  })
);
app.use(express.json());

const serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "http://sophiaplanner-123.firebaseapp.com",
});

// //To check if server is running katodo
// app.get("/", (req, res) => {
//   res.send("Server is running!");
// });
const registerRoute = require("./routes/register");
app.use("/api/register", registerRoute);

// //just a test katodo
// app.get("/api/test", (req, res) => {
//   res.json({ message: "Hello from server!" });
// });

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
