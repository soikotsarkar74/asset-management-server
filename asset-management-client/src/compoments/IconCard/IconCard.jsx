import React from "react";

const IconCard = ({ icon: Icon, title, description }) => {
  return (
    <div className="card bg-base-100 shadow-md p-6 text-center">
      <Icon className="text-4xl text-primary mb-4 mx-auto" />
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-sm text-gray-500 mt-2">{description}</p>
    </div>
  );
};

export default IconCard;

