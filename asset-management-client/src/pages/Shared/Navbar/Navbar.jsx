
// import { Link } from "react-router-dom";
// import useAuth from "../../../hooks/useAuth";

// const Navbar = () => {
//   const { user, logOut } = useAuth();

//   const handleLogout = () => {
//     logOut()
//       .then(() => console.log("Logged out"))
//       .catch(err => console.log(err));
//   };

//   const navLinks = (
//     <>
//       <li><Link to="/">Home</Link></li>
//       <li><Link to="/about">About Us</Link></li>
//       <li><Link to="/coverage">Coverage</Link></li>
//       {/* <li><Link to="/add-asset">Add-Asset</Link></li> */}
//       <li><Link to="/dashboard/assets">Assets</Link></li>
//       <li><Link to='/dashboard/employee-list'>Employee</Link></li>
//       <li><Link to="/reports">Reports</Link></li>
//       <li><Link to='/dashboard/payment-history'>Payment History</Link></li>

//       {
//         user &&  <> 
//          <li><Link to="/dashboard/my-assets">My Assets</Link></li>
//         </>
//       }
//     </>
//   );

//   return (
//     <div className="navbar bg-base-100 shadow-md px-2 sm:px-4">
      
//       {/* Left */}
//       <div className="navbar-start">
//         {/* Mobile dropdown */}
//         <div className="dropdown">
//           <label tabIndex={0} className="btn btn-ghost lg:hidden">
//             ☰
//           </label>
//           <ul
//             tabIndex={0}
//             className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-56"
//           >
//             {navLinks}
//           </ul>
//         </div>

//         <Link to="/" className="btn btn-ghost text-lg sm:text-xl font-bold">
//           AssetVerse
//         </Link>
//       </div>

//       {/* Center (desktop only) */}
//       <div className="navbar-center hidden lg:flex">
//         <ul className="menu menu-horizontal px-1 gap-1">
//           {navLinks}
//         </ul>
//       </div>

//       {/* Right */}
//       <div className="navbar-end flex gap-2">
//         {user ? (
//           <button onClick={handleLogout} className="btn btn-primary btn-sm sm:btn-md">
//             Log Out
//           </button>
//         ) : (
//           <Link to="/login" className="btn btn-primary btn-sm sm:btn-md">
//             Login
//           </Link>
//         )}

       

//         <Link className="btn bg-yellow-300 text-black mx-4" to='/register-employee'>RegisterEmployee</Link>
//       </div>
//     </div>
//   );
// };

// export default Navbar;


// import { Link } from "react-router-dom";
// import useAuth from "../../../hooks/useAuth";

// const Navbar = () => {
//   const { user, logOut } = useAuth();

//   const handleLogout = () => {
//     logOut()
//       .then(() => console.log("Logged out"))
//       .catch((err) => console.log(err));
//   };

//   return (
//     <div className="navbar bg-base-100 shadow-md px-3 sm:px-6">

//       {/* LEFT */}
//       <div className="navbar-start">
//         <Link to="/" className="btn btn-ghost text-xl font-bold">
//           AssetVerse
//         </Link>
//       </div>

//       {/* CENTER (Desktop) */}
//       <div className="navbar-center hidden lg:flex">
//         <ul className="menu menu-horizontal gap-2">

//           {/* Public Routes */}
//           <li><Link to="/">Home</Link></li>
//           <li><Link to="/coverage">Coverage</Link></li>

//           {/* Auth based */}
//           {!user && (
//             <>
//               <li><Link to="/login">Login</Link></li>
//               <li><Link to="/register">Register</Link></li>
//             </>
//           )}

//           {/* Employee / HR Dashboard */}
//           {user && (
//             <>
//               <li><Link to="/dashboard">Dashboard</Link></li>
//               <li><Link to="/assets">Assets</Link></li>
//               <li><Link to="/dashboard/my-assets">My Assets</Link></li>
//               <li><Link to="/dashboard/assigned-assets">Assigned Assets</Link></li>
//               <li><Link to="/dashboard/my-team">My Team</Link></li>
//               <li><Link to="/dashboard/request-asset">Request Asset</Link></li>
//               <li><Link to="/dashboard/payment-history">Payment History</Link></li>
//             </>
//           )}
//         </ul>
//       </div>

//       {/* RIGHT */}
//       <div className="navbar-end flex gap-2">

//         {user ? (
//           <>
//             <button onClick={handleLogout} className="btn btn-primary btn-sm">
//               Logout
//             </button>

//             <Link
//               to="/register-employee"
//               className="btn btn-warning btn-sm"
//             >
//               Register Employee
//             </Link>
//           </>
//         ) : (
//           <Link to="/login" className="btn btn-primary btn-sm">
//             Login
//           </Link>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Navbar;


import React from "react";
import {
  Link,
  NavLink,
  useNavigate,
} from "react-router-dom";

import useAuth from "../../../hooks/useAuth";
import useRole from "../../../hooks/useRole";

const Navbar = () => {
  const { user, logOut } = useAuth();

  const { role, roleLoading } = useRole();

  const navigate = useNavigate();

  // ================= LOGOUT =================
  const handleLogout = async () => {
    try {
      await logOut();

      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  // ================= NAV STYLE =================
  const navClass = ({ isActive }) =>
    isActive
      ? "text-primary font-semibold"
      : "hover:text-primary transition duration-200";

  // ================= LOADING =================
  if (roleLoading) {
    return (
      <div className="navbar bg-base-100 shadow-md px-6">
        <span className="loading loading-spinner loading-md"></span>
      </div>
    );
  }

  // ================= ROLE =================
  const isHR =
    role === "hr" || role === "admin";

  return (
    <div className="navbar bg-base-100 shadow-md sticky top-0 z-50 px-4 md:px-8">

      {/* ================= LEFT ================= */}
      <div className="navbar-start">

        {/* MOBILE MENU */}
        <div className="dropdown lg:hidden">

          <label
            tabIndex={0}
            className="btn btn-ghost"
          >
            ☰
          </label>

          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-3 shadow bg-base-100 rounded-box w-56 space-y-1"
          >

            {/* PUBLIC LINKS */}
            <li>
              <NavLink to="/" className={navClass}>
                Home
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/packages"
                className={navClass}
              >
                Packages
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/features"
                className={navClass}
              >
                Features
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/faq"
                className={navClass}
              >
                FAQ
              </NavLink>
            </li>

            {/* NOT LOGGED IN */}
            {!user && (
              <>
                <li>
                  <NavLink
                    to="/login"
                    className={navClass}
                  >
                    Login
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/register-employee"
                    className={navClass}
                  >
                    Join as Employee
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/hr-register"
                    className={navClass}
                  >
                    Join as HR
                  </NavLink>
                </li>
              </>
            )}

            {/* LOGGED USER */}
            {user && (
              <li>
                <NavLink
                  to="/dashboard"
                  className={navClass}
                >
                  Dashboard
                </NavLink>
              </li>
            )}
          </ul>
        </div>

        {/* LOGO */}
        <Link
          to="/"
          className="text-3xl font-extrabold text-primary"
        >
          AssetVerse
        </Link>
      </div>

      {/* ================= CENTER ================= */}
      <div className="navbar-center hidden lg:flex">

        <ul className="menu menu-horizontal gap-4 text-base">

          <li>
            <NavLink to="/" className={navClass}>
              Home
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/packages"
              className={navClass}
            >
              Packages
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/features"
              className={navClass}
            >
              Features
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/faq"
              className={navClass}
            >
              FAQ
            </NavLink>
          </li>

          {/* USER */}
          {user && (
            <li>
              <NavLink
                to="/dashboard"
                className={navClass}
              >
                Dashboard
              </NavLink>
            </li>
          )}
        </ul>
      </div>

      {/* ================= RIGHT ================= */}
      <div className="navbar-end gap-2">

        {/* NOT LOGGED */}
        {!user && (
          <>
            <Link
              to="/login"
              className="btn btn-outline btn-primary btn-sm hidden md:flex"
            >
              Login
            </Link>

            <Link
              to="/register-employee"
              className="btn btn-primary btn-sm hidden md:flex"
            >
              Join Employee
            </Link>
          </>
        )}

        {/* LOGGED USER */}
        {user && (
          <div className="dropdown dropdown-end">

            <label
              tabIndex={0}
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full border">

                <img
                  src={
                    user?.photoURL ||
                    "https://i.ibb.co/4pDNDk1/avatar.png"
                  }
                  alt="profile"
                />
              </div>
            </label>

            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-56"
            >

              {/* USER INFO */}
              <li className="px-2 py-2 border-b">

                <h2 className="font-bold">
                  {user?.displayName || "User"}
                </h2>

                <p className="text-xs opacity-70 capitalize">
                  {role}
                </p>
              </li>

              {/* DASHBOARD */}
              <li>
                <Link to="/dashboard">
                  Dashboard
                </Link>
              </li>

              {/* PROFILE */}
              <li>
                <Link to="/dashboard/profile">
                  Profile
                </Link>
              </li>

              {/* ROLE BASED */}
              {isHR ? (
                <li>
                  <Link to="/dashboard/assets-list">
                    Manage Assets
                  </Link>
                </li>
              ) : (
                <li>
                  <Link to="/dashboard/my-assets">
                    My Assets
                  </Link>
                </li>
              )}

              {/* LOGOUT */}
              <li>
                <button onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;


// import { Link, NavLink } from "react-router-dom";
// import useAuth from "../../../hooks/useAuth";
// import useRole from "../../../hooks/useRole";

// const Navbar = () => {
//   const { user, logOut } = useAuth();
//   const { role, roleLoading } = useRole();

//   const handleLogout = async () => {
//     try {
//       await logOut();
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const navClass = ({ isActive }) =>
//     isActive
//       ? "text-primary font-semibold"
//       : "hover:text-primary transition";

//   if (roleLoading) {
//     return (
//       <div className="navbar bg-base-100 shadow-md px-6">
//         <span className="loading loading-spinner loading-md"></span>
//       </div>
//     );
//   }

//   const isEmployee = role === "employee";
//   const isHR = role === "hr" || role === "admin";

//   return (
//     <div className="navbar bg-base-100 shadow-md px-3 sm:px-6">

//       {/* ================= LEFT ================= */}
//       <div className="navbar-start">

//         {/* MOBILE MENU */}
//         <div className="dropdown lg:hidden">

//           <label tabIndex={0} className="btn btn-ghost">
//             ☰
//           </label>

//           <ul
//             tabIndex={0}
//             className="menu menu-sm dropdown-content mt-3 z-[1] p-3 shadow bg-base-100 rounded-box w-56 space-y-1"
//           >

//             {/* HOME */}
//             <li>
//               <NavLink to="/" className={navClass}>
//                 Home
//               </NavLink>
//             </li>

//             {/* PUBLIC ROUTES */}
//             {!user && (
//               <>
//                 <li>
//                   <NavLink to="/login" className={navClass}>
//                     Login
//                   </NavLink>
//                 </li>

//                 <li>
//                   <NavLink
//                     to="/register-employee"
//                     className={navClass}
//                   >
//                     Join Employee
//                   </NavLink>
//                 </li>

//                 <li>
//                   <NavLink to="/join-hr" className={navClass}>
//                     Join HR
//                   </NavLink>
//                 </li>
//               </>
//             )}

//             {/* EMPLOYEE ROUTES */}
//             {user && isEmployee && (
//               <>
//                 <li>
//                   <NavLink
//                     to="/dashboard/my-assets"
//                     className={navClass}
//                   >
//                     My Assets
//                   </NavLink>
//                 </li>

//                 <li>
//                   <NavLink
//                     to="/dashboard/request-asset"
//                     className={navClass}
//                   >
//                     Request Asset
//                   </NavLink>
//                 </li>

//                 <li>
//                   <NavLink
//                     to="/dashboard/my-team"
//                     className={navClass}
//                   >
//                     My Team
//                   </NavLink>
//                 </li>
//               </>
//             )}

//             {/* HR ROUTES */}
//             {user && isHR && (
//               <>
//                 <li>
//                   <NavLink
//                     to="/dashboard/assets-list"
//                     className={navClass}
//                   >
//                     Asset List
//                   </NavLink>
//                 </li>

//                 <li>
//                   <NavLink
//                     to="/dashboard/add-asset"
//                     className={navClass}
//                   >
//                     Add Asset
//                   </NavLink>
//                 </li>

//                 <li>
//                   <NavLink
//                     to="/dashboard/all-requests"
//                     className={navClass}
//                   >
//                     All Requests
//                   </NavLink>
//                 </li>

//                 <li>
//                   <NavLink
//                     to="/dashboard/employee-list"
//                     className={navClass}
//                   >
//                     Employee List
//                   </NavLink>
//                 </li>

//                 <li>
//                   <NavLink
//                     to="/dashboard/payment-history"
//                     className={navClass}
//                   >
//                     Payment History
//                   </NavLink>
//                 </li>
//               </>
//             )}
//           </ul>
//         </div>

//         {/* LOGO */}
//         <Link
//           to="/"
//           className="text-2xl font-bold text-primary"
//         >
//           AssetVerse
//         </Link>
//       </div>

//       {/* ================= CENTER ================= */}
//       <div className="navbar-center hidden lg:flex">

//         <ul className="menu menu-horizontal gap-3">

//           {/* HOME */}
//           <li>
//             <NavLink to="/" className={navClass}>
//               Home
//             </NavLink>
//           </li>

//           {/* PUBLIC ROUTES */}
//           {!user && (
//             <>
//               <li>
//                 <NavLink to="/login" className={navClass}>
//                   Login
//                 </NavLink>
//               </li>

//               <li>
//                 <NavLink
//                   to="/register-employee"
//                   className={navClass}
//                 >
//                   Join Employee
//                 </NavLink>
//               </li>

//               <li>
//                 <NavLink to="/hr-register" className={navClass}>
//                 HR Register
//                 </NavLink>
//               </li>
//             </>
//           )}

//           {/* EMPLOYEE ROUTES */}
//           {user && isEmployee && (
//             <>
//               <li>
//                 <NavLink
//                   to="/dashboard/my-assets"
//                   className={navClass}
//                 >
//                   My Assets
//                 </NavLink>
//               </li>

//               <li>
//                 <NavLink
//                   to="/dashboard/request-asset"
//                   className={navClass}
//                 >
//                   Request Asset
//                 </NavLink>
//               </li>

//               <li>
//                 <NavLink
//                   to="/dashboard/my-team"
//                   className={navClass}
//                 >
//                   My Team
//                 </NavLink>
//               </li>
//             </>
//           )}

//           {/* HR ROUTES */}
//           {user && isHR && (
//             <>
//               <li>
//                 <NavLink
//                   to="/dashboard/assets-list"
//                   className={navClass}
//                 >
//                   Asset List
//                 </NavLink>
//               </li>

//               <li>
//                 <NavLink
//                   to="/dashboard/add-asset"
//                   className={navClass}
//                 >
//                   Add Asset
//                 </NavLink>
//               </li>

//               <li>
//                 <NavLink
//                   to="/dashboard/all-requests"
//                   className={navClass}
//                 >
//                   All Requests
//                 </NavLink>
//               </li>

//               <li>
//                 <NavLink
//                   to="/dashboard/employee-list"
//                   className={navClass}
//                 >
//                   Employees
//                 </NavLink>
//               </li>

//               <li>
//                 <NavLink
//                   to="/dashboard/payment-history"
//                   className={navClass}
//                 >
//                   Payments
//                 </NavLink>
//               </li>
//             </>
//           )}
//         </ul>
//       </div>

//       {/* ================= RIGHT ================= */}
//       <div className="navbar-end gap-2">

//         {user ? (
//           <div className="dropdown dropdown-end">

//             <label
//               tabIndex={0}
//               className="btn btn-ghost btn-circle avatar"
//             >
//               <div className="w-10 rounded-full">
//                 <img
//                   src={
//                     user?.photoURL ||
//                     "https://i.ibb.co/4pDNDk1/avatar.png"
//                   }
//                   alt="profile"
//                 />
//               </div>
//             </label>

//             <ul
//               tabIndex={0}
//               className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
//             >

//               <li className="font-semibold px-2 py-1">
//                 {user?.displayName || "User"}
//               </li>

//               <li>
//                 <Link to="/dashboard/profile">
//                   Profile
//                 </Link>
//               </li>

//               <li>
//                 <button onClick={handleLogout}>
//                   Logout
//                 </button>
//               </li>

//             </ul>
//           </div>
//         ) : (
//           <Link to="/login" className="btn btn-primary btn-sm">
//             Login
//           </Link>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Navbar;