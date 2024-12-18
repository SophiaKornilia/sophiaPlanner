import { useContext } from "react";
import API_BASE_URL from "../../config/vercel-config";
import { AuthContext } from "../context/AuthContext";

export function useTokenService() {
  const { logout } = useContext(AuthContext);

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

        // Spara det nya idToken och refreshToken
        localStorage.setItem("idToken", data.idToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        localStorage.setItem(
          "tokenExpiry",
          String(Date.now() + data.expiresIn * 1000)
        );

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

//katodo - code for using cookies
// import API_BASE_URL from "../../config/vercel-config";

// // export function scheduleTokenRefresh(expiresIn: number) {
// export function scheduleTokenRefresh() {
//   //   const refreshTime = (expiresIn - 300) * 1000; // 5 minuter innan token går ut
//   const refreshTime = 10 * 1000;
//   console.log(
//     `Schemalägger tokenuppdatering om ${refreshTime / 1000} sekunder.`
//   );

//   setTimeout(async () => {
//     console.log("Försöker uppdatera token...");
//     await refreshIdToken();
//   }, refreshTime);
// }

// export async function refreshIdToken() {
//   try {
//     const response = await fetch(`${API_BASE_URL}/refreshToken`, {
//       method: "POST",
//       credentials: "include", // Skickar cookies automatiskt
//     });

//     if (response.ok) {
//       console.log("Token uppdaterades framgångsrikt.", response);
//       const data = await response.json();
//       console.log("data message", data);
//     } else {
//       console.error("Misslyckades med att uppdatera token.");
//     }
//   } catch (error) {
//     console.error("Ett fel uppstod vid tokenuppdatering:", error);
//   }
// }
