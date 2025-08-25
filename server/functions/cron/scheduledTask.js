

// job.start();
const admin = require("firebase-admin");

exports.deleteExpiredSessions = async (req, res) => {
  try {
    const db = admin.firestore();
    const now = new Date();

    const sessionRef = db.collection("sessions");
    const snapshot = await sessionRef.where("expiresAt", "<", now).get();

    if (snapshot.empty) {
      return res.status(200).send("No expired sessions found");
    }

    const batch = db.batch();
    snapshot.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();

    res.status(200).send("Expired sessions deleted successfully");
  } catch (error) {
    console.error("Error deleting expired sessions:", error);
    res.status(500).send("Error deleting expired sessions");
  }
};

