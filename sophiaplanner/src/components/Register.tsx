import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../../config/vercel-config";
interface teacher {
  name: string;
  email: string;
  password: string;
  role: string;
}
const Register = () => {
  const emailInputRef = useRef<HTMLInputElement | null>(null);
  const [formData, setFormData] = useState<teacher>({
    name: "",
    email: "",
    password: "",
    role: "teacher",
  });

  const [password, setPassword] = useState<string>("");
  const [passwordRepeat, setPasswordRepeat] = useState<string>("");
  const navigate = useNavigate();

  const handleClick = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name) {
      alert("Namnfälter får inte var tomt");
      return;
    }
    if (!formData.email) {
      alert("Email får inte var tomt");
      return;
    }

    if (emailInputRef.current && !emailInputRef.current.checkValidity()) {
      alert("Ange en giltig e-postadress!");
      return;
    }

    if (password.length < 6) {
      alert("Lösenordet måste vara minst 6 karaktärer");
      return;
    }

    if (password !== passwordRepeat) {
      alert("Lösenorden är inte samma!");
      return;
    }

    const updatedFormData = { ...formData, password: password };

    try {
      // const response = await fetch("http://localhost:3000/api/users/register", {
      const response = await fetch(`${API_BASE_URL}/registerUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFormData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("User registered successfully:", data);
        alert("Registreringen lyckades, du omdirigeras nu till login sidan!");

        navigate("/LoginPage");
      } else {
        const error = await response.json();
        if (error.message === "Email already exists") {
          alert("E-postadressen är redan registrerad!");
        }
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("Ett nätverksfel inträffade!");
    }
  };

  return (
    <div>
      <div className="h-screen flex justify-center flex-start items-center bg-gradient-to-b from-primary to-background px-4 py-4 font-sans overflow-scroll ">
        <div className="h-screen flex justify-center items-start bg-gradient-to-b from-primary to-background px-4 py-14 font-sans overflow-hidden">
          <div className="w-full max-w-6xl bg-secondary p-6 md:p-8 rounded-lg shadow-lg flex flex-col md:flex-row items-center gap-6">
            {/* Vänster sektion - Introduktion */}
            <div className="w-full md:w-1/2 text-center md:text-left px-6 py-4">
              <h2 className="text-2xl md:text-3xl font-bold text-text mb-4">
                Registrera dig som lärare
              </h2>
              <p className="text-base md:text-lg text-text-light mb-6">
                Fyll i formuläret för att skapa ett konto och börja planera dina
                lektioner med SophiaPlanner. Enkelt, smidigt och anpassat för
                dig!
              </p>
            </div>

            {/* Höger sektion - Formulär */}
            <form className="w-full md:w-1/2 flex flex-col items-center gap-4">
              {/* Namn */}
              <div className="w-full">
                <label className="block text-lg font-semibold text-text mb-2">
                  Namn:
                </label>
                <input
                  className="w-full p-2 border rounded-md"
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              {/* Email */}
              <div className="w-full">
                <label className="block text-lg font-semibold text-text mb-2">
                  Email:
                </label>
                <input
                  ref={emailInputRef}
                  className="w-full p-2 border rounded-md"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>

              {/* Lösenord */}
              <div className="w-full">
                <label className="block text-lg font-semibold text-text mb-2">
                  Lösenord (minst 6 karaktärer):
                </label>
                <input
                  className="w-full p-2 border rounded-md"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {/* Upprepa lösenord */}
              <div className="w-full">
                <label className="block text-lg font-semibold text-text mb-2">
                  Upprepa lösenord:
                </label>
                <input
                  className="w-full p-2 border rounded-md"
                  type="password"
                  value={passwordRepeat}
                  onChange={(e) => setPasswordRepeat(e.target.value)}
                  required
                />
              </div>
              <button
                type="button"
                className="bg-accent text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-80 transition duration-300 w-full md:w-auto"
                onClick={handleClick}
              >
                Registrera
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

{
  /*         
        <div className=" w-full max-w-6xl bg-secondary p-6 md:p-8 rounded-lg shadow-lg flex flex-col md:flex-row items-center gap-6"></div>
        <form className="w-full max-w-md bg-secondary p-6 runded-lg shadow-md flex flex-col items-center space-y-4">
          <label className="text-lg font-semibold">
            Registrera dig som lärare
          </label>
          <label className="mb-2 text-lg font-semibold">Namn:</label>
          <input
            className="mb-4 p-2 w-full max-w-xs border rounded-md"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          ></input>
          <label className="mb-2 text-lg font-semibold">Email:</label>
          <input
            ref={emailInputRef}
            className="mb-4 p-2 w-full max-w-xs border rounded-md"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          ></input>
          <label className="mb-2 text-lg font-semibold">
            Lösenord(minst 6 karaktärer):
          </label>
          <input
            className="mb-4 p-2 w-full max-w-xs border rounded-md"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          ></input>
          <label className="mb-2 text-lg font-semibold">
            Upprepa lösenord:
          </label>
          <input
            className="mb-4 p-2 w-full max-w-xs border rounded-md"
            type="password"
            value={passwordRepeat}
            onChange={(e) => setPasswordRepeat(e.target.value)}
            required
          ></input>
          <button
            type="button"
            className="custom-button hover:bg-opacity-80"
            onClick={handleClick}
          >
            Registrera
          </button>
        </form>
      </div>
    </div> */
}
