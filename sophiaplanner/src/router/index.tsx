import { createBrowserRouter, RouteObject } from "react-router-dom";
import NotFound from "../pages/NotFound";
import Home from "../pages/Home";
import CreateLessonPlan from "../pages/CreateLessonPlan";
import CreateStudentAccount from "../pages/CreateStudentAccount";
import DashboardStudent from "../pages/DashboardStudent";
import DashboardTeacher from "../pages/DashboardTeacher";
import LoginPage from "../pages/LoginPage";
import { PrivacyPolicy } from "../pages/PrivacyPolicy";
import PrivateRoutes from "./PrivateRoutes";
import ErrorBoundary from "../components/ErrorBoundary";

// Skapar en routerkonfiguration med olika rutter och deras tillhörande komponenter
//PrivateRoutes läggs runt komponenter där användaren måste vara inloggad för att nå.
// Wrappad i ErrorBoundary för att fånga fel vid render och visa en användarvänlig fallback istället för att krascha

const routes: RouteObject[] = [
  {
    path: "/",
    element: (
      <ErrorBoundary fallback={<h2>Oj! Något gick fel i home.</h2>}>
        <Home />
      </ErrorBoundary>
    ),
    errorElement: <NotFound />,
  },
  {
    path: "/CreateLessonPlan",
    element: (
      <PrivateRoutes>
        <ErrorBoundary
          fallback={<h2>Oj! Något gick fel i CreateLessonPlan.</h2>}
        >
          <CreateLessonPlan />
        </ErrorBoundary>
      </PrivateRoutes>
    ),
  },
  {
    path: "/CreateStudentAccount",
    element: (
      <PrivateRoutes>
        <ErrorBoundary
          fallback={<h2>Oj! Något gick fel i CreateStudentAccount.</h2>}
        >
          <CreateStudentAccount />
        </ErrorBoundary>
      </PrivateRoutes>
    ),
  },
  {
    path: "/DashboardStudent",
    element: (
      <PrivateRoutes>
        <ErrorBoundary
          fallback={<h2>Oj! Något gick fel i DashboardStudent.</h2>}
        >
          <DashboardStudent />
        </ErrorBoundary>
      </PrivateRoutes>
    ),
  },
  {
    path: "/DashboardTeacher",
    element: (
      <PrivateRoutes>
        <ErrorBoundary
          fallback={<h2>Oj! Något gick fel i DashboardTeacher.</h2>}
        >
          <DashboardTeacher />
        </ErrorBoundary>
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
    element: (
      <ErrorBoundary fallback={<h2>Oj! Något gick fel i inloggningssidan.</h2>}>
        <LoginPage />
      </ErrorBoundary>
    ),
  },
  {
    path: "/PrivacyPolicy",
    element: (
      <ErrorBoundary fallback={<h2>Oj! Något gick fel i PrivacyPolicy.</h2>}>
        <PrivacyPolicy />
      </ErrorBoundary>
    ),
  },
];

export const router = createBrowserRouter(routes);
