import { useRef, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export const TextEditor = () => {
  const [content, setContent] = useState<string>(""); // Textinnehållet
  const [title, setTitle] = useState<string>(""); // Titel
  //   const [timers, setTimers] = useState<string[]>([]); // Lista med timers
  //   const [timerInput, setTimerInput] = useState<number>(0); // Input för minuter
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // Modal state

  const quillRef = useRef<ReactQuill>(null); // Ref för ReactQuill

  //   const [editorInstance, setEditorInstance] = useState<any>(null); // Quill-instans

  //   useEffect(() => {
  //     if (quillRef.current) {
  //       const editor = quillRef.current.getEditor(); // Hämta Quill-editor
  //       if (editor) {
  //         setEditorInstance(editor); // Sätt editor-instansen i state
  //       }
  //     }
  //   }, []);

  // Hantera textförändringar i Quill
  const handleChange = (value: string) => {
    setContent(value);
  };

  // Skapa en ny timer
  //   const addTimer = () => {
  //     if (timerInput > 0) {
  //       setTimers([...timers, `${timerInput} minuter`]);
  //       setTimerInput(0);
  //     }
  //   };

  //   // Dra och släpp-timer
  //   const handleDragStart = (e: React.DragEvent, timer: string) => {
  //     e.dataTransfer.setData("text/plain", `[Timer: ${timer}]`);
  //   };

  //   const handleDrop = (e: React.DragEvent) => {
  //     e.preventDefault();
  //     const text = e.dataTransfer.getData("text/plain");

  //     if (!editorInstance) {
  //       console.error("Quill editor not ready yet");
  //       return;
  //     }

  //     const range = editorInstance.getSelection(true);
  //     if (range) {
  //       editorInstance.insertText(range.index, text, "bold", true);
  //     }
  //   };

  //   const handleDragOver = (e: React.DragEvent) => {
  //     e.preventDefault();
  //   };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div>
      <div className="flex bg-gray-50 min-h-screen p-5">
        {/* Vänster sektion: Editorn */}
        <div
          className="w-3/4 pr-4"
          //   onDrop={handleDrop} // Hantera drop-händelse
          //   onDragOver={handleDragOver} // Tillåt drop-händelse
        >
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
          {/* <p className="text-sm text-gray-600">Skapa en timer:</p> */}
          {/* <div className="flex mb-4">
            <input
              type="number"
              value={timerInput}
              onChange={(e) => setTimerInput(Number(e.target.value))}
              placeholder="Ange minuter"
              className="border border-gray-300 rounded p-2 w-full mr-2"
            />
            <button
              onClick={addTimer}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            >
              Lägg till
            </button>
          </div> */}

          {/* Lista över timers */}
          {/* <ul>
            {timers.map((timer, index) => (
              <li
                key={index}
                draggable
                onDragStart={(e) => handleDragStart(e, timer)}
                className="p-2 bg-gray-100 border border-gray-300 rounded mb-2 text-center cursor-move"
              >
                {timer}
              </li>
            ))}
          </ul> */}
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
                  alert("Dokumentet har sparats!"); // Här kan du lägga till backend-logik
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
