import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import API_BASE_URL from "../../config/vercel-config";

interface student {
  name: string;
  userName: string;
  password: string;
  role: string;
  teacherId: string;
  group?: string;
}

export const CreateStudent = () => {
  const { user } = useContext(AuthContext);

  const [password, setPassword] = useState<string>("");
  const [passwordRepeat, setPasswordRepeat] = useState<string>("");

  const navigate = useNavigate();

  const [formData, setFormData] = useState<student>({
    name: "",
    userName: "",
    password: "",
    role: "student",
    teacherId: user?.id || "",
  });

  useEffect(() => {
    if (user?.id) {
      setFormData((prev) => ({ ...prev, teacherID: user.id }));
    }
  }, [user?.id]);

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

    const bearerToken = localStorage.getItem("idToken");
    console.log("bearerToken", bearerToken);

    try {
      const response = await fetch(`${API_BASE_URL}/registerStudent`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${bearerToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFormData),
      });

      if (response.status === 401) {
        alert("Du måste logga in för att ha tillgång!");
        navigate("/loginPage"); // Navigera till inloggningssidan
        return;
      }

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
      <div className="h-screen flex justify-center items-center bg-background font-sans  ">
        <form className="w-full max-w-md bg-secondary p-6 runded-lg shadow-md flex flex-col items-center space-y-4">
          <label className="text-lg font-semibold">Registrera en ny elev</label>

          <div className="mb-4 w-full max-w-xs">
            <label className="mb-2 text-lg font-semibold">Namn:</label>
            <input
              className="p-2 w-full border rounded-md"
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          <div className="mb-4 w-full max-w-xs">
            <label className="mb-2 text-lg font-semibold">Användarnamn:</label>
            <input
              className="p-2 w-full border rounded-md"
              type="text"
              value={formData.userName}
              onChange={(e) =>
                setFormData({ ...formData, userName: e.target.value })
              }
              required
            />
          </div>

          <div className="mb-4 w-full max-w-xs">
            <label className="mb-2 text-lg font-semibold">
              Lösenord (minst 6 karaktärer):
            </label>
            <input
              className="p-2 w-full border rounded-md"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="mb-4 w-full max-w-xs">
            <label className="mb-2 text-lg font-semibold">
              Upprepa lösenord:
            </label>
            <input
              className="p-2 w-full border rounded-md"
              type="password"
              value={passwordRepeat}
              onChange={(e) => setPasswordRepeat(e.target.value)}
              required
            />
          </div>

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
