
import React from "react";

const Services= ({ icon: Icon, title, description }) => {
  return (
    <div className="card bg-base-100 shadow-md p-6 hover:shadow-xl transition text-center">
      <Icon className="text-4xl text-primary mb-4 mx-auto" />
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  );
};

export default Services;
