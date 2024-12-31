// import { useNavigate } from "react-router-dom";

import { useContext, useEffect } from "react";
import { Header } from "../components/Header";
import { RegisterStudent } from "../components/RegisterStudent";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const CreateStudentAccount = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  });

  return (
    <div>
      <Header />
      <RegisterStudent />
    </div>
  );
};

export default CreateStudentAccount;
