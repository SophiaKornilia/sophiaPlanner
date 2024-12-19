// import { useNavigate } from "react-router-dom";


import { Header } from "../components/Header";
import { RegisterStudent } from "../components/RegisterStudent";

// interface Group {
//   groupName: string;
// }
const CreateStudentAccount = () => {
  // const [groups, setGroups] = useState<Group[]>([]);

  // const checkGroups = useCallback(async () => {
  //   try {
  //     const response = await fetch(
  //       "http://localhost:3000/api/users/getGroups",
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         // body: JSON.stringify({ teacherId: user?.uid }),
  //       }
  //     );

  //     if (response.ok) {
  //       const data = await response.json();
  //       setGroups(data.groups);
  //       console.log("Groups found successfully!", data);
  //     } else {
  //       console.error("Failed to fetch groups");
  //     }
  //   } catch (error) {
  //     console.error("Hittade inga grupper", error);
  //   }
  // }, [user?.id]);

  // useEffect(() => {
  //   if (user?.id) {
  //     checkGroups();
  //   }
  // }, [user, checkGroups]);

  return (
    <div className="">
      <Header />
      <RegisterStudent/> 
      {/* {groups.length > 0 ? (
            <div className="mb-4 w-full max-w-xs">
              <label className="mb-2 text-lg font-semibold">Grupp:</label>
              <select
                className="p-2 w-full border rounded-md"
                onChange={(e) => console.log("Selected group:", e.target.value)}
              >
                <option value="">Ingen grupp</option>
                {groups.map((group) => (
                  <option key={group.groupName} value={group.groupName}>
                    {group.groupName}
                  </option>
                ))}
              </select>
            </div>
          ) : null} */}
    </div>
  );
};

export default CreateStudentAccount;
