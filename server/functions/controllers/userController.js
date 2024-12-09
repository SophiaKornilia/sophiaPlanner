
const admin = require("firebase-admin");

// app.post("/registerUser", async (req, res) => {
    exports.registerUser = async (req, res) => {
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
  };