import { useContext, useEffect } from "react";
import { Header } from "../components/Header";
import { StudentLessonPlans } from "../components/StudentLessonplans";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const DashboardStudent = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  //Kolla om användare är inloggad, annars navigera till homepage
  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  });
  return (
    <div className="">
      <Header />
      <div className="h-screen flex justify-center items-center bg-background font-sans  ">
        <div>
          <StudentLessonPlans />
        </div>
      </div>
    </div>
  );
};

export default DashboardStudent;
