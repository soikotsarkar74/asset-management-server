

import React from "react";
import useRole from "../../hooks/useRole";



const UseRole = () => {
  const { role, roleLoading } = useRole();

  if (roleLoading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div className="text-center mt-10">
      <h2 className="text-2xl font-bold">
        Your Role: {role}
      </h2>
    </div>
  );
};

export default UseRole;

