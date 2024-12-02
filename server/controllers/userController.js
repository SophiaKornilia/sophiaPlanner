const { auth, db } = require("../config/firebase-config"); // Anpassa sökvägen om nödvändigt
const {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  getAuth,
  signOut,
} = require("firebase/auth");
const {
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
} = require("firebase/firestore");
const bcrypt = require("bcrypt");

exports.registerUser = async (req, res) => {
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
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Använd signInWithEmailAndPassword för att logga in användaren
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    //sparar ytterligare data i firestore
    const userDocRef = doc(db, "users", user.uid);
    const userSnapShot = await getDoc(userDocRef);
    if (!userSnapShot.exists()) {
      return res
        .status(404)
        .json({ message: "User data not found in Firestore" });
    }

    const userData = userSnapShot.data();

    const accessToken = await user.getIdToken();

    res.status(201).json({
      message: "User logedin successfully!",
      accessToken: accessToken,
      user: {
        uid: user.uid,
        email: user.email,
        role: userData.role,
        name: userData.name,
      },
    });
  } catch (error) {
    console.error("Error registering user", error);
    res
      .status(500)
      .json({ message: "Failed to login user", error: error.message });
  }
};

exports.logOut = async (req, res) => {
  const auth = getAuth();

  try {
    await signOut(auth);
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ message: "Logout failed", error: error.message });
  }
};

exports.registerStudent = async (req, res) => {
  try {
    const { name, userName, password, role } = req.body;

    if (!name || !userName || !role || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const studentsRef = collection(db, "students");
    const userNameQuery = query(studentsRef, where("userName", "==", userName));
    const existingUser = await getDocs(userNameQuery);

    if (!existingUser.empty) {
      return res.status(409).json({ message: "Användarnamnet är redan taget" });
    }

    //hasha lösenordet
    const userPassword = password;
    const hashedPassword = await bcrypt.hash(userPassword, 10);

    //sparar data i firestore
    const userDocRef = doc(db, "students", userName);
    await setDoc(userDocRef, {
      name,
      userName,
      role,
      password: hashedPassword,
      createdAt: new Date(),
    });

    res
      .status(201)
      .json({ message: "User registered successfully!", userName: userName });
  } catch (error) {
    console.error("Error registering user", error);
    res
      .status(500)
      .json({ message: "Failed to register user", error: error.message });
  }
};
