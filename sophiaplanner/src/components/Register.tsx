import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

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
      const response = await fetch("http://localhost:3000/api/register", {
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
      <div className="h-screen flex justify-center items-center bg-background font-sans  ">
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
    </div>
  );
};

export default Register;
