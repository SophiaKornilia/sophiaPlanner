import { Header } from "../components/Header";
import { StudentLessonPlans } from "../components/StudentLessonplans";

const DashboardStudent = () => {
  return (
    <div className="">
      <Header />
      <div className="h-screen flex justify-center items-center bg-background font-sans  ">
        <h1>Detta är student homepage</h1>
        <div>
          <StudentLessonPlans />
        </div>
      </div>
    </div>
  );
};

export default DashboardStudent;
