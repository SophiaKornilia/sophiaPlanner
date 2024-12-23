import { useEffect, useState } from "react";
import API_BASE_URL from "../../config/vercel-config";

interface LessonPlan {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export const StudentLessonPlans = () => {
  const [lessonPlans, setLessonPlans] = useState<LessonPlan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLessonPlan, setSelectedLessonPlan] = useState<LessonPlan | null>(null);

  useEffect(() => {
    const fetchLessonPlans = async () => {
      const sessionId = localStorage.getItem("sessionId");

      if (!sessionId) {
        setError("Session ID saknas. Logga in igen.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/getStudentLessonPlans`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "session-id": sessionId,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setLessonPlans(data.lessonPlans);
        } else {
          const errorData = await response.json();
          setError(errorData.error || "Kunde inte hämta planeringar.");
        }
      } catch (err) {
        console.error("Error fetching lesson plans:", err);
        setError("Något gick fel. Försök igen senare.");
      } finally {
        setLoading(false);
      }
    };

    fetchLessonPlans();
  }, []);

  if (loading) return <p>Loading lesson plans...</p>;
  if (error) return <p>Error: {error}</p>;

  const openLessonPlan = (plan: LessonPlan) => {
    setSelectedLessonPlan(plan);
  };

  const closeLessonPlan = () => {
    setSelectedLessonPlan(null);
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">Dina Planeringar</h2>
      {lessonPlans.length === 0 ? (
        <p>Inga planeringar hittades.</p>
      ) : (
        <ul>
          {lessonPlans.map((plan) => (
            <li
              key={plan.id}
              className="p-2 border rounded cursor-pointer hover:bg-gray-100"
              onClick={() => openLessonPlan(plan)}
            >
              {plan.title}
            </li>
          ))}
        </ul>
      )}

      {/* Modal */}
      {selectedLessonPlan && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-3/5">
            <h2 className="text-xl font-bold mb-4">{selectedLessonPlan.title}</h2>
            <div
              className="prose"
              dangerouslySetInnerHTML={{ __html: selectedLessonPlan.content }}
            ></div>
            <div className="mt-4 flex justify-end">
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded mr-2"
                onClick={closeLessonPlan}
              >
                Stäng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
