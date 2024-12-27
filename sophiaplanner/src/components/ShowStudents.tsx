import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import API_BASE_URL from "../../config/vercel-config";
import { useStudentContext } from "../context/StudentContext";

interface Student {
  id: string;
  userName: string;
  name: string;
}
export const ShowStudents = () => {
  const { user } = useContext(AuthContext);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { selectedStudents, setSelectedStudents } = useStudentContext();

  const teacherId = user?.id;
  console.log(error);
  
  // Hämta elever från API
  useEffect(() => {
    if (!user) {
      console.log("User is not authenticated yet.");
      return; // Vänta tills `user` är satt
    }

    if (!teacherId) {
      setError("Teacher ID is missing");
      setLoading(false);
      return;
    }
    const bearerToken = localStorage.getItem("idToken");
    console.log("bearerToken", bearerToken);
    if (!bearerToken) {
      setError("Authentication token is missing");
      setLoading(false);
      return;
    }

    const fetchStudents = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/getStudent?teacherId=${teacherId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${bearerToken}`,
            },
          }
        );

        const data = await response.json();

        if (response.ok) {
          setStudents(data.students);
        } else {
          setError(data.error || "Failed to fetch students");
        }
      } catch (err) {
        console.error("Fetch students error:", err);
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [teacherId]);

  if (!user) {
    console.error("User is not authenticated.");
    return <p>Please log in to view this page.</p>;
  }

  // Rendera innehållet
  if (loading) return <p>Loading students...</p>;

  const toggleStudentSelection = (studentId: string) => {
    setSelectedStudents((prevSelected) =>
      prevSelected.includes(studentId)
        ? prevSelected.filter((id) => id !== studentId)
        : [...prevSelected, studentId]
    );
  };

  return (
    <div>
      {students.length === 0 ? (
        <p>Inga elever hittades. Lägg till elever för att komma igång!.</p>
      ) : (
        <ul>
          {students.map((student) => (
            <li
              key={student.id}
              className={`cursor-pointer p-2 ${
                selectedStudents.includes(student.id)
                  ? "font-bold bg-blue-100"
                  : ""
              }`}
              onClick={() => toggleStudentSelection(student.id)}
            >
              {student.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
