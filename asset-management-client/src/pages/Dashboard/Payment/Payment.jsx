import React from "react";
import { useLocation } from "react-router-dom";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";

const Payment = () => {
  const location = useLocation();

  const packageData = location.state;

  const axiosSecure = useAxiosSecure();

  const { user } = useAuth();

  if (!packageData) {
    return (
      <p className="text-center mt-10 text-red-500">
        No package selected
      </p>
    );
  }

  const handlePayment = async () => {
    try {

      const paymentData = {
        packageName: packageData.name,
        price: Number(packageData.price),
        employeeLimit: Number(packageData.employeeLimit),
        hrEmail: user?.email,
      };

      const res = await axiosSecure.post(
        "/create-checkout-session",
        paymentData
      );

      window.location.href = res.data.url;

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-base-100 shadow rounded-xl">

      <h1 className="text-3xl font-bold text-center mb-6">
        Payment Page
      </h1>

      <div className="space-y-3">

        <p>
          <strong>Package:</strong> {packageData.name}
        </p>

        <p>
          <strong>Price:</strong> ${packageData.price}
        </p>

        <p>
          <strong>Employee Limit:</strong>{" "}
          {packageData.employeeLimit}
        </p>

      </div>

      <button
        onClick={handlePayment}
        className="btn btn-primary w-full mt-6"
      >
        Pay Now
      </button>

    </div>
  );
};

export default Payment;

