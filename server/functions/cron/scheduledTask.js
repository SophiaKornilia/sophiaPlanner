// const cron = require("cron");
// const admin = require("firebase-admin");
// //katodo firebase cloudschedular

// const CronJob = cron.CronJob;

// const job = new CronJob("0 * * * *", async function () {
//   console.log("cronjob is running");

//   const db = admin.firestore();
//   const now = new Date();
//   try {
//     const sessionRef = db.collection("sessions");
//     const snapshot = await sessionRef.where("expiresAt", "<", now).get();

//     if (snapshot.empty) {
//       console.log("No expired sessions found");
//       return;
//     }

//     // Iterera över dokumenten och radera dem
//     const batch = db.batch(); // Använd batch för bättre prestanda
//     snapshot.forEach((doc) => {
//       console.log(`Deleting session: ${doc.id}`);
//       batch.delete(doc.ref);
//     });

//     // Utför batch-operationen
//     await batch.commit();
//     console.log("Expired sessions deleted successfully");
//   } catch (error) {
//     console.error("Error deleting expired sessions:", error);
//   }
// });

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

