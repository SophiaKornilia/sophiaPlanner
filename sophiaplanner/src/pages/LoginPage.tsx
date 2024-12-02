import { Header } from "../components/Header";
import { useState } from "react";
import { auth } from "../../config/firebas-config";
import { signInWithEmailAndPassword } from "firebase/auth";
import "../styles/index.css";
import { FirebaseError } from "firebase/app";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      alert("Email fältet är tomt!");
      return;
    }
    if (!password) {
      alert("Lösenords fältet är tomt!");
      return;
    }

    try {
      // Använd signInWithEmailAndPassword för att logga in användaren
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Visa feedback till användaren
      alert("Inloggning lyckades! Välkommen " + user.email);
      //katodo om user.role = teacher else:
      navigate("/DashboardTeacher");
      console.log("Användare inloggad:", user);
    } catch (error) {
      if (error instanceof FirebaseError) {
        // Nu har TypeScript information om att det är en FirebaseError
        console.error("Firebase error code:", error.code);
        console.error("Firebase error message:", error.message);
      } else {
        // Hantera andra typer av fel
        console.error("Unknown error:", error);
      }
    }
  };

  return (
    <div>
      <Header />
      <div className="h-screen items-start bg-background font-sans flex justify-center">
        <form className="h-2/4 w-1/4  bg-secondary mt-[10%] flex flex-col items-center justify-center p-6 rounded-lg shadow-md">
          <label className="mb-2 text-lg font-semibold">
            Användarnamn/epost:
          </label>
          <input
            className="mb-4 p-2 w-full max-w-xs border rounded-md"
            type="text"
            id="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            required
          ></input>
          <label className="mb-2 text-lg font-semibold">Lösenord:</label>
          <input
            className="mb-4 p-2 w-full max-w-xs border rounded-md"
            type="password"
            id="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            required
          ></input>
          <button
            className="custom-button hover:bg-opacity-80"
            onClick={handleLogin}
          >
            Logga in
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
