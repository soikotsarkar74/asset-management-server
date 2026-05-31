import React from "react";
import {
  FaBoxes,
  FaUserShield,
  FaClipboardCheck,
  FaCloud
} from "react-icons/fa";
import Services from "../../../compoments/Services/Services";

const OurServices = () => {
  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4">
          Our Services
        </h2>
        <p className="text-center text-gray-500 mb-12 max-w-2xl mx-auto">
          AssetVerse provides powerful tools to manage, track, and secure your
          company assets efficiently.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Services
            icon={FaBoxes}
            title="Asset Management"
            description="Manage all company assets from a single dashboard."
          />

          <Services
            icon={FaClipboardCheck}
            title="Asset Requests"
            description="Employees can request and track asset approvals."
          />

          <Services
            icon={FaUserShield}
            title="Role-Based Access"
            description="Admin & employee permissions with secure access."
          />

          <Services
            icon={FaCloud}
            title="Cloud Storage"
            description="Store asset data securely with cloud integration."
          />
        </div>
      </div>
    </section>
  );
};

export default OurServices;
