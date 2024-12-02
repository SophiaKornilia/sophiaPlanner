import { useState } from "react";
import { Header } from "../components/Header";
import { useNavigate } from "react-router-dom";
// import { useNavigate } from "react-router-dom";

interface student {
  name: string;
  userName: string;
  password: string;
  role: string;
}
const CreateStudentAccount = () => {
  const [formData, setFormData] = useState<student>({
    name: "",
    userName: "",
    password: "",
    role: "student",
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
    if (!formData.userName) {
      alert("Användarnamnet får inte var tomt");
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
      const response = await fetch(
        "http://localhost:3000/api/users/registerStudent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedFormData),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Student registered successfully:", data);
        alert("Registreringen lyckades, du omdirigeras nu till mina sidor!");
        navigate("/DashboardTeacher");
      } else {
        const error = await response.json();
        if (error.message === "Student username already exists") {
          alert("Användarnamnet är redan registrerad!");
        }
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("Ett nätverksfel inträffade!");
    }
  };
  return (
    <div className="">
      <Header />
      <div className="h-screen flex justify-center items-center bg-background font-sans  ">
        <form className="w-full max-w-md bg-secondary p-6 runded-lg shadow-md flex flex-col items-center space-y-4">
          <label className="text-lg font-semibold">Registrera en ny elev</label>
          <label className="mb-2 text-lg font-semibold">Namn:</label>
          <input
            className="mb-4 p-2 w-full max-w-xs border rounded-md"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          ></input>
          <label className="mb-2 text-lg font-semibold">Användarnamn:</label>
          <input
            // ref={emailInputRef}
            className="mb-4 p-2 w-full max-w-xs border rounded-md"
            type="email"
            value={formData.userName}
            onChange={(e) =>
              setFormData({ ...formData, userName: e.target.value })
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

export default CreateStudentAccount;
