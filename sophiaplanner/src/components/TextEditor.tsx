import { useContext, useRef, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { AuthContext } from "../context/AuthContext";
import API_BASE_URL from "../../config/vercel-config";

export const TextEditor = () => {
  const [content, setContent] = useState<string>(""); // Textinnehållet
  const [title, setTitle] = useState<string>(""); // Titel
  const { user } = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // Modal state

  const quillRef = useRef<ReactQuill>(null); // Ref för ReactQuill
  const userId = user?.id;
  // Hantera textförändringar i Quill
  const handleChange = (value: string) => {
    setContent(value);
  };

  const createLessonPlan = async (title: string, content: string) => {
    if (!userId) {
      alert("User is not authenticated.");
      return;
    }

    const bearerToken = localStorage.getItem("idToken");
    console.log("bearerToken", bearerToken);

    try {
      const response = await fetch(`${API_BASE_URL}/createLessonplan`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${bearerToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content, userId }),
      });
      const data = await response.json();
      if (response.ok) {
        alert("Lesson plan created successfully!");
        return data.lessonId; // Returnerar lessonId till nästa steg
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error creating lesson plan:", error);
      alert("Failed to create lesson plan.");
    }
  };

  const handleSaveLessonPlan = () => {
    if (!title) {
      alert("Title are required.");
      return;
    }
    createLessonPlan(title, content);
  };
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div>
      <div className="flex bg-gray-50 min-h-screen p-5">
        {/* Vänster sektion: Editorn */}
        <div className="w-3/4 pr-4">
          <input
            type="text"
            placeholder={"Titel på dokumentet"}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full mb-4 p-2 border border-gray-300 rounded"
          />
          <ReactQuill
            ref={quillRef}
            theme="snow"
            value={content}
            onChange={handleChange}
            placeholder="Skriv din text här..."
            className="h-[600px] bg-white border border-gray-300 rounded shadow-sm"
          />

          <button
            onClick={openModal}
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Förhandsgranska & Spara
          </button>
        </div>

        {/* Höger sektion: Timer */}
        <div className="w-1/4 bg-white border border-gray-300 rounded shadow-sm p-4">
          <h3 className="text-lg font-semibold mb-2 text-gray-800">Verktyg</h3>
        </div>
      </div>

      {/* Modal för förhandsgranskning */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-3/5 p-6">
            <h2 className="text-2xl font-bold mb-4">
              {title || "Ingen titel angiven"}
            </h2>
            <div className="quill-preview">
              <div
                className="ql-container ql-snow border border-gray-300 p-4 rounded bg-gray-50 min-h-[300px] prose"
                dangerouslySetInnerHTML={{ __html: content }}
              ></div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={closeModal}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded mr-2"
              >
                Stäng
              </button>
              <button
                onClick={() => {
                  closeModal();
                  handleSaveLessonPlan();
                  // alert("Dokumentet har sparats!");
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                Bekräfta & Spara
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
