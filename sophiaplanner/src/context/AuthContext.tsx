import { createContext, ReactNode, useEffect, useState } from "react";
import API_BASE_URL from "../../config/vercel-config";
import { useContext } from "react";
/*Skapar en kontext för autentisering och användarhantering
 Context används för att dela autentiseringsstatus och användardata över hela applikationen.
  Definierar strukturen för vad som finns i AuthContext.
 */

interface AuthContextProps {
  logout: () => Promise<void>;
  user: user | null;
  setUser: (user: user | null) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
}

// Skapar själva kontexten med standardvärden
export const AuthContext = createContext<AuthContextProps>({
  logout: async () => {},
  user: null,
  setUser: () => {},
  isAuthenticated: false,
  setIsAuthenticated: () => {},
});

// Används för att specificera att komponenten tar emot ReactNode som barn.
interface AuthProviderProps {
  children: ReactNode;
}

// Typdefinition för användarobjektet
interface user {
  name: string;
  role: string;
  id: string;
  identification: string;
}

// AuthProvider-komponenten tillhandahåller kontextvärden för barnkomponenter
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<user | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const sessionId = localStorage.getItem("sessionId");
  const userId = user?.id;
  const identification = user?.identification;

  // useEffect används för att kontrollera inloggningsstatus vid första inladdning av komponenten
  useEffect(() => {
    const idToken = localStorage.getItem("idToken");
    const sessionId = localStorage.getItem("sessionId");

    console.log("idToken", idToken);
    console.log("sessionId", sessionId);

    // Verifierar om användaren är inloggad
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

        if (response && response.ok) {
          const data = await response.json();
          console.log("response data", data);

          setUser({
            id: data.uid,
            role: data.role,
            name: data.name,
            identification: data.identification,
          });

          console.log("User set in AuthContext:", {
            id: data.uid,
            role: data.role,
            name: data.name,
            identification: data.identification,
          });

          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          localStorage.clear();
        }
      } catch (error) {
        console.error("Error verifying login:", error);
        setIsAuthenticated(false);
      }
    };

    verifyLogin();
  }, []);

  // Loggar ut användaren
  const logout = async () => {
    if (!identification) {
      console.error("Identification saknas. Kan inte logga ut.");
      return;
    }
    try {
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

    localStorage.clear();
    setUser(null);

    console.log("LocalStorage cleared. Logging out...");
  };

  // Returnerar AuthContext med aktuella värden
  return (
    <AuthContext.Provider
      value={{ user, setUser, isAuthenticated, setIsAuthenticated, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

//useAuth är en egen hook som hämtar autentiseringsdata från AuthContext och säkerställer att den bara används inom en AuthProvider.
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
