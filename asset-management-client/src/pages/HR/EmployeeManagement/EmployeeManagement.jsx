// import React, { useEffect, useState } from "react";
// import { useQuery, useQueryClient } from "@tanstack/react-query";
// import useAxiosSecure from "../../../hooks/useAxiosSecure";
// import { FaEdit, FaTrash, FaUserShield, FaUser } from "react-icons/fa";
// import Swal from "sweetalert2";

// const UserManagement = () => {
//   const axiosSecure = useAxiosSecure();
//   const queryClient = useQueryClient();

//   const [searchText, setSearchText] = useState("");
//   const [debouncedSearch, setDebouncedSearch] = useState("");

  
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setDebouncedSearch(searchText);
//     }, 400);

//     return () => clearTimeout(timer);
//   }, [searchText]);


//   const {
//     data: users = [],
//     isLoading,
//     isFetching, 
//     isError,
//   } = useQuery({
//     queryKey: ["users", debouncedSearch],
//     queryFn: async () => {
//       const res = await axiosSecure.get(
//         `/users?searchText=${debouncedSearch}`
//       );
//       return res.data;
//     },
//     keepPreviousData: true,
//   });

//   // ✅ Make Admin
//   const handleMakeAdmin = async (user) => {
//     const confirm = await Swal.fire({
//       title: "Are you sure?",
//       text: `Make ${user.displayName} an admin?`,
//       icon: "warning",
//       showCancelButton: true,
//     });

//     if (confirm.isConfirmed) {
//       const res = await axiosSecure.patch(`/users/${user._id}/role`, {
//         role: "admin",
//       });

//       if (res.data.modifiedCount) {
//         Swal.fire("Success!", "User is now admin.", "success");
//         queryClient.invalidateQueries(["users"]);
//       }
//     }
//   };

//   // ✅ Remove Admin
//   const handleRemoveAdmin = async (user) => {
//     const confirm = await Swal.fire({
//       title: "Are you sure?",
//       text: `Remove admin from ${user.displayName}?`,
//       icon: "warning",
//       showCancelButton: true,
//     });

//     if (confirm.isConfirmed) {
//       const res = await axiosSecure.patch(`/users/${user._id}/role`, {
//         role: "user",
//       });

//       if (res.data.modifiedCount) {
//         Swal.fire("Updated!", "Admin removed.", "success");
//         queryClient.invalidateQueries(["users"]);
//       }
//     }
//   };

//   if (isLoading) {
//     return <p className="text-center mt-10">Loading users...</p>;
//   }

//   if (isError) {
//     return (
//       <p className="text-center mt-10 text-red-500">
//         Failed to load users
//       </p>
//     );
//   }

//   return (
//     <div className="p-6 bg-base-100 shadow-xl rounded-2xl">
//       {/* Header */}
//       <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
//         <h1 className="text-2xl font-bold">
//           User Management ({users.length})
//         </h1>

//         {/* 🔍 Search */}
//         <div className="relative w-full max-w-xs">
//           <input
//             type="text"
//             placeholder=" "
//             value={searchText}
//             onChange={(e) => setSearchText(e.target.value)}
//             className="input input-bordered w-full peer"
//           />
//           <label className="absolute left-3 top-2 text-gray-500 text-sm transition-all
//             peer-placeholder-shown:top-3.5 
//             peer-placeholder-shown:text-base
//             peer-focus:top-2 
//             peer-focus:text-sm 
//             peer-focus:text-primary">
//             {/* Search users... */}
//           </label> 

//           {/* 🔥 Searching indicator */}
//           {isFetching && (
//             <span className="absolute right-3 top-3 loading loading-spinner loading-xs"></span>
//           )}
//         </div>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto rounded-xl border">
//         <table className="table table-zebra">
//           <thead className="bg-base-200">
//             <tr>
//               <th>#</th>
//               <th>User</th>
//               <th>Email</th>
//               <th>Role</th>
//               <th>Actions</th>
//               <th>Admin</th>
//             </tr>
//           </thead>

//           <tbody>
//             {users.map((user, index) => (
//               <tr key={user._id}>
//                 <th>{index + 1}</th>

//                 <td>
//                   <div className="flex items-center gap-3">
//                     <div className="avatar">
//                       <div className="w-10 rounded-full">
//                         <img
//                           src={
//                             user.photoURL ||
//                             "https://i.ibb.co/4pDNDk1/avatar.png"
//                           }
//                           alt="user"
//                         />
//                       </div>
//                     </div>
//                     <div className="font-semibold">
//                       {user.displayName || "No Name"}
//                     </div>
//                   </div>
//                 </td>

//                 <td className="text-sm text-gray-500">
//                   {user.email}
//                 </td>

//                 <td>
//                   <span
//                     className={`badge ${
//                       user.role === "admin"
//                         ? "badge-success"
//                         : "badge-ghost"
//                     }`}
//                   >
//                     {user.role || "user"}
//                   </span>
//                 </td>

//                 <td className="flex gap-2">
//                   <button className="btn btn-xs btn-outline btn-info">
//                     <FaEdit />
//                   </button>
//                   <button className="btn btn-xs btn-outline btn-error">
//                     <FaTrash />
//                   </button>
//                 </td>

//                 <td>
//                   {user.role === "admin" ? (
//                     <button
//                       onClick={() => handleRemoveAdmin(user)}
//                       className="btn btn-xs btn-warning"
//                     >
//                       <FaUser /> Remove
//                     </button>
//                   ) : (
//                     <button
//                       onClick={() => handleMakeAdmin(user)}
//                       className="btn btn-xs btn-success"
//                     >
//                       <FaUserShield /> Make Admin
//                     </button>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {users.length === 0 && (
//           <p className="text-center py-6 text-gray-400">
//             No users found
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default UserManagement;



// import React, { useEffect, useState } from "react";
// import { useQuery, useQueryClient } from "@tanstack/react-query";
// import useAxiosSecure from "../../../hooks/useAxiosSecure";
// import { FaEdit, FaTrash, FaUserShield, FaUser } from "react-icons/fa";
// import Swal from "sweetalert2";

// const UserManagement = () => {
//   const axiosSecure = useAxiosSecure();
//   const queryClient = useQueryClient();

//   const [searchText, setSearchText] = useState("");
//   const [debouncedSearch, setDebouncedSearch] = useState("");

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setDebouncedSearch(searchText);
//     }, 400);

//     return () => clearTimeout(timer);
//   }, [searchText]);


//   const {
//     data: users = [],
//     isLoading,
//     isFetching, 
//     isError,
//   } = useQuery({
//     queryKey: ["users", debouncedSearch],
//     queryFn: async () => {
//       const res = await axiosSecure.get(
//         `/users?searchText=${debouncedSearch}`
//       );
//       return res.data;
//     },
//     keepPreviousData: true,
//   });

//   // ✅ Make Admin
//   const handleMakeHr = async (user) => {
//     const confirm = await Swal.fire({
//       title: "Are you sure?",
//       text: `Make ${user.displayName} an admin?`,
//       icon: "warning",
//       showCancelButton: true,
//     });

//     if (confirm.isConfirmed) {
//       const res = await axiosSecure.patch(`/users/${user._id}/role`, {
//         role: "admin",
//       });

//       if (res.data.modifiedCount) {
//         Swal.fire("Success!", "User is now admin.", "success");
//         queryClient.invalidateQueries(["users"]);
//       }
//     }
//   };

//   // ✅ Remove Admin
//   const handleRemoveHr = async (user) => {
//     const confirm = await Swal.fire({
//       title: "Are you sure?",
//       text: `Remove admin from ${user.displayName}?`,
//       icon: "warning",
//       showCancelButton: true,
//     });

//     if (confirm.isConfirmed) {
//       const res = await axiosSecure.patch(`/users/${user._id}/role`, {
//         role: "user",
//       });

//       if (res.data.modifiedCount) {
//         Swal.fire("Updated!", "Admin removed.", "success");
//         queryClient.invalidateQueries(["users"]);
//       }
//     }
//   };

//   if (isLoading) {
//     return <p className="text-center mt-10">Loading users...</p>;
//   }

//   if (isError) {
//     return (
//       <p className="text-center mt-10 text-red-500">
//         Failed to load users
//       </p>
//     );
//   }

//   return (
//     <div className="p-6 bg-base-100 shadow-xl rounded-2xl">
//       {/* Header */}
//       <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
//         <h1 className="text-2xl font-bold">
//           User Management ({users.length})
//         </h1>

//         {/* 🔍 Search */}
//         <div className="relative w-full max-w-xs">
//           <input
//             type="text"
//             placeholder=" "
//             value={searchText}
//             onChange={(e) => setSearchText(e.target.value)}
//             className="input input-bordered w-full peer"
//           />
//           <label className="absolute left-3 top-2 text-gray-500 text-sm transition-all
//             peer-placeholder-shown:top-3.5 
//             peer-placeholder-shown:text-base
//             peer-focus:top-2 
//             peer-focus:text-sm 
//             peer-focus:text-primary">
//             {/* Search users... */}
//           </label> 

//           {/* 🔥 Searching indicator */}
//           {isFetching && (
//             <span className="absolute right-3 top-3 loading loading-spinner loading-xs"></span>
//           )}
//         </div>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto rounded-xl border">
//         <table className="table table-zebra">
//           <thead className="bg-base-200">
//             <tr>
//               <th>#</th>
//               <th>User</th>
//               <th>Email</th>
//               <th>Role</th>
//               <th>Actions</th>
//               <th>Admin</th>
//             </tr>
//           </thead>

//           <tbody>
//             {users.map((user, index) => (
//               <tr key={user._id}>
//                 <th>{index + 1}</th>

//                 <td>
//                   <div className="flex items-center gap-3">
//                     <div className="avatar">
//                       <div className="w-10 rounded-full">
//                         <img
//                           src={
//                             user.photoURL ||
//                             "https://i.ibb.co/4pDNDk1/avatar.png"
//                           }
//                           alt="user"
//                         />
//                       </div>
//                     </div>
//                     <div className="font-semibold">
//                       {user.displayName || "No Name"}
//                     </div>
//                   </div>
//                 </td>

//                 <td className="text-sm text-gray-500">
//                   {user.email}
//                 </td>

//                 <td>
//                   <span
//                     className={`badge ${
//                       user.role === "hr"
//                         ? "badge-success"
//                         : "badge-ghost"
//                     }`}
//                   >
//                     {user.role || "user"}
//                   </span>
//                 </td>

//                 <td className="flex gap-2">
//                   <button className="btn btn-xs btn-outline btn-info">
//                     <FaEdit />
//                   </button>
//                   <button className="btn btn-xs btn-outline btn-error">
//                     <FaTrash />
//                   </button>
//                 </td>

//                 <td>
//                   {user.role === "hr" ? (
//                     <button
//                       onClick={() => handleRemoveHr(user)}
//                       className="btn btn-xs btn-warning"
//                     >
//                       <FaUser /> Remove
//                     </button>
//                   ) : (
//                     <button
//                       onClick={() => handleMakeHr(user)}
//                       className="btn btn-xs btn-success"
//                     >
//                       <FaUserShield /> Make Hr
//                     </button>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {users.length === 0 && (
//           <p className="text-center py-6 text-gray-400">
//             No users found
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default UserManagement;


// import React, { useEffect, useState } from "react";
// import { useQuery, useQueryClient } from "@tanstack/react-query";
// import useAxiosSecure from "../../../hooks/useAxiosSecure";
// import { FaUserShield, FaUser } from "react-icons/fa";
// import Swal from "sweetalert2";

// const UserManagement = () => {
//   const axiosSecure = useAxiosSecure();
//   const queryClient = useQueryClient();

//   const [searchText, setSearchText] = useState("");
//   const [debouncedSearch, setDebouncedSearch] = useState("");

//   // debounce search
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setDebouncedSearch(searchText);
//     }, 400);

//     return () => clearTimeout(timer);
//   }, [searchText]);

//   // fetch users
//   const { data: users = [], isLoading, isFetching, isError } = useQuery({
//     queryKey: ["users", debouncedSearch],
//     queryFn: async () => {
//       const res = await axiosSecure.get(
//         `/users?search=${debouncedSearch}`
//       );
//       return res.data;
//     },
//     keepPreviousData: true,
//   });

//   // Make Admin
//   const handleMakeAdmin = async (user) => {
//     const confirm = await Swal.fire({
//       title: "Are you sure?",
//       text: `Make ${user.name} an admin?`,
//       icon: "warning",
//       showCancelButton: true,
//     });

//     if (confirm.isConfirmed) {
//       const res = await axiosSecure.patch(`/users/${user._id}`, {
//         role: "admin",
//       });

//       if (res.data.modifiedCount > 0) {
//         Swal.fire("Success!", "User is now admin.", "success");
//         queryClient.invalidateQueries(["users"]);
//       }
//     }
//   };

//   // Remove Admin
//   const handleRemoveAdmin = async (user) => {
//     const confirm = await Swal.fire({
//       title: "Are you sure?",
//       text: `Remove admin from ${user.name}?`,
//       icon: "warning",
//       showCancelButton: true,
//     });

//     if (confirm.isConfirmed) {
//       const res = await axiosSecure.patch(`/users/${user._id}`, {
//         role: "employee",
//       });

//       if (res.data.modifiedCount > 0) {
//         Swal.fire("Updated!", "Admin removed.", "success");
//         queryClient.invalidateQueries(["users"]);
//       }
//     }
//   };

//   if (isLoading) return <p className="text-center mt-10">Loading...</p>;
//   if (isError) return <p className="text-center text-red-500">Error loading users</p>;

//   return (
//     <div className="p-6 bg-base-100 rounded-2xl shadow-xl">

//       {/* HEADER */}
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-bold">
//           User Management ({users.length})
//         </h2>

//         <input
//           type="text"
//           placeholder="Search users..."
//           value={searchText}
//           onChange={(e) => setSearchText(e.target.value)}
//           className="input input-bordered"
//         />
//       </div>

//       {/* TABLE */}
//       <div className="overflow-x-auto">
//         <table className="table table-zebra">

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
//             {users.map((user, index) => (
//               <tr key={user._id}>
//                 <td>{index + 1}</td>

//                 {/* USER */}
//                 <td className="flex items-center gap-3">
//                   <img
//                     src={user.photoURL || "https://i.ibb.co/4pDNDk1/avatar.png"}
//                     className="w-10 h-10 rounded-full"
//                   />
//                   <span className="font-semibold">
//                     {user.name || "No Name"}
//                   </span>
//                 </td>

//                 <td>{user.email}</td>

//                 <td>
//                   <span className={`badge ${user.role === "admin" ? "badge-success" : "badge-ghost"}`}>
//                     {user.role}
//                   </span>
//                 </td>

//                 <td className="flex gap-2">

//                   {user.role === "admin" ? (
//                     <button
//                       onClick={() => handleRemoveAdmin(user)}
//                       className="btn btn-warning btn-xs"
//                     >
//                       <FaUser /> Remove
//                     </button>
//                   ) : (
//                     <button
//                       onClick={() => handleMakeAdmin(user)}
//                       className="btn btn-success btn-xs"
//                     >
//                       <FaUserShield /> Make Admin
//                     </button>
//                   )}

//                 </td>
//               </tr>
//             ))}
//           </tbody>

//         </table>
//       </div>

//     </div>
//   );
// };

// export default UserManagement;


// import React, { useEffect, useState } from "react";
// import { useQuery, useQueryClient } from "@tanstack/react-query";
// import useAxiosSecure from "../../../hooks/useAxiosSecure";
// import { FaUserShield, FaUser } from "react-icons/fa";
// import Swal from "sweetalert2";

// const EmployeeManagement = () => {
//   const axiosSecure = useAxiosSecure();
//   const queryClient = useQueryClient();

//   const [searchText, setSearchText] = useState("");
//   const [debouncedSearch, setDebouncedSearch] = useState("");

//   // debounce search
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setDebouncedSearch(searchText);
//     }, 400);

//     return () => clearTimeout(timer);
//   }, [searchText]);

//   // fetch users
//   const { data: users = [], isLoading, isFetching, isError } = useQuery({
//     queryKey: ["users", debouncedSearch],
//     queryFn: async () => {
//       const res = await axiosSecure.get(
//         `/users?search=${debouncedSearch}`
//       );
//       return res.data;
//     },
//     keepPreviousData: true,
//   });

//   // Make Admin
//   const handleMakeAdmin = async (user) => {
//     const confirm = await Swal.fire({
//       title: "Are you sure?",
//       text: `Make ${user.name} an admin?`,
//       icon: "warning",
//       showCancelButton: true,
//     });

//     if (confirm.isConfirmed) {
//       const res = await axiosSecure.patch(`/users/${user._id}`, {
//         role: "admin",
//       });

//       if (res.data.modifiedCount > 0) {
//         Swal.fire("Success!", "User is now admin.", "success");
//         queryClient.invalidateQueries(["users"]);
//       }
//     }
//   };

//   // Remove Admin
//   const handleRemoveAdmin = async (user) => {
//     const confirm = await Swal.fire({
//       title: "Are you sure?",
//       text: `Remove admin from ${user.name}?`,
//       icon: "warning",
//       showCancelButton: true,
//     });

//     if (confirm.isConfirmed) {
//       const res = await axiosSecure.patch(`/users/${user._id}`, {
//         role: "employee",
//       });

//       if (res.data.modifiedCount > 0) {
//         Swal.fire("Updated!", "Admin removed.", "success");
//         queryClient.invalidateQueries(["users"]);
//       }
//     }
//   };

//   if (isLoading) return <p className="text-center mt-10">Loading...</p>;
//   if (isError) return <p className="text-center text-red-500">Error loading users</p>;

//   return (
//     <div className="p-6 bg-base-100 rounded-2xl shadow-xl">

//       {/* HEADER */}
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-bold">
//           Employee Management ({users.length})
//         </h2>

//         <input
//           type="text"
//           placeholder="Search users..."
//           value={searchText}
//           onChange={(e) => setSearchText(e.target.value)}
//           className="input input-bordered"
//         />
//       </div>

//       {/* TABLE */}
//       <div className="overflow-x-auto">
//         <table className="table table-zebra">

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
//             {users.map((user, index) => (
//               <tr key={user._id}>
//                 <td>{index + 1}</td>

//                 {/* USER */}
//                 <td className="flex items-center gap-3">
//                   <img
//                     src={user.photoURL || "https://i.ibb.co/4pDNDk1/avatar.png"}
//                     className="w-10 h-10 rounded-full"
//                   />
//                   <span className="font-semibold">
//                     {user.name || "No Name"}
//                   </span>
//                 </td>

//                 <td>{user.email}</td>

//                 <td>
//                   <span className={`badge ${user.role === "admin" ? "badge-success" : "badge-ghost"}`}>
//                     {user.role}
//                   </span>
//                 </td>

//                 <td className="flex gap-2">

//                   {user.role === "admin" ? (
//                     <button
//                       onClick={() => handleRemoveAdmin(user)}
//                       className="btn btn-warning btn-xs"
//                     >
//                       <FaUser /> Remove
//                     </button>
//                   ) : (
//                     <button
//                       onClick={() => handleMakeAdmin(user)}
//                       className="btn btn-success btn-xs"
//                     >
//                       <FaUserShield /> Make Admin
//                     </button>
//                   )}

//                 </td>
//               </tr>
//             ))}
//           </tbody>

//         </table>
//       </div>

//     </div>
//   );
// };

// export default EmployeeManagement;



// import React from "react";
// import { useQuery, useQueryClient } from "@tanstack/react-query";
// import useAxiosSecure from "../../../hooks/useAxiosSecure";
// import Swal from "sweetalert2";

// const EmployeeManagement = () => {
//   const axiosSecure = useAxiosSecure();
//   const queryClient = useQueryClient();


// const { data: employees = [] } = useQuery({
//   queryKey: ["employee-management"],
//   queryFn: async () => {
//     const res = await axiosSecure.get("/employee-management");
//     return res.data;
//   },
// });
//   // ================= REMOVE EMPLOYEE =================
//   const handleRemove = async (id) => {
//     const confirm = await Swal.fire({
//       title: "Remove employee?",
//       icon: "warning",
//       showCancelButton: true,
//     });

//     if (!confirm.isConfirmed) return;

//     await axiosSecure.delete(`/employees/${id}`);

//     queryClient.invalidateQueries(["employees"]);

//     Swal.fire("Removed!", "", "success");
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
//                 <td>
//                   <span className="badge badge-success">
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

// export default EmployeeManagement;

// import React from "react";
// import { useQuery, useQueryClient } from "@tanstack/react-query";
// import useAxiosSecure from "../../../hooks/useAxiosSecure";
// import Swal from "sweetalert2";

// const EmployeeManagement = () => {
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

// export default EmployeeManagement;

// import React from "react";
// import { useQuery, useQueryClient } from "@tanstack/react-query";
// import useAxiosSecure from "../../../hooks/useAxiosSecure";
// import Swal from "sweetalert2";
// import {
//   Building2,
//   Mail,
//   ShieldCheck,
//   Trash2,
//   Users,
// } from "lucide-react";

// const EmployeeManagement = () => {
//   const axiosSecure = useAxiosSecure();
//   const queryClient = useQueryClient();

//   // ================= GET EMPLOYEES =================
//   const {
//     data: employees = [],
//     isLoading,
//   } = useQuery({
//     queryKey: ["employee-management"],
//     queryFn: async () => {
//       const res = await axiosSecure.get("/employee-management");
//       return res.data;
//     },
//   });

//   // ================= REMOVE AFFILIATION =================
//   const handleRemoveAffiliation = async (userId, companyId) => {
//     const confirm = await Swal.fire({
//       title: "Remove Affiliation?",
//       text: "Employee will be removed from this company.",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#d33",
//       confirmButtonText: "Remove",
//     });

//     if (!confirm.isConfirmed) return;

//     try {
//       const res = await axiosSecure.patch(
//         `/remove-affiliation/${userId}/${companyId}`
//       );

//       if (res.data.modifiedCount > 0) {
//         queryClient.invalidateQueries({
//           queryKey: ["employee-management"],
//         });

//         Swal.fire({
//           icon: "success",
//           title: "Affiliation Removed",
//           timer: 1500,
//           showConfirmButton: false,
//         });
//       }
//     } catch (error) {
//       console.log(error);

//       Swal.fire({
//         icon: "error",
//         title: "Failed",
//         text: "Something went wrong",
//       });
//     }
//   };

//   // ================= LOADING =================
//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center min-h-[60vh]">
//         <span className="loading loading-spinner loading-lg text-primary"></span>
//       </div>
//     );
//   }

//   return (
//     <div className="p-4 md:p-8 bg-base-100 min-h-screen">
//       {/* ================= HEADER ================= */}
//       <div className="mb-8">
//         <h2 className="text-3xl font-bold text-base-content">
//           Employee Affiliation Management
//         </h2>

//         <p className="text-base-content/60 mt-2 max-w-3xl">
//           Manage employee affiliations, company access, and automatic
//           asset-request-based affiliation workflow.
//         </p>
//       </div>

//       {/* ================= TOP CARDS ================= */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
//         {/* TOTAL */}
//         <div className="bg-white border rounded-2xl p-6 shadow-sm">
//           <div className="flex items-center gap-4">
//             <div className="bg-primary/10 p-4 rounded-xl">
//               <Users className="text-primary w-8 h-8" />
//             </div>

//             <div>
//               <h3 className="text-3xl font-bold">
//                 {employees.length}
//               </h3>

//               <p className="text-gray-500">
//                 Total Employees
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* MULTI COMPANY */}
//         <div className="bg-white border rounded-2xl p-6 shadow-sm">
//           <div className="flex items-center gap-4">
//             <div className="bg-success/10 p-4 rounded-xl">
//               <Building2 className="text-success w-8 h-8" />
//             </div>

//             <div>
//               <h3 className="text-2xl font-bold">
//                 Multi Company
//               </h3>

//               <p className="text-gray-500">
//                 Affiliation Enabled
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* PACKAGE */}
//         <div className="bg-white border rounded-2xl p-6 shadow-sm">
//           <div className="flex items-center gap-4">
//             <div className="bg-secondary/10 p-4 rounded-xl">
//               <ShieldCheck className="text-secondary w-8 h-8" />
//             </div>

//             <div>
//               <h3 className="text-2xl font-bold">
//                 Package Limit
//               </h3>

//               <p className="text-gray-500">
//                 Enforced Per HR
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ================= TABLE ================= */}
//       <div className="bg-white rounded-3xl shadow-sm border overflow-hidden">
//         <div className="overflow-x-auto">

//           <table className="table">

//             {/* HEAD */}
//             <thead className="bg-base-200">
//               <tr className="text-base-content">
//                 <th>#</th>
//                 <th>Employee</th>
//                 <th>Email</th>
//                 <th>Companies</th>
//                 <th>Total</th>
//                 <th>Status</th>
//                 <th>Action</th>
//               </tr>
//             </thead>

//             {/* BODY */}
//             <tbody>
//               {employees.map((emp, i) => (
//                 <tr
//                   key={emp._id}
//                   className="hover"
//                 >
//                   {/* INDEX */}
//                   <td className="font-semibold">
//                     {i + 1}
//                   </td>

//                   {/* NAME */}
//                   <td>
//                     <div className="flex items-center gap-3">

//                       <div className="avatar">
//                         <div className="w-12 rounded-full">
//                           <img
//                             src={
//                               emp.photoURL ||
//                               "https://i.ibb.co/4pDNDk1/avatar.png"
//                             }
//                             alt="employee"
//                           />
//                         </div>
//                       </div>

//                       <div>
//                         <h2 className="font-bold">
//                           {emp.employeeName}
//                         </h2>

//                         <p className="text-xs text-gray-500">
//                           Employee Account
//                         </p>
//                       </div>
//                     </div>
//                   </td>

//                   {/* EMAIL */}
//                   <td>
//                     <div className="flex items-center gap-2 text-sm">
//                       <Mail size={16} />
//                       {emp.employeeEmail}
//                     </div>
//                   </td>

//                   {/* COMPANIES */}
//                   <td>
//                     <div className="flex flex-wrap gap-2">

//                       {emp.affiliatedCompanies?.length > 0 ? (
//                         emp.affiliatedCompanies.map(
//                           (company, index) => (
//                             <div
//                               key={index}
//                               className="badge badge-primary badge-outline p-3"
//                             >
//                               {company.companyName}
//                             </div>
//                           )
//                         )
//                       ) : (
//                         <span className="text-gray-400 text-sm">
//                           No Company
//                         </span>
//                       )}
//                     </div>
//                   </td>

//                   {/* TOTAL */}
//                   <td>
//                     <span className="badge badge-info">
//                       {emp.affiliatedCompanies?.length || 0}
//                     </span>
//                   </td>

//                   {/* STATUS */}
//                   <td>
//                     <span
//                       className={`badge ${
//                         emp.affiliatedCompanies?.length > 0
//                           ? "badge-success"
//                           : "badge-warning"
//                       }`}
//                     >
//                       {emp.affiliatedCompanies?.length > 0
//                         ? "Affiliated"
//                         : "Not Affiliated"}
//                     </span>
//                   </td>

//                   {/* ACTION */}
//                   <td>
//                     <div className="flex flex-col gap-2">

//                       {emp.affiliatedCompanies?.map(
//                         (company, index) => (
//                           <button
//                             key={index}
//                             onClick={() =>
//                               handleRemoveAffiliation(
//                                 emp._id,
//                                 company.companyId
//                               )
//                             }
//                             className="btn btn-error btn-xs"
//                           >
//                             <Trash2 size={14} />
//                             Remove {company.companyName}
//                           </button>
//                         )
//                       )}
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>

//           </table>
//         </div>

//         {/* EMPTY */}
//         {employees.length === 0 && (
//           <div className="text-center py-20">
//             <Users className="mx-auto w-16 h-16 text-gray-300 mb-4" />

//             <h2 className="text-2xl font-bold text-gray-700">
//               No Employees Found
//             </h2>

//             <p className="text-gray-500 mt-2">
//               Employees will appear here once affiliated.
//             </p>
//           </div>
//         )}
//       </div>

//       {/* ================= BUSINESS RULES ================= */}
//       <div className="mt-10 bg-gradient-to-r from-primary/5 to-secondary/5 border rounded-3xl p-6">

//         <h2 className="text-xl font-bold mb-5">
//           Affiliation System Rules
//         </h2>

//         <div className="space-y-4 text-base-content/70">

//           <div className="flex gap-3">
//             <span className="font-bold text-primary">
//               01.
//             </span>

//             <p>
//               Employee requests asset → HR approves →
//               Employee automatically becomes affiliated.
//             </p>
//           </div>

//           <div className="flex gap-3">
//             <span className="font-bold text-primary">
//               02.
//             </span>

//             <p>
//               One employee can stay affiliated with
//               multiple companies simultaneously.
//             </p>
//           </div>

//           <div className="flex gap-3">
//             <span className="font-bold text-primary">
//               03.
//             </span>

//             <p>
//               HR package employee limits are enforced
//               automatically by the system.
//             </p>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default EmployeeManagement;




import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

import {
  Building2,
  Mail,
  ShieldCheck,
  Trash2,
  Users,
  BadgeCheck,
  Layers3,
} from "lucide-react";

const EmployeeManagement = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // ================= GET EMPLOYEES =================
  const {
    data: employees = [],
    isLoading,
  } = useQuery({
    queryKey: ["employee-management"],
    queryFn: async () => {
      const res = await axiosSecure.get(
        "/employee-management"
      );

      return res.data;
    },
  });

  // ================= HR PACKAGE INFO =================
  const { data: packageInfo = {} } = useQuery({
    queryKey: ["hr-package-info"],
    queryFn: async () => {
      const res = await axiosSecure.get(
        "/hr-package-info"
      );

      return res.data;
    },
  });

  // ================= REMOVE AFFILIATION =================
  const handleRemove = async (id) => {
    const confirm = await Swal.fire({
      title: "Remove Employee?",
      text: "Affiliation will be removed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      confirmButtonText: "Remove",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await axiosSecure.patch(
        `/employee-management/${id}/remove`
      );

      if (res.data.modifiedCount > 0) {
        queryClient.invalidateQueries({
          queryKey: ["employee-management"],
        });

        queryClient.invalidateQueries({
          queryKey: ["hr-package-info"],
        });

        Swal.fire({
          icon: "success",
          title: "Removed Successfully",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.log(error);

      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Something went wrong",
      });
    }
  };

  // ================= LOADING =================
  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-base-100 min-h-screen">

      {/* ================= PAGE HEADER ================= */}
      <div className="mb-8">

        <h1 className="text-4xl font-bold text-base-content">
          Employee Management
        </h1>

        <p className="text-base-content/60 mt-3 max-w-3xl">
          Employees become automatically affiliated
          after HR approves asset requests. One
          employee can stay connected with multiple
          companies simultaneously while package
          limits are enforced per HR.
        </p>
      </div>

      {/* ================= OVERVIEW CARDS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">

        {/* TOTAL EMPLOYEE */}
        <div className="bg-white border rounded-3xl p-6 shadow-sm">

          <div className="flex justify-between items-center">

            <div>
              <p className="text-gray-500 text-sm">
                Total Employees
              </p>

              <h2 className="text-4xl font-bold mt-2">
                {employees.length}
              </h2>
            </div>

            <div className="bg-primary/10 p-4 rounded-2xl">
              <Users className="w-8 h-8 text-primary" />
            </div>

          </div>
        </div>

        {/* PACKAGE LIMIT */}
        <div className="bg-white border rounded-3xl p-6 shadow-sm">

          <div className="flex justify-between items-center">

            <div>
              <p className="text-gray-500 text-sm">
                Package Limit
              </p>

              <h2 className="text-4xl font-bold mt-2">
                {packageInfo.packageLimit || 0}
              </h2>
            </div>

            <div className="bg-secondary/10 p-4 rounded-2xl">
              <ShieldCheck className="w-8 h-8 text-secondary" />
            </div>

          </div>
        </div>

        {/* ACTIVE */}
        <div className="bg-white border rounded-3xl p-6 shadow-sm">

          <div className="flex justify-between items-center">

            <div>
              <p className="text-gray-500 text-sm">
                Active Employees
              </p>

              <h2 className="text-4xl font-bold mt-2">
                {packageInfo.totalEmployees || 0}
              </h2>
            </div>

            <div className="bg-success/10 p-4 rounded-2xl">
              <BadgeCheck className="w-8 h-8 text-success" />
            </div>

          </div>
        </div>

        {/* REMAINING */}
        <div className="bg-white border rounded-3xl p-6 shadow-sm">

          <div className="flex justify-between items-center">

            <div>
              <p className="text-gray-500 text-sm">
                Remaining Slot
              </p>

              <h2 className="text-4xl font-bold mt-2">
                {packageInfo.remaining || 0}
              </h2>
            </div>

            <div className="bg-warning/10 p-4 rounded-2xl">
              <Layers3 className="w-8 h-8 text-warning" />
            </div>

          </div>
        </div>
      </div>

      {/* ================= RULES SECTION ================= */}
      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 border rounded-3xl p-6 mb-8">

        <h2 className="text-2xl font-bold mb-6">
          Auto Affiliation Workflow
        </h2>

        <div className="grid md:grid-cols-3 gap-5">

          {/* RULE 1 */}
          <div className="bg-white rounded-2xl p-5 border">

            <div className="flex items-center gap-3 mb-3">

              <div className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">
                1
              </div>

              <h3 className="font-bold text-lg">
                Asset Request
              </h3>
            </div>

            <p className="text-gray-600 text-sm">
              Employee requests an asset from
              the HR dashboard.
            </p>
          </div>

          {/* RULE 2 */}
          <div className="bg-white rounded-2xl p-5 border">

            <div className="flex items-center gap-3 mb-3">

              <div className="bg-success text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">
                2
              </div>

              <h3 className="font-bold text-lg">
                HR Approval
              </h3>
            </div>

            <p className="text-gray-600 text-sm">
              HR approves the request and
              system checks package limits.
            </p>
          </div>

          {/* RULE 3 */}
          <div className="bg-white rounded-2xl p-5 border">

            <div className="flex items-center gap-3 mb-3">

              <div className="bg-secondary text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">
                3
              </div>

              <h3 className="font-bold text-lg">
                Auto Affiliation
              </h3>
            </div>

            <p className="text-gray-600 text-sm">
              Employee automatically becomes
              affiliated with the company.
            </p>
          </div>

        </div>
      </div>

      {/* ================= EMPLOYEE TABLE ================= */}
      <div className="bg-white border rounded-3xl shadow-sm overflow-hidden">

        <div className="p-6 border-b">

          <h2 className="text-2xl font-bold">
            Affiliated Employees
          </h2>

          <p className="text-gray-500 mt-1">
            Employees can belong to multiple
            companies simultaneously.
          </p>
        </div>

        <div className="overflow-x-auto">

          <table className="table">

            {/* TABLE HEAD */}
            <thead className="bg-base-200">

              <tr>
                <th>#</th>
                <th>Employee</th>
                <th>Email</th>
                <th>Company</th>
                <th>Status</th>
                <th>Affiliated Date</th>
                <th>Action</th>
              </tr>

            </thead>

            {/* TABLE BODY */}
            <tbody>

              {employees.map((emp, index) => (
                <tr
                  key={emp._id}
                  className="hover"
                >

                  {/* INDEX */}
                  <td className="font-semibold">
                    {index + 1}
                  </td>

                  {/* EMPLOYEE */}
                  <td>

                    <div className="flex items-center gap-3">

                      <div className="avatar">

                        <div className="w-12 rounded-full">
                          <img
                            src={
                              emp.photoURL ||
                              "https://i.ibb.co/4pDNDk1/avatar.png"
                            }
                            alt=""
                          />
                        </div>

                      </div>

                      <div>

                        <h2 className="font-bold">
                          {emp.employeeName}
                        </h2>

                        <p className="text-xs text-gray-500">
                          Employee Account
                        </p>

                      </div>

                    </div>
                  </td>

                  {/* EMAIL */}
                  <td>

                    <div className="flex items-center gap-2">

                      <Mail size={16} />

                      <span className="text-sm">
                        {emp.employeeEmail}
                      </span>

                    </div>
                  </td>

                  {/* COMPANY */}
                  <td>

                    <div className="badge badge-primary badge-outline p-3">

                      <Building2 size={14} />

                      {emp.companyName}

                    </div>
                  </td>

                  {/* STATUS */}
                  <td>

                    <div className="badge badge-success">
                      Active
                    </div>

                  </td>

                  {/* DATE */}
                  <td>

                    {new Date(
                      emp.affiliatedAt
                    ).toLocaleDateString()}

                  </td>

                  {/* ACTION */}
                  <td>

                    <button
                      onClick={() =>
                        handleRemove(emp._id)
                      }
                      className="btn btn-error btn-sm"
                    >

                      <Trash2 size={16} />

                      Remove

                    </button>

                  </td>
                </tr>
              ))}

            </tbody>

          </table>
        </div>

        {/* EMPTY */}
        {employees.length === 0 && (
          <div className="text-center py-20">

            <Users className="mx-auto w-16 h-16 text-gray-300 mb-4" />

            <h2 className="text-2xl font-bold">
              No Affiliated Employees
            </h2>

            <p className="text-gray-500 mt-2">
              Employees will appear after HR
              approves asset requests.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeManagement;