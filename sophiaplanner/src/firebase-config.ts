// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAg9j-bYYIuCb5F5pQXKuLTZeifrArd1es",
  authDomain: "sophiaplanner-123.firebaseapp.com",
  projectId: "sophiaplanner-123",
  storageBucket: "sophiaplanner-123.firebasestorage.app",
  messagingSenderId: "587430811027",
  appId: "1:587430811027:web:f7e3f2f803ca0c609ec466",
  measurementId: "G-WQ37R3JX0Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);