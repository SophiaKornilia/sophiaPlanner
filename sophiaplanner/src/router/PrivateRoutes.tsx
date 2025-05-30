import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoutes  = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth();
  
  return isAuthenticated ? children : <Navigate to="/LoginPage" replace />;
};

export default PrivateRoutes ;
