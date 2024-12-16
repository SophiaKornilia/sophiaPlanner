// // Import the functions you need from the SDKs you need
// const admin = require("firebase-admin");
// const { initializeApp } = require("firebase/app");
// const { getAuth } = require("firebase/auth");
// const { getFirestore } = require("firebase/firestore");
// const dotenv = require("dotenv");

// dotenv.config();

// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: process.env.FIREBASE_API_KEY,
//   authDomain: process.env.FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.FIREBASE_PROJECT_ID,
//   storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.FIREBASE_APP_ID,
//   measurementId: process.env.FIREBASE_MEASURMENT_ID,
// };

// // Initialize Firebase
// const firebaseApp = initializeApp(firebaseConfig);
// const auth = getAuth(firebaseApp);
// const db = getFirestore(firebaseApp);

// if (!admin.apps.length) {
//   admin.initializeApp({
//     credential: admin.credential.cert(
//       JSON.parse(process.env.FIREBASE_ADMIN_KEY)
//     ),
//     databaseURL: "http://sophiaplanner-123.firebaseapp.com",
//   });
// }

// module.exports = { auth, db, admin, firebaseApp };
