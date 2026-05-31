import React from "react";
import { FaShieldAlt, FaClock, FaMapMarkedAlt } from "react-icons/fa";

const OurTreast = () => {
  return (
    <section className="py-16 bg-base-100">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Header */}
        <h2 className="text-3xl font-bold text-center mb-4">
          Our Trust AssetVerse
        </h2>
        <p className="text-center text-gray-500 mb-12 max-w-2xl mx-auto">
          We provide real-time tracking, enterprise-grade security, and
          round-the-clock support to keep your assets safe and under control.
        </p>

        {/* Trust Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          
          {/* Live Tracking */}
          <div className="card bg-base-200 p-6 text-center shadow-md hover:shadow-xl transition">
            <FaMapMarkedAlt className="text-4xl text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              Real-Time Asset Tracking
            </h3>
            <p className="text-sm text-gray-500">
              Monitor your assets live with accurate location and usage updates
              anytime, anywhere.
            </p>
          </div>

          {/* Security */}
          <div className="card bg-base-200 p-6 text-center shadow-md hover:shadow-xl transition">
            <FaShieldAlt className="text-4xl text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              100% Secure System
            </h3>
            <p className="text-sm text-gray-500">
              Role-based access, encrypted data, and secure authentication keep
              your information protected.
            </p>
          </div>

          {/* 24/7 Support */}
          <div className="card bg-base-200 p-6 text-center shadow-md hover:shadow-xl transition">
            <FaClock className="text-4xl text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              24/7 Call Center Support
            </h3>
            <p className="text-sm text-gray-500">
              Our dedicated support team is always available to assist you,
              day or night.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default OurTreast;
