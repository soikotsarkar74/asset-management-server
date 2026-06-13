import React, { useState } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import {
  FaSpinner,
  FaSearch,
  FaUser,
  FaTrash,
} from "react-icons/fa";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

const EmployeeList = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [searchText, setSearchText] = useState("");

  // ================= FETCH EMPLOYEES =================
  const {
    data: employees = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["employees", searchText],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/employee-management?search=${searchText}`
      );
      return res.data;
    },
  });

  // ================= REMOVE EMPLOYEE =================
  const removeEmployeeMutation = useMutation({
    mutationFn: async (employeeId) => {
      const res = await axiosSecure.patch(
        `/employee-management/${employeeId}/remove`
      );
      return res.data;
    },

    onSuccess: () => {
      toast.success("Employee removed successfully");
      queryClient.invalidateQueries({
        queryKey: ["employees"],
      });
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to remove employee"
      );
    },
  });

  // ================= HANDLE REMOVE =================
  const handleRemoveEmployee = (employee) => {
    Swal.fire({
      title: "Remove Employee?",
      text: `Are you sure you want to remove ${employee.employeeName} from your team?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, remove",
    }).then((result) => {
      if (result.isConfirmed) {
        removeEmployeeMutation.mutate(employee._id);
      }
    });
  };

  // ================= LOADING =================
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <FaSpinner className="animate-spin text-4xl text-primary" />
      </div>
    );
  }

  const packageLimit = employees[0]?.packageLimit || 5;

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Employee List</h1>
          <p className="text-gray-500">
            Total Employees: {employees.length}
          </p>
        </div>

        {/* SEARCH */}
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

          <input
            type="text"
            placeholder="Search by name or email..."
            className="input input-bordered pl-10 w-80"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto bg-base-100 rounded-2xl shadow">
        <table className="table table-zebra w-full">
          <thead>
            <tr className="bg-base-200">
              <th>#</th>
              <th>Employee</th>
              <th>Email</th>
              <th>Designation</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {employees.length > 0 ? (
              employees.map((employee, index) => (
                <tr key={employee._id}>
                  <td>{index + 1}</td>

                  {/* Employee */}
                  <td>
                    <div className="flex items-center gap-3">
                      {employee.profileImage ? (
                        <img
                          src={employee.profileImage}
                          alt={employee.employeeName}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                          <FaUser className="text-primary" />
                        </div>
                      )}

                      <div>
                        <div className="font-semibold">
                          {employee.employeeName || "N/A"}
                        </div>

                        <div className="text-sm text-gray-500">
                          {employee.designation || "No designation"}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Email */}
                  <td>{employee.employeeEmail}</td>

                  {/* Designation */}
                  <td>{employee.designation || "—"}</td>

                  {/* Status */}
                  <td>
                    <span className="badge badge-success">
                      {employee.status || "active"}
                    </span>
                  </td>

                  {/* Join Date */}
                  <td>
                    {employee.affiliationDate
                      ? new Date(
                          employee.affiliationDate
                        ).toLocaleDateString("en-BD")
                      : "N/A"}
                  </td>

                  {/* Action */}
                  <td>
                    <button
                      onClick={() => handleRemoveEmployee(employee)}
                      className="btn btn-sm btn-error btn-outline"
                      disabled={removeEmployeeMutation.isPending}
                    >
                      {removeEmployeeMutation.isPending ? (
                        <FaSpinner className="animate-spin" />
                      ) : (
                        <>
                          <FaTrash />
                          Remove
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-10">
                  {searchText ? (
                    <div>
                      <p>No employees found matching "{searchText}"</p>

                      <button
                        onClick={() => setSearchText("")}
                        className="btn btn-primary btn-sm mt-3"
                      >
                        Clear Search
                      </button>
                    </div>
                  ) : (
                    <p>No employees added yet</p>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* STATS */}
      <div className="stats shadow w-full mt-6">
        <div className="stat">
          <div className="stat-title">Total Employees</div>
          <div className="stat-value text-primary">
            {employees.length}
          </div>
          <div className="stat-desc">
            Active team members
          </div>
        </div>

        <div className="stat">
          <div className="stat-title">Package Limit</div>
          <div className="stat-value text-secondary">
            {packageLimit}
          </div>
          <div className="stat-desc">
            Maximum employees allowed
          </div>
        </div>

        <div className="stat">
          <div className="stat-title">Available Slots</div>
          <div className="stat-value text-accent">
            {packageLimit - employees.length}
          </div>
          <div className="stat-desc">
            Upgrade to add more employees
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeList;