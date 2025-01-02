import { useContext, useEffect } from "react";
import { DraftLessonPlans } from "../components/DraftLessonPlans";
import { Header } from "../components/Header";
import { ShowStudentCard } from "../components/ShowStudentCard";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const DashboardTeacher = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  //Kolla om användare är inloggad, annars navigera till homepage
  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  });
  return (
    <div>
      <Header />
      <div className="h-screen flex justify-center items-start bg-gradient-to-b from-primary to-background font-sans">
        {/* Yttre ruta */}
        <div className="bg-secondary w-[90%] max-w-5xl flex flex-col md:flex-row justify-between items-center p-4 md:p-6 rounded-lg shadow-lg gap-4 md:mt-4 lg:mt-8">
          {/* Inre rutor */}
          <div className="flex-grow w-full md:w-1/2">
            <ShowStudentCard />
          </div>
          <div className="flex-grow w-full md:w-1/2">
            <DraftLessonPlans />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardTeacher;
