import { useContext, useState } from "react";
import { Header } from "../components/Header";
import { AuthContext } from "../context/AuthContext";

const HandleAccount = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [groupName, setGroupName] = useState<string>("");
  const { user } = useContext(AuthContext);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Groupname", groupName);

    try {
      const response = await fetch(
        "http://localhost:3000/api/users/createGroup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ groupName: groupName, teacherId: user?.uid }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("group", data);
      }

      handleCloseModal();
    } catch (error) {
      console.error("Ett fel inträffade vid skapande av grupp:", error);
      alert("Kunde inte skapa grupp. Försök igen senare.");
    }
  };
  return (
    <div className="">
      <Header />
      <div className="h-screen flex justify-center items-center bg-background font-sans  ">
        <div className="w-full max-w-md bg-secondary p-6 runded-lg shadow-md flex flex-col items-center space-y-4">
          <h2 className="text-white">
            <a className="cursor-pointer" onClick={handleOpenModal}>
              Skapa grupp
            </a>
          </h2>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white w-96 p-6 rounded-md shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Skapa Grupp</h3>
            <form>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Gruppnamn
              </label>
              <input
                type="text"
                placeholder="Ange gruppnamn"
                className="w-full mb-4 p-2 border rounded-md"
                onChange={(e) => setGroupName(e.target.value)}
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Avbryt
                </button>
                <button
                  type="submit"
                  onClick={handleCreateGroup}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Skapa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HandleAccount;
