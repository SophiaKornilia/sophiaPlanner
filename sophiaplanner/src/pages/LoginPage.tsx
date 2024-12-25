import { Header } from "../components/Header";
import { useContext, useState } from "react";
import "../styles/index.css";
import API_BASE_URL from "../../config/vercel-config";
// import { scheduleTokenRefresh } from "../utils/tokenUtils";
import { useNavigate } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext";
import { useTokenService } from "../utils/tokenUtils";
import { AuthContext } from "../context/AuthContext";

interface loginData {
  identification: string;
  password: string;
}

const Login = () => {
  const [loginForm, setLoginForm] = useState<loginData>({
    identification: "",
    password: "",
  });
  // const { setUser, setToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const { scheduleTokenRefresh } = useTokenService();
  const { user, setUser } = useContext(AuthContext);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!loginForm.identification) {
      alert("Fyll i användarnamn!");
      return;
    }
    if (!loginForm.password) {
      alert("Lösenords fältet är tomt!");
      return;
    }

    try {
      console.log("api base url", API_BASE_URL);
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginForm),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("User logedin successfully", data);

        // Navigera till rätt dashboard
        if (data.teacherRole === "teacher") {
          if (data.idToken) {
            setUser({
              name: data.teacherName,
              role: data.teacherRole,
              id: data.user.userId,
              identification: data.user.email,
            });
            localStorage.setItem("idToken", data.idToken);
            localStorage.setItem("refreshToken", data.refreshToken);
            localStorage.setItem(
              "tokenExpiry",
              String(Date.now() + data.expiresIn * 1000)
            );

            scheduleTokenRefresh();
            // setToken(data.accessToken);
            console.log("Token set in context:", data.accessToken);

            console.log("Tokens sparade i LocalStorage.");
          }
          navigate("/DashboardTeacher");
          console.log("userlog", user);
        } else if (data.user.role === "student") {
          if (data.sessionId) {
            setUser({
              name: data.user.name,
              role: data.user.role,
              id: data.user.userName,
              identification: data.user.userName,
            });
            localStorage.setItem("sessionId", data.sessionId);
            localStorage.setItem(
              "tokenExpiry",
              String(Date.now() + data.expiresIn * 1000)
            );
            console.log("Tokens sparade i LocalStorage.");
          }
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
      <div className="h-screen items-start bg-gradient-to-b from-primary to-background font-sans flex justify-center">
        <form className="h-2/4 w-11/12 md:w-1/3 lg:w-1/4 bg-secondary mt-[10%] flex flex-col items-center justify-center p-6 px-4 py-10 rounded-lg shadow-md gap-4">
          <label className="mb-2 text-lg font-semibold">
            Användarnamn/epost:
          </label>
          <input
            className="mb-4 p-2 w-full md:w-full lg:max-w-xs border rounded-md"
            type="text"
            id="email"
            value={loginForm.identification}
            onChange={(e) => {
              setLoginForm({ ...loginForm, identification: e.target.value });
            }}
            required
          ></input>
          <label className="mb-2 text-lg font-semibold">Lösenord:</label>
          <input
            className="mb-4 p-2 w-full md:w-full lg:max-w-xs border rounded-md"
            type="password"
            id="password"
            value={loginForm.password}
            onChange={(e) => {
              setLoginForm({ ...loginForm, password: e.target.value });
            }}
            required
          ></input>
          <button
            className="custom-button hover:bg-opacity-80 w-full py-3"
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
