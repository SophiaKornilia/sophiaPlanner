
import { useEffect, useState } from "react";
import { interval, switchMap, from } from "rxjs";
import API_BASE_URL from "../../config/vercel-config";

interface LessonPlan {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export const StudentLessonPlans = () => {
  const [lessonPlans, setLessonPlans] = useState<LessonPlan[]>([]); // Håller alla lektionsplaner
  const [loading, setLoading] = useState<boolean>(true); // Håller laddningsstatus
  const [error, setError] = useState<string | null>(null); // Håller eventuella felmeddelanden
  const [selectedLessonPlan, setSelectedLessonPlan] = useState<LessonPlan | null>(null); // Håller vald lektionsplan

  useEffect(() => {
    // Hämta session-id från localStorage
    const sessionId = localStorage.getItem("sessionId");
    if (!sessionId) {
      setError("Session ID saknas. Logga in igen.");
      setLoading(false);
      return;
    }

    // Funktion för att hämta lektionsplaner med async/await och try/catch
    const fetchLessonPlans = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/getStudentLessonPlans`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "session-id": sessionId,
          },
        });

        if (!response.ok) {
          throw new Error("Kunde inte hämta planeringar");
        }

        const data = await response.json();
        return data.lessonPlans; // Returnerar planerna
      } catch (err) {
        console.error("Error fetching lesson plans:", err);
        setError("Något gick fel. Försök igen senare.");
        return []; // Returnerar tom array vid fel
      }
    };

    // Skapar en RxJs Observable som triggar var 10:e sekund
    const subscription = interval(10000) // Uppdatering var 10:e sekund
      .pipe(
        switchMap(() => from(fetchLessonPlans())) // Anropar API:t och returnerar en Observable
      )
      .subscribe((plans) => {
        setLessonPlans(plans); // Uppdaterar state med nya lektionsplaner
        setLoading(false); // Stoppar laddningsstatus
      });

    return () => subscription.unsubscribe(); // Rensar prenumerationen när komponenten avmonteras
  }, []); // Körs endast vid första renderingen

  // Funktion för att öppna en vald lektionsplan
  const openLessonPlan = (plan: LessonPlan) => {
    setSelectedLessonPlan(plan);
  };

  // Funktion för att stänga modalen
  const closeLessonPlan = () => {
    setSelectedLessonPlan(null);
  };

  // Renderar laddningsmeddelande om data laddas
  if (loading) return <p>Loading lesson plans...</p>;

  // Renderar felmeddelande om något gått fel
  if (error) return <p>Error: {error}</p>;

  // Renderar lektionsplanerna
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

      {/* Modal för att visa vald lektionsplan */}
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
