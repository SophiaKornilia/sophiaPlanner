# Sophia Planner

Sophia Planner är ett verktyg för specialpedagoger och lärare för att skapa individanpassade planeringar. Projektet är byggt med en modern techstack och är enkelt att köra i produktion.

---

## Tech Stack

### Frontend

- **React** med **Vite**
- **TypeScript**
- **Tailwind CSS**
- **Hostad på Vercel**

### Backend

- **Node.js** och **Express**
- **Firebase** för autentisering och datalagring
- **Google Cloud Scheduler** för automatiserade processer
- **Hostad på Firebase**

---

## Krav för Utveckling

För att kunna utveckla och köra projektet lokalt behöver du:

- **Node.js** (v16 eller senare)
- **npm** eller **yarn** som paketmanager
- **Vite CLI** (installeras med `npm install vite`)
- En **Firebase-konsol**-instans (du behöver konfigurationen)
- Ett konto på **Google Cloud** för Cloud Scheduler
- **Vercel CLI** (för frontend-deployment)

---

## Dependencies

Dessa paket krävs för att applikationen ska fungera i både utvecklings- och produktionsmiljö. Här är vad de används till:

- **@google-cloud/secret-manager**: Hanterar hemligheter (API-nycklar, lösenord osv.) med Google Cloud Secret Manager.
- **bcrypt**: För att hash:a lösenord (säkra användarinloggningar).
- **cors**: Hanterar Cross-Origin Resource Sharing (tillåter frontend att prata med backend).
- **dotenv**: Laddar ENV-variabler från en `.env`-fil.
- **express**: Backend-ramverket för att hantera serverlogik och API-anrop.
- **firebase**: För klientkommunikation med Firebase-tjänster (t.ex. databaser, autentisering).
- **firebase-admin**: För backend-kommunikation med Firebase, t.ex. hantering av databaser och autentisering.
- **firebase-functions**: Hanterar molnfunktioner i Firebase.
- **quill** och **react-quill**: Rich-text editor för frontend (t.ex. för att skapa eller redigera innehåll).

---

## Instruktioner för Lokal Testning

`1.` **Klona projektet:**  
 Kör följande kommandon i din terminal:

```bash
git clone https://github.com/SophiaKornilia/sophiaPlanner.git
cd sophia-planner
```

`2.` **Installera beroenden:**  
 Navigera till projektmappen och installera alla nödvändiga beroenden:

```bash
npm install
```

`3.` **Definiera ENV-variabler:**  
 Skapa en `.env`-fil i frontend-katalogen med följande variabler:

**Frontend:**

```env
VITE_API_BASE_URL=https://<your-deployed-backend-url>
```

`4.` **Starta frontend:**  
 I en ny terminalflik, navigera till frontend-katalogen och kör:

```bash
npm run dev
```

Detta startar frontend-applikationen på `http://localhost:3000`.

---

## Externa Tjänster och Kontokrav

För att projektet ska fungera krävs följande externa tjänster och konton:

- **Firebase:**

  - Krävs för autentisering och datalagring.
  - Skapa ett projekt på [Firebase Console](https://console.firebase.google.com) och hämta din `FIREBASE_API_KEY`.

- **Google Cloud Scheduler:**

  - Krävs för att hantera schemalagda uppgifter (cron-jobb).
  - Skapa ett projekt på [Google Cloud Console](https://console.cloud.google.com) och aktivera `Cloud Scheduler API`.
  - Säkerställ att din Google Cloud Scheduler är kopplad till samma Firebase-projekt för smidigare integration.

- **Vercel (för frontend):**

  - För att deploya frontend-applikationen. Skapa ett konto på [Vercel](https://vercel.com).

- **GitHub Secrets (valfritt):**
  - För produktion bör känsliga variabler som `FIREBASE_API_KEY` lagras säkert i GitHub Secrets eller motsvarande.

---

## Seed Data och Testanvändare

- **Seed Data:**  
  Projektet kräver ingen förseedad data. Firebase skapar automatiskt nödvändiga databasstrukturer vid användning.

- **Testanvändare:**  
  Följande testanvändare kan användas för att logga in på applikationen:

  **Inloggningsuppgifter:**

  - **Lärare:**
    - **E-post:** teacher@example.com
    - **Lösenord:** abc123
  - **Elev:**
    - **Användarnamn:** student
    - **Lösenord:** abc123

  Testanvändaren är förkonfigurerad med standardbehörigheter för att simulera en vanlig användare.

---

## Övrigt

- Kontrollera att alla ENV-variabler är korrekt definierade i frontend-projektet.
- Säkerställ att din backend är korrekt konfigurerad och att URL:en är uppdaterad i frontendens `.env`.
- Om du stöter på problem, dubbelkolla att Firebase-projektet och Google Cloud Scheduler är korrekt konfigurerade.

---
