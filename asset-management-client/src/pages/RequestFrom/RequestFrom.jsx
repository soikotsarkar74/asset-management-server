

import React, { useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import Swal from "sweetalert2";

const RequestForm = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.email) {
      return Swal.fire("Error", "User not logged in", "error");
    }

    const form = e.target;

    const requestData = {
      assetId: form.assetId.value.trim(),
      assetName: form.assetName.value.trim(),
      assetType: form.assetType.value.trim(),
      hrEmail: form.hrEmail.value.trim(),
      companyName: form.companyName.value.trim(),
    };

    try {
      setLoading(true);

      const res = await axiosSecure.post("/requests", requestData);

      Swal.fire({
        icon: "success",
        title: "Request Sent",
        text: "Your request has been submitted successfully",
        timer: 1500,
        showConfirmButton: false,
      });

      form.reset();
    } catch (error) {
      console.log(error.response?.data || error.message);

      Swal.fire(
        "Failed",
        error.response?.data?.message || "Something went wrong",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="w-full max-w-lg bg-base-100 shadow-2xl rounded-2xl p-6 md:p-8">

        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold">📨 Request Asset</h2>
          <p className="text-sm text-gray-500 mt-1">
            Submit asset request to HR
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            name="assetId"
            placeholder="Asset ID"
            className="input input-bordered w-full"
            required
          />

          <input
            name="assetName"
            placeholder="Asset Name"
            className="input input-bordered w-full"
            required
          />

          <input
            name="assetType"
            placeholder="Asset Type"
            className="input input-bordered w-full"
            required
          />

          <input
            name="hrEmail"
            placeholder="HR Email"
            className="input input-bordered w-full"
            required
          />

          <input
            name="companyName"
            placeholder="Company Name"
            className="input input-bordered w-full"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full"
          >
            {loading ? (
              <span className="loading loading-spinner"></span>
            ) : (
              "Send Request"
            )}
          </button>

        </form>
      </div>
    </div>
  );
};

export default RequestForm;