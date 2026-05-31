// import React from "react";
// import { useQuery } from "@tanstack/react-query";
// import useAxiosSecure from "../../hooks/useAxiosSecure";
// import useAuth from "../../hooks/useAuth";

// const AssignedAssets = () => {
//   const { user } = useAuth();
//   const axiosSecure = useAxiosSecure();

//   const {
//     data: assets = [],
//     isLoading,
//     isError,
//   } = useQuery({
//     queryKey: ["assigned-assets", user?.email],
//     enabled: !!user?.email,
//     queryFn: async () => {

//       const res = await axiosSecure.get("/assigned-assets");
//       console.log(res.data);
//       return res.data;
//     },
//   });

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center min-h-[60vh]">
//         <span className="loading loading-spinner loading-lg"></span>
//       </div>
//     );
//   }

//   if (isError) {
//     return (
//       <div className="text-center py-10 text-red-500">
//         Failed to load assigned assets
//       </div>
//     );
//   }

//   return (
//     <div className="p-4 md:p-6 lg:p-8">

//       {/* Header */}
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl md:text-3xl font-bold">
//           📦 My Assigned Assets
//         </h2>

//         <div className="badge badge-primary p-3">
//           Total: {assets.length}
//         </div>
//       </div>

//       {/* Empty State */}
//       {assets.length === 0 ? (
//         <div className="text-center py-10 border rounded-xl bg-base-100 shadow-sm">
//           <p className="text-gray-500">No assigned assets found</p>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

//           {assets.map((asset) => (
//             <div
//               key={asset._id}
//               className="card bg-base-100 shadow-md border hover:shadow-xl transition"
//             >
//               <div className="card-body">

//                 {/* Asset Name */}
//                 <h2 className="card-title text-lg font-bold">
//                   {asset.assetName}
//                 </h2>

//                 {/* Status */}
//                 <div>
//                   <span className="badge badge-success">
//                     {asset.status}
//                   </span>
//                 </div>

//                 {/* Email */}
//                 <p className="text-sm text-gray-500">
//                   Assigned To: {asset.employeeEmail}
//                 </p>

//                 {/* Date */}
//                 <p className="text-xs text-gray-400">
//                   Assigned At:{" "}
//                   {asset.assignedAt
//                     ? new Date(asset.assignedAt).toLocaleString()
//                     : "N/A"}
//                 </p>

//               </div>
//             </div>
//           ))}

//         </div>
//       )}
//     </div>
//   );
// };

// export default AssignedAssets;


// import React from "react";
// import { useQuery } from "@tanstack/react-query";
// import useAxiosSecure from "../../hooks/useAxiosSecure";
// import useAuth from "../../hooks/useAuth";

// const AssignedAssets = () => {
//   const { user } = useAuth();
//   const axiosSecure = useAxiosSecure();

//   const {
//     data: assets = [],
//     isLoading,
//     isError,
//   } = useQuery({
//     queryKey: ["assigned-assets", user?.email],
//     enabled: !!user?.email,
//     queryFn: async () => {
//       const res = await axiosSecure.get("/assigned-assets");
//       return res.data;
//     },
//   });

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center min-h-[60vh]">
//         <span className="loading loading-spinner loading-lg"></span>
//       </div>
//     );
//   }

//   if (isError) {
//     return (
//       <div className="text-center py-10 text-red-500">
//         Failed to load assigned assets
//       </div>
//     );
//   }

//   return (
//     <div className="p-4 md:p-8">

//       {/* HEADER */}
//       <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
//         <div>
//           <h1 className="text-3xl font-bold">
//             My Assigned Assets
//           </h1>
//           <p className="text-gray-500">
//             Track all your assigned company assets
//           </p>
//         </div>

//         <div className="bg-primary text-white px-5 py-3 rounded-xl shadow">
//           Total: {assets.length}
//         </div>
//       </div>

//       {/* EMPTY STATE */}
//       {assets.length === 0 ? (
//         <div className="border rounded-2xl p-10 text-center bg-base-100 shadow-sm">
//           <h2 className="text-xl font-semibold">
//             No Assigned Assets
//           </h2>
//           <p className="text-gray-500 mt-2">
//             You don’t have any assets assigned yet.
//           </p>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

//           {assets.map((asset) => (
//             <div
//               key={asset._id}
//               className="border rounded-2xl shadow-sm hover:shadow-xl transition"
//             >
//               <div className="p-6">

//                 {/* TITLE */}
//                 <div className="flex justify-between items-start mb-4">
//                   <div>
//                     <h2 className="text-xl font-bold">
//                       {asset.assetName}
//                     </h2>
//                     <p className="text-sm text-gray-500">
//                       ID: {asset.assetId}
//                     </p>
//                   </div>

//                   <span className="badge badge-success">
//                     {asset.status}
//                   </span>
//                 </div>

//                 {/* DETAILS */}
//                 <div className="space-y-2 text-sm text-gray-600">

//                   <p>
//                     <span className="font-semibold">Type:</span>{" "}
//                     {asset.assetType}
//                   </p>

//                   <p>
//                     <span className="font-semibold">Email:</span>{" "}
//                     {asset.employeeEmail}
//                   </p>

//                   <p>
//                     <span className="font-semibold">Date:</span>{" "}
//                     {asset.assignedAt
//                       ? new Date(asset.assignedAt).toLocaleString()
//                       : "N/A"}
//                   </p>

//                 </div>

//               </div>
//             </div>
//           ))}

//         </div>
//       )}

//     </div>
//   );
// };

// export default AssignedAssets;

// import React from "react";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import Swal from "sweetalert2";

// import useAxiosSecure from "../../hooks/useAxiosSecure";

// const AssignedAssets = () => {
//   const axiosSecure = useAxiosSecure();
//   const queryClient = useQueryClient();

//   // ================= FETCH ASSIGNED ASSETS =================
//   const {
//     data: assignedAssets = [],
//     isLoading,
//     isError,
//     refetch,
//   } = useQuery({
//     queryKey: ["assigned-assets"],
//     queryFn: async () => {
//       const res = await axiosSecure.get("/assigned-assets");
//       return res.data;
//     },
//   });

//   // ================= RETURN ASSET =================
//   const returnMutation = useMutation({
//     mutationFn: async (id) => {
//       const res = await axiosSecure.patch(
//         `/assigned-assets/return/${id}`
//       );

//       return res.data;
//     },

//     onSuccess: () => {
//       Swal.fire({
//         icon: "success",
//         title: "Returned!",
//         text: "Asset returned successfully",
//         timer: 1500,
//         showConfirmButton: false,
//       });

//       queryClient.invalidateQueries(["assigned-assets"]);
//     },

//     onError: (error) => {
//       Swal.fire({
//         icon: "error",
//         title: "Failed",
//         text:
//           error?.response?.data?.message ||
//           "Something went wrong",
//       });
//     },
//   });

//   // ================= HANDLE RETURN =================
//   const handleReturn = (id) => {
//     Swal.fire({
//       title: "Return Asset?",
//       text: "Do you want to return this asset?",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonText: "Yes, Return",
//     }).then((result) => {
//       if (result.isConfirmed) {
//         returnMutation.mutate(id);
//       }
//     });
//   };

//   // ================= LOADING =================
//   if (isLoading) {
//     return (
//       <div className="flex justify-center py-20">
//         <span className="loading loading-spinner loading-lg"></span>
//       </div>
//     );
//   }

//   // ================= ERROR =================
//   if (isError) {
//     return (
//       <div className="text-center py-10">
//         <h2 className="text-red-500 text-xl font-bold">
//           Failed to load assigned assets
//         </h2>

//         <button
//           onClick={refetch}
//           className="btn btn-outline mt-4"
//         >
//           Retry
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="p-4 md:p-6">
//       {/* HEADER */}
//       <div className="mb-6">
//         <h2 className="text-3xl font-bold">
//           📦 Assigned Assets
//         </h2>

//         <p className="text-gray-500 mt-1">
//           Total Assigned Assets:{" "}
//           <span className="font-semibold">
//             {assignedAssets.length}
//           </span>
//         </p>
//       </div>

//       {/* EMPTY STATE */}
//       {assignedAssets.length === 0 ? (
//         <div className="bg-white rounded-xl shadow border p-10 text-center">
//           <h3 className="text-xl font-semibold text-gray-700">
//             No Assigned Assets
//           </h3>

//           <p className="text-gray-500 mt-2">
//             You don’t have any assigned assets yet.
//           </p>
//         </div>
//       ) : (
//         <div className="overflow-x-auto bg-white rounded-xl shadow border">
//           <table className="table w-full">
//             <thead className="bg-base-200 text-gray-700">
//               <tr>
//                 <th>#</th>
//                 <th>Asset</th>
//                 <th>Type</th>
//                 <th>Company</th>
//                 <th>Assigned Date</th>
//                 <th>Status</th>
//                 <th>Action</th>
//               </tr>
//             </thead>

//             <tbody>
//               {assignedAssets.map((asset, index) => (
//                 <tr key={asset._id}>
//                   {/* INDEX */}
//                   <td>{index + 1}</td>

//                   {/* ASSET */}
//                   <td>
//                     <div className="flex items-center gap-3">
//                       <div className="avatar">
//                         <div className="w-14 rounded-lg border">
//                           <img
//                             src={
//                               asset.assetImage ||
//                               "https://i.ibb.co/4pDNDk1/avatar.png"
//                             }
//                             alt={asset.assetName}
//                           />
//                         </div>
//                       </div>

//                       <div>
//                         <div className="font-bold">
//                           {asset.assetName}
//                         </div>

//                         <div className="text-sm text-gray-500">
//                           {asset.employeeEmail}
//                         </div>
//                       </div>
//                     </div>
//                   </td>

//                   {/* TYPE */}
//                   <td>
//                     <span
//                       className={`badge ${
//                         asset.assetType === "Returnable"
//                           ? "badge-warning"
//                           : "badge-info"
//                       }`}
//                     >
//                       {asset.assetType}
//                     </span>
//                   </td>

//                   {/* COMPANY */}
//                   <td>{asset.companyName}</td>

//                   {/* DATE */}
//                   <td>
//                     {new Date(
//                       asset.assignmentDate
//                     ).toLocaleDateString()}
//                   </td>

//                   {/* STATUS */}
//                   <td>
//                     <span
//                       className={`badge ${
//                         asset.returnStatus === "Returned"
//                           ? "badge-success"
//                           : "badge-primary"
//                       }`}
//                     >
//                       {asset.returnStatus}
//                     </span>
//                   </td>

//                   {/* ACTION */}
//                   <td>
//                     {asset.assetType === "Returnable" &&
//                     asset.returnStatus !== "Returned" ? (
//                       <button
//                         onClick={() =>
//                           handleReturn(asset._id)
//                         }
//                         className="btn btn-sm btn-error text-white"
//                       >
//                         Return
//                       </button>
//                     ) : (
//                       <span className="text-gray-400 text-sm">
//                         No Action
//                       </span>
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           {/* FOOTER */}
//           <div className="p-4 text-center">
//             <button
//               onClick={refetch}
//               className="btn btn-outline btn-sm"
//             >
//               Refresh
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AssignedAssets;


import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";

import useAxiosSecure from "../../hooks/useAxiosSecure";

const AssignedAssets = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // ================= FETCH ASSIGNED ASSETS =================
  const {
    data: assignedAssets = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["assigned-assets"],
    queryFn: async () => {
      const res = await axiosSecure.get("/assigned-assets");
      return res.data;
    },
  });

  // ================= RETURN ASSET =================
  const returnMutation = useMutation({
    mutationFn: async (id) => {
      const res = await axiosSecure.patch(
        `/assigned-assets/return/${id}`
      );
      return res.data;
    },

    onSuccess: () => {
      Swal.fire({
        icon: "success",
        title: "Returned!",
        text: "Asset returned successfully",
        timer: 1500,
        showConfirmButton: false,
      });

      queryClient.invalidateQueries({
        queryKey: ["assigned-assets"],
      });
    },

    onError: (error) => {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text:
          error?.response?.data?.message ||
          "Something went wrong",
      });
    },
  });

  // ================= HANDLE RETURN =================
  const handleReturn = (id) => {
    Swal.fire({
      title: "Return Asset?",
      text: "Do you want to return this asset?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Return",
    }).then((result) => {
      if (result.isConfirmed) {
        returnMutation.mutate(id);
      }
    });
  };

  // ================= LOADING =================
  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  // ================= ERROR =================
  if (isError) {
    return (
      <div className="text-center py-10">
        <h2 className="text-red-500 text-xl font-bold">
          Failed to load assigned assets
        </h2>

        <button
          onClick={refetch}
          className="btn btn-outline mt-4"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      {/* HEADER */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold">
          📦 Assigned Assets
        </h2>

        <p className="text-gray-500 mt-1">
          Total Assigned Assets:{" "}
          <span className="font-semibold">
            {assignedAssets.length}
          </span>
        </p>
      </div>

      {/* EMPTY */}
      {assignedAssets.length === 0 ? (
        <div className="bg-white rounded-xl shadow border p-10 text-center">
          <h3 className="text-xl font-semibold text-gray-700">
            No Assigned Assets
          </h3>
          <p className="text-gray-500 mt-2">
            You don’t have any assigned assets yet.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow border">
          <table className="table w-full">
            <thead className="bg-base-200 text-gray-700">
              <tr>
                <th>#</th>
                <th>Asset</th>
                <th>Type</th>
                <th>Company Name</th>
                <th>Assigned Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {assignedAssets.map((asset, index) => (
                <tr key={asset._id}>
                  {/* INDEX */}
                  <td>{index + 1}</td>

                  {/* ASSET */}
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="w-14 rounded-lg border">
                          <img
                            src={
                              asset.assetImage ||
                              "https://i.ibb.co/4pDNDk1/avatar.png"
                            }
                            alt={asset.assetName}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="font-bold">
                          {asset.assetName}
                        </div>

                        <div className="text-sm text-gray-500">
                          {asset.employeeEmail}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* TYPE */}
                  <td>
                    <span
                      className={`badge ${
                        asset.assetType === "Returnable"
                          ? "badge-warning"
                          : "badge-info"
                      }`}
                    >
                      {asset.assetType}
                    </span>
                  </td>

                  {/* COMPANY NAME ONLY */}
                  <td className="font-semibold">
                    {asset.companyName}
                  </td>

                  {/* DATE */}
                  <td>
                    {new Date(
                      asset.assignmentDate
                    ).toLocaleDateString()}
                  </td>

                  {/* STATUS */}
                  <td>
                    <span
                      className={`badge ${
                        asset.returnStatus === "Returned"
                          ? "badge-success"
                          : "badge-primary"
                      }`}
                    >
                      {asset.returnStatus}
                    </span>
                  </td>

                  {/* ACTION */}
                  <td>
                    {asset.assetType === "Returnable" &&
                    asset.returnStatus !== "Returned" ? (
                      <button
                        onClick={() =>
                          handleReturn(asset._id)
                        }
                        className="btn btn-sm btn-error text-white"
                      >
                        Return
                      </button>
                    ) : asset.returnStatus === "Returned" ? (
                      <span className="badge badge-success">
                        Returned
                      </span>
                    ) : (
                      <span className="badge badge-info">
                        Non-returnable
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* FOOTER */}
          <div className="p-4 text-center">
            <button
              onClick={refetch}
              className="btn btn-outline btn-sm"
            >
              Refresh
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignedAssets;