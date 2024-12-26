import { useContext, useRef, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { AuthContext } from "../context/AuthContext";
import API_BASE_URL from "../../config/vercel-config";
import { ShowStudents } from "./ShowStudents";
import { useStudentContext } from "../context/StudentContext";

export const TextEditor = () => {
  const [content, setContent] = useState<string>(""); // Textinnehållet
  const [title, setTitle] = useState<string>(""); // Titel
  const { user } = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // Modal state
  const { selectedStudents } = useStudentContext();
  const [isSaveModalOpen, setIsSaveModalOpen] = useState<boolean>(false);

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

  const handlePublishLessonPlan = async () => {
    if (!title || !content) {
      alert("Title and content are required.");
      return;
    }

    // Skapa lessonplan först och få dess lessonId
    const lessonId = await createLessonPlan(title, content);

    if (!lessonId) {
      alert("Failed to create lesson plan.");
      return;
    }

    if (selectedStudents.length === 0) {
      alert("No students selected for publishing.");
      return;
    }

    // Skicka varje student till /createStudentLessonplan
    try {
      const bearerToken = localStorage.getItem("idToken");
      const response = await fetch(`${API_BASE_URL}/createStudentLessonplan`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${bearerToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lessonId,
          studentIds: selectedStudents,
        }),
      });

      if (response.ok) {
        alert("Lesson plan successfully published to selected students!");
      } else {
        const data = await response.json();
        alert(`Failed to publish lesson plan: ${data.error}`);
      }
    } catch (error) {
      console.error("Error publishing lesson plan:", error);
      alert("Failed to publish lesson plan.");
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
            className="w-full mb-4 p-3 border border-gray-300 rounded text-lg"
          />
          <ReactQuill
            ref={quillRef}
            theme="snow"
            value={content}
            onChange={handleChange}
            placeholder="Skriv din text här..."
            className="h-[300px] md:h-[500px] bg-white border border-gray-300 rounded shadow-sm"
          />
          <button
            onClick={openModal}
            className="mt-16 bg-accent text-white font-semibold px-4 py-2 rounded-lg shadow hover:bg-accent-light transition-all duration-300"
          >
            Förhandsgranska & Spara
          </button>
        </div>

        {/* Höger sektion: Elever */}
        <div className="w-full md:w-1/3 bg-white p-4 md:p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Tilldela elever
          </h3>
          <div className="max-h-[500px] overflow-y-auto">
            <ShowStudents />
          </div>
        </div>
      </div>

      {/* Modal för förhandsgranskning */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
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
                onClick={() => setIsSaveModalOpen(true)}
                className="bg-secondary hover:bg-blue-600 text-white px-4 py-2 rounded mr-2"
              >
                Spara
              </button>
              <button
                onClick={() => {
                  handlePublishLessonPlan();
                  closeModal();
                }}
                className="bg-accent text-white px-4 py-2 rounded"
              >
                Bekräfta & Publicera
              </button>
            </div>
          </div>
        </div>
      )}
    </div>

    // <div>
    //   <div className="flex flex-col bg-gradient-to-b from-primary to-background min-h-screen p-4">
    //     {/* Vänster sektion: Editorn */}
    //     <div className="w-3/4 pr-4">
    //       <input
    //         type="text"
    //         placeholder={"Titel på dokumentet"}
    //         value={title}
    //         onChange={(e) => setTitle(e.target.value)}
    //         className="w-full mb-4 p-2 border border-gray-300 rounded"
    //       />
    //       <ReactQuill
    //         ref={quillRef}
    //         theme="snow"
    //         value={content}
    //         onChange={handleChange}
    //         placeholder="Skriv din text här..."
    //         className="h-[600px] bg-white border border-gray-300 rounded shadow-sm"
    //       />

    //       <button
    //         onClick={openModal}
    //         className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
    //       >
    //         Förhandsgranska & Spara
    //       </button>
    //     </div>

    //     {/* Höger sektion: Elever */}
    //     <div className="w-1/4 bg-white border border-gray-300 rounded shadow-sm p-4">
    //       <h3 className="text-lg font-semibold mb-2 text-gray-800">
    //         Tilldela elever
    //       </h3>
    //       <ShowStudents />
    //     </div>
    //   </div>

    //   {/* Modal för förhandsgranskning */}
    //   {isModalOpen && (
    //     <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
    //       <div className="bg-white rounded-lg shadow-lg w-3/5 p-6 flex flex-col">
    //         <h2 className="text-2xl font-bold mb-4">
    //           {title || "Ingen titel angiven"}
    //         </h2>
    //         <div className="flex">
    //           {/* Text-innehåll */}
    //           <div className="quill-preview flex-grow">
    //             <div
    //               className="ql-container ql-snow border border-gray-300 p-4 rounded bg-gray-50 min-h-[300px] prose"
    //               dangerouslySetInnerHTML={{ __html: content }}
    //             ></div>
    //           </div>

    //           {/* Valda elever */}
    //           <div className="ml-4 w-1/3 bg-gray-50 border border-gray-300 p-4 rounded">
    //             <h3 className="text-lg font-semibold">
    //               Vid publicering tilldelar du denna planering till:
    //             </h3>
    //             {selectedStudents.length === 0 ? (
    //               <p className="text-gray-600 mt-2">Inga elever valda.</p>
    //             ) : (
    //               <ul className="mt-2">
    //                 {selectedStudents.map((studentId) => (
    //                   <li
    //                     key={studentId}
    //                     className="py-1 border-b border-gray-200 last:border-none"
    //                   >
    //                     {studentId}
    //                   </li>
    //                 ))}
    //               </ul>
    //             )}
    //           </div>
    //         </div>

    //         <div className="mt-6 flex justify-end">
    //           <button
    //             onClick={closeModal}
    //             className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded mr-2"
    //           >
    //             Stäng
    //           </button>
    //           {/* Knapp för att bara spara lessonplan */}
    //           <button
    //             // onClick={() => {
    //             //   handleSaveLessonPlan();
    //             //   closeModal();
    //             // }}
    //             onClick={() => setIsSaveModalOpen(true)}
    //             className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded mr-2"
    //           >
    //             Spara
    //           </button>

    //           {/* Knapp för att publicera till elever */}
    //           <button
    //             onClick={() => {
    //               handlePublishLessonPlan();
    //               closeModal();
    //             }}
    //             className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
    //           >
    //             Bekräfta & Publicera
    //           </button>
    //         </div>
    //       </div>
    //     </div>
    //   )}
    //   {/* Modal för att bekräfta spara */}
    //   {isSaveModalOpen && (
    //     <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
    //       <div className="bg-white rounded-lg shadow-lg w-1/3 p-6">
    //         <h3 className="text-lg font-semibold mb-4">Spara planering</h3>
    //         <p className="mb-4">
    //           Planeringen sparas till utkast och kommer inte kopplas till någon
    //           elev.
    //         </p>
    //         <div className="flex justify-end">
    //           <button
    //             onClick={() => setIsSaveModalOpen(false)} // Stäng modalen
    //             className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded mr-2"
    //           >
    //             Avbryt
    //           </button>
    //           <button
    //             onClick={() => {
    //               setIsSaveModalOpen(false); // Stäng modalen
    //               handleSaveLessonPlan(); // Anropa funktionen för att spara
    //             }}
    //             className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
    //           >
    //             Bekräfta
    //           </button>
    //         </div>
    //       </div>
    //     </div>
    //   )}
    // </div>
  );
};
