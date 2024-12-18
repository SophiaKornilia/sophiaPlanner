// import { useEffect } from "react";
import { useCallback, useContext, useEffect, useState } from "react";
import { Header } from "../components/Header";
import { AuthContext } from "../context/AuthContext";
interface Student {
  userName: string;
  name: string;
}

interface Group {
  groupName: string;
}
const DashboardTeacher = () => {
  const { user } = useContext(AuthContext);
  const [students, setStudents] = useState<Student[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);

  const getStudents = useCallback(async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/users/getStudents",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ teacherId: user?.id }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setStudents(data.students); // Uppdatera eleverna
        console.log("Get students successfully!", data);
      } else {
        console.error("Failed to fetch students");
      }
    } catch (error) {
      console.error("Hittade inga elever", error);
    }
  }, [user?.id]);

  const getGroups = useCallback(async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/users/getGroups",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ teacherId: user?.id }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setGroups(data.groups);
        console.log("Get groups successfully!", data);
      } else {
        console.error("Failed to fetch groups");
      }
    } catch (error) {
      console.error("Hittade inga grupper", error);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      console.log("Fetching students for user: ", user?.id);
      getStudents();
      getGroups();
    }
  }, [user, getStudents, getGroups]);

  return (
    <div>
      <Header />
      <div className="h-screen flex justify-center items-center bg-background font-sans">
        {/* Yttre ruta */}
        <div className="bg-secondary h-3/4 w-3/4 flex flex-row justify-between items-center p-6 rounded-lg shadow-lg">
          {/* Inre rutor */}
          <div className="bg-primary h-full w-1/3 flex flex-col rounded-md mx-2">
            <h1 className="text-white text-xl font-bold m-3 flex justify-center">
              Mina elever
            </h1>
            {students ? (
              <ul className="text-white ml-8">
                {students.map((student) => (
                  <li key={student.userName}>{student.name}</li>
                ))}
              </ul>
            ) : (
              <p className="text-white ml-8">Du har inga elever än...</p>
            )}
          </div>
          <div className="bg-primary h-full w-1/3 flex flex-col rounded-md mx-2">
            <h1 className="text-white text-xl font-bold m-3 flex justify-center">
              Mina grupper
            </h1>
            {groups ? (
              <ul className="text-white ml-8">
                {groups.map((group, index) => (
                  <li key={index}>{group.groupName}</li>
                ))}
              </ul>
            ) : (
              <p className="text-white ml-8">Du har inga grupper än...</p>
            )}
          </div>
          <div className="bg-primary h-full w-1/3 flex  justify-center rounded-md mx-2">
            <h1 className="text-white text-xl font-bold m-3">Mina utkast</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardTeacher;
