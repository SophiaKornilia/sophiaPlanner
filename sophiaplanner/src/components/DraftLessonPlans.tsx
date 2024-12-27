import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import API_BASE_URL from "../../config/vercel-config";

interface LessonPlan {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export const DraftLessonPlans = () => {
  const { user } = useContext(AuthContext);
  const [lessonPlans, setLessonPlans] = useState<LessonPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLessonPlan, setSelectedLessonPlan] =
    useState<LessonPlan | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  console.log("userid", user?.id);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    if (!user) {
      console.log("User is not authenticated yet.");
      return; // Vänta tills `user` är satt
    }

    const fetchLessonPlans = async () => {
      const bearerToken = localStorage.getItem("idToken");

      if (!user?.id) {
        setError("User is not authenticated.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${API_BASE_URL}/getLessonplan?authorId=${user.id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${bearerToken}`,
            },
          }
        );

        const data = await response.json();

        if (response.ok) {
          setLessonPlans(data.lessonplans);
        } else {
          setError(data.error || "Failed to fetch lesson plans.");
        }
      } catch (err) {
        console.error("Error fetching lesson plans:", err);
        setError("Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchLessonPlans();
  }, [user?.id]);

  if (loading) return <p>Loading...</p>;
  // if (error) return <p>Error: {error}</p>;

  console.log("selected plan", selectedLessonPlan);

  const formatDate = (timestamp: any) => {
    if (timestamp?._seconds) {
      return new Date(timestamp._seconds * 1000).toLocaleString(); // Om Firebase Timestamp
    }
    return timestamp; // Om redan en sträng
  };

  return (
    <div className="bg-secondary p-6 rounded-lg  w-full h-full max-h-[400px] flex flex-col">
      <h1 className="text-2xl font-bold text-text mb-4">
        Mina lektionsplaneringar
      </h1>
      {lessonPlans.length === 0 ? (
        <p className="text-text">Inga planeringar hittades.</p>
      ) : (
        <ul className="overflow-y-auto max-h-[300px] space-y-2">
          {lessonPlans.map((lesson) => (
            <li
              key={lesson.id}
              className="bg-primary text-white p-4 rounded-md shadow  transition duration-300 cursor-pointer hover:bg-accent"
              onClick={() => {
                setSelectedLessonPlan(lesson);
                openModal();
              }}
            >
              <h4 className="text-lg font-semibold">{lesson.title}</h4>
            </li>
          ))}
        </ul>
      )}
      {/* Modal för elevinformation */}
      {/* Katodo: lägg till en radera och ändra knapp */}
      {isModalOpen && selectedLessonPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-primary rounded-lg p-6 w-full max-w-md mx-4 shadow-lg overflow-y-auto">
            <h2 className="text-2xl font-bold text-white mb-4 text-center">
              Elevinformation
            </h2>
            <p className="text-lg text-white">
              <strong>Titel:</strong> {selectedLessonPlan.title}
            </p>
            <p className="text-lg text-white mt-2">
              <strong>Skapad:</strong>{" "}
              {formatDate(selectedLessonPlan.createdAt)}
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
