import { Header } from "../components/Header";
import { useContext, useState } from "react";
import "../styles/index.css";
import API_BASE_URL from "../../config/vercel-config";

import { useNavigate } from "react-router-dom";

import { useTokenService } from "../utils/tokenUtils";
import { AuthContext } from "../context/AuthContext";

interface loginData {
  identification: string;
  password: string;
}

//Funktion för att logga in lärare eller elev
const Login = () => {
  const [loginForm, setLoginForm] = useState<loginData>({
    identification: "",
    password: "",
  });

  const navigate = useNavigate();
  const { scheduleTokenRefresh } = useTokenService();
  const { user, setUser, setIsAuthenticated } = useContext(AuthContext);
  const [saveModalText, setSaveModalText] = useState<string>("");
  const [saveModalTitle, setSaveModalTitle] = useState<string>("");
  const [alertModal, setAlertModal] = useState<boolean>(false);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  // Funktion som hanterar inloggningsförsök
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!loginForm.identification) {
      setSaveModalTitle("Ojdå!");
      setSaveModalText("Du måste fylla i användarnamn!");
      setAlertModal(true);

      return;
    }
    if (!loginForm.password) {
      setSaveModalTitle("Ojdå!");
      setSaveModalText("Du måste fylla i lösenord!");
      setAlertModal(true);

      return;
    }

    try {
     
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

            setIsAuthenticated(true);

            // Schemalägger tokenuppdatering
            scheduleTokenRefresh();
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
            // Lagrar session och expiration-tid i localStorage
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
        setSaveModalTitle("Ojdå!");
        setSaveModalText("Felaktiga inloggningsuppgifter!");
        setAlertModal(true);
      } else if (response.status === 500) {
        setSaveModalTitle("Ojdå!");
        setSaveModalText("Ett serverfel inträffade. Försök igen senare.");
        setAlertModal(true);
      } else {
        const error = await response.json();
        setSaveModalTitle("Ojdå!");
        setSaveModalText(error.message || "Ett okänt fel inträffade.");
        setAlertModal(true);
      }
    } catch (error) {
      console.error("Nätverksfel:", error);
      setSaveModalTitle("Ojdå!");
      setSaveModalText(
        "Kunde inte ansluta till servern. Kontrollera din internetanslutning."
      );
      setAlertModal(true);
    }
  };

  return (
    <div>
      <Header />
      <div className="h-screen items-start bg-gradient-to-b from-primary to-background font-sans flex justify-center">
        <form className="h-2/4 w-11/12 md:w-1/3 lg:w-1/4 bg-secondary mt-[10%] flex flex-col items-center justify-center p-6 px-4 py-10 rounded-lg shadow-md gap-4">
          <div className="flex items-center justify-center w-full mb-2">
            <label className="text-lg font-semibold mr-1" id="email">
              Användarnamn:
            </label>
            {/* i-ikonen med tooltip */}
            <div className="relative group">
              <button
                type="button"
                className="flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-gray-400 rounded-full cursor-pointer"
                onClick={() => setIsTooltipVisible(!isTooltipVisible)} // Hantera klick för mobiler
              >
                i
              </button>
              {/* Tooltip som visas antingen via klick (mobil) eller hover (dator) */}
              <div
                className={`absolute right-0 top-full mt-2 bg-gray-800 text-white text-sm rounded-md px-4 py-2 shadow-lg w-56 text-center ${
                  isTooltipVisible ? "block" : "hidden"
                } group-hover:block`}
              >
                Loggar du in som elev använder du ditt användarnamn. Loggar du
                in som lärare använder du e-post som användarnamn.
                <div className="absolute -top-1 right-2 w-2 h-2 bg-gray-800 transform rotate-45"></div>
              </div>
            </div>
          </div>

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
          <label className="mb-2 text-lg font-semibold" id="password">
            Lösenord:
          </label>
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
            className=" contrast-more:text-highContrastText custom-button hover:bg-opacity-80 w-full lg:max-w-xs md:w-full py-3 "
            onClick={handleLogin}
          >
            Logga in
          </button>
        </form>
      </div>
      {/* Modal för varningar */}
      {alertModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-lg p-6 mx-4 md:mx-0">
            <h3 className="text-xl font-bold mb-4 text-center md:text-left">
              {saveModalTitle}
            </h3>
            <p className="mb-6 text-gray-700 text-center md:text-left">
              {saveModalText}
            </p>
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <button
                onClick={() => {
                  setAlertModal(false);
                }}
                className="bg-accent hover:bg-text text-white px-4 py-2 rounded w-full md:w-auto"
              >
                Ok
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
