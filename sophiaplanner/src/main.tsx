import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { StudentProvider } from "./context/StudentContext";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { router } from "./router"; 

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <StudentProvider>
        <RouterProvider router={router} />
      </StudentProvider>
    </AuthProvider>
  </StrictMode>
);
