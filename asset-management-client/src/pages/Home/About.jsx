import React from "react";
import {
  FaShieldAlt,
  FaUsersCog,
  FaLaptopHouse,
} from "react-icons/fa";
import bannerImage2 from "../../assets/banner2.jpg";

const About = () => {
  return (
    <section className="bg-base-100 py-20 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-primary font-semibold uppercase tracking-widest">
            About AssetVerse
          </p>

          <h2 className="text-4xl md:text-5xl font-bold mt-3 leading-tight">
            Smart HR & Asset Management
            <span className="text-primary"> Simplified</span>
          </h2>

          <p className="mt-6 text-gray-500 leading-relaxed text-lg">
            AssetVerse is a modern B2B HR & Asset Management platform
            designed to help companies efficiently manage employees,
            track assets, and streamline workplace operations —
            all from one centralized dashboard.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-12 items-center mt-16">

          {/* Left Side */}
          <div>
        
             <img className="rounded-3xl shadow-2xl w-full" src={bannerImage2}/>
     
          </div>

          {/* Right Side */}
          <div>
            <h3 className="text-3xl font-bold mb-5">
              Empowering Businesses With Better Control
            </h3>

            <p className="text-gray-600 leading-relaxed mb-5">
              From laptops and office equipment to employee requests
              and team management, AssetVerse provides businesses with
              real-time visibility and complete operational control.
            </p>

            <p className="text-gray-600 leading-relaxed">
              HR managers can monitor inventory, approve requests,
              manage employees, and upgrade company packages,
              while employees can request assets, view assignments,
              and collaborate seamlessly across departments.
            </p>

            {/* Features */}
            <div className="mt-8 space-y-5">

              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-xl text-primary text-xl">
                  <FaLaptopHouse />
                </div>

                <div>
                  <h4 className="font-bold text-lg">
                    Real-Time Asset Tracking
                  </h4>

                  <p className="text-gray-500 text-sm">
                    Monitor and manage company assets with live updates.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-xl text-primary text-xl">
                  <FaUsersCog />
                </div>

                <div>
                  <h4 className="font-bold text-lg">
                    Role-Based Dashboard
                  </h4>

                  <p className="text-gray-500 text-sm">
                    Separate and secure experiences for HR managers
                    and employees.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-xl text-primary text-xl">
                  <FaShieldAlt />
                </div>

                <div>
                  <h4 className="font-bold text-lg">
                    Secure Authentication
                  </h4>

                  <p className="text-gray-500 text-sm">
                    Protected with Firebase Authentication and JWT security.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default About;