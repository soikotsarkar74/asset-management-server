import React from "react";
import {
  FaBoxOpen,
  FaUsers,
  FaTasks,
  FaShieldAlt,
  FaChartBar,
  FaCreditCard,
  FaSyncAlt,
  FaBell,
} from "react-icons/fa";

const features = [
  {
    icon: <FaBoxOpen />,
    title: "Smart Asset Tracking",
    desc: "Track all company assets in real-time including laptops, chairs, keyboards, and more.",
  },
  {
    icon: <FaUsers />,
    title: "Employee Management",
    desc: "Manage employees efficiently with role-based access and company affiliation system.",
  },
  {
    icon: <FaTasks />,
    title: "Asset Request System",
    desc: "Employees can request assets and HR can approve or reject instantly.",
  },
  {
    icon: <FaShieldAlt />,
    title: "Secure Authentication",
    desc: "Firebase authentication with JWT-based secure backend protection.",
  },
  {
    icon: <FaChartBar />,
    title: "Analytics Dashboard",
    desc: "Visual charts for asset usage, requests, and company insights.",
  },
  {
    icon: <FaCreditCard />,
    title: "Payment Integration",
    desc: "Stripe-powered subscription system for HR package upgrades.",
  },
  {
    icon: <FaSyncAlt />,
    title: "Auto Affiliation System",
    desc: "Employees get automatically linked to companies through asset requests.",
  },
  {
    icon: <FaBell />,
    title: "Smart Notifications",
    desc: "Real-time updates for approvals, requests, and system alerts.",
  },
];

const Features = () => {
  return (
    <div className="min-h-screen bg-base-200 py-12 px-4 md:px-10">

      {/* HEADER */}
      <div className="text-center mb-12">

        <h1 className="text-4xl font-bold text-primary">
          Powerful Features
        </h1>

        <p className="mt-3 text-gray-500 max-w-2xl mx-auto">
          AssetVerse is a complete B2B HR & Asset Management system designed to
          simplify company operations and improve productivity.
        </p>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        {features.map((item, index) => (
          <div
            key={index}
            className="bg-base-100 shadow-md rounded-xl p-6 hover:shadow-xl transition"
          >

            <div className="text-3xl text-primary mb-4">
              {item.icon}
            </div>

            <h2 className="text-xl font-semibold mb-2">
              {item.title}
            </h2>

            <p className="text-sm text-gray-500">
              {item.desc}
            </p>
          </div>
        ))}
      </div>

      {/* BOTTOM CTA */}
      <div className="text-center mt-16">

        <h2 className="text-2xl font-bold">
          Ready to manage your company assets?
        </h2>

        <p className="text-gray-500 mt-2">
          Join AssetVerse and simplify your HR workflow today.
        </p>

        <div className="mt-5">
          <a
            href="/register-employee"
            className="btn btn-primary mr-3"
          >
            Join as Employee
          </a>

          <a
            href="/hr-register"
            className="btn btn-outline btn-primary"
          >
            Join as HR
          </a>
        </div>
      </div>
    </div>
  );
};

export default Features;