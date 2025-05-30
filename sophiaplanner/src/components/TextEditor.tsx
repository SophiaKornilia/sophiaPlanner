import { useContext, useRef, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { AuthContext } from "../context/AuthContext";
import API_BASE_URL from "../../config/vercel-config";
import { ShowStudents } from "./ShowStudents";
import { useStudentContext } from "../context/StudentContext";

export const TextEditor = () => {
  const [content, setContent] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const { user } = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { selectedStudents } = useStudentContext();
  const [isSaveModalOpen, setIsSaveModalOpen] = useState<boolean>(false);
  const [alertModal, setAlertModal] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const quillRef = useRef<ReactQuill>(null);
  const userId = user?.id;
  const [saveModalText, setSaveModalText] = useState<string>("");
  const [saveModalTitle, setSaveModalTitle] = useState<string>("");
  const [hasError, setHasError] = useState(false);
  const [actionToRun, setActionToRun] = useState("");

  console.log(error);
  // Hanterar textförändringar i Quill-editorn
  // Uppdaterar "content"-state med det nya innehållet från editorn.
  const handleChange = (value: string) => {
    setContent(value.trim());
  };

  //Skapar en lektionsplanering med titel och innehåll
  const createLessonPlan = async (title: string, content: string) => {
    if (!userId) {
      setError("User is not authenticated.");
      //katodo navigare to start??
      return;
    }

    const bearerToken = localStorage.getItem("idToken");
   

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
        setError("Lesson plan created successfully!");
        return { lessonId: data.lessonId, authorId: data.userId };
      } else if (response.status === 409) {
        setSaveModalTitle("Ojdå!");
        setSaveModalText("Det finns redan en planering med denna titel!");
        setAlertModal(true);
        setError(data.error);
      } else {
        setError(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error creating lesson plan:", error);
      setError("Failed to create lesson plan.");
    }
  };

  // Sparar en lektionsplanering som ett utkast.
  const createLessonPlanDraft = async (title: string, content: string) => {
  
    if (!userId) {
      setError("User is not authenticated.");
      //katodo navigare to start??
      return;
    }

    const bearerToken = localStorage.getItem("idToken");
 

    try {
      const response = await fetch(`${API_BASE_URL}/createLessonplanDraft`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${bearerToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content, userId }),
      });
      const data = await response.json();
      if (response.ok) {
        setError("Lessonplandraft was created successfully!");
        return data.lessonId;
      } else if (response.status === 409) {
        setSaveModalTitle("Ojdå!");
        setSaveModalText("Det finns redan ett utkast med denna titel!");
        setAlertModal(true);
        setError(data.error);
      } else {
        setError(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error creating lesson plan draft:", error);
      setError("Failed to create lesson plan draft.");
    }
  };

  // Tilldelar en lektionsplanering till valda elever.
  const createStudentLessonplan = async (
    lessonId: string,
    studentIds: string[],
    authorId: string
  ) => {
    if (selectedStudents.length === 0) {
      setSaveModalTitle("Ojdå!");
      setSaveModalText("Du måste välja elever vid publicering!");
      setAlertModal(true);
      return;
    }

    try {
      const bearerToken = localStorage.getItem("idToken");

      if (!bearerToken) {
        setSaveModalTitle("Ojdå!");
        setSaveModalText("Du måste vara inloggad för att skapa en planering!");
        setAlertModal(true);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/createStudentLessonplan`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${bearerToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lessonId,
          studentIds,
          authorId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        closeModal();
        setSaveModalTitle("Bekräftelse!");
        setSaveModalText("Din lektionsplanering är skapad!");
        setAlertModal(true);
        console.log("Student lesson plans created successfully:", data);
      } else {
        closeModal();
        setSaveModalTitle("Något gick fel!");
        setSaveModalText(
          data?.error || "Din lektionsplanering kunde inte skapas, testa igen!"
        );
        console.error("Error response from server:", data);
        setAlertModal(true);
      }
    } catch (error) {
      console.error("Error publishing lesson plan:", error);
      setSaveModalTitle("Något gick fel!");
      setSaveModalText("Ett nätverksfel inträffade, försök igen!");
      setAlertModal(true);
    }
  };

  // Hanterar publicering av en lektionsplanering.
  const handlePublishLessonplan = async () => {
    if (!title || !content) {
      setSaveModalTitle("Ojdå!");
      setSaveModalText(
        "Titel och innehåll behövs för att spara lektionsplaneringen!"
      );
      setAlertModal(true);
      closeModal();
      return;
    }

    if (selectedStudents.length === 0) {
      setSaveModalTitle("Ojdå!");
      setSaveModalText("Du måste välja elever vid publicering!");
      setAlertModal(true);
      return;
    }

    try {
      // Skapa lessonplan först och få dess lessonId
      const lessonPlanData = await createLessonPlan(title, content);

      if (!lessonPlanData) {
        setSaveModalTitle("Fel!");
        setSaveModalText("Lektionsplanen kunde inte skapas.");
        setAlertModal(true);
        return;
      }

      const { lessonId, authorId } = lessonPlanData;
      await createStudentLessonplan(lessonId, selectedStudents, authorId);
    

      setSaveModalTitle("Bekräftelse!");
      setSaveModalText(
        "Din lektionsplanering har publicerats och eleverna har tilldelats!"
      );
      setAlertModal(true);
      closeModal();
    } catch (error) {
      console.error("Error handling publish lesson plan:", error);
      setSaveModalTitle("Något gick fel!");
      setSaveModalText("Ett fel inträffade under publiceringen, försök igen!");
      setAlertModal(true);
    }
  };

  // Validerar om innehåll och titel är ifyllda innan modal öppnas.
  const checkContent = () => {
    if (!title.trim() || !content.trim()) {
      setHasError(true);
      return;
    }
    setHasError(false);
    openModal();
  };

  // Hanterar bekräftelseknappen för att spara utkast.
  const handleConfirmClick = async () => {
    switch (actionToRun) {
      case "SaveToDraft":
        try {
          await createLessonPlanDraft(title, content);
        } catch (error) {
          console.log("couldnt create draft");
        }

        break;
      default:
        console.log("No action to run.");
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-primary to-background font-sans p-4">
      {/* Rubrik */}
      <div className="mb-6 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-text">
          Skapa din planering
        </h1>
        <p className="text-lg text-text-light">
          Fyll i innehållet och tilldela planeringen till elever.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Vänster sektion: Editorn */}
        <div className="flex-grow bg-white p-4 md:p-6 rounded-lg shadow-md">
          <input
            type="text"
            placeholder="Titel på dokumentet"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`w-full mb-4 p-3 border rounded text-lg ${
              hasError && !title.trim() ? "border-red-500" : "border-gray-300"
            }`}
          />
          <ReactQuill
            ref={quillRef}
            theme="snow"
            value={content}
            onChange={handleChange}
            placeholder="Skriv din text här..."
            className={`h-[300px] md:h-[500px] bg-white border rounded shadow-sm ${hasError && !content.trim() ? "border-red-500" : "border-gray-300"}`}
          />
          <button
            onClick={checkContent}
            className="mt-16 bg-accent text-white font-semibold px-4 py-2 rounded-lg shadow hover:bg-accent-light transition-all duration-300"
          >
            Förhandsgranska & Spara
          </button>
        </div>

        {/* Höger sektion: Elever */}

        <div className="w-full md:w-1/3 bg-white p-4 md:p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800">Tilldela elever</h3>
            <div className="relative group ml-2">
              <span className="flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-gray-400 rounded-full cursor-pointer">
                i
              </span>
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 hidden group-hover:block bg-gray-800 text-white text-sm rounded-md px-4 py-2 shadow-lg w-64 text-center">
                Här väljer du de elever du vill tilldela planeringen.
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 transform rotate-45"></div>
              </div>
            </div>
          </div>
          <div className="max-h-[500px] overflow-y-auto">
            <ShowStudents />
          </div>
        </div>
      </div>

      {/* Modal för förhandsgranskning */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center ">
          <div className="bg-white rounded-lg shadow-lg w-4/5 md:w-3/5 p-6 flex flex-col">
            <h2 className="text-2xl font-bold mb-4">
              {title || "Ingen titel angiven"}
            </h2>
            <div className="flex flex-col md:flex-row gap-6">
              {/* Text-innehåll */}
              <div className="flex-grow quill-preview">
                <div
                  className="ql-container ql-snow border border-gray-300 p-4 rounded bg-gray-50 min-h-[200px]"
                  dangerouslySetInnerHTML={{ __html: content }}
                ></div>
              </div>

              {/* Valda elever */}
              <div className="w-full md:w-1/3 bg-gray-50 border border-gray-300 p-4 rounded">
                <h3 className="text-lg font-semibold">Tilldelade elever:</h3>
                {selectedStudents.length === 0 ? (
                  <p className="text-gray-600 mt-2">Inga elever valda.</p>
                ) : (
                  <ul className="mt-2">
                    {selectedStudents.map((studentId) => (
                      <li
                        key={studentId}
                        className="py-1 border-b border-gray-200 last:border-none"
                      >
                        {studentId}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
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
                  console.log("save to draft");

                  setActionToRun("SaveToDraft");
                  setSaveModalTitle("Spara planering till utkast");
                  setSaveModalText(
                    "Planeringen sparas till utkast och kommer inte kopplas till någon elev."
                  );
                  setIsSaveModalOpen(true);
                }}
                className="bg-secondary hover:bg-blue-600 text-white px-4 py-2 rounded mr-2"
              >
                Spara till utkast
              </button>
              <button
                onClick={() => {
                  handlePublishLessonplan();
                }}
                className="bg-accent text-white px-4 py-2 rounded"
              >
                Bekräfta & Publicera
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal för varning för sparaknappen */}
      {isSaveModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center ">
          <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-lg p-6 mx-4 md:mx-0">
            <h3 className="text-xl font-bold mb-4 text-center md:text-left">
              {saveModalTitle}
            </h3>
            <p className="mb-6 text-gray-700 text-center md:text-left">
              {saveModalText}
            </p>
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <button
                onClick={() => {
                  setIsSaveModalOpen(false);
                  closeModal();
                }}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded w-full md:w-auto"
              >
                Avbryt
              </button>
              <button
                onClick={() => {
                  console.log("confirm draft ");

                  handleConfirmClick();
                  setIsSaveModalOpen(false);
                  closeModal();
                }}
                className="bg-accent hover:bg-text text-white px-4 py-2 rounded w-full md:w-auto"
              >
                Bekräfta
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal för varningar */}
      {alertModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-lg p-6 mx-4 md:mx-0">
            <h3 className="text-xl font-bold mb-4 text-center md:text-left">
              {saveModalTitle}
            </h3>
            <p className="mb-6 text-gray-700 text-center md:text-left">
              {saveModalText}
            </p>
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <button
                onClick={() => {
                  setAlertModal(false);
                }}
                className="bg-accent hover:bg-text text-white px-4 py-2 rounded w-full md:w-auto"
              >
                Bekräfta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
