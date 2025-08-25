import { useContext, useEffect } from "react";
import { Header } from "../components/header/Header";
import { TextEditor } from "../components/TextEditor";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
// import { LessonPlanCreator } from "../components/LessonPlanCreator";

const CreateLessonPlan = () => {
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
      <TextEditor />
    </div>
  );
};

export default CreateLessonPlan;
