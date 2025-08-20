// import { useState, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import API_BASE_URL from "../../config/vercel-config";

// interface RegisterProps {
//   setShowRegister?: (value: boolean) => void;
// }
// interface teacher {
//   name: string;
//   email: string;
//   password: string;
//   role: string;
//   gdpr: boolean;
// }

// // Registreringskomponent för lärare
// const Register: React.FC<RegisterProps> = ({ setShowRegister }) => {
//   const emailInputRef = useRef<HTMLInputElement | null>(null);
//   const [formData, setFormData] = useState<teacher>({
//     name: "",
//     email: "",
//     password: "",
//     role: "teacher",
//     gdpr: false,
//   });

//   const [password, setPassword] = useState<string>("");
//   const [passwordRepeat, setPasswordRepeat] = useState<string>("");
//   const navigate = useNavigate();
//   const [alertModal, setAlertModal] = useState(false);
//   const [saveModalText, setSaveModalText] = useState<string>("");
//   const [saveModalTitle, setSaveModalTitle] = useState<string>("");
//   const [success, setSuccess] = useState(false);

//   // Funktion för att hantera formulärskick
//   const handleClick = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!formData.name) {
//       setSaveModalTitle("Ojdå!");
//       setSaveModalText("Namnfälter får inte var tomt");
//       setAlertModal(true);
//       return;
//     }
//     if (!formData.email) {
//       setSaveModalTitle("Ojdå!");
//       setSaveModalText("Du måste fylla i email.");
//       setAlertModal(true);
//       return;
//     }

//     if (emailInputRef.current && !emailInputRef.current.checkValidity()) {
//       setSaveModalTitle("Ojdå!");
//       setSaveModalText("Ange en giltig e-postadress!");
//       setAlertModal(true);

//       return;
//     }

//     if (password.length < 6) {
//       setSaveModalTitle("Ojdå!");
//       setSaveModalText("Lösenordet måste vara minst 6 karaktärer");
//       setAlertModal(true);

//       return;
//     }

//     if (password !== passwordRepeat) {
//       setSaveModalTitle("Ojdå!");
//       setSaveModalText("Lösenorden är inte lika!");
//       setAlertModal(true);

//       return;
//     }

//     if (!formData.gdpr) {
//       setSaveModalTitle("Ojdå!");
//       setSaveModalText(
//         "Du måste godkänna vår integritetspolicy för att fortsätta."
//       );
//       setAlertModal(true);
//       return;
//     }

//     // Skicka data till backend
//     const updatedFormData = { ...formData, password: password };

//     try {
//       const response = await fetch(`${API_BASE_URL}/registerUser`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(updatedFormData),
//       });

//       if (response.ok) {
//         const data = await response.json();
//         console.log("User registered successfully:", data);
//         setSuccess(true);
//         setSaveModalTitle("Yaay!");
//         setSaveModalText(
//           "Registreringen lyckades, du omdirigeras nu till login sidan!"
//         );
//         setAlertModal(true);
//       } else {
//         const error = await response.json();
//         if (error.message === "User already exists") {
//           setSaveModalTitle("Ojdå!");
//           setSaveModalText("E-postadressen är redan registrerad!");
//           setAlertModal(true);
//         }
//       }
//     } catch (error) {
//       console.error("Network error:", error);
//       setSaveModalTitle("Ojdå!");
//       setSaveModalText("Ett nätverksfel inträffade!");
//       setAlertModal(true);
//     }
//   };

//   // Hantera navigering till integritetspolicy
//   const handleNavigation = (event: React.MouseEvent<HTMLAnchorElement>) => {
//     event.preventDefault();
//     window.open("/PrivacyPolicy", "_blank");
//   };

//   return (
//     <div className="h-screen w-full flex justify-center items-center bg-gradient-to-b from-primary to-background px-4 pt-20 sm:pt-12 pb-14 md:py-14 font-sans overflow-y-auto">
//       <div className="w-full max-w-6xl bg-secondary p-6 md:p-8  rounded-lg shadow-lg flex flex-col md:flex-row items-center gap-6 ">
//         {/* Vänster sektion - Introduktion */}
//         <div className="w-full md:w-1/2 text-center md:text-left px-6 py-4">
//           <h2 className="text-2xl md:text-3xl font-bold text-text mb-4">
//             Registrera dig som lärare
//           </h2>
//           <p className="text-base md:text-lg text-text-light mb-6">
//             Fyll i formuläret för att skapa ett konto och låt SophiaPlanner
//             hjälpa dig att göra lektionerna både organiserade och engagerande. <br/><br/><br/>
//             Är du elev behöver du inte registrera dig, du får dina inloggningsuppgifter av din lärare eller någon på skolan.
//           </p>
//         </div>

//         {/* Höger sektion - Formulär */}
//         <form className="w-full md:w-1/2 flex flex-col items-center gap-4">
//           {/* Namn */}
//           <div className="w-full">
//             <label className="block text-lg font-semibold text-text mb-2">
//               Namn:
//             </label>
//             <input
//               className="w-full p-2 border rounded-md"
//               type="text"
//               value={formData.name}
//               onChange={(e) =>
//                 setFormData({ ...formData, name: e.target.value })
//               }
//               required
//             />
//           </div>

//           {/* Email */}
//           <div className="w-full">
//             <label className="block text-lg font-semibold text-text mb-2">
//               Email:
//             </label>
//             <input
//               ref={emailInputRef}
//               className="w-full p-2 border rounded-md"
//               type="email"
//               value={formData.email}
//               onChange={(e) =>
//                 setFormData({ ...formData, email: e.target.value })
//               }
//               required
//             />
//           </div>

//           {/* Lösenord */}
//           <div className="w-full">
//             <label className="block text-lg font-semibold text-text mb-2">
//               Lösenord (minst 6 karaktärer):
//             </label>
//             <input
//               className="w-full p-2 border rounded-md"
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//           </div>

//           {/* Upprepa lösenord */}
//           <div className="w-full">
//             <label className="block text-lg font-semibold text-text mb-2">
//               Upprepa lösenord:
//             </label>
//             <input
//               className="w-full p-2 border rounded-md"
//               type="password"
//               value={passwordRepeat}
//               onChange={(e) => setPasswordRepeat(e.target.value)}
//               required
//             />
//           </div>
//           <div>
//             <label className="text-text">
//               <input
//                 type="checkbox"
//                 checked={formData.gdpr}
//                 onChange={
//                   (e) => setFormData({ ...formData, gdpr: e.target.checked }) // Uppdatera formData.gdpr
//                 }
//                 required
//                 className="text-text"
//               />
//               &nbsp;Jag godkänner att mina personuppgifter behandlas i enlighet
//               med vår&nbsp;
//               <a
//                 onClick={handleNavigation}
//                 target="_blank"
//                 className="font-bold cursor-pointer"
//               >
//                 integritetspolicy
//               </a>
//               .
//             </label>
//           </div>
//           <button
//             type="button"
//             className="bg-accent text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-80 transition duration-300 w-full md:w-auto"
//             onClick={handleClick}
//           >
//             Registrera
//           </button>
//         </form>
//       </div>
//       {alertModal && (
//         <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-lg p-6 mx-4 md:mx-0">
//             <h3 className="text-xl font-bold mb-4 text-center md:text-left">
//               {saveModalTitle}
//             </h3>
//             <p className="mb-6 text-gray-700 text-center md:text-left">
//               {saveModalText}
//             </p>
//             <div className="flex flex-col md:flex-row justify-between gap-4">
//               <button
//                 onClick={() => {
//                   setAlertModal(false); // Stäng modalen
//                   if (success) {
//                     if (setShowRegister) {
//                       setShowRegister(false);
//                     } // Döljer registreringsrutan
//                     navigate("/LoginPage"); // Navigerar till inloggningssidan
//                   }
//                 }}
//                 className="bg-accent hover:bg-text text-white px-4 py-2 rounded w-full md:w-auto"
//               >
//                 Ok
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Register;

import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../../config/vercel-config";

interface RegisterProps {
  setShowRegister?: (value: boolean) => void;
}
interface teacher {
  name: string;
  email: string;
  password: string;
  role: string;
  gdpr: boolean;
}

const Register: React.FC<RegisterProps> = ({ setShowRegister }) => {
  const emailInputRef = useRef<HTMLInputElement | null>(null);
  const [formData, setFormData] = useState<teacher>({
    name: "",
    email: "",
    password: "",
    role: "teacher",
    gdpr: false,
  });

  const [password, setPassword] = useState<string>("");
  const [passwordRepeat, setPasswordRepeat] = useState<string>("");
  const navigate = useNavigate();
  const [alertModal, setAlertModal] = useState(false);
  const [saveModalText, setSaveModalText] = useState<string>("");
  const [saveModalTitle, setSaveModalTitle] = useState<string>("");
  const [success, setSuccess] = useState(false);

  const handleClick = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name) {
      setSaveModalTitle("Ojdå!");
      setSaveModalText("Namnfältet får inte vara tomt");
      setAlertModal(true);
      return;
    }
    if (!formData.email) {
      setSaveModalTitle("Ojdå!");
      setSaveModalText("Du måste fylla i email.");
      setAlertModal(true);
      return;
    }
    if (emailInputRef.current && !emailInputRef.current.checkValidity()) {
      setSaveModalTitle("Ojdå!");
      setSaveModalText("Ange en giltig e-postadress!");
      setAlertModal(true);
      return;
    }
    if (password.length < 6) {
      setSaveModalTitle("Ojdå!");
      setSaveModalText("Lösenordet måste vara minst 6 tecken.");
      setAlertModal(true);
      return;
    }
    if (password !== passwordRepeat) {
      setSaveModalTitle("Ojdå!");
      setSaveModalText("Lösenorden är inte lika!");
      setAlertModal(true);
      return;
    }
    if (!formData.gdpr) {
      setSaveModalTitle("Ojdå!");
      setSaveModalText(
        "Du måste godkänna vår integritetspolicy för att fortsätta."
      );
      setAlertModal(true);
      return;
    }

    const updatedFormData = { ...formData, password };

    try {
      const response = await fetch(`${API_BASE_URL}/registerUser`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFormData),
      });

      if (response.ok) {
        const data = await response.json();
        setSuccess(true);
        setSaveModalTitle("Yaay!");
        setSaveModalText(
          "Registreringen lyckades, du omdirigeras nu till login sidan!"
        );
        setAlertModal(true);
      } else {
        const error = await response.json();
        if (error.message === "User already exists") {
          setSaveModalTitle("Ojdå!");
          setSaveModalText("E-postadressen är redan registrerad!");
          setAlertModal(true);
        }
      }
    } catch (error) {
      console.error("Network error:", error);
      setSaveModalTitle("Ojdå!");
      setSaveModalText("Ett nätverksfel inträffade!");
      setAlertModal(true);
    }
  };

  const handleNavigation = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    window.open("/PrivacyPolicy", "_blank");
  };

  return (
    <>
      <div className="w-full max-w-xl bg-secondary rounded-xl px-3 py-4 sm:px-6 sm:py-6 flex flex-col md:flex-row gap-4 overflow-y-auto max-h-[90vh]">
        {/* Vänster kolumn */}
        <div className="w-full md:w-1/2 text-text px-1 text-center md:text-left text-xs sm:text-sm">
          <h2 className="text-base sm:text-lg font-bold mb-2 leading-snug">
            Registrera dig som lärare
          </h2>
          <p className="text-xs sm:text-sm text-text-light leading-snug">
            Fyll i formuläret för att skapa ett konto och låt SophiaPlanner
            hjälpa dig att göra lektionerna både organiserade och engagerande.
            <br />
            <br />
            Är du elev behöver du inte registrera dig – du får dina
            inloggningsuppgifter från lärare eller skola.
          </p>
        </div>

        {/* Formulär */}
        <form className="w-full md:w-1/2 flex flex-col gap-3">
          <div className="w-full">
            <label className="block text-[11px] sm:text-xs font-semibold text-text mb-1">
              Namn:
            </label>
            <input
              className="w-full p-1.5 sm:p-2 border rounded-md text-[11px] sm:text-xs"
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>
          <div className="w-full">
            <label className="block text-[11px] sm:text-xs font-semibold text-text mb-1">
              Email:
            </label>
            <input
              ref={emailInputRef}
              className="w-full p-1.5 sm:p-2 border rounded-md text-[11px] sm:text-xs"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>
          <div className="w-full">
            <label className="block text-[11px] sm:text-xs font-semibold text-text mb-1">
              Lösenord (minst 6 tecken):
            </label>
            <input
              className="w-full p-1.5 sm:p-2 border rounded-md text-[11px] sm:text-xs"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="w-full">
            <label className="block text-[11px] sm:text-xs font-semibold text-text mb-1">
              Upprepa lösenord:
            </label>
            <input
              className="w-full p-1.5 sm:p-2 border rounded-md text-[11px] sm:text-xs"
              type="password"
              value={passwordRepeat}
              onChange={(e) => setPasswordRepeat(e.target.value)}
              required
            />
          </div>

          <label className="text-[11px] sm:text-xs text-text leading-snug">
            <input
              type="checkbox"
              checked={formData.gdpr}
              onChange={(e) =>
                setFormData({ ...formData, gdpr: e.target.checked })
              }
              required
              className="mr-2"
            />
            Jag godkänner att mina personuppgifter behandlas enligt vår{" "}
            <a
              onClick={handleNavigation}
              className="font-bold underline cursor-pointer"
            >
              integritetspolicy
            </a>
            .
          </label>

          <button
            type="button"
            className="bg-accent text-white px-3 py-1.5 sm:px-4 sm:py-2 
            rounded-lg font-semibold hover:bg-opacity-80 transition duration-300 
            w-full md:w-auto text-[11px] sm:text-xs"
            onClick={handleClick}
          >
            Registrera
          </button>
        </form>
      </div>

      {/* Modal */}
      {alertModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-md p-4 mx-2">
            <h3 className="text-base font-bold mb-3 text-center">
              {saveModalTitle}
            </h3>
            <p className="mb-4 text-gray-700 text-sm text-center">
              {saveModalText}
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => {
                  setAlertModal(false);
                  if (success) {
                    if (setShowRegister) setShowRegister(false);
                    navigate("/LoginPage");
                  }
                }}
                className="bg-accent hover:bg-text text-white px-4 py-2 rounded text-sm"
              >
                Ok
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Register;
