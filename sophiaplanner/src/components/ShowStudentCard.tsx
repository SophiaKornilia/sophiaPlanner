import { useContext, useEffect, useState } from "react";
import { useStudentContext } from "../context/StudentContext";
import { AuthContext } from "../context/AuthContext";
import API_BASE_URL from "../../config/vercel-config";

interface Student {
  id: string;
  userName: string;
  name: string;
}

export const ShowStudentCard = () => {
  const { user } = useContext(AuthContext);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const {
    selectedStudent,
    setSelectedStudent,
    selectedStudents,
    setSelectedStudents,
  } = useStudentContext();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const teacherId = user?.id;
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

  if (loading) return <p>Loading students...</p>;
  if (error) return <p>Error: {error}</p>;

  const toggleStudentSelection = (studentId: string) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  return (
    <div>
      {students.length === 0 ? (
        <p className="text-center text-text">Inga elever hittades.</p>
      ) : (
        <ul className="overflow-y-auto max-h-60 bg-primary p-2 rounded-md">
          {students.map((student) => (
            <li
              key={student.id}
              className={`cursor-pointer p-2 mb-1 rounded hover:bg-secondary hover:text-white ${
                selectedStudents.includes(student.id)
                  ? "bg-accent text-white"
                  : "text-text font-bold"
              }`}
              onClick={() => {
                setSelectedStudent(student);
                openModal();
              }}
            >
              {student.name}
            </li>
          ))}
        </ul>
      )}
      {isModalOpen && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm mx-4 shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-center text-primary">
              Elevinformation
            </h2>
            <p className="text-base text-gray-700">
              <strong>Namn:</strong> {selectedStudent.name}
            </p>
            <p className="text-base text-gray-700">
              <strong>Användarnamn:</strong> {selectedStudent.userName}
            </p>
            <button
              onClick={closeModal}
              className="mt-6 bg-accent text-white w-full py-2 rounded hover:bg-accent-light"
            >
              Stäng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
