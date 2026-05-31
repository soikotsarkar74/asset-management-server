// import React, { useState } from "react";
// import { useQuery, useQueryClient } from "@tanstack/react-query";
// import useAxiosSecure from "../../../hooks/useAxiosSecure";
// import Swal from "sweetalert2";
// import { FaCheck, FaTimes, FaTrash } from "react-icons/fa";

// const ApproveEmployee = () => {
//   const axiosSecure = useAxiosSecure();
//   const queryClient = useQueryClient();
//   const [processingId, setProcessingId] = useState(null);


 
//   const {
//   data: employees = [],
//   isLoading,
//   isError,
// } = useQuery({
//   queryKey: ["employees"],
//   queryFn: async () => {
//     const res = await axiosSecure.get("/users");
//     return res.data;
//   },
// });

//   const updateEmployeeStatus = async (employee, status) => {
//     const confirm = await Swal.fire({
//       title: "Are you sure?",
//       text: `Set status to ${status}?`,
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonText: "Yes",
//     });

//     if (!confirm.isConfirmed) return;

//     try {
//       setProcessingId(employee._id);

//       const res = await axiosSecure.patch(`/employees/${employee._id}`, {
//         status,
//         email: employee.email,
//       });

//       if (res.data.employeeUpdate?.modifiedCount) {
//         queryClient.invalidateQueries(["employees"]);

//         Swal.fire({
//           position: "top-end",
//           icon: "success",
//           title: `Employee ${status}`,
//           showConfirmButton: false,
//           timer: 2000,
//         });
//       }
//     } catch (error) {
//       console.error(error);
//       Swal.fire("Error", "Failed to update", "error");
//     } finally {
//       setProcessingId(null);
//     }
//   };

//   // 🗑️ Delete Employee
//   const handleDelete = async (id) => {
//     const confirm = await Swal.fire({
//       title: "Delete employee?",
//       text: "This action cannot be undone!",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#d33",
//       confirmButtonText: "Delete",
//     });

//     if (!confirm.isConfirmed) return;

//     try {
//       const res = await axiosSecure.delete(`/employees/${id}`);

//       if (res.data.deletedCount) {
//         queryClient.invalidateQueries(["employees"]);

//         Swal.fire("Deleted!", "Employee removed", "success");
//       }
//     } catch (error) {
//       console.error(error);
//       Swal.fire("Error", "Delete failed", "error");
//     }
//   };

//   // 🔄 Loading UI
//   if (isLoading) {
//     return (
//       <div className="flex justify-center mt-10">
//         <span className="loading loading-spinner loading-lg"></span>
//       </div>
//     );
//   }

//   // ❌ Error UI
//   if (isError) {
//     return (
//       <p className="text-center text-red-500 mt-10">
//         Failed to load employees
//       </p>
//     );
//   }

//   return (
//     <div className="p-6">
//       <h3 className="text-2xl font-bold mb-6">
//         Employee Management ({employees.length})
//       </h3>

//       <div className="overflow-x-auto">
//         <table className="table table-zebra">
//           <thead>
//             <tr>
//               <th>#</th>
//               <th>Name</th>
//               <th>Email</th>
//               <th>Application Status</th>
//               <th>Work Status</th>
//               <th>Actions</th>
//             </tr>
//           </thead>

//           <tbody>
//             {employees.map((employee, index) => (
//               <tr key={employee._id}>
//                 <th>{index + 1}</th>
//                 <td>{employee.name}</td>
//                 <td>{employee.email}</td>

//                 {/* Status */}
//                 <td>
//                   <span
//                     className={`font-semibold ${
//                       employee.status === "approved"
//                         ? "text-green-600"
//                         : employee.status === "rejected"
//                         ? "text-red-500"
//                         : "text-yellow-500"
//                     }`}
//                   >
//                     {employee.status}
//                   </span>
//                 </td>

//                 {/* Actions */}
//                 <td className="flex gap-2">
//                   {/* Approve */}
//                   <button
//                     disabled={processingId === employee._id}
//                     onClick={() =>
//                       updateEmployeeStatus(employee, "approved")
//                     }
//                     className="btn btn-sm btn-success"
//                   >
//                     {processingId === employee._id ? "..." : <FaCheck />}
//                   </button>

//                   {/* Reject */}
//                   <button
//                     disabled={processingId === employee._id}
//                     onClick={() =>
//                       updateEmployeeStatus(employee, "rejected")
//                     }
//                     className="btn btn-sm btn-error"
//                   >
//                     <FaTimes />
//                   </button>

//                   {/* Delete */}
//                   <button
//                     onClick={() => handleDelete(employee._id)}
//                     className="btn btn-sm btn-warning"
//                   >
//                     <FaTrash />
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default ApproveEmployee;


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



// import React from "react";
// import { useQuery, useQueryClient } from "@tanstack/react-query";
// import useAxiosSecure from "../../../hooks/useAxiosSecure";
// import Swal from "sweetalert2";

// const ApproveEmployee = () => {
//   const axiosSecure = useAxiosSecure();
//   const queryClient = useQueryClient();

//   const { data: employees = [] } = useQuery({
//     queryKey: ["employee-management"],
//     queryFn: async () => {
//       const res = await axiosSecure.get("/employee-management");
//       return res.data;
//     },
//   });

//   // ================= REMOVE (SOFT DELETE) =================
//   const handleRemove = async (id) => {
//     const confirm = await Swal.fire({
//       title: "Remove employee?",
//       icon: "warning",
//       showCancelButton: true,
//     });

//     if (!confirm.isConfirmed) return;

//     await axiosSecure.patch(`/employee-management/${id}/remove`);

//     queryClient.invalidateQueries({
//       queryKey: ["employee-management"],
//     });

//     Swal.fire("Removed!", "Employee deactivated", "success");
//   };

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold mb-4">
//         Employee Management ({employees.length})
//       </h2>

//       <div className="overflow-x-auto">
//         <table className="table table-zebra">
//           <thead>
//             <tr>
//               <th>#</th>
//               <th>Name</th>
//               <th>Email</th>
//               <th>Company</th>
//               <th>Status</th>
//               <th>Action</th>
//             </tr>
//           </thead>

//           <tbody>
//             {employees.map((emp, i) => (
//               <tr key={emp._id}>
//                 <td>{i + 1}</td>
//                 <td>{emp.employeeName}</td>
//                 <td>{emp.employeeEmail}</td>
//                 <td>{emp.companyName}</td>

//                 <td>
//                   <span
//                     className={`badge ${
//                       emp.status === "active"
//                         ? "badge-success"
//                         : "badge-ghost"
//                     }`}
//                   >
//                     {emp.status}
//                   </span>
//                 </td>

//                 <td>
//                   <button
//                     onClick={() => handleRemove(emp._id)}
//                     className="btn btn-error btn-xs"
//                   >
//                     Remove
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default ApproveEmployee;


// import React, { useState } from "react";
// import { useQuery, useQueryClient } from "@tanstack/react-query";
// import useAxiosSecure from "../../../hooks/useAxiosSecure";
// import Swal from "sweetalert2";

// import { FaCheck, FaTimes, FaTrash, FaUsers } from "react-icons/fa";

// const ApproveEmployee = () => {
//   const axiosSecure = useAxiosSecure();
//   const queryClient = useQueryClient();

//   const [processingId, setProcessingId] = useState(null);

//   // ================= FETCH USERS =================

//   const {
//     data: employees = [],
//     isLoading,
//     isError,
//   } = useQuery({
//     queryKey: ["employees"],
//     queryFn: async () => {
//       const res = await axiosSecure.get("/users");
//       return res.data;
//     },
//   });

//   // ================= APPROVE / REJECT =================

//   const updateRole = async (user, role) => {
//     const confirm = await Swal.fire({
//       title: "Are you sure?",
//       text: `You want to make this user ${role}`,
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: role === "admin" ? "#16a34a" : "#dc2626",
//       confirmButtonText: "Confirm",
//     });

//     if (!confirm.isConfirmed) return;

//     try {
//       setProcessingId(user._id);

//       const res = await axiosSecure.patch(`/users/${user._id}`, {
//         role,
//       });

//       // FIXED CHECK
//       if (res.data.modifiedCount > 0) {
//         queryClient.invalidateQueries({ queryKey: ["employees"] });

//         Swal.fire({
//           icon: "success",
//           title: "Updated Successfully",
//           timer: 1500,
//           showConfirmButton: false,
//         });
//       }
//     } catch (error) {
//       Swal.fire({
//         icon: "error",
//         title: "Failed",
//         text: error.message,
//       });
//     } finally {
//       setProcessingId(null);
//     }
//   };

//   // ================= DELETE =================

//   const handleDelete = async (id) => {
//     const confirm = await Swal.fire({
//       title: "Delete User?",
//       text: "This action cannot be undone",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#dc2626",
//       confirmButtonText: "Delete",
//     });

//     if (!confirm.isConfirmed) return;

//     try {
//       const res = await axiosSecure.delete(`/users/${id}`);

//       if (res.data.deletedCount > 0) {
//         queryClient.invalidateQueries({ queryKey: ["employees"] });

//         Swal.fire({
//           icon: "success",
//           title: "Deleted",
//           timer: 1500,
//           showConfirmButton: false,
//         });
//       }
//     } catch (error) {
//       Swal.fire({
//         icon: "error",
//         title: "Delete Failed",
//         text: error.message,
//       });
//     }
//   };

//   // ================= LOADING =================

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center min-h-[60vh]">
//         <span className="loading loading-spinner loading-lg"></span>
//       </div>
//     );
//   }

//   // ================= ERROR =================

//   if (isError) {
//     return (
//       <p className="text-center text-red-500 mt-10">
//         Failed to load users
//       </p>
//     );
//   }

//   return (
//     <div className="p-4 md:p-6">

//       {/* HEADER */}
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-bold flex items-center gap-2">
//           <FaUsers />
//           Employee Management
//         </h2>

//         <div className="badge badge-primary">
//           Total: {employees.length}
//         </div>
//       </div>

//       {/* TABLE */}
//       <div className="overflow-x-auto bg-base-100 rounded-xl shadow">

//         <table className="table">

//           <thead>
//             <tr>
//               <th>#</th>
//               <th>User</th>
//               <th>Email</th>
//               <th>Role</th>
//               <th>Action</th>
//             </tr>
//           </thead>

//           <tbody>

//             {employees.map((user, index) => (
//               <tr key={user._id}>

//                 <td>{index + 1}</td>

//                 {/* USER */}
//                 <td>
//                   <div className="flex items-center gap-3">
//                     <img
//                       src={
//                         user.photoURL ||
//                         "https://i.ibb.co/4pDNDk1/avatar.png"
//                       }
//                       className="w-10 h-10 rounded-full"
//                       alt="user"
//                     />

//                     <span className="font-semibold">
//                       {user.name}
//                     </span>
//                   </div>
//                 </td>

//                 {/* EMAIL */}
//                 <td>{user.email}</td>

//                 {/* ROLE */}
//                 <td>
//                   <span
//                     className={`badge ${
//                       user.role === "admin"
//                         ? "badge-success"
//                         : "badge-ghost"
//                     }`}
//                   >
//                     {user.role}
//                   </span>
//                 </td>

//                 {/* ACTION */}
//                 <td className="flex gap-2">

//                   {/* MAKE ADMIN */}
//                   <button
//                     disabled={processingId === user._id}
//                     onClick={() =>
//                       updateRole(user, "admin")
//                     }
//                     className="btn btn-success btn-xs"
//                   >
//                     {processingId === user._id ? (
//                       <span className="loading loading-spinner loading-xs"></span>
//                     ) : (
//                       <FaCheck />
//                     )}
//                   </button>

//                   {/* MAKE EMPLOYEE */}
//                   <button
//                     disabled={processingId === user._id}
//                     onClick={() =>
//                       updateRole(user, "employee")
//                     }
//                     className="btn btn-warning btn-xs"
//                   >
//                     <FaTimes />
//                   </button>

//                   {/* DELETE */}
//                   <button
//                     onClick={() =>
//                       handleDelete(user._id)
//                     }
//                     className="btn btn-error btn-xs"
//                   >
//                     <FaTrash />
//                   </button>

//                 </td>

//               </tr>
//             ))}

//           </tbody>

//         </table>
//       </div>
//     </div>
//   );
// };

// export default ApproveEmployee;