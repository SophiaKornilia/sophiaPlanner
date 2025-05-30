import { createBrowserRouter } from "react-router-dom";
import NotFound from "../pages/NotFound";
import Home from "../pages/Home";
import CreateLessonPlan from "../pages/CreateLessonPlan";
import CreateStudentAccount from "../pages/CreateStudentAccount";
import DashboardStudent from "../pages/DashboardStudent";
import DashboardTeacher from "../pages/DashboardTeacher";
import LoginPage from "../pages/LoginPage";
import { PrivacyPolicy } from "../pages/PrivacyPolicy";
import PrivateRoutes from "./PrivateRoutes";

// Skapar en routerkonfiguration med olika rutter och deras tillhörande komponenter
//PrivateRoutes läggs runt komponenter där användaren måste vara inloggad för att nå. 
export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <NotFound />,
  },
  {
    path: "/CreateLessonPlan",
    element: (
      <PrivateRoutes>
        <CreateLessonPlan />
      </PrivateRoutes>
    ),
  },
  {
    path: "/CreateStudentAccount",
    element: (
      <PrivateRoutes>
        <CreateStudentAccount />
      </PrivateRoutes>
    ),
  },
  {
    path: "/DashboardStudent",
    element: (
      <PrivateRoutes>
        <DashboardStudent />
      </PrivateRoutes>
    ),
  },
  {
    path: "/DashboardTeacher",
    element: (
      <PrivateRoutes>
        <DashboardTeacher />
      </PrivateRoutes>
    ),
  },
  // {
  //   path: "/Planner",
  //   element: <Planner />,
  // },
  // {
  //   path: "/HandleAccount",
  //   element: <HandleAccount />,
  // },
  {
    path: "/LoginPage",
    element: <LoginPage />,
  },
  {
    path: "/PrivacyPolicy",
    element: <PrivacyPolicy />,
  },
]);
