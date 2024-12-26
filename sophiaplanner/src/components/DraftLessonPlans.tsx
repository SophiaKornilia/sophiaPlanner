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

  console.log("userid", user?.id);

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
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="bg-secondary p-6 rounded-lg  w-full h-full max-h-[400px] flex flex-col">
      <h1 className="text-2xl font-bold text-text mb-4">Mina utkast</h1>
      {lessonPlans.length === 0 ? (
        <p className="text-text text-center">Inga utkast hittades.</p>
      ) : (
        <ul className="overflow-y-auto max-h-[300px] space-y-2">
          {lessonPlans.map((lesson) => (
            <li
              key={lesson.id}
              className="bg-primary text-white p-4 rounded-md shadow  transition duration-300 "
            >
              <h4 className="text-lg font-semibold">{lesson.title}</h4>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
