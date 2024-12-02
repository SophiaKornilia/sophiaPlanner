//ALL LOGIN FUNKTIONALITET SKER FRÅN FRONTEND

// import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

// const auth = getAuth();

const loginUser = async (email, password) => {
  //   try {
  //     // Försök logga in användaren
  //     const userCredential = await signInWithEmailAndPassword(auth, email, password);
  //     const user = userCredential.user;
  //     // Inloggning lyckades
  //     console.log("User signed in:", user);
  //     return user; // Returnera användardata om det behövs
  //   } catch (error) {
  //     // Fångar fel vid inloggning
  //     console.error("Error during sign-in:", error.code, error.message);
  //     // Hantera felkoder
  //     if (error.code === "auth/user-not-found") {
  //       alert("Användaren finns inte. Kontrollera e-postadressen.");
  //     } else if (error.code === "auth/wrong-password") {
  //       alert("Fel lösenord. Försök igen.");
  //     } else {
  //       alert("Ett oväntat fel inträffade: " + error.message);
  //     }
  //   }
};

// // Exempel på hur du anropar funktionen
// loginUser("test@example.com", "password123");
