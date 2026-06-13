


import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import useRole from "../../../hooks/useRole";
import axios from "axios";

const Navbar = () => {
  const { user, logOut } = useAuth();
  const { role, roleLoading, refetchRole } = useRole();
  const navigate = useNavigate();
  const [isSyncing, setIsSyncing] = useState(false);

  // ================= SYNC ROLE WITH BACKEND =================
  const syncUserRole = async () => {
    if (!user) return;
    
    setIsSyncing(true);
    try {
      const token = await user.getIdToken();
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/sync-user-role`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      if (response.data.success) {
        await refetchRole();
        console.log("Role synced:", response.data.role);
      }
    } catch (error) {
      console.error("Role sync failed:", error);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    if (user) {
      syncUserRole();
    }
  }, [user]);

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
  if (roleLoading || isSyncing) {
    return (
      <div className="navbar bg-base-100 shadow-md px-6">
        <span className="loading loading-spinner loading-md"></span>
      </div>
    );
  }


  const isHR = role === "hr" || role === "admin";
  
  console.log("Current role:", role, "isHR:", isHR); 

  return (
    <div className="navbar bg-base-100 shadow-md sticky top-0 z-50 px-4 md:px-8">

      {/* ================= LEFT ================= */}
      <div className="navbar-start">

        {/* MOBILE MENU */}
        <div className="dropdown lg:hidden">
          <label tabIndex={0} className="btn btn-ghost">
            ☰
          </label>

          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-3 shadow bg-base-100 rounded-box w-56 space-y-1"
          >
            <li>
              <NavLink to="/" className={navClass}>Home</NavLink>
            </li>

            <li>
              <NavLink to="/assets" className={navClass}>Assets</NavLink>
            </li>

            <li>
              <NavLink to="/packages" className={navClass}>Packages</NavLink>
            </li>

            <li>
              <NavLink to="/features" className={navClass}>Features</NavLink>
            </li>

            <li>
              <NavLink to="/faq" className={navClass}>FAQ</NavLink>
            </li>

            {!user && (
              <>
                <li>
                  <NavLink to="/login" className={navClass}>Login</NavLink>
                </li>

                <li>
                  <NavLink to="/hr-register" className={navClass}> HR Register</NavLink>
                </li>
              </>
            )}

            {user && (
              <>
                <li>
                  <NavLink to="/dashboard" className={navClass}>Dashboard</NavLink>
                </li>
                {isHR && (
                  <li>
                    <NavLink to="/dashboard/assets-list" className={navClass}>Manage Assets</NavLink>
                  </li>
                )}
              </>
            )}
          </ul>
        </div>

        {/* LOGO */}
        <Link to="/" className="text-3xl font-extrabold text-primary">
          AssetVerse
        </Link>
      </div>

      {/* ================= CENTER ================= */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal gap-4 text-base">

          <li>
            <NavLink to="/" className={navClass}>Home</NavLink>
          </li>

          <li>
            <NavLink to="/assets" className={navClass}>Assets</NavLink>
          </li>

          <li>
            <NavLink to="/packages" className={navClass}>Packages</NavLink>
          </li>

          <li>
            <NavLink to="/features" className={navClass}>Features</NavLink>
          </li>

          <li>
            <NavLink to="/faq" className={navClass}>FAQ</NavLink>
          </li>

          {user && (
            <li>
              <NavLink to="/dashboard" className={navClass}>
                Dashboard
              </NavLink>
            </li>
          )}
          
          {user && isHR && (
            <li>
              <NavLink to="/dashboard/assets-list" className={navClass}>
                Manage Assets
              </NavLink>
            </li>
          )}
        </ul>
      </div>

      {/* ================= RIGHT ================= */}
      <div className="navbar-end gap-2">

        {!user && (
          <>
            <Link
              to="/login"
              className="btn btn-outline btn-primary btn-sm hidden md:flex"
            >
              Login
            </Link>

            <Link
              to="/hr-register"
              className="btn btn-primary btn-sm hidden md:flex"
            >
               HR Register
            </Link>
          </>
        )}

        {user && (
          <div className="dropdown dropdown-end">

            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
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
              <li className="px-2 py-2 border-b">
                <h2 className="font-bold">
                  {user?.displayName || "User"}
                </h2>
                <p className="text-xs opacity-70 capitalize">
                  {role || "employee"}
                </p>
              </li>

              <li>
                <Link to="/dashboard">Dashboard</Link>
              </li>

              <li>
                <Link to="/dashboard/profile">Profile</Link>
              </li>

              {isHR ? (
                <>
                  <li>
                    <Link to="/dashboard/assets-list">
                      Manage Assets
                    </Link>
                  </li>
                  <li>
                    <Link to="/dashboard/employee-list">
                      Employees
                    </Link>
                  </li>
               
                  <li>
                    <Link to="/dashboard/all-requests">
                      Requests
                    </Link>
                  </li>
                </>
              ) : (
                <li>
                  <Link to="/dashboard/my-assets">
                    My Assets
                  </Link>
                </li>
              )}

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

