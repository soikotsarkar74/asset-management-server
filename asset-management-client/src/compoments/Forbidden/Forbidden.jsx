import React from "react";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";

const Forbidden = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 px-4">

      <div className="w-80">
        <Lottie
          animationData={null}
          path="https://assets10.lottiefiles.com/packages/lf20_qp1q7mct.json"
          loop
        />
      </div>

      <h1 className="text-3xl md:text-4xl font-bold text-red-500 mt-4">
        403 - Access Forbidden
      </h1>

      <p className="text-gray-600 mt-2 text-center max-w-md">
        You don’t have permission to access this page.
      </p>

      <div className="flex gap-4 mt-6">
        <button
          onClick={() => navigate("/dashboard")}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg"
        >
          Go to Dashboard
        </button>

        <button
          onClick={() => navigate("/")}
          className="px-6 py-2 bg-gray-700 text-white rounded-lg"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default Forbidden;