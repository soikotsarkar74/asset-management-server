import React from "react";

const faqs = [
  {
    q: "What is AssetVerse?",
    a: "AssetVerse is a B2B HR & Asset Management system that helps companies track and manage their physical assets and employees efficiently.",
  },
  {
    q: "How does employee affiliation work?",
    a: "Employees start unaffiliated. When they request an asset and HR approves it, they automatically get affiliated with that company.",
  },
  {
    q: "Can an employee join multiple companies?",
    a: "Yes. Employees can be affiliated with multiple companies based on different asset requests and approvals.",
  },
  {
    q: "What happens when HR reaches employee limit?",
    a: "HR must upgrade their package using Stripe payment to increase employee limits and continue approvals.",
  },
  {
    q: "What types of assets can be managed?",
    a: "Companies can manage laptops, keyboards, chairs, monitors, and any physical office equipment.",
  },
  {
    q: "Is the system secure?",
    a: "Yes. It uses Firebase Authentication and JWT-based backend security for protected routes and data safety.",
  },
];

const FAQ = () => {
  return (
    <div className="min-h-screen bg-base-200 px-4 md:px-10 py-12">

      {/* HEADER */}
      <div className="text-center mb-10">

        <h1 className="text-4xl font-bold text-primary">
          Frequently Asked Questions
        </h1>

        <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
          Find answers to common questions about AssetVerse system, features,
          and how it works.
        </p>
      </div>

      {/* FAQ ACCORDION */}
      <div className="max-w-3xl mx-auto space-y-3">

        {faqs.map((item, index) => (
          <div
            key={index}
            className="collapse collapse-arrow bg-base-100 shadow-md"
          >

            <input type="radio" name="faq-accordion" />

            <div className="collapse-title text-lg font-medium">
              {item.q}
            </div>

            <div className="collapse-content text-gray-500">
              <p>{item.a}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA SECTION */}
      <div className="text-center mt-14">

        <h2 className="text-2xl font-bold">
          Still have questions?
        </h2>

        <p className="text-gray-500 mt-2">
          Contact our support team or start using AssetVerse today.
        </p>

        <div className="mt-5">
          <a
            href="/register-employee"
            className="btn btn-primary mr-3"
          >
            Get Started
          </a>

          <a
            href="/login"
            className="btn btn-outline btn-primary"
          >
            Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQ;