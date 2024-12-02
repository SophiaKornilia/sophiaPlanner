const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
const PORT = 3000;
app.use(cors());
app.use(express.json());

const serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "http://sophiaplanner-123.firebaseapp.com",
});

const registerRoute = require("./routes/register");
app.use("/api/register", registerRoute);

// const loginRoute = require("./routes/login");
// app.use("/api/login", loginRoute);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
