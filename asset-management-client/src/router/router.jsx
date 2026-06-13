

import { createBrowserRouter } from "react-router-dom";

// Layouts
import RootLayout from "../Layouts/RootLayout";
import DashboardLayout from "../Layouts/DashboardLayout";

// Pages (Public)
import Home from "../pages/Home/Home";
import Login from "../pages/Home/Auth/Login";
import Register from "../pages/Home/Auth/Register/Register";
import RegisterEmployee from "../pages/RegisterEmployee/RegisterEmployee";
import Coverage from "../pages/Coverage/Coverage";
import Packages from "../pages/Packages/Packages";
// Private Route
import PrivateRoute from "./PrivateRoute";

// Employee Pages
import MyAssets from "../pages/Dashboard/MyAssets";
import AssignedAssets from "../pages/AssignedAssets/AssignedAssets";
import MyTeam from "../pages/MyTeam/MyTeam";
import RequestForm from "../pages/RequestFrom/RequestFrom";


// Payment
import Payment from "../pages/Dashboard/Payment/Payment";
import PaymentSuccess from "../pages/Dashboard/PaymentSucess/PaymentSucess";
import PaymentCancel from "../pages/Dashboard/Payment/PaymentCancel";
import PaymentHistory from "../pages/Dashboard/PaymentHistory";

// HR Pages
import EmployeeEmployee from "../pages/HR/ApproveEmployee/ApproveEmployee";
import AssignProduct from "../pages/AssignProduct/AssignProduct";
import Requests from "../pages/Requests/Requests";
import AddAsset from "../pages/AddAsset/AddAsset";
import useRole from "../hooks/useRole";
// HR Router
import HrRouter from "./HrRouter";
import AllRequests from "../pages/HR/AllRequests/AllRequests";
import AssetsList from "../pages/HR/AssetsList/AssetsList";
import About from "../pages/Home/About";
import EmployeeList from "../pages/HR/EmployeeList/EmployeeList";
import UpdateAsset from "../pages/HR/UpdateAsset/UpdateAsset";
import JoinHR from "../pages/HR/JoinHR/JoinHr";
import Profile from "../pages/Profile/Profile";
import EmployeeManagement from "../pages/HR/EmployeeManagement/EmployeeManagement";
import ApproveEmployee from "../pages/HR/ApproveEmployee/ApproveEmployee";
import HrRegister from "../pages/Home/Auth/HrRegister";
import Features from "../pages/Features/Features";
import FAQ from "../pages/Faq/Faq";
import EmployeeHome from "../pages/Dashboard/Employee/EmployeeHome";
import HRHome from "../pages/HR/HRHome/HRHome";
import UpdatePackage from "../pages/HR/UpdatePackage/UpdatePackage";
import MyCompanies from "../pages/Dashboard/MyCompanies/MyCompanies";
import RequestAsset from "../pages/Dashboard/RequestAssets/RequestAssets";
import Assets from "../pages/Home/Assets/Assets";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      // ================= PUBLIC ROUTES =================
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "hr-register", element: <HrRegister /> },
      // {
      //   path: 'join-hr',
      //   element: <JoinHR />
      // },
      {
        path: "register-employee",
        element: (
          <PrivateRoute>
            <RegisterEmployee />
          </PrivateRoute>
        ),
      },
      {
        path: "coverage",
        element: <Coverage />,
      },
       { path: "assets", element: <Assets /> },
      
      {
        path: "packages",
        element: <Packages />,
      },
      {
        path: 'features',
        element: <Features />
      },
      {
        path: 'faq',
        element: <FAQ />
      },

      {
        path: "/payment",
        element: <Payment />
      },

      {
        path: "/payment-success",
        element: <PaymentSuccess />
      },
    { path: "payment-cancel", element: <PaymentCancel /> },




      // ================= DASHBOARD =================
      {
        path: "dashboard",
        element: (
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        ),
        children: [
        
          //{ index: true, element: <MyAssets /> },

          // EMPLOYEE ROUTES
         
          { path: "my-assets", element: <MyAssets /> },
          
          { path: "assigned-assets", element: <AssignedAssets /> },
          { path: "my-team", element: <MyTeam /> },
          { path: "request-asset", element: <RequestForm /> },
          { path: 'profile', element: <Profile /> },
          { path: 'employee-home', element: <EmployeeHome /> },
          {path:'my-companies',element:<MyCompanies/>},
         

          // PAYMENT
      
          { path: "payment-success", element: <PaymentSuccess /> },
          { path: "payment-cancel", element: <PaymentCancel /> },
          { path: "payment-history", element: <PaymentHistory /> },


          // HR ROUTES (PROTECTED)
          {
            path: "add-asset",
            element: (
              <HrRouter>
                <AddAsset />
              </HrRouter>
            ),
          },
          {
            path: 'hr-home',
            element: (
              <HrRouter>
                <HRHome />
              </HrRouter>
            )

          },
          {
            path: "assets-list",
            element: (
              <HrRouter>
                <AssetsList />
              </HrRouter>
            ),
          },
          {
            path: "approve-employee",
            element: (
              <HrRouter>

                <ApproveEmployee />
              </HrRouter>
            ),
          },
          {
            path: "employee-management",
            element: (
              <HrRouter>
                <EmployeeManagement />
              </HrRouter>
            ),
          },
          {
            path: "assign-product",
            element: (
              <HrRouter>
                <AssignProduct />
              </HrRouter>
            ),
          },
          {
            path: 'use-role',
            element: <useRole />

          },
          {
            path: 'employee-management',
            element: <EmployeeManagement />

          },
          {
            path: 'assets-list',
            element: <HrRouter><AssetsList /></HrRouter>
          },
          {
            path: "all-requests",
            element: (
              <HrRouter>

                <AllRequests />
              </HrRouter>
            ),
          },
          {
            path: 'employee-list',
            element: <HrRouter><EmployeeList /></HrRouter>

          },
          {
            path: "update-asset/:id",
            element: <HrRouter><UpdateAsset /></HrRouter>,
          },
          {
            path:"update-package",
            element:<HrRouter><UpdatePackage/></HrRouter>
          }

        ],
      },
    ],
  },
]);

export default router;

