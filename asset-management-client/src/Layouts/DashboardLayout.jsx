// import React from "react";
// import {
//   Link,
//   NavLink,
//   Outlet,
// } from "react-router-dom";

// // ================= ICONS =================
// import {
//   FaHome,
//   FaBoxOpen,
//   FaClipboardList,
//   FaTasks,
//   FaUsers,
//   FaCreditCard,
//   FaPlusCircle,
//   FaUserShield,
//   FaUserCheck,
//   FaLink,
//   FaBuilding,
//   FaBell,
//   FaCog,
//   FaUser,
//   FaChartBar,
//   FaSignOutAlt,
// } from "react-icons/fa";

// // ================= HOOKS =================
// import useAuth from "../hooks/useAuth";
// import useRole from "../hooks/useRole";

// const DashboardLayout = () => {
//   const { user, logOut } = useAuth();

//   const {
//     role,
//     roleLoading,
//     companyId,
//   } = useRole();

//   // ================= LOADING =================
//   if (roleLoading) {
//     return (
//       <div className="min-h-screen flex justify-center items-center">
//         <span className="loading loading-spinner loading-lg"></span>
//       </div>
//     );
//   }

//   // ================= ROLE =================
//   const isHR = role === "hr";
//   const isAdmin = role === "admin";
//   const isEmployee = role === "employee";

//   const hasCompany = !!companyId;

//   // ================= NAV STYLE =================
//   const navClass = ({ isActive }) =>
//     `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium border-l-4
//     ${
//       isActive
//         ? "bg-lime-400 text-black border-black"
//         : "hover:bg-base-300 text-base-content border-transparent"
//     }`;

//   // ================= COMMON MENUS =================
//   const commonMenus = [
//     {
//       name: "Profile",
//       path: "/dashboard/profile",
//       icon: <FaUser />,
//     },

//     {
//       name: "Notifications",
//       path: "/dashboard/notifications",
//       icon: <FaBell />,
//     },

//     {
//       name: "Settings",
//       path: "/dashboard/settings",
//       icon: <FaCog />,
//     },
//   ];

//   // ================= EMPLOYEE MENU =================
//   const employeeMenus = [
//     {
//       name: "Employee Home",
//       path: "/dashboard/employee-home",
//       icon: <FaHome />,
//     },

//     {
//       name: "My Assets",
//       path: "/dashboard/my-assets",
//       icon: <FaBoxOpen />,
//     },

//     {
//       name: "Assigned Assets",
//       path: "/dashboard/assigned-assets",
//       icon: <FaClipboardList />,
//     },

//     {
//       name: "Request Asset",
//       path: "/dashboard/request-asset",
//       icon: <FaTasks />,
//     },

//     {
//       name: "My Requests",
//       path: "/dashboard/my-requests",
//       icon: <FaClipboardList />,
//     },

//     {
//       name: "My Team",
//       path: "/dashboard/my-team",
//       icon: <FaUsers />,
//     },

//     {
//       name: "Team Companies",
//       path: "/dashboard/team-companies",
//       icon: <FaBuilding />,
//     },

//     {
//       name: "Payment History",
//       path: "/dashboard/payment-history",
//       icon: <FaCreditCard />,
//     },
//   ];

//   // ================= HR MENU =================
//   const hrMenus = [
//     {
//       name: "HR Home",
//       path: "/dashboard/hr-home",
//       icon: <FaHome />,
//     },

//     {
//       name: "Add Asset",
//       path: "/dashboard/add-asset",
//       icon: <FaPlusCircle />,
//     },

//     {
//       name: "Assets List",
//       path: "/dashboard/assets-list",
//       icon: <FaBoxOpen />,
//     },

//     {
//       name: "All Requests",
//       path: "/dashboard/all-requests",
//       icon: <FaClipboardList />,
//     },

//     {
//       name: "Employee Management",
//       path: "/dashboard/employee-management",
//       icon: <FaUserShield />,
//     },

//     {
//       name: "Approve Employee",
//       path: "/dashboard/approve-employee",
//       icon: <FaUserCheck />,
//     },

//     {
//       name: "Assign Product",
//       path: "/dashboard/assign-product",
//       icon: <FaLink />,
//     },

//     {
//       name: "Statistics",
//       path: "/dashboard/statistics",
//       icon: <FaChartBar />,
//     },

//     {
//       name: "Package & Payment",
//       path: "/dashboard/package-payment",
//       icon: <FaCreditCard />,
//     },

//     {
//       name: "Company Profile",
//       path: "/dashboard/company-profile",
//       icon: <FaBuilding />,
//     },
//   ];

//   // ================= ADMIN MENU =================
//   const adminMenus = [
//     {
//       name: "Admin Home",
//       path: "/dashboard/admin-home",
//       icon: <FaHome />,
//     },

//     {
//       name: "All Companies",
//       path: "/dashboard/all-companies",
//       icon: <FaBuilding />,
//     },

//     {
//       name: "All Employees",
//       path: "/dashboard/all-employees",
//       icon: <FaUsers />,
//     },

//     {
//       name: "Manage Users",
//       path: "/dashboard/manage-users",
//       icon: <FaUserShield />,
//     },

//     {
//       name: "Manage Packages",
//       path: "/dashboard/manage-packages",
//       icon: <FaBoxOpen />,
//     },

//     {
//       name: "Payments",
//       path: "/dashboard/payments",
//       icon: <FaCreditCard />,
//     },

//     {
//       name: "System Analytics",
//       path: "/dashboard/system-analytics",
//       icon: <FaChartBar />,
//     },
//   ];

//   // ================= NO COMPANY MENU =================
//   const noCompanyMenus = [
//     {
//       name: "Join Company",
//       path: "/dashboard/join-company",
//       icon: <FaBuilding />,
//     },
//   ];

//   // ================= LOGOUT =================
//   const handleLogout = async () => {
//     try {
//       await logOut();
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   return (
//     <div className="drawer lg:drawer-open bg-base-100">

//       {/* DRAWER TOGGLE */}
//       <input
//         id="dashboard-drawer"
//         type="checkbox"
//         className="drawer-toggle"
//       />

//       {/* ================= MAIN CONTENT ================= */}
//       <div className="drawer-content flex flex-col">

//         {/* ================= TOP NAVBAR ================= */}
//         <div className="navbar bg-base-200 border-b px-6">

//           {/* MOBILE MENU */}
//           <div className="flex-none lg:hidden">
//             <label
//               htmlFor="dashboard-drawer"
//               className="btn btn-square btn-ghost"
//             >
//               ☰
//             </label>
//           </div>

//           {/* TITLE + BREADCRUMB */}
//           <div className="flex-1">
//             <h2 className="text-2xl font-bold">
//               AssetVerse Dashboard
//             </h2>

//             <p className="text-sm opacity-60">
//               Home / Dashboard
//             </p>
//           </div>

//           {/* USER INFO */}
//           <div className="flex items-center gap-5">

//             {/* NOTIFICATION */}
//             <button className="btn btn-ghost btn-circle">
//               <FaBell className="text-xl" />
//             </button>

//             {/* USER */}
//             <div className="flex items-center gap-3">

//               <div className="hidden md:block text-right">
//                 <h3 className="font-semibold">
//                   {user?.displayName || "User"}
//                 </h3>

//                 <p className="text-sm opacity-70 capitalize">
//                   {role}
//                 </p>
//               </div>

//               <img
//                 src={
//                   user?.photoURL ||
//                   "https://i.ibb.co/4pDNDk1/avatar.png"
//                 }
//                 alt="user"
//                 className="w-11 h-11 rounded-full object-cover border"
//               />
//             </div>
//           </div>
//         </div>

//         {/* ================= PAGE CONTENT ================= */}
//         <main className="p-4 md:p-6 min-h-screen bg-base-100">
//           <Outlet />
//         </main>
//       </div>

//       {/* ================= SIDEBAR ================= */}
//       <div className="drawer-side z-40">

//         <label
//           htmlFor="dashboard-drawer"
//           className="drawer-overlay"
//         ></label>

//         <aside className="w-72 min-h-full bg-base-200 border-r p-5 overflow-y-auto flex flex-col">

//           {/* LOGO */}
//           <div className="mb-8">
//             <Link
//               to="/"
//               className="text-3xl font-bold text-primary"
//             >
//               AssetVerse
//             </Link>
//           </div>

//           {/* NAVIGATION */}
//           <ul className="space-y-2 flex-1">

//             {/* HOME */}
//             <li>
//               <NavLink
//                 to="/"
//                 className={navClass}
//               >
//                 <FaHome />
//                 Home
//               </NavLink>
//             </li>

//             {/* ================= COMMON MENUS ================= */}
//             <div className="divider">
//               COMMON
//             </div>

//             {commonMenus.map((menu) => (
//               <li key={menu.path}>
//                 <NavLink
//                   to={menu.path}
//                   className={navClass}
//                 >
//                   {menu.icon}
//                   {menu.name}
//                 </NavLink>
//               </li>
//             ))}

//             {/* ================= EMPLOYEE ================= */}
//             {isEmployee && hasCompany && (
//               <>
//                 <div className="divider">
//                   EMPLOYEE PANEL
//                 </div>

//                 {employeeMenus.map((menu) => (
//                   <li key={menu.path}>
//                     <NavLink
//                       to={menu.path}
//                       className={navClass}
//                     >
//                       {menu.icon}
//                       {menu.name}
//                     </NavLink>
//                   </li>
//                 ))}
//               </>
//             )}

//             {/* ================= NO COMPANY ================= */}
//             {isEmployee && !hasCompany && (
//               <>
//                 <div className="divider">
//                   JOIN COMPANY
//                 </div>

//                 {noCompanyMenus.map((menu) => (
//                   <li key={menu.path}>
//                     <NavLink
//                       to={menu.path}
//                       className={navClass}
//                     >
//                       {menu.icon}
//                       {menu.name}
//                     </NavLink>
//                   </li>
//                 ))}

//                 {/* WARNING */}
//                 <div className="bg-warning text-black rounded-xl p-4 mt-4 text-sm">
//                   <h3 className="font-bold mb-1">
//                     No Company Affiliation
//                   </h3>

//                   <p>
//                     You are not affiliated with any
//                     company yet.
//                   </p>
//                 </div>
//               </>
//             )}

//             {/* ================= HR ================= */}
//             {isHR && (
//               <>
//                 <div className="divider">
//                   HR PANEL
//                 </div>

//                 {hrMenus.map((menu) => (
//                   <li key={menu.path}>
//                     <NavLink
//                       to={menu.path}
//                       className={navClass}
//                     >
//                       {menu.icon}
//                       {menu.name}
//                     </NavLink>
//                   </li>
//                 ))}
//               </>
//             )}

//             {/* ================= ADMIN ================= */}
//             {isAdmin && (
//               <>
//                 <div className="divider">
//                   ADMIN PANEL
//                 </div>

//                 {adminMenus.map((menu) => (
//                   <li key={menu.path}>
//                     <NavLink
//                       to={menu.path}
//                       className={navClass}
//                     >
//                       {menu.icon}
//                       {menu.name}
//                     </NavLink>
//                   </li>
//                 ))}
//               </>
//             )}
//           </ul>

//           {/* ================= LOGOUT ================= */}
//           <div className="pt-5 border-t mt-5">
//             <button
//               onClick={handleLogout}
//               className="btn btn-error w-full"
//             >
//               <FaSignOutAlt />
//               Logout
//             </button>
//           </div>
//         </aside>
//       </div>
//     </div>
//   );
// };

// export default DashboardLayout;

// import React from "react";
// import { Link, NavLink, Outlet } from "react-router-dom";
// import { FaRegCreditCard, FaUserCheck, FaUserShield } from "react-icons/fa";

// import useAuth from "../hooks/useAuth";
// import useRole from "../hooks/useRole";

// const DashboardLayout = () => {
//   const { user } = useAuth();
//   const { role, roleLoading } = useRole();

//   const navClass = ({ isActive }) =>
//     `flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition
//     ${
//       isActive
//         ? "bg-lime-400 text-black"
//         : "text-base-content hover:bg-base-300"
//     }`;

//   if (roleLoading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <span className="loading loading-spinner loading-lg"></span>
//       </div>
//     );
//   }

//   const isHR = role === "admin" || role === "hr";

//   return (
//     <div className="drawer lg:drawer-open">
//       <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />

//       {/* ================= MAIN CONTENT ================= */}
//       <div className="drawer-content flex flex-col bg-base-100">

//         {/* NAVBAR */}
//         <div className="navbar bg-base-200 shadow-sm px-6">
//           <div className="flex-none lg:hidden">
//             <label htmlFor="dashboard-drawer" className="btn btn-ghost">
//               ☰
//             </label>
//           </div>

//           <div className="flex-1 text-lg font-bold">
//             AssetVerse Dashboard
//           </div>

//           <div className="hidden lg:block text-sm opacity-70">
//             Welcome, {user?.displayName || "User"}
//           </div>
//         </div>

//         {/* PAGE CONTENT */}
//         <main className="p-6 min-h-screen bg-base-100">
//           <Outlet />
//         </main>
//       </div>

//       {/* ================= SIDEBAR ================= */}
//       <div className="drawer-side">
//         <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>

//         <aside className="w-64 min-h-full bg-base-200 p-5">

//           {/* BRAND */}
//           <div className="text-xl font-bold text-center mb-6">
//             AssetVerse
//           </div>

//           <ul className="space-y-2">

//             {/* HOME */}
//             <li>
//               <Link to="/" className={navClass}>
//                 🏠 Home
//               </Link>
//             </li>

//             {/* EMPLOYEE ROUTES */}
//             <li>
//               <NavLink to="/dashboard/my-assets" className={navClass}>
//                 📦 My Assets
//               </NavLink>
//             </li>

//             <li>
//               <NavLink to="/dashboard/assigned-assets" className={navClass}>
//                 📥 Assigned Assets
//               </NavLink>
//             </li>

//             <li>
//               <NavLink to="/dashboard/my-team" className={navClass}>
//                 👥 My Team
//               </NavLink>
//             </li>

//             <li>
//               <NavLink to="/dashboard/request-asset" className={navClass}>
//                 📤 Request Asset
//               </NavLink>
//             </li>

//             <li>
//               <NavLink to="/dashboard/payment-history" className={navClass}>
//                 <FaRegCreditCard />
//                 Payment History
//               </NavLink>
//             </li>

//             {/* HR / ADMIN SECTION */}
//             {isHR && (
//               <>
//                 <div className="divider my-3"></div>

//                 <li>
//                   <NavLink to="/dashboard/add-asset" className={navClass}>
//                     ➕ Add Asset
//                   </NavLink>
//                 </li>

//                 <li>
//                   <NavLink to="/dashboard/requests" className={navClass}>
//                     📋 Requests
//                   </NavLink>
//                 </li>

//                 <li>
//                   <NavLink to="/dashboard/user-management" className={navClass}>
//                     <FaUserShield />
//                     User Management
//                   </NavLink>
//                 </li>

//                 <li>
//                   <NavLink to="/dashboard/approve-employee" className={navClass}>
//                     <FaUserCheck />
//                     Approve Employee
//                   </NavLink>
//                 </li>

//                 <li>
//                   <NavLink to="/dashboard/assign-product" className={navClass}>
//                     🔗 Assign Product
//                   </NavLink>
//                 </li>
//               </>
//             )}

//           </ul>
//         </aside>
//       </div>
//     </div>
//   );
// };

// export default DashboardLayout;


// import React from "react";
// import {
//   Link,
//   NavLink,
//   Outlet,
// } from "react-router-dom";

// // ICONS
// import {
//   FaHome,
//   FaBoxOpen,
//   FaClipboardList,
//   FaTasks,
//   FaUsers,
//   FaCreditCard,
//   FaPlusCircle,
//   FaUserShield,
//   FaUserCheck,
//   FaLink,
//   FaBuilding,
// } from "react-icons/fa";

// // HOOKS
// import useAuth from "../hooks/useAuth";
// import useRole from "../hooks/useRole";

// const DashboardLayout = () => {
//   const { user } = useAuth();

//   const {
//     role,
//     roleLoading,
//     companyId,
//   } = useRole();

//   // ================= LOADING =================
//   if (roleLoading) {
//     return (
//       <div className="min-h-screen flex justify-center items-center">
//         <span className="loading loading-spinner loading-lg"></span>
//       </div>
//     );
//   }

//   // ================= ROLE =================
//   const isHR =
//     role === "hr" || role === "admin";

//   const hasCompany = !!companyId;

//   // ================= NAV STYLE =================
//   const navClass = ({ isActive }) =>
//     `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium
//     ${
//       isActive
//         ? "bg-lime-400 text-black"
//         : "hover:bg-base-300 text-base-content"
//     }`;

//   // ================= EMPLOYEE MENU =================
//   const employeeMenus = [
//     {
//       name: "My Assets",
//       path: "/dashboard/my-assets",
//       icon: <FaBoxOpen />,
//     },

//     {
//       name: "Assigned Assets",
//       path: "/dashboard/assigned-assets",
//       icon: <FaClipboardList />,
//     },

//     {
//       name: "Request Asset",
//       path: "/dashboard/request-asset",
//       icon: <FaTasks />,
//     },

//     {
//       name: "My Team",
//       path: "/dashboard/my-team",
//       icon: <FaUsers />,
//     },

//     {
//       name: "Payment History",
//       path: "/dashboard/payment-history",
//       icon: <FaCreditCard />,
//     },
//   ];

//   // ================= HR MENU =================
//   const hrMenus = [
//     {
//       name: "Add Asset",
//       path: "/dashboard/add-asset",
//       icon: <FaPlusCircle />,
//     },

//     {
//       name: "Assets List",
//       path: "/dashboard/assets-list",
//       icon: <FaBoxOpen />,
//     },

//     {
//       name: "All Requests",
//       path: "/dashboard/all-requests",
//       icon: <FaClipboardList />,
//     },

//     {
//       name: "Employee Management",
//       path: "/dashboard/employee-management",
//       icon: <FaUserShield />,
//     },

//     {
//       name: "Approve Employee",
//       path: "/dashboard/approve-employee",
//       icon: <FaUserCheck />,
//     },

//     {
//       name: "Assign Product",
//       path: "/dashboard/assign-product",
//       icon: <FaLink />,
//     },
//   ];

//   // ================= NO COMPANY MENU =================
//   const noCompanyMenus = [
//     {
//       name: "Join Company",
//       path: "/dashboard/join-company",
//       icon: <FaBuilding />,
//     },
//   ];

//   return (
//     <div className="drawer lg:drawer-open bg-base-100">

//       {/* DRAWER TOGGLE */}
//       <input
//         id="dashboard-drawer"
//         type="checkbox"
//         className="drawer-toggle"
//       />

//       {/* ================= MAIN CONTENT ================= */}
//       <div className="drawer-content flex flex-col">

//         {/* TOP NAVBAR */}
//         <div className="navbar bg-base-200 border-b px-6">

//           {/* MOBILE MENU */}
//           <div className="flex-none lg:hidden">
//             <label
//               htmlFor="dashboard-drawer"
//               className="btn btn-square btn-ghost"
//             >
//               ☰
//             </label>
//           </div>

//           {/* TITLE */}
//           <div className="flex-1">
//             <h2 className="text-2xl font-bold">
//               AssetVerse Dashboard
//             </h2>
//           </div>

//           {/* USER INFO */}
//           <div className="flex items-center gap-3">

//             <div className="hidden md:block text-right">
//               <h3 className="font-semibold">
//                 {user?.displayName || "User"}
//               </h3>

//               <p className="text-sm opacity-70 capitalize">
//                 {role}
//               </p>
//             </div>

//             <img
//               src={
//                 user?.photoURL ||
//                 "https://i.ibb.co/4pDNDk1/avatar.png"
//               }
//               alt="user"
//               className="w-11 h-11 rounded-full object-cover border"
//             />
//           </div>
//         </div>

//         {/* PAGE CONTENT */}
//         <main className="p-4 md:p-6 min-h-screen bg-base-100">
//           <Outlet />
//         </main>
//       </div>

//       {/* ================= SIDEBAR ================= */}
//       <div className="drawer-side z-40">

//         <label
//           htmlFor="dashboard-drawer"
//           className="drawer-overlay"
//         ></label>

//         <aside className="w-72 min-h-full bg-base-200 border-r p-5">

//           {/* LOGO */}
//           <div className="mb-8">
//             <Link
//               to="/"
//               className="text-3xl font-bold text-primary"
//             >
//               AssetVerse
//             </Link>
//           </div>

//           {/* NAVIGATION */}
//           <ul className="space-y-2">

//             {/* HOME */}
//             <li>
//               <NavLink
//                 to="/"
//                 className={navClass}
//               >
//                 <FaHome />
//                 Home
//               </NavLink>
//             </li>

//             {/* ================= EMPLOYEE WITH COMPANY ================= */}
//             {!isHR &&
//               hasCompany &&
//               employeeMenus.map((menu) => (
//                 <li key={menu.path}>
//                   <NavLink
//                     to={menu.path}
//                     className={navClass}
//                   >
//                     {menu.icon}
//                     {menu.name}
//                   </NavLink>
//                 </li>
//               ))}

//             {/* ================= EMPLOYEE WITHOUT COMPANY ================= */}
//             {!isHR &&
//               !hasCompany &&
//               noCompanyMenus.map((menu) => (
//                 <li key={menu.path}>
//                   <NavLink
//                     to={menu.path}
//                     className={navClass}
//                   >
//                     {menu.icon}
//                     {menu.name}
//                   </NavLink>
//                 </li>
//               ))}

//             {/* WARNING */}
//             {!isHR && !hasCompany && (
//               <div className="bg-warning text-black rounded-xl p-4 mt-4 text-sm">
//                 <h3 className="font-bold mb-1">
//                   No Company Affiliation
//                 </h3>

//                 <p>
//                   You are not affiliated with any
//                   company yet.
//                 </p>
//               </div>
//             )}

//             {/* ================= HR SECTION ================= */}
//             {isHR && (
//               <>
//                 <div className="divider py-2">
//                   HR PANEL
//                 </div>

//                 {hrMenus.map((menu) => (
//                   <li key={menu.path}>
//                     <NavLink
//                       to={menu.path}
//                       className={navClass}
//                     >
//                       {menu.icon}
//                       {menu.name}
//                     </NavLink>
//                   </li>
//                 ))}
//               </>
//             )}
//           </ul>
//         </aside>
//       </div>
//     </div>
//   );
// };

// export default DashboardLayout;


// import React from "react";
// import { Link, NavLink, Outlet } from "react-router-dom";

// // ICONS
// import {
//   FaBoxOpen,
//   FaClipboardList,
//   FaCreditCard,
//   FaHome,
//   FaPlusCircle,
//   FaTasks,
//   FaUsers,
//   FaUserShield,
//   FaUserCheck,
//   FaLink,
// } from "react-icons/fa";

// // HOOKS
// import useAuth from "../hooks/useAuth";
// import useRole from "../hooks/useRole";

// const DashboardLayout = () => {
//   const { user } = useAuth();
//   const { role, roleLoading, companyId } = useRole();

//   // ================= LOADING =================
//   if (roleLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <span className="loading loading-spinner loading-lg"></span>
//       </div>
//     );
//   }

//   // ================= ROLE CHECK =================
//   const isHR = ["hr", "admin"].includes(role);

//   // ================= NAV STYLE =================
//   const navClass = ({ isActive }) =>
//     `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium
//     ${
//       isActive
//         ? "bg-lime-400 text-black"
//         : "hover:bg-base-300 text-base-content"
//     }`;

//   return (
//     <div className="drawer lg:drawer-open bg-base-100">

//       {/* TOGGLE */}
//       <input
//         id="dashboard-drawer"
//         type="checkbox"
//         className="drawer-toggle"
//       />

//       {/* ================= MAIN CONTENT ================= */}
//       <div className="drawer-content flex flex-col">

//         {/* TOP NAVBAR */}
//         <div className="navbar bg-base-200 border-b px-6">

//           {/* MOBILE MENU */}
//           <div className="flex-none lg:hidden">
//             <label
//               htmlFor="dashboard-drawer"
//               className="btn btn-square btn-ghost"
//             >
//               ☰
//             </label>
//           </div>

//           {/* TITLE */}
//           <div className="flex-1">
//             <h2 className="text-xl font-bold">
//               AssetVerse Dashboard
//             </h2>
//           </div>

//           {/* USER INFO */}
//           <div className="flex items-center gap-3">

//             <div className="hidden md:block text-right">
//               <p className="font-semibold">
//                 {user?.displayName || "User"}
//               </p>
//               <p className="text-xs opacity-70">
//                 {role}
//               </p>
//             </div>

//             <img
//               src={
//                 user?.photoURL ||
//                 "https://i.ibb.co/4pDNDk1/avatar.png"
//               }
//               alt="user"
//               className="w-10 h-10 rounded-full object-cover"
//             />
//           </div>
//         </div>

//         {/* PAGE CONTENT */}
//         <main className="p-4 md:p-6 min-h-screen">
//           <Outlet />
//         </main>
//       </div>

//       {/* ================= SIDEBAR ================= */}
//       <div className="drawer-side z-40">
//         <label
//           htmlFor="dashboard-drawer"
//           className="drawer-overlay"
//         ></label>

//         <aside className="w-72 min-h-full bg-base-200 border-r p-5">

//           {/* LOGO */}
//           <div className="mb-8">
//             <Link
//               to="/"
//               className="text-2xl font-bold text-primary"
//             >
//               AssetVerse
//             </Link>
//           </div>

//           {/* NAV LIST */}
//           <ul className="space-y-2">

//             {/* HOME */}
//             <li>
//               <NavLink to="/" className={navClass}>
//                 <FaHome />
//                 Home
//               </NavLink>
//             </li>

//             {/* ================= EMPLOYEE ================= */}

//             <li>
//               <NavLink
//                 to="/dashboard/my-assets"
//                 className={navClass}
//               >
//                 <FaBoxOpen />
//                 My Assets
//               </NavLink>
//             </li>

//             <li>
//               <NavLink
//                 to="/dashboard/assigned-assets"
//                 className={navClass}
//               >
//                 <FaClipboardList />
//                 Assigned Assets
//               </NavLink>
//             </li>

//             <li>
//               <NavLink
//                 to="/dashboard/my-team"
//                 className={navClass}
//               >
//                 <FaUsers />
//                 My Team
//               </NavLink>
//             </li>

//             <li>
//               <NavLink
//                 to="/dashboard/request-asset"
//                 className={navClass}
//               >
//                 <FaTasks />
//                 Request Asset
//               </NavLink>
//             </li>

//             <li>
//               <NavLink
//                 to="/dashboard/payment-history"
//                 className={navClass}
//               >
//                 <FaCreditCard />
//                 Payment History
//               </NavLink>
//             </li>

//             {/* ================= NO COMPANY WARNING ================= */}
//             {!companyId && (
//               <div className="p-3 mt-3 bg-warning text-black rounded-xl text-sm">
//                 No company affiliated yet
//               </div>
//             )}

//             {/* ================= HR SECTION ================= */}
//             {isHR && (
//               <>
//                 <div className="divider py-2">
//                   HR PANEL
//                 </div>

//                 <li>
//                   <NavLink
//                     to="/dashboard/add-asset"
//                     className={navClass}
//                   >
//                     <FaPlusCircle />
//                     Add Asset
//                   </NavLink>
//                 </li>

//                 <li>
//                   <NavLink
//                     to="/dashboard/assets-list"
//                     className={navClass}
//                   >
//                     <FaBoxOpen />
//                     Assets List
//                   </NavLink>
//                 </li>

//                 <li>
//                   <NavLink
//                     to="/dashboard/all-requests"
//                     className={navClass}
//                   >
//                     <FaClipboardList />
//                     All Requests
//                   </NavLink>
//                 </li>

//                 <li>
//                   <NavLink
//                     to="/dashboard/employee-management"
//                     className={navClass}
//                   >
//                     <FaUserShield />
//                     Employee Management
//                   </NavLink>
//                 </li>

//                 <li>
//                   <NavLink
//                     to="/dashboard/approve-employee"
//                     className={navClass}
//                   >
//                     <FaUserCheck />
//                     Approve Employee
//                   </NavLink>
//                 </li>

//                 <li>
//                   <NavLink
//                     to="/dashboard/assign-product"
//                     className={navClass}
//                   >
//                     <FaLink />
//                     Assign Product
//                   </NavLink>
//                 </li>
//               </>
//             )}
//           </ul>
//         </aside>
//       </div>
//     </div>
//   );
// };

// export default DashboardLayout;

// // import { Outlet, NavLink } from "react-router-dom";
// // import {
// //   FaHome,
// //   FaBox,
// //   FaUsers,
// //   FaClipboardList,
// //   FaPlus,
// //   FaUser,
// //   FaMoneyBill,
// //   FaSignOutAlt,
// // } from "react-icons/fa";

// // import useRole from "../hooks/useRole";
// // import useAuth from "../hooks/useAuth";

// // const DashboardLayout = () => {
// //   const { role } = useRole();
// //   const { user, logOut } = useAuth();

// //   return (
// //     <div className="drawer lg:drawer-open">
      
// //       <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />

// //       {/* PAGE CONTENT */}
// //       <div className="drawer-content flex flex-col">

// //         {/* TOP NAVBAR */}
// //         <div className="navbar bg-base-100 shadow-md px-6">

// //           <div className="flex-none lg:hidden">
// //             <label
// //               htmlFor="dashboard-drawer"
// //               className="btn btn-square btn-ghost"
// //             >
// //               ☰
// //             </label>
// //           </div>

// //           <div className="flex-1">
// //             <h2 className="text-2xl font-bold text-primary">
// //               AssetVerse
// //             </h2>
// //           </div>

// //           <div className="flex items-center gap-3">

// //             <img
// //               src={user?.photoURL}
// //               alt=""
// //               className="w-10 h-10 rounded-full"
// //             />

// //             <div>
// //               <h3 className="font-semibold">
// //                 {user?.displayName}
// //               </h3>
// //               <p className="text-sm opacity-70">
// //                 {role}
// //               </p>
// //             </div>
// //           </div>
// //         </div>

// //         {/* MAIN CONTENT */}
// //         <div className="p-6 bg-base-200 min-h-screen">
// //           <Outlet />
// //         </div>
// //       </div>

// //       {/* SIDEBAR */}
// //       <div className="drawer-side z-50">
// //         <label
// //           htmlFor="dashboard-drawer"
// //           className="drawer-overlay"
// //         ></label>

// //         <ul className="menu p-4 w-72 min-h-full bg-base-100 text-base-content">

// //           {/* LOGO */}
// //           <div className="mb-8">
// //             <h2 className="text-3xl font-extrabold text-primary">
// //               AssetVerse
// //             </h2>
// //           </div>

// //           {/* HR MENU */}
// //           {role === "hr" && (
// //             <>
// //               <li>
// //                 <NavLink to="/dashboard/hr-home">
// //                   <FaHome /> Dashboard
// //                 </NavLink>
// //               </li>

// //               <li>
// //                 <NavLink to="/dashboard/asset-list">
// //                   <FaBox /> Asset List
// //                 </NavLink>
// //               </li>

// //               <li>
// //                 <NavLink to="/dashboard/add-asset">
// //                   <FaPlus /> Add Asset
// //                 </NavLink>
// //               </li>

// //               <li>
// //                 <NavLink to="/dashboard/all-requests">
// //                   <FaClipboardList /> All Requests
// //                 </NavLink>
// //               </li>

// //               <li>
// //                 <NavLink to="/dashboard/employees">
// //                   <FaUsers /> Employee List
// //                 </NavLink>
// //               </li>

// //               <li>
// //                 <NavLink to="/dashboard/upgrade-package">
// //                   <FaMoneyBill /> Upgrade Package
// //                 </NavLink>
// //               </li>
// //             </>
// //           )}

// //           {/* EMPLOYEE MENU */}
// //           {role === "employee" && (
// //             <>
// //               <li>
// //                 <NavLink to="/dashboard/employee-home">
// //                   <FaHome /> Dashboard
// //                 </NavLink>
// //               </li>

// //               <li>
// //                 <NavLink to="/dashboard/my-assets">
// //                   <FaBox /> My Assets
// //                 </NavLink>
// //               </li>

// //               <li>
// //                 <NavLink to="/dashboard/request-asset">
// //                   <FaPlus /> Request Asset
// //                 </NavLink>
// //               </li>

// //               <li>
// //                 <NavLink to="/dashboard/my-team">
// //                   <FaUsers /> My Team
// //                 </NavLink>
// //               </li>
// //             </>
// //           )}

// //           {/* SHARED */}
// //           <div className="divider"></div>

// //           <li>
// //             <NavLink to="/dashboard/profile">
// //               <FaUser /> Profile
// //             </NavLink>
// //           </li>

// //           <li>
// //             <button onClick={logOut}>
// //               <FaSignOutAlt /> Logout
// //             </button>
// //           </li>
// //         </ul>
// //       </div>
// //     </div>
// //   );
// // };

// // export default DashboardLayout;



import { Outlet, NavLink, Link } from "react-router-dom";

import {
  FaHome,
  FaBox,
  FaUsers,
  FaClipboardList,
  FaPlus,
  FaUser,
  FaMoneyBill,
  FaSignOutAlt,
} from "react-icons/fa";

import useRole from "../hooks/useRole";
import useAuth from "../hooks/useAuth";

const DashboardLayout = () => {
  const { role, roleLoading } = useRole();
  const { user, logOut } = useAuth();


  const normalizedRole = role?.toLowerCase() || "";

  const isHR = normalizedRole === "hr" || normalizedRole === "admin";
  const isEmployee = normalizedRole === "employee";

  if (roleLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  // ================= NAV STYLE =================
  const navClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium
    ${
      isActive
        ? "bg-primary text-white"
        : "hover:bg-base-300 text-base-content"
    }`;

  return (
    <div className="drawer lg:drawer-open bg-base-100">

      <input
        id="dashboard-drawer"
        type="checkbox"
        className="drawer-toggle"
      />

      {/* ================= MAIN ================= */}
      <div className="drawer-content flex flex-col">

        {/* TOP BAR */}
        <div className="navbar bg-base-200 border-b px-4 md:px-6">

          <div className="flex-1">
            <h2 className="text-xl md:text-2xl font-bold text-primary">
              AssetVerse
            </h2>
          </div>

          <div className="flex items-center gap-3">

            <div className="hidden md:block text-right">
              <h3 className="font-semibold">
                {user?.displayName || "User"}
              </h3>

              <p className="text-xs opacity-70 capitalize">
                {normalizedRole || "loading..."}
              </p>
            </div>

            <img
              src={
                user?.photoURL ||
                "https://i.ibb.co/4pDNDk1/avatar.png"
              }
              className="w-10 h-10 rounded-full object-cover border"
              alt="user"
            />
          </div>
        </div>

        {/* PAGE */}
        <main className="p-4 md:p-6 bg-base-100 min-h-screen">
          <Outlet />
        </main>
      </div>

      {/* ================= SIDEBAR ================= */}
      <div className="drawer-side z-50">
        <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>

        <aside className="w-72 min-h-full bg-base-200 border-r">

          <ul className="menu p-5 space-y-2">

            {/* HOME */}
            <li>
              <NavLink to="/" className={navClass}>
                <FaHome /> Home
              </NavLink>
            </li>

            {/* ================= HR ================= */}
            {isHR && (
              <>
                <div className="divider">HR PANEL</div>

                <li>
                  <NavLink to="/dashboard/hr-home" className={navClass}>
                    <FaHome /> Dashboard
                  </NavLink>
                </li>

                <li>
                  <NavLink to="/dashboard/assets-list" className={navClass}>
                    <FaBox /> Asset List
                  </NavLink>
                </li>

                <li>
                  <NavLink to="/dashboard/add-asset" className={navClass}>
                    <FaPlus /> Add Asset
                  </NavLink>
                </li>

                <li>
                  <NavLink to="/dashboard/all-requests" className={navClass}>
                    <FaClipboardList /> All Requests
                  </NavLink>
                </li>

                <li>
                  <NavLink to="/dashboard/employee-list" className={navClass}>
                    <FaUsers /> Employee List
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/dashboard/employee-management" className={navClass}>
                    <FaUsers /> Employee Management
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/dashboard/update-package"
                    className={navClass}
                  >
                    <FaMoneyBill /> Upgrade Package
                  </NavLink>
                </li>
              </>
            )}

            {/* ================= EMPLOYEE ================= */}
            {isEmployee && (
              <>
                <div className="divider">EMPLOYEE PANEL</div>

                <li>
                  <NavLink to="/dashboard/employee-home" className={navClass}>
                    <FaHome /> Dashboard
                  </NavLink>
                </li>

                <li>
                  <NavLink to="/dashboard/my-assets" className={navClass}>
                    <FaBox /> My Assets
                  </NavLink>
                </li>

                <li>
                  <NavLink to="/dashboard/request-asset" className={navClass}>
                    <FaPlus /> Request Asset
                  </NavLink>
                </li>

                <li>
                  <NavLink to="/dashboard/my-team" className={navClass}>
                    <FaUsers /> My Team
                  </NavLink>
                </li>
                 <li>
                  <NavLink to="/dashboard/my-companies" className={navClass}>
                    <FaUsers /> My Companies
                  </NavLink>
                </li>
              </>
            )}

            {/* PROFILE */}
            <div className="divider">ACCOUNT</div>

            <li>
              <NavLink to="/dashboard/profile" className={navClass}>
                <FaUser /> Profile
              </NavLink>
            </li>

            <li>
              <button
                onClick={logOut}
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500 hover:text-white w-full"
              >
                <FaSignOutAlt /> Logout
              </button>
            </li>
          </ul>
        </aside>
      </div>
    </div>
  );
};

export default DashboardLayout;
