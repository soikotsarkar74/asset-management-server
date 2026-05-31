import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

import {
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaClipboardList,
} from "react-icons/fa";

const AllRequests = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // ================= FETCH REQUESTS =================

  const {
    data: requests = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["all-requests"],
    queryFn: async () => {
      const res = await axiosSecure.get("/requests");
      return res.data;
    },
  });

  // ================= APPROVE REQUEST =================

  const handleApprove = async (id) => {
    const confirm = await Swal.fire({
      title: "Approve Request?",
      text: "This asset will be assigned to employee",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#16a34a",
      confirmButtonText: "Approve",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await axiosSecure.patch(
        `/requests/approve/${id}`
      );

      if (res.data.success) {
        queryClient.invalidateQueries({
          queryKey: ["all-requests"],
        });

        Swal.fire({
          icon: "success",
          title: "Request Approved",
          timer: 1800,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Approval Failed",
        text: "Something went wrong",
      });
    }
  };

  // ================= REJECT REQUEST =================

  const handleReject = async (id) => {
    const confirm = await Swal.fire({
      title: "Reject Request?",
      text: "This request will be rejected",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      confirmButtonText: "Reject",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await axiosSecure.patch(
        `/requests/reject/${id}`
      );

      if (res.data.modifiedCount) {
        queryClient.invalidateQueries({
          queryKey: ["all-requests"],
        });

        Swal.fire({
          icon: "success",
          title: "Request Rejected",
          timer: 1800,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Reject Failed",
        text: "Something went wrong",
      });
    }
  };

  // ================= LOADING =================

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  // ================= ERROR =================

  if (isError) {
    return (
      <div className="text-center mt-20">
        <h2 className="text-2xl font-bold text-red-500">
          Failed to Load Requests
        </h2>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">

      {/* ================= HEADER ================= */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <FaClipboardList className="text-primary" />
            All Asset Requests
          </h2>

          <p className="text-sm opacity-70 mt-1">
            Approve or reject employee asset requests.
          </p>
        </div>

        <div className="badge badge-primary badge-lg px-4 py-4">
          Total Requests: {requests.length}
        </div>
      </div>

      {/* ================= TABLE ================= */}

      <div className="overflow-x-auto bg-base-100 rounded-2xl shadow-md border border-base-300">

        <table className="table">

          <thead className="bg-base-200">
            <tr>
              <th>#</th>
              <th>Employee</th>
              <th>Asset</th>
              <th>Type</th>
              <th>Status</th>
              <th>Date</th>
              <th className="text-center">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>

            {requests.map((request, index) => (
              <tr
                key={request._id}
                className="hover"
              >
                {/* INDEX */}
                <td className="font-semibold">
                  {index + 1}
                </td>

                {/* EMPLOYEE */}
                <td>
                  <div>
                    <h3 className="font-semibold">
                      {request.requesterName}
                    </h3>

                    <p className="text-xs opacity-60">
                      {request.requesterEmail}
                    </p>
                  </div>
                </td>

                {/* ASSET */}
                <td>
                  <div className="flex items-center gap-3">
                    <img
                      src={request.assetImage}
                      alt={request.assetName}
                      className="w-12 h-12 rounded-lg object-cover border"
                    />

                    <span className="font-medium">
                      {request.assetName}
                    </span>
                  </div>
                </td>

                {/* TYPE */}
                <td>
                  <span className="badge badge-outline">
                    {request.assetType}
                  </span>
                </td>

                {/* STATUS */}
                <td>
                  <span
                    className={`badge font-medium ${
                      request.requestStatus === "Approved"
                        ? "badge-success"
                        : request.requestStatus === "Rejected"
                        ? "badge-error"
                        : "badge-warning"
                    }`}
                  >
                    {request.requestStatus === "Pending" && (
                      <FaClock className="mr-1" />
                    )}

                    {request.requestStatus === "Approved" && (
                      <FaCheckCircle className="mr-1" />
                    )}

                    {request.requestStatus === "Rejected" && (
                      <FaTimesCircle className="mr-1" />
                    )}

                    {request.requestStatus}
                  </span>
                </td>

                {/* DATE */}
                <td>
                  {new Date(
                    request.requestDate
                  ).toLocaleDateString()}
                </td>

                {/* ACTIONS */}
                <td>

                  <div className="flex items-center justify-center gap-2">

                    <button
                      disabled={
                        request.requestStatus !==
                        "Pending"
                      }
                      onClick={() =>
                        handleApprove(request._id)
                      }
                      className="btn btn-sm btn-success"
                    >
                      Approve
                    </button>

                    <button
                      disabled={
                        request.requestStatus !==
                        "Pending"
                      }
                      onClick={() =>
                        handleReject(request._id)
                      }
                      className="btn btn-sm btn-error"
                    >
                      Reject
                    </button>

                  </div>

                </td>
              </tr>
            ))}

          </tbody>
        </table>

        {/* EMPTY */}

        {requests.length === 0 && (
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold">
              No Requests Found
            </h2>

            <p className="opacity-70 mt-2">
              There are currently no asset requests.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllRequests;