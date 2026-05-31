import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

import {
  FaBox,
  FaClipboardList,
  FaCheckCircle,
} from "react-icons/fa";

const EmployeeHome = () => {
  const axiosSecure = useAxiosSecure();

  // ================= FETCH DATA =================

  const { data, isLoading, isError } = useQuery({
    queryKey: ["employee-dashboard"],
    queryFn: async () => {
      const res = await axiosSecure.get("/employee/dashboard");
      return res.data;
    },
  });

  // ================= LOADING =================

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  // ================= ERROR =================

  if (isError) {
    return (
      <div className="text-center text-red-500 mt-10">
        Failed to load dashboard
      </div>
    );
  }

  // ================= STATS =================

  const stats = [
    {
      title: "Assigned Assets",
      value: data?.stats?.assignedAssets || 0,
      icon: <FaBox className="text-3xl text-blue-500" />,
    },
    {
      title: "Pending Requests",
      value: data?.stats?.pendingRequests || 0,
      icon: <FaClipboardList className="text-3xl text-yellow-500" />,
    },
    {
      title: "Approved Assets",
      value: data?.stats?.approvedAssets || 0,
      icon: <FaCheckCircle className="text-3xl text-green-500" />,
    },
  ];

  return (
    <div className="space-y-8 p-6">

      {/* ================= HEADER ================= */}

      <div>
        <h2 className="text-3xl font-bold">
          Employee Dashboard
        </h2>

        <p className="text-base-content/70 mt-2">
          Track your assets and requests in real-time
        </p>
      </div>

      {/* ================= STATS ================= */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {stats.map((item, index) => (
          <div
            key={index}
            className="bg-base-200 rounded-2xl p-6 shadow-sm border hover:shadow-md transition"
          >
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm opacity-70">
                  {item.title}
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {item.value}
                </h2>
              </div>

              <div className="text-primary">
                {item.icon}
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* ================= RECENT ASSETS ================= */}

      <div className="bg-base-200 rounded-2xl p-6 shadow-sm border">

        <h2 className="text-2xl font-bold mb-6">
          Recent Assets
        </h2>

        <div className="overflow-x-auto">

          <table className="table">

            <thead>
              <tr>
                <th>Asset</th>
                <th>Type</th>
                <th>Status</th>
                <th>Company</th>
              </tr>
            </thead>

            <tbody>

              {data?.recentAssets?.length > 0 ? (
                data.recentAssets.map((item) => (
                  <tr key={item._id}>

                    <td className="font-semibold">
                      {item.assetName}
                    </td>

                    <td>{item.assetType}</td>

                    <td>
                      <span
                        className={`badge ${
                          item.status === "assigned"
                            ? "badge-success"
                            : "badge-warning"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td>{item.companyName}</td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-6">
                    No recent assets found
                  </td>
                </tr>
              )}

            </tbody>
          </table>

        </div>
      </div>

      {/* ================= QUICK ACTIONS ================= */}

      <div className="bg-base-200 rounded-2xl p-6 shadow-sm border">

        <h2 className="text-2xl font-bold mb-6">
          Quick Actions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <button className="btn btn-primary">
            Request Asset
          </button>

          <button className="btn btn-outline">
            My Assets
          </button>

          <button className="btn btn-outline">
            Team Info
          </button>

        </div>
      </div>

    </div>
  );
};

export default EmployeeHome;