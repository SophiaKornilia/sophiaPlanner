import { createContext, ReactNode, useState } from "react";
// import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../../config/vercel-config";

interface AuthContextProps {
  logout: () => Promise<void>;
  user: user | null;
  setUser: (user: user | null) => void;
}

export const AuthContext = createContext<AuthContextProps>({
  logout: async () => {},
  user: null,
  setUser: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

interface user {
  name: string;
  role: string;
  id: string; 
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<user | null>(null);
  // const navigate = useNavigate();

  const logout = async () => {
    const role = localStorage.getItem("role"); // Läser roll från localStorage
    const sessionId = localStorage.getItem("sessionId"); // Student sessionId
    const userId = localStorage.getItem("userId"); // Lärare userId
    const identification = localStorage.getItem("identification"); // E-post eller användarnamn

    try {
      // Anropa serverns logout-endpoint
      const response = await fetch(`${API_BASE_URL}/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role,
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
    // Rensa localStorage för båda rollerna
    // localStorage.removeItem("role");
    // localStorage.removeItem("sessionId");
    // localStorage.removeItem("idToken");
    // localStorage.removeItem("refreshToken");
    // localStorage.removeItem("tokenExpiry");
    // localStorage.removeItem("userId");
    // localStorage.removeItem("identification");

    console.log("LocalStorage cleared. Logging out...");

    // Navigera tillbaka till inloggningssidan
    // navigate("/LoginPage");
  };

  return (
    <AuthContext.Provider value={{ logout, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
