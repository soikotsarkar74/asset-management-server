// import { Navigate } from "react-router-dom";
// import useAuth from "../hooks/useAuth";
// import useRole from "../pages/useRole/useRole";
// import Forbidden from "../compoments/Forbidden/Forbidden";

// const AdminRouter = ({ children }) => {
//   const { user, loading } = useAuth();
//   const { role, roleLoading } = useRole();


//   if (loading || roleLoading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <span className="text-xl font-semibold">Loading...</span>
//       </div>
//     );
//   }

  
//   if (!user) {
//     return <Navigate to="/login" replace />;
//   }


//   if (role !== "admin") {
//     return <Forbidden/>;
//   }

//   return children;
// };

// export default AdminRouter;


// import { Navigate } from "react-router-dom";
// import useAuth from "../hooks/useAuth";
// import useRole from "../hooks/useRole";
// import Forbidden from "../compoments/Forbidden/Forbidden";

// const HrRouter = ({ children }) => {
//   const { user, loading } = useAuth();
//   const { role, roleLoading } = useRole();

//   if (loading || roleLoading) {
//     return <p className="text-center mt-10">Loading...</p>;
//   }

//   if (!user) {
//     return <Navigate to="/login" replace />;
//   }

//   if (role !== "admin") {
//     return <Forbidden />;
//   }

//   return children;
// };

// export default HrRouter;


// import { Navigate } from "react-router-dom";
// import useAuth from "../hooks/useAuth";
// import useRole from "../hooks/useRole";

// //import Forbidden from "../components/Forbidden/Forbidden";

// const HrRouter = ({ children }) => {
//   const { user, loading } = useAuth();
//   const { role, roleLoading } = useRole();

//   if (loading || roleLoading) {
//     return <p className="text-center mt-10">Loading...</p>;
//   }

//   if (!user) {
//     return <Navigate to="/login" replace />;
//   }

//   // ✅ HR + ADMIN allowed
//   if (role !== "hr" && role !== "admin") {
//     // return <Forbidden />;
//     return admin;
//   }

//   return children;
// };

// export default HrRouter;

import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useRole from "../hooks/useRole";

const HrRoute = ({ children }) => {

  const { user, loading } = useAuth();
  const { role, roleLoading } = useRole();

  if (loading || roleLoading) {
    return <p>Loading...</p>;
  }

  // not logged in
  if (!user) {
    return <Navigate to="/login" />;
  }

  // not HR
  if (role !== "admin") {
    return 
  }

  return children;
};

export default HrRoute;