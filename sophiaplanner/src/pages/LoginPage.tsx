import { Header } from "../components/Header";
import { useContext, useState } from "react";
import "../styles/index.css";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

interface loginData {
  email: string;
  password: string;
}

const Login = () => {
  const [loginForm, setLoginForm] = useState<loginData>({
    email: "",
    password: "",
  });
  const { setUser, setToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!loginForm.email) {
      alert("Email fältet är tomt!");
      return;
    }
    if (!loginForm.password) {
      alert("Lösenords fältet är tomt!");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginForm),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("User logedin successfully", data);

        //spara användare och token i context
        setUser(data.user);
        console.log("User set in context:", data.user);
        setToken(data.accessToken);
        console.log("Token set in context:", data.accessToken);

        // Navigera till rätt dashboard
        if (data.user.role === "teacher") {
          navigate("/DashboardTeacher");
        } else if (data.user.role === "student") {
          navigate("/DashboardStudent");
        } else {
          console.log("Ingen roll satt/hittades!");

          navigate("/");
        }
      } else if (response.status === 401) {
        alert("Felaktiga inloggningsuppgifter!");
      } else if (response.status === 500) {
        alert("Ett serverfel inträffade. Försök igen senare.");
      } else {
        const error = await response.json();
        alert(error.message || "Ett okänt fel inträffade.");
      }
    } catch (error) {
      console.error("Nätverksfel:", error);
      alert(
        "Kunde inte ansluta till servern. Kontrollera din internetanslutning."
      );
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
            value={loginForm.email}
            onChange={(e) => {
              setLoginForm({ ...loginForm, email: e.target.value });
            }}
            required
          ></input>
          <label className="mb-2 text-lg font-semibold">Lösenord:</label>
          <input
            className="mb-4 p-2 w-full max-w-xs border rounded-md"
            type="password"
            id="password"
            value={loginForm.password}
            onChange={(e) => {
              setLoginForm({ ...loginForm, password: e.target.value });
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
