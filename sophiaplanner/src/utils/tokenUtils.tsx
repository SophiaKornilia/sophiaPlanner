import { useContext } from "react";
import API_BASE_URL from "../../config/vercel-config";
import { AuthContext } from "../context/AuthContext";

// Custom hook för att hantera token-tjänster (uppdatering och schemaläggning)
export function useTokenService() {
  const { logout } = useContext(AuthContext);

  // Funktion för att uppdatera idToken
  async function refreshIdToken() {
    try {
      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        console.error("Ingen refreshToken hittades i LocalStorage.");
        logout();
        return;
      }

      const response = await fetch(`${API_BASE_URL}/refreshToken`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Token uppdaterades framgångsrikt", data);

        // Spara det nya idToken, refreshToken och expiration-tid
        localStorage.setItem("idToken", data.idToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        localStorage.setItem(
          "tokenExpiry",
          String(Date.now() + data.expiresIn * 1000)
        );
        // Schemalägg nästa tokenuppdatering
        scheduleTokenRefresh();
      } else {
        console.error("Misslyckades med att uppdatera token.");
        logout();
      }
    } catch (error) {
      console.error("Ett fel uppstod vid tokenuppdatering:", error);
      logout();
    }
  }
  // Funktion för att schemalägga tokenuppdatering innan den går ut
  function scheduleTokenRefresh() {
    const tokenExpiry = Number(localStorage.getItem("tokenExpiry"));

    if (!tokenExpiry || Date.now() >= tokenExpiry) {
      console.error("Token har redan gått ut.");
      logout();
      return;
    }

    const refreshTime = tokenExpiry - Date.now() - 5 * 60 * 1000; // Uppdatera 5 min innan
    console.log(
      `Schemalägger tokenuppdatering om ${refreshTime / 1000} sekunder.`
    );

    if (refreshTime <= 0) {
      console.warn("Token har nästan gått ut. Uppdaterar token direkt.");
      refreshIdToken();
      return;
    }

    setTimeout(() => refreshIdToken(), refreshTime);
  }

  return { refreshIdToken, scheduleTokenRefresh };
}
