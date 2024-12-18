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
  identification: string;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<user | null>(null);
  const sessionId = localStorage.getItem("sessionId");
  const userId = user?.id; // Hämtar id från user-state
  const identification = user?.identification;
  // const navigate = useNavigate();

  const logout = async () => {
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
    <AuthContext.Provider value={{ logout, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
