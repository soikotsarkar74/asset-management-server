

import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

import {
  FaCheck,
  FaTimes,
  FaTrash,
  FaUsers,
} from "react-icons/fa";

const ApproveEmployee = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [processingId, setProcessingId] = useState(null);

  // ================= FETCH EMPLOYEES =================

  const {
    data: employees = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users");
      return res.data;
    },
  });

  // ================= UPDATE STATUS =================

  const updateEmployeeStatus = async (employee, status) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: `You want to ${status} this employee`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor:
        status === "approved" ? "#16a34a" : "#dc2626",
      confirmButtonText: "Confirm",
    });

    if (!confirm.isConfirmed) return;

    try {
      setProcessingId(employee._id);

      const res = await axiosSecure.patch(
        `/users/${employee._id}`,
        {
          status,
        }
      );

      if (res.data.employeeUpdate?.modifiedCount) {
        queryClient.invalidateQueries({
          queryKey: ["employees"],
        });

        Swal.fire({
          position: "top-end",
          icon: "success",
          title: `Employee ${status}`,
          showConfirmButton: false,
          timer: 1800,
        });
      }
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "Something went wrong",
      });
    } finally {
      setProcessingId(null);
    }
  };

  // ================= DELETE EMPLOYEE =================

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Delete Employee?",
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      confirmButtonText: "Delete",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await axiosSecure.delete(`/users/${id}`);

      if (res.data.deletedCount) {
        queryClient.invalidateQueries({
          queryKey: ["employees"],
        });

        Swal.fire({
          icon: "success",
          title: "Employee Deleted",
          timer: 1800,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Delete Failed",
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
          Failed to Load Employees
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
            <FaUsers className="text-primary" />
            Employee Management
          </h2>

          <p className="text-sm opacity-70 mt-1">
            Manage employee approvals, rejections, and removal.
          </p>
        </div>

        <div className="badge badge-primary badge-lg px-4 py-4">
          Total Employees: {employees.length}
        </div>
      </div>

      {/* ================= TABLE ================= */}

      <div className="overflow-x-auto bg-base-100 rounded-2xl shadow-md border border-base-300">

        <table className="table">

          <thead className="bg-base-200">
            <tr>
              <th>#</th>
              <th>Employee</th>
              <th>Email</th>
              <th>Status</th>
              <th className="text-center">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>

            {employees.map((employee, index) => (
              <tr
                key={employee._id}
                className="hover"
              >
                {/* INDEX */}
                <td className="font-semibold">
                  {index + 1}
                </td>

                {/* NAME */}
                <td>
                  <div>
                    <h3 className="font-semibold">
                      {employee.name || "No Name"}
                    </h3>

                    <p className="text-xs opacity-60">
                      {employee.role || "employee"}
                    </p>
                  </div>
                </td>

                {/* EMAIL */}
                <td>
                  {employee.email}
                </td>

                {/* STATUS */}
                <td>
                  <span
                    className={`badge font-medium ${
                      employee.status === "approved"
                        ? "badge-success"
                        : employee.status === "rejected"
                        ? "badge-error"
                        : "badge-warning"
                    }`}
                  >
                    {employee.status || "pending"}
                  </span>
                </td>

                {/* ACTIONS */}
                <td>

                  <div className="flex items-center justify-center gap-2">

                    {/* APPROVE */}
                    <button
                      disabled={
                        processingId === employee._id
                      }
                      onClick={() =>
                        updateEmployeeStatus(
                          employee,
                          "approved"
                        )
                      }
                      className="btn btn-sm btn-success"
                    >
                      {processingId === employee._id
                        ? (
                          <span className="loading loading-spinner loading-xs"></span>
                        )
                        : (
                          <FaCheck />
                        )}
                    </button>

                    {/* REJECT */}
                    <button
                      disabled={
                        processingId === employee._id
                      }
                      onClick={() =>
                        updateEmployeeStatus(
                          employee,
                          "rejected"
                        )
                      }
                      className="btn btn-sm btn-error"
                    >
                      <FaTimes />
                    </button>

                    {/* DELETE */}
                    <button
                      onClick={() =>
                        handleDelete(employee._id)
                      }
                      className="btn btn-sm btn-warning"
                    >
                      <FaTrash />
                    </button>

                  </div>

                </td>
              </tr>
            ))}

          </tbody>
        </table>

        {/* EMPTY */}
        {employees.length === 0 && (
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold">
              No Employees Found
            </h2>

            <p className="opacity-70 mt-2">
              Employee list is currently empty.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApproveEmployee;

