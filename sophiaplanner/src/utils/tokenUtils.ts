import API_BASE_URL from "../../config/vercel-config";

// export function scheduleTokenRefresh(expiresIn: number) {
export function scheduleTokenRefresh() {
  //   const refreshTime = (expiresIn - 300) * 1000; // 5 minuter innan token går ut
  const refreshTime = 10 * 1000;
  console.log(
    `Schemalägger tokenuppdatering om ${refreshTime / 1000} sekunder.`
  );

  setTimeout(async () => {
    console.log("Försöker uppdatera token...");
    await refreshIdToken();
  }, refreshTime);
}

export async function refreshIdToken() {
  try {
    const response = await fetch(`${API_BASE_URL}/refreshToken`, {
      method: "POST",
      credentials: "include", // Skickar cookies automatiskt
    });

    if (response.ok) {
      console.log("Token uppdaterades framgångsrikt.");
      const data = await response.json();
      console.log(data.message);
    } else {
      console.error("Misslyckades med att uppdatera token.");
    }
  } catch (error) {
    console.error("Ett fel uppstod vid tokenuppdatering:", error);
  }
}
