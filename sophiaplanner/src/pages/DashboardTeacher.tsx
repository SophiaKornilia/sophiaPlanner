import { DraftLessonPlans } from "../components/DraftLessonPlans";
import { Header } from "../components/Header";
import { ShowStudents } from "../components/ShowStudents";

const DashboardTeacher = () => {
  return (
    <div>
      <Header />
      <div className="h-screen flex justify-center items-center bg-background font-sans">
        {/* Yttre ruta */}
        <div className="bg-secondary h-3/4 w-3/4 flex flex-row justify-between items-center p-6 rounded-lg shadow-lg">
          {/* Inre rutor */}
          <div className="bg-primary h-full w-1/2 flex flex-col rounded-md mx-2">
            <h1 className="text-white text-xl font-bold m-3 flex justify-center">
              Mina elever
            </h1>
            <ShowStudents />
          </div>
          {/* <div className="bg-primary h-full w-1/3 flex flex-col rounded-md mx-2">
            <h1 className="text-white text-xl font-bold m-3 flex justify-center">
              Mina grupper
            </h1>
          </div> */}
          <div className="bg-primary h-full w-1/2 flex flex-col rounded-md mx-2">
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
