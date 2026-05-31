import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

import { FaTrash, FaUsers, FaBuilding } from "react-icons/fa";

const EmployeeList = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // ================= GET EMPLOYEES =================
  const {
    data: employees = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      const res = await axiosSecure.get("/employees");
      return res.data;
    },
  });

  // ================= REMOVE EMPLOYEE =================
  const removeMutation = useMutation({
    mutationFn: async (id) => {
      return await axiosSecure.delete(`/employees/${id}`);
    },

    onSuccess: () => {
      toast.success("Employee removed successfully ❌");

      queryClient.invalidateQueries({
        queryKey: ["employees"],
      });
    },

    onError: () => {
      toast.error("Failed to remove employee");
    },
  });

  // ================= LOADING =================
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  // ================= ERROR =================
  if (isError) {
    return (
      <div className="text-center text-red-500 mt-10">
        Failed to load employees ❌
      </div>
    );
  }

  // ================= EMPTY =================
  if (!employees.length) {
    return (
      <div className="text-center text-gray-500 mt-10">
        No employees found 👀
      </div>
    );
  }

  const used = employees.length;

  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

        <h2 className="text-3xl font-bold flex items-center gap-3">
          <FaUsers className="text-primary" />
          Employee List
        </h2>

        <div className="badge badge-primary p-5 text-sm font-semibold">
          Total Employees: {used}
        </div>

      </div>

      {/* TABLE */}
      <div className="overflow-x-auto bg-base-100 shadow-xl rounded-2xl border border-base-300">

        <table className="table table-zebra w-full">

          {/* HEAD */}
          <thead className="bg-base-200 text-base-content">
            <tr>
              <th>#</th>
              <th>Employee</th>
              <th>Email</th>
              <th>Company</th>
              <th>Join Date</th>
              <th>Assets</th>
              <th>Action</th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody>

            {employees.map((emp, index) => (
              <tr key={emp._id} className="hover">

                {/* INDEX */}
                <td className="font-semibold">
                  {index + 1}
                </td>

                {/* EMPLOYEE */}
                <td>
                  <div className="flex items-center gap-3">

                    <img
                      src={
                        emp.profileImage ||
                        "https://i.ibb.co/2Wz5b7z/user.png"
                      }
                      alt="user"
                      className="w-12 h-12 rounded-full object-cover border"
                    />

                    <div>
                      <h3 className="font-bold">
                        {emp.employeeName}
                      </h3>

                      <p className="text-xs opacity-70">
                        Active Employee
                      </p>
                    </div>

                  </div>
                </td>

                {/* EMAIL */}
                <td className="font-medium">
                  {emp.employeeEmail}
                </td>

                {/* COMPANY */}
                <td>
                  <div className="flex items-center gap-3">

                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">

                      {emp.companyLogo ? (
                        <img
                          src={emp.companyLogo}
                          alt="company"
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <FaBuilding className="text-primary text-lg" />
                      )}

                    </div>

                    <div>
                      <h3 className="font-semibold">
                        {emp.companyName || "No Company"}
                      </h3>
                    </div>

                  </div>
                </td>

                {/* JOIN DATE */}
                <td>
                  {emp.affiliationDate
                    ? new Date(
                        emp.affiliationDate
                      ).toLocaleDateString()
                    : "N/A"}
                </td>

                {/* ASSETS */}
                <td>
                  <span className="badge badge-secondary badge-lg">
                    {emp.assetCount || 0}
                  </span>
                </td>

                {/* ACTION */}
                <td>

                  <button
                    onClick={() => {

                      Swal.fire({
                        title: "Are you sure?",
                        text: "This employee will be removed!",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#d33",
                        cancelButtonColor: "#3085d6",
                        confirmButtonText: "Yes, delete it!",
                      }).then((result) => {

                        if (result.isConfirmed) {
                          removeMutation.mutate(emp._id);
                        }

                      });

                    }}
                    className="btn btn-error btn-sm text-white"
                  >
                    <FaTrash />
                  </button>

                </td>

              </tr>
            ))}

          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeList;