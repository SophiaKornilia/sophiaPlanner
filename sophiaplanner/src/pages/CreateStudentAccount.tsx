import { useContext, useEffect, useState } from "react";
import { Header } from "../components/Header";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import API_BASE_URL from "../../config/vercel-config";
// import { useNavigate } from "react-router-dom";

interface student {
  name: string;
  userName: string;
  password: string;
  role: string;
  teacherId: string;
  group?: string;
}

// interface Group {
//   groupName: string;
// }
const CreateStudentAccount = () => {
  const { user } = useContext(AuthContext);

  const [password, setPassword] = useState<string>("");
  const [passwordRepeat, setPasswordRepeat] = useState<string>("");
  // const [groups, setGroups] = useState<Group[]>([]);
  const navigate = useNavigate();

  const [formData, setFormData] = useState<student>({
    name: "",
    userName: "",
    password: "",
    role: "student",
    teacherId: user?.id || "",
    // teacherID: user?.uid || "",
  });

  useEffect(() => {
    if (user?.id) {
      setFormData((prev) => ({ ...prev, teacherID: user.id }));
    }
  }, [user?.id]);

  // const checkGroups = useCallback(async () => {
  //   try {
  //     const response = await fetch(
  //       "http://localhost:3000/api/users/getGroups",
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         // body: JSON.stringify({ teacherId: user?.uid }),
  //       }
  //     );

  //     if (response.ok) {
  //       const data = await response.json();
  //       setGroups(data.groups);
  //       console.log("Groups found successfully!", data);
  //     } else {
  //       console.error("Failed to fetch groups");
  //     }
  //   } catch (error) {
  //     console.error("Hittade inga grupper", error);
  //   }
  // }, [user?.id]);

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
      const response = await fetch(`${API_BASE_URL}/registerStudent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFormData),
      });

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

  // useEffect(() => {
  //   if (user?.id) {
  //     checkGroups();
  //   }
  // }, [user, checkGroups]);

  return (
    <div className="">
      <Header />
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

          {/* {groups.length > 0 ? (
            <div className="mb-4 w-full max-w-xs">
              <label className="mb-2 text-lg font-semibold">Grupp:</label>
              <select
                className="p-2 w-full border rounded-md"
                onChange={(e) => console.log("Selected group:", e.target.value)}
              >
                <option value="">Ingen grupp</option>
                {groups.map((group) => (
                  <option key={group.groupName} value={group.groupName}>
                    {group.groupName}
                  </option>
                ))}
              </select>
            </div>
          ) : null} */}

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
