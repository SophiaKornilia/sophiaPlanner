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

// Komponent för att visa och hantera elevens lektionsplaner
export const StudentLessonPlans = () => {
  const [lessonPlans, setLessonPlans] = useState<LessonPlan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLessonPlan, setSelectedLessonPlan] =
    useState<LessonPlan | null>(null);

  // Funktion för att hämta lektionsplaner
  const fetchLessonPlans = async () => {
    const sessionId = localStorage.getItem("sessionId");
    if (!sessionId) {
      setError("Session ID saknas. Logga in igen.");
      setLoading(false);
      return [];
    }

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
      return data.lessonPlans;
    } catch (err) {
      console.error("Error fetching lesson plans:", err);
      setError("Något gick fel. Försök igen senare.");
      return [];
    }
  };

  // useEffect för att hantera hämtning och uppdatering av lektionsplaner
  useEffect(() => {
    const loadInitialLessonPlans = async () => {
      const plans = await fetchLessonPlans();
      setLessonPlans(plans);
      setLoading(false);
    };
    loadInitialLessonPlans();

    // Skapa en RxJS Observable för uppdateringar var 10:e sekund
    const subscription = interval(10000)
      .pipe(switchMap(() => from(fetchLessonPlans())))
      .subscribe((plans) => {
        setLessonPlans(plans); // Uppdaterar state med nya lektionsplaner
        setLoading(false);
      });

    return () => subscription.unsubscribe(); // Rensar prenumerationen
  }, []); // Körs endast vid första renderingen

  // Funktion för att öppna en vald lektionsplan
  const openLessonPlan = (plan: LessonPlan) => {
    setSelectedLessonPlan(plan);
  };

  const closeLessonPlan = () => {
    setSelectedLessonPlan(null);
  };

  // Renderar laddningsmeddelande om data laddas
  if (loading) return <p>Loading lesson plans...</p>;

  // // Renderar felmeddelande om något gått fel
  // if (error) return <p>Error: {error}</p>;
  console.log(error);

  // Renderar lektionsplanerna
  return (
    <div className="p-4">
      {/* Välkomsttext */}
      <div className="bg-secondary text-text p-4 rounded-lg shadow-md mb-6">
        <h1 className="text-3xl font-bold mb-2 text-center  contrast-more:text-highContrastText">
          Välkommen!
        </h1>
        <p className="text-lg text-text contrast-more:text-highContrastText">
          Här hittar du alla lektionsplaneringar som dina lärare har tilldelat
          dig. Klicka på en planering för att öppna och läsa den. Se till att
          följa instruktionerna i varje planering och fråga din lärare om du har
          några frågor.
        </p>
      </div>

      {/* Planeringslista */}
      <h2 className="text-2xl font-bold text-primary mb-4 text-center md:text-left contrast-more:text-highContrastText">
        Dina Planeringar
      </h2>

      {lessonPlans.length === 0 ? (
        <p className="text-gray-600 text-center">Inga planeringar hittades.</p>
      ) : (
        <ul className="space-y-3 max-h-[400px] overflow-y-scroll border rounded-md bg-secondary p-4 shadow-md ">
          {lessonPlans.map((plan) => (
            <li
              key={plan.id}
              className="p-4 bg-primary text-white rounded-lg shadow hover:shadow-lg hover:bg-secondary hover:text-black transition-all cursor-pointer contrast-more:text-highContrastText"
              onClick={() => openLessonPlan(plan)}
            >
              <h4 className="text-lg font-semibold">{plan.title}</h4>
            </li>
          ))}
        </ul>
      )}

      {/* Modal för att visa vald lektionsplan */}
      {selectedLessonPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-11/12 max-w-3xl max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-primary mb-4 text-center">
              {selectedLessonPlan.title}
            </h2>
            <div
              className="prose text-gray-800"
              dangerouslySetInnerHTML={{ __html: selectedLessonPlan.content }}
            ></div>
            <div className="mt-6 flex justify-end">
              <button
                className="bg-accent text-white px-6 py-2 rounded-lg hover:bg-accent-light transition-all"
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
