import { Outlet, NavLink } from "react-router-dom";
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

  const normalizedRole = (role || "").toLowerCase();

  const isHR = ["hr", "admin"].includes(normalizedRole);
  const isEmployee = normalizedRole === "employee";

  // ================= LOGOUT =================
  const handleLogout = async () => {
    try {
      await logOut();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // ================= NAV STYLE =================
  const navClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium
    ${isActive ? "bg-primary text-white" : "hover:bg-base-300 text-base-content"}`;

  if (roleLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-3">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="text-sm opacity-70">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="drawer lg:drawer-open bg-base-100">

      {/* Drawer toggle */}
      <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />

      {/* ================= MAIN CONTENT ================= */}
      <div className="drawer-content flex flex-col">

        {/* TOP NAVBAR */}
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
                {normalizedRole || "role"}
              </p>
            </div>

            <img
              src={user?.photoURL || "https://i.ibb.co/4pDNDk1/avatar.png"}
              className="w-10 h-10 rounded-full object-cover border"
              alt="user"
            />
          </div>
        </div>

        {/* PAGE CONTENT */}
        <main className="p-4 md:p-6 min-h-screen bg-base-100">
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

            {/* ================= HR MENU ================= */}
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
                  <NavLink to="/dashboard/update-package" className={navClass}>
                    <FaMoneyBill /> Upgrade Package
                  </NavLink>
                </li>
              </>
            )}

            {/* ================= EMPLOYEE MENU ================= */}
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

            {/* ================= ACCOUNT ================= */}
            <div className="divider">ACCOUNT</div>

            <li>
              <NavLink to="/dashboard/profile" className={navClass}>
                <FaUser /> Profile
              </NavLink>
            </li>

            <li>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 rounded-xl w-full hover:bg-red-500 hover:text-white transition"
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