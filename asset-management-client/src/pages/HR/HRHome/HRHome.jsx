
import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

import {
  FaBox,
  FaUsers,
  FaClipboardList,
  FaCheckCircle,
} from "react-icons/fa";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const axiosSecure = useAxiosSecure();

  // ================= DATA =================

  const { data, isLoading, isError } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const res = await axiosSecure.get("/dashboard/stats");
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="mt-3 text-gray-500">Loading dashboard...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-500 mt-20">
        Failed to load dashboard data
      </div>
    );
  }

  // ================= STATS CONFIG =================

  const stats = [
    {
      title: "Total Assets",
      value: data?.stats?.totalAssets || 0,
      icon: <FaBox />,
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      title: "Employees",
      value: data?.stats?.employees || 0,
      icon: <FaUsers />,
      color: "text-green-500",
      bg: "bg-green-50",
    },
    {
      title: "Pending Requests",
      value: data?.stats?.pendingRequests || 0,
      icon: <FaClipboardList />,
      color: "text-yellow-500",
      bg: "bg-yellow-50",
    },
    {
      title: "Approved Assets",
      value: data?.stats?.approvedAssets || 0,
      icon: <FaCheckCircle />,
      color: "text-emerald-500",
      bg: "bg-emerald-50",
    },
  ];

  const pieData = data?.pieData || [];
  const COLORS = ["#22c55e", "#3b82f6"];

  return (
    <div className="p-6 space-y-10">

      {/* ================= HEADER ================= */}

      <div>
        <h1 className="text-3xl font-bold">
          Dashboard Overview
        </h1>
        <p className="text-gray-500 mt-1">
          Real-time insights of your system
        </p>
      </div>

      {/* ================= STATS ================= */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        {stats.map((item, index) => (
          <div
            key={index}
            className="bg-base-100 shadow-md rounded-2xl p-5 flex items-center justify-between hover:shadow-xl transition"
          >

            <div>
              <p className="text-sm text-gray-500">
                {item.title}
              </p>

              <h2 className="text-2xl font-bold mt-1">
                {item.value}
              </h2>
            </div>

            <div
              className={`text-3xl p-3 rounded-xl ${item.bg} ${item.color}`}
            >
              {item.icon}
            </div>

          </div>
        ))}

      </div>

      {/* ================= CHART SECTION ================= */}

      <div className="grid lg:grid-cols-2 gap-8">

        {/* PIE CHART CARD */}
        <div className="bg-base-100 shadow-md rounded-2xl p-6">

          <div className="mb-4">
            <h2 className="text-xl font-bold">
              Asset Distribution
            </h2>
            <p className="text-sm text-gray-500">
              Returnable vs Non-returnable
            </p>
          </div>

          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={110}
                label
              >
                {pieData.map((_, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* RIGHT SIDE INFO CARD */}
        <div className="bg-base-100 shadow-md rounded-2xl p-6">

          <h2 className="text-xl font-bold mb-4">
            Quick Insights
          </h2>

          <div className="space-y-4 text-gray-600">

            <p>
              📦 Total assets in system:{" "}
              <span className="font-semibold text-black">
                {data?.stats?.totalAssets}
              </span>
            </p>

            <p>
              👨‍💼 Active employees:{" "}
              <span className="font-semibold text-black">
                {data?.stats?.employees}
              </span>
            </p>

            <p>
              ⏳ Pending approvals:{" "}
              <span className="font-semibold text-black">
                {data?.stats?.pendingRequests}
              </span>
            </p>

            <p>
              ✅ Approved assets:{" "}
              <span className="font-semibold text-black">
                {data?.stats?.approvedAssets}
              </span>
            </p>

          </div>

        </div>

      </div>
    </div>
  );
};

export default Dashboard;
