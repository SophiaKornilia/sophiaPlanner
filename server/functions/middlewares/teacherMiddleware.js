const admin = require("firebase-admin");

exports.teacherMiddleware = async (req, res, next) => {
  const idToken = req.headers.authorization?.split(" ")[1];

  try {
    if (!idToken) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No idToken provided" });
    }

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = { uid: decodedToken.uid };

    next();
  } catch (error) {
    console.error("Teacher middleware failed:", error.message);
    return res
      .status(401)
      .json({ message: "Unauthorized", error: error.message });
  }
};
