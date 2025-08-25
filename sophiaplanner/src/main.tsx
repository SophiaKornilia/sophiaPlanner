import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { StudentProvider } from "./context/StudentContext";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { router } from "./router";
import ErrorBoundary from "./components/ErrorBoundary";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary fallback={<h1>Något gick fel. Försök igen senare</h1>}>
      <AuthProvider>
        <StudentProvider>
          <RouterProvider router={router} />
        </StudentProvider>
      </AuthProvider>
    </ErrorBoundary>
  </StrictMode>
);
