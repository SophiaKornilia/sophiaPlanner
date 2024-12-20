import { createContext, ReactNode, useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../../config/vercel-config";

interface AuthContextProps {
  logout: () => Promise<void>;
  user: user | null;
  setUser: (user: user | null) => void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextProps>({
  logout: async () => {},
  user: null,
  setUser: () => {},
  isAuthenticated: false,
});

interface AuthProviderProps {
  children: ReactNode;
}

interface user {
  name: string;
  role: string;
  id: string;
  identification: string;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<user | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const idToken = localStorage.getItem("idToken");
    const sessionId = localStorage.getItem("sessionId");

    const verifyLogin = async () => {
      try {
        let response;

        // Skicka förfrågan till rätt endpoint baserat på token/session
        if (idToken) {
          response = await fetch(`${API_BASE_URL}/verifyTeacher`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${idToken}`,
            },
          });
        } else if (sessionId) {
          response = await fetch(`${API_BASE_URL}/verifyStudent`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sessionId }),
          });
        }

        // Hantera svar från backend
        if (response && response.ok) {
          const data = await response.json();
          console.log("response data", data);

          setUser({
            id: data.uid,
            role: data.role,
            name: data.name, // Se till att backend skickar tillbaka detta
            identification: data.identification, // Se till att backend skickar tillbaka detta
          });
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          localStorage.clear(); // Rensa om verifiering misslyckas
        }
      } catch (error) {
        console.error("Error verifying login:", error);
        setIsAuthenticated(false);
      }
    };

    verifyLogin();
  }, []);
  const sessionId = localStorage.getItem("sessionId");
  const userId = user?.id; // Hämtar id från user-state
  const identification = user?.identification;

  const logout = async () => {
    if (!identification) {
      console.error("Identification saknas. Kan inte logga ut.");
      return;
    }
    try {
      // Anropa serverns logout-endpoint
      const response = await fetch(`${API_BASE_URL}/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId,
          userId,
          identification,
        }),
      });

      if (response.ok) {
        console.log("Logout successful!");
      } else {
        console.error("Logout failed on server");
      }
    } catch (error) {
      console.error("Network error during logout:", error);
    }
    //rensa localStorage
    localStorage.clear();
    setUser(null);

    console.log("LocalStorage cleared. Logging out...");

    // Navigera tillbaka till inloggningssidan
    // navigate("/LoginPage");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, isAuthenticated, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
