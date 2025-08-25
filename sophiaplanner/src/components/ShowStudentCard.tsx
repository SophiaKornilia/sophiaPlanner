import { useContext, useEffect, useState } from "react";
import { useStudentContext } from "../context/StudentContext";
import { AuthContext } from "../context/AuthContext";
import API_BASE_URL from "../../config/vercel-config";

interface Student {
  id: string;
  userName: string;
  name: string;
}

// Komponent för att visa en lista över elever och deras detaljer
export const ShowStudentCard = () => {
  const { user } = useContext(AuthContext);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { selectedStudent, setSelectedStudent } = useStudentContext();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Hämta lärarens ID från AuthContext
  const teacherId = user?.id;
  console.log("error", error);

  // useEffect för att hämta elever från API
  useEffect(() => {
    if (!user) {
      console.log("User is not authenticated yet.");
      return; // Vänta tills användarinformation är tillgänglig
    }

    if (!teacherId) {
      setError("Teacher ID is missing");
      setLoading(false);
      return;
    }
    // Hämta JWT-token för autentisering
    const bearerToken = localStorage.getItem("idToken");
    if (!bearerToken) {
      setError("Authentication token is missing");
      setLoading(false);
      return;
    }

    //skicka GET förfrågan till backend för att hämta elever kopplade till läraren
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
          if (data.students && data.students.length === 0) {
            setStudents([]);
            setError(null);
          } else {
            setStudents(data.students);
            setError(null);
          }
        } else {
       
          if (data.message === "No students found for this teacher.") {
            setStudents([]);
            setError(null);
          }
          setError(data.message || "Failed to fetch students");
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

  // Om användaren inte är inloggad, visa ett meddelande
  if (!user) {
    console.error("User is not authenticated.");
    return <p>Please log in to view this page.</p>;
  }

  if (loading) return <p>Loading students...</p>;

  return (
    <div className="bg-secondary p-6 rounded-lg  w-full h-full max-h-[400px] flex flex-col md:max-h-[500px]">
      <div className="flex items-start gap-2">
        <h2 className="text-2xl font-bold text-text mb-4">Mina elever</h2>
        <div className="relative group ml-2">
          <button
            type="button"
            onClick={() => setIsTooltipVisible(!isTooltipVisible)}
            className=" mt-2 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-gray-400 rounded-full cursor-pointer "
          >
            i
          </button>

          <div
            className={`absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-gray-800 text-white text-sm rounded-md px-4 py-2 shadow-lg w-64 text-center ${
              isTooltipVisible ? "block" : "hidden"
            } group-hover:block`}
          >
            Nedan ser du alla dina elever. Du registrerar nya elever under
            "skapa elevkonto".
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 transform rotate-45"></div>
          </div>
        </div>
      </div>

      {students.length === 0 ? (
        <p className=" text-text">
          Inga elever hittades. Lägg till elever för att komma igång!.
        </p>
      ) : (
        <ul className="overflow-y-auto max-h-[300px] space-y-2">
          {students.map((student) => (
            <li
              key={student.id}
              className={`bg-primary text-white p-4 rounded-md shadow hover:bg-opacity-90 transition duration-300 cursor-pointer font-bold hover:bg-accent contrast-more:text-highContrastText`}
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

      {/* Modal för elevinformation */}
      {isModalOpen && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-primary rounded-lg p-6 w-full max-w-md mx-4 shadow-lg overflow-y-auto">
            <h2 className="text-2xl font-bold text-white mb-4 text-center">
              Elevinformation
            </h2>
            <p className="text-lg text-white">
              <strong>Namn:</strong> {selectedStudent.name}
            </p>
            <p className="text-lg text-white mt-2">
              <strong>Användarnamn:</strong> {selectedStudent.userName}
            </p>
            <button
              onClick={closeModal}
              className="mt-6 bg-secondary text-white w-full py-2 rounded hover:bg-accent hover:text-white transition"
            >
              Stäng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
