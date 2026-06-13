

import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useRole from "../hooks/useRole";

const HrRoute = ({ children }) => {

  const { user, loading } = useAuth();
  const { role, roleLoading } = useRole();

  if (loading || roleLoading) {
    return <p>Loading...</p>;
  }


  if (!user) {
    return <Navigate to="/login" />;
  }


  if (role !== "admin") {
    return 
  }

  return children;
};

export default HrRoute;