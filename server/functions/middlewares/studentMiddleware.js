const admin = require("firebase-admin");

exports.studentMiddleware = async (req, res, next) => {
  const db = admin.firestore();
  const sessionId = req.body.sessionId || req.headers["session-id"]; // Hämta sessionId från body
  console.log("sessionId", sessionId);

  try {
    if (!sessionId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No sessionId provided" });
    }

    // Kontrollera om sessionId finns i Firestore
    const sessionRef = await db.collection("sessions").doc(sessionId).get();
    if (!sessionRef.exists) {
      return res.status(401).json({ message: "Unauthorized: Invalid session" });
    }

    const sessionData = sessionRef.data();
    const now = new Date();

    // Kontrollera om sessionen har gått ut
    if (sessionData.expiresAt.toDate() <= now) {
      return res.status(401).json({ message: "Unauthorized: Session expired" });
    }

    // Sätt användarens studentId i request-objektet
    req.user = { uid: sessionData.studentId };
    console.log("Middleware UID:", req.user.uid);
    next(); // Fortsätt till nästa middleware eller route-handler
  } catch (error) {
    console.error("Session validation failed:", error.message);
    return res
      .status(401)
      .json({ message: "Unauthorized", error: error.message });
  }
};
