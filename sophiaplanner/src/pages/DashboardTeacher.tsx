import { DraftLessonPlans } from "../components/DraftLessonPlans";
import { Header } from "../components/Header";
import { ShowStudentCard } from "../components/ShowStudentCard";

const DashboardTeacher = () => {
  return (
    <div>
      <Header />
      <div className="h-screen flex justify-center items-start bg-gradient-to-b from-primary to-background font-sans">
        {/* Yttre ruta */}
        <div className="bg-secondary h-[70%]  w-[90%] max-w-5xl flex flex-col md:flex-row justify-between items-center p-4 md:p-6 rounded-lg shadow-lg gap-4 md:mt-4 lg:mt-8">
          {/* Inre rutor */}
          <div className="bg-primary w-[95%] md:w-[48%] h-full flex flex-col rounded-md mx-2 overflow-y-scroll">
            <h1 className="text-white text-xl font-bold m-3 flex justify-center ">
              Mina elever
            </h1>
            <ShowStudentCard />
          </div>
          <div className="bg-primary w-[95%] md:w-[48%] h-full flex flex-col rounded-md mx-2 overflow-y-scroll">
            <h1 className="text-white text-xl font-bold m-3 flex justify-center">
              Mina utkast
            </h1>
            <DraftLessonPlans />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardTeacher;
