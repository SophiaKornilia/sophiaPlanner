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
    const usersRef = collection(db, "users");
    const emailQuery = query(usersRef, where("email", "==", email));
    const existingUser = await getDocs(emailQuery);

    if (!existingUser.empty) {
      const user = existingUser.docs[0].data();
      return authenticateTeacher(user.email, user.name, password, res);
    }

    const studentsRef = collection(db, "students");
    const userNameQuery = query(studentsRef, where("userName", "==", email));
    const existingStudent = await getDocs(userNameQuery);

    if (!existingStudent.empty) {
      const student = existingStudent.docs[0].data();
      const isPasswordValid = await bcrypt.compare(password, student.password);

      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid password" });
      }
      return res.status(200).json({
        message: "Student login successful",
        accessToken: "studentToken",
        user: {
          role: "student",
          userName: student.userName,
          name: student.name,
        },
      });
    }
    res.status(404).json({ message: "User not found" });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const authenticateTeacher = async (email, name, password, res) => {
  try {
    const auth = getAuth();
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    const accessToken = await user.getIdToken();

    return res.status(201).json({
      message: "User logedin successfully!",
      accessToken,
      user: {
        uid: user.uid,
        email: user.email,
        role: "teacher",
        name: name,
      },
    });
  } catch (error) {
    console.error("Error authenticating teacher:", error);
    return res.status(401).json({ message: "Invalid email or password" });
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
    const { name, userName, password, role, teacherID } = req.body;

    if (!name || !userName || !role || !password || !teacherID) {
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
      teacherID: teacherID,
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

exports.getStudents = async (req, res) => {
  try {
    const { teacherId } = req.body;
    console.log(teacherId);
    if (!teacherId) {
      return res.status(400).json({ message: "Teacher ID is required" });
    }
    const studentsRef = collection(db, "students");
    const studentsQuery = query(
      studentsRef,
      where("teacherID", "==", teacherId)
    );
    const querySnapshot = await getDocs(studentsQuery);

    const students = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return res.status(200).json({ students });
  } catch (error) {
    console.error("Error fetching students:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

exports.createGroup = async (req, res) => {
  try {
    const { groupName, teacherId } = req.body;

    const groupDocRef = doc(db, "groups", groupName);
    await setDoc(groupDocRef, {
      groupName: groupName,
      teacherId: teacherId,
      createdAt: new Date(),
    });

    res
      .status(201)
      .json({ message: "Group registered successfully!", groupName });
  } catch (error) {
    console.error("Error creating group:", error.message);
    res
      .status(500)
      .json({ message: "Failed to create group", error: error.message });
  }
};

exports.getGroups = async (req, res) => {
  try {
    const { teacherId } = req.body;

    if (!teacherId) {
      return res.status(400).json({ message: "Teacher ID is required" });
    }
    const groupsRef = collection(db, "groups");
    const groupQuery = query(groupsRef, where("teacherId", "==", teacherId));
    const querySnapshot = await getDocs(groupQuery);

    const groups = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return res.status(200).json({ groups });
  } catch (error) {
    console.error("Error fetching students:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
