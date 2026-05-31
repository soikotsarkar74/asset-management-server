// import { createBrowserRouter } from "react-router-dom";

// import Home from "../pages/Home/Home";
// import RootLayout from "../Layouts/RootLayout";
// import Coverage from "../pages/Coverage/Coverage";
// import Login from "../pages/Home/Auth/Login";
// import Register from "../pages/Home/Auth/Register/Register";
// import RegisterEmployee from "../pages/RegisterEmployee/RegisterEmployee";
// import PrivateRoute from "./PrivateRoute";
// import AddAsset from "../pages/AddAsset/AddAsset";
// import DashboardLayout from "../Layouts/DashboardLayout";
// import Payment from "../pages/Dashboard/Payment/Payment";
// import PaymentSuccess from "../pages/Dashboard/PaymentSucess/PaymentSucess";
// import PaymentCancel from "../pages/Dashboard/Payment/PaymentCancel";
// import PaymentHistory from "../pages/Dashboard/PaymentHistory";
// import MyAssets from "../pages/Dashboard/MyAssets";
// import ApproveEmployee from "../pages/HR/ApproveEmployee/ApproveEmployee";
// import UserManagement from "../pages/HR/UserManagement/UserManagement";
// import UseRole from "../pages/UseRole/useRole";
// import AdminRouter from "./adminRouter";
// import AssignProduct from "../pages/AssignProduct/AssignProduct";
// import Requests from "../pages/Requests/Requests";
// import AssignedAssets from "../pages/AssignedAssets/AssignedAssets";
// import MyTeam from "../pages/MyTeam/MyTeam";
// import RequestForm from "../pages/RequestFrom/RequestFrom";
// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <RootLayout />,
//     children: [
//       {
//         index: true,
//         element: <Home />,
//       },
//       {
//         path: "register-employee",
//         element: (
//           <PrivateRoute>
//             <RegisterEmployee />
//           </PrivateRoute>
//         ),
//       },
//       {
//         path: "coverage",
//         element: <Coverage />,
//         loader: () =>
//           fetch("/serviceCenter.json").then((res) => res.json()),
//       },
//       {
//         path: "add-asset",
//         element: (
//           <PrivateRoute>
//             <AddAsset />
//           </PrivateRoute>
//         ),
//         loader: () =>
//           fetch("/serviceCenter.json").then((res) => res.json()),
//       },
//       {
//         path: "login",
//         element: <Login />,
//       },
//       {
//         path: "register",
//         element: <Register />,
//       },

//       // ✅ DASHBOARD ROUTES
//       {
//         path: "dashboard",
//         element: (
//           <PrivateRoute>
//             <DashboardLayout />
//           </PrivateRoute>
//         ),
//         children: [

//           {
//             index: true,
//             element: <MyAssets />,
//           },
//           {
//             path: "my-assets",
//             element: <MyAssets />,
//           },
//           {
//             path: "payment/:assetId",
//             element: <Payment />,
//           },
//           {
//             path: "payment-success",
//             element: <PaymentSuccess />,
//           },
//           {
//             path: "payment-cancel",
//             element: <PaymentCancel />,
//           },
//           {
//             path: "payment-history",
//             element: <PaymentHistory />
//           },

//           {
//             path: 'approve-employee',
//             element: <AdminRouter><ApproveEmployee /></AdminRouter>
//            >

//           },
//           {
//             path: 'user-management',
//             element:<AdminRouter><UserManagement /></AdminRouter>

//           },
//           {
//             path:'use-role',
//           element:<AdminRouter><UseRole/></AdminRouter>,



//           },
//            {
//             path:'assign-product',
//            element:<AdminRouter><AssignProduct/></AdminRouter>,

//           },
//           {
//             path:'requests',
//             element:<AdminRouter><Requests/></AdminRouter>
//           },
//           {
//             path:'assigned-assets',
//             element:<AdminRouter><AssignedAssets/></AdminRouter>

//           },
//           {
//             path:'my-team',
//             element:<AdminRouter><MyTeam/></AdminRouter>
//           },
//           {
//             path:'request-from',
//             element:<RequestForm></RequestForm>
//           }


//         ],
//       },
//     ],
//   },
// ]);

// export default router;

// import { createBrowserRouter } from "react-router-dom";

// import Home from "../pages/Home/Home";
// import RootLayout from "../Layouts/RootLayout";
// import Coverage from "../pages/Coverage/Coverage";
// import Login from "../pages/Home/Auth/Login";
// import Register from "../pages/Home/Auth/Register/Register";
// import RegisterEmployee from "../pages/RegisterEmployee/RegisterEmployee";

// import PrivateRoute from "./PrivateRoute";

// import AddAsset from "../pages/AddAsset/AddAsset";
// import DashboardLayout from "../Layouts/DashboardLayout";

// import Payment from "../pages/Dashboard/Payment/Payment";
// import PaymentSuccess from "../pages/Dashboard/PaymentSucess/PaymentSucess";
// import PaymentCancel from "../pages/Dashboard/Payment/PaymentCancel";
// import PaymentHistory from "../pages/Dashboard/PaymentHistory";

// import MyAssets from "../pages/Dashboard/MyAssets";

// import ApproveEmployee from "../pages/HR/ApproveEmployee/ApproveEmployee";
// import UserManagement from "../pages/HR/UserManagement/UserManagement";

// import UseRole from "../pages/UseRole/useRole";
// import AssignProduct from "../pages/AssignProduct/AssignProduct";
// import Requests from "../pages/Requests/Requests";

// import AssignedAssets from "../pages/AssignedAssets/AssignedAssets";
// import MyTeam from "../pages/MyTeam/MyTeam";
// import RequestForm from "../pages/RequestFrom/RequestFrom";
// import HrRouter from "./HrRouter";

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <RootLayout />,
//     children: [
//       {
//         index: true,
//         element: <Home />,
//       },
//       {
//         path: "register-employee",
//         element: (
//           <PrivateRoute>
//             <RegisterEmployee />
//           </PrivateRoute>
//         ),
//       },
//       {
//         path: "coverage",
//         element: <Coverage />,
//         loader: () =>
//           fetch("/serviceCenter.json").then((res) => res.json()),
//       },

//       {
//         path: "login",
//         element: <Login />,
//       },
//       {
//         path: "register",
//         element: <Register />,
//       },

//       // ================= DASHBOARD =================
//       {
//         path: "dashboard",
//         element: (
//           <PrivateRoute>
//             <DashboardLayout />
//           </PrivateRoute>
//         ),
//         children: [
//           // Default
//           {
//             index: true,
//             element: <MyAssets />,
//           },

//           // Employee Routes
//           {
//             path: "my-assets",
//             element: <MyAssets />,
//           },
//           {
//             path: "assigned-assets",
//             element: <AssignedAssets />,
//           },
//           {
//             path: "my-team",
//             element: <MyTeam />,
//           },
//           {
//             path: "request-asset",
//             element: <RequestForm />,
//           },

//           // Payment
//           {
//             path: "payment/:assetId",
//             element: <Payment />,
//           },
//           {
//             path: "payment-success",
//             element: <PaymentSuccess />,
//           },
//           {
//             path: "payment-cancel",
//             element: <PaymentCancel />,
//           },
//           {
//             path: "payment-history",
//             element: <PaymentHistory />,
//           },

//           // HR (Admin) Routes
//           {
//             path: "approve-employee",
//             element: (
//               <HrRouter> <ApproveEmployee /></HrRouter>


//             ),
//           },
//           {
//             path: "user-management",
//             element: (
//               <HrRouter>
//                 <UserManagement />
//               </HrRouter>
//             ),
//           },
//           {
//             path: "use-role",
//             element: (
//               <HrRouter>
//                 <UseRole />
//               </HrRouter>
//             ),
//           },
//           {
//             path: "assign-product",
//             element: (
//               <HrRouter>
//                 <AssignProduct />
//               </HrRouter>
//             ),
//           },
//           {
//             path: "requests",
//             element: (
//               <HrRouter>
//                 <Requests />
//               </HrRouter>
//             ),
//           },
//           {
//         path: "add-asset",
//         element: (
//           <HrRouter>
//             <AddAsset />
//           </HrRouter>
//         ),
//       },
//         ],
//       },
//     ],
//   },
// ]);

// export default router;

// import { createBrowserRouter } from "react-router-dom";

// // Layouts
// import RootLayout from "../Layouts/RootLayout";
// import DashboardLayout from "../Layouts/DashboardLayout";

// // Pages (Public)
// import Home from "../pages/Home/Home";
// import Login from "../pages/Home/Auth/Login";
// import Register from "../pages/Home/Auth/Register/Register";
// import RegisterEmployee from "../pages/RegisterEmployee/RegisterEmployee";
// import Coverage from "../pages/Coverage/Coverage";

// // Private Route
// import PrivateRoute from "./PrivateRoute";

// // Employee Pages
// import MyAssets from "../pages/Dashboard/MyAssets";
// import AssignedAssets from "../pages/AssignedAssets/AssignedAssets";
// import MyTeam from "../pages/MyTeam/MyTeam";
// import RequestForm from "../pages/RequestFrom/RequestFrom";

// // Payment
// import Payment from "../pages/Dashboard/Payment/Payment";
// import PaymentSuccess from "../pages/Dashboard/PaymentSucess/PaymentSucess";
// import PaymentCancel from "../pages/Dashboard/Payment/PaymentCancel";
// import PaymentHistory from "../pages/Dashboard/PaymentHistory";

// // HR Pages
// import ApproveEmployee from "../pages/HR/ApproveEmployee/ApproveEmployee";
// import UserManagement from "../pages/HR/UserManagement/UserManagement";
// import AssignProduct from "../pages/AssignProduct/AssignProduct";
// import Requests from "../pages/Requests/Requests";
// import AddAsset from "../pages/AddAsset/AddAsset";
// //import useRole from "../hooks/useRole";
// import useRole from "../hooks/useRole";

// // HR Router
// import HrRouter from "./HrRouter";


// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <RootLayout />,
//     children: [
//       // ================= PUBLIC ROUTES =================
//       { index: true, element: <Home /> },
//       { path: "login", element: <Login /> },
//       { path: "register", element: <Register /> },
//       {
//         path: "register-employee",
//         element: (
//           <PrivateRoute>
//             <RegisterEmployee />
//           </PrivateRoute>
//         ),
//       },
//       {
//         path: "coverage",
//         element: <Coverage />,
//       },


//       // ================= DASHBOARD =================
//       {
//         path: "dashboard",
//         element: (
//           <PrivateRoute>
//             <DashboardLayout />
//           </PrivateRoute>
//         ),
//         children: [
//           // DEFAULT
//           { index: true, element: <MyAssets /> },

//           // EMPLOYEE ROUTES
//           { path: "my-assets", element: <MyAssets /> },
//           { path: "assigned-assets", element: <AssignedAssets /> },
//           { path: "my-team", element: <MyTeam /> },
//           { path: "request-asset", element: <RequestForm /> },

//           // PAYMENT
//           { path: "payment/:assetId", element: <Payment /> },
//           { path: "payment-success", element: <PaymentSuccess /> },
//           { path: "payment-cancel", element: <PaymentCancel /> },
//           { path: "payment-history", element: <PaymentHistory /> },

//           // HR ROUTES (PROTECTED)
//           {
//             path: "add-asset",
//             element: (
//               <HrRouter>
//                 <AddAsset />
//               </HrRouter>
//             ),
//           },
//           {
//             path: "approve-employee",
//             element: (
//               <HrRouter>
//                 <ApproveEmployee />
//               </HrRouter>
//             ),
//           },
//           {
//             path: "user-management",
//             element: (
//               <HrRouter>
//                 <UserManagement />
//               </HrRouter>
//             ),
//           },
//           {
//             path: "assign-product",
//             element: (
//               <HrRouter>
//                 <AssignProduct />
//               </HrRouter>
//             ),
//           },
//           {
//             path:'use-role',
//             element:<useRole/>

//           },
//           {
//             path: "requests",
//             element: (
//               <HrRouter>
//                 <Requests />
//               </HrRouter>
//             ),
//           },

//         ],
//       },
//     ],
//   },
// ]);

// export default router;



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
      {
        path: 'join-hr',
        element: <JoinHR />
      },
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




      // ================= DASHBOARD =================
      {
        path: "dashboard",
        element: (
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        ),
        children: [
          // DEFAULT
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
          // { path: "payment/:assetId", element: <Payment /> },
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