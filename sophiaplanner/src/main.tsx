import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import CreateLessonPlan from "./pages/CreateLessonPlan";
import CreateStudentAccount from "./pages/CreateStudentAccount";
import DashboardStudent from "./pages/DashboardStudent";
import DashboardTeacher from "./pages/DashboardTeacher";
import Planner from "./pages/Planner";
import HandleAccount from "./pages/HandleAccount";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import { AuthProvider } from "./context/AuthContext";
import { StudentProvider } from "./context/StudentContext";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { PrivacyPolicy } from "./pages/PrivacyPolicy";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <NotFound />,
  },
  {
    path: "/CreateLessonPlan",
    element: <CreateLessonPlan />,
  },
  {
    path: "/CreateStudentAccount",
    element: <CreateStudentAccount />,
  },
  {
    path: "/DashboardStudent",
    element: <DashboardStudent />,
  },
  {
    path: "/DashboardTeacher",
    element: <DashboardTeacher />,
  },
  {
    path: "/Planner",
    element: <Planner />,
  },
  {
    path: "/HandleAccount",
    element: <HandleAccount />,
  },
  {
    path: "/LoginPage",
    element: <LoginPage />,
  },
  {
    path: "/PrivacyPolicy",
    element: <PrivacyPolicy />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <StudentProvider>
        <RouterProvider router={router} />
      </StudentProvider>
    </AuthProvider>
  </StrictMode>
);
