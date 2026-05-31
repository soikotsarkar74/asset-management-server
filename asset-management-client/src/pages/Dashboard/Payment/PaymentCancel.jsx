import React from "react";
import { Link } from "react-router";

const PaymentCancel = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] text-center">
      
      <h1 className="text-3xl font-bold text-red-500 mb-4">
        ❌ Payment Cancelled
      </h1>

      <p className="text-gray-600 mb-6">
        Your payment was not completed. You can try again.
      </p>

      <Link to="/dashboard/my-assets">
        <button className="btn btn-error">
          Try Again
        </button>
      </Link>
    </div>
  );
};

export default PaymentCancel;