// import React, { useEffect, useState } from "react";
// import axiosInstance from "../../hooks/axiosInstance";

// const AssetList = () => {
//   const [assets, setAssets] = useState([]);

//   useEffect(() => {
//     axiosInstance
//       .get("/assets")
//       .then((res) => {
//         console.log(res.data); 
//         setAssets(res.data);
//       })
//       .catch((err) => console.log(err));
//   }, []);

//   return (
//     <div className="p-6">
//       <h1 className="text-3xl font-bold mb-6">All Assets</h1>

//       <div className="overflow-x-auto">
//         <table className="table table-zebra w-full">
//           <thead>
//             <tr>
//               <th>Product Name</th>
//               <th>HR Email</th>
//               <th>Product Type</th>
//               <th>Quantity</th>
//               <th>Available Quantity</th>
//               <th>Price</th>
//               <th>Total Price</th>
//             </tr>
//           </thead>

//           <tbody>
//             {assets.map((asset) => (
//               <tr key={asset._id}>
//                 <td>{asset.productName}</td>
//                 <td>{asset.hrEmail}</td>
//                 <td>{asset.productType}</td>
//                 <td>{asset.productQuantity}</td>
//                 <td>{asset.availableQuantity}</td>
//                 <td>{asset.price} ৳</td>
//                 <td>{asset.totalPrice} ৳</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default AssetList;


// import React, { useContext } from "react";
// import { useQuery } from "@tanstack/react-query";
// import Swal from "sweetalert2";
// import { Link } from "react-router-dom";

// import useAxiosSecure from "../../../hooks/useAxiosSecure";
// import { AuthContext } from "../../../contexts/AuthContext";

// const AssetsList = () => {
//   const axiosSecure = useAxiosSecure();

//   // ================= USER =================
//   const { user } = useContext(AuthContext);

//   // ================= LOAD ASSETS =================
//   const {
//     data: assets = [],
//     isLoading,
//     isError,
//     refetch,
//   } = useQuery({
//     queryKey: ["assets", user?.email],

//     enabled: !!user?.email,

//     queryFn: async () => {
//       // ✅ token থেকে backend email নিবে
//       const res = await axiosSecure.get("/assets");

//       console.log("ASSET RESPONSE:", res.data);

//       // ✅ backend response:
//       // {
//       //   success: true,
//       //   data: [...]
//       // }

//       return res.data.data || [];
//     },
//   });

//   // ================= DELETE =================
//   const handleDelete = async (id) => {
//     const result = await Swal.fire({
//       title: "Delete Asset?",
//       text: "This asset will be permanently removed",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonText: "Yes, Delete",
//     });

//     if (result.isConfirmed) {
//       try {
//         const res = await axiosSecure.delete(`/assets/${id}`);

//         if (res.data.deletedCount > 0) {
//           Swal.fire({
//             title: "Deleted!",
//             text: "Asset deleted successfully",
//             icon: "success",
//           });

//           refetch();
//         }
//       } catch (error) {
//         Swal.fire({
//           title: "Error",
//           text: error.message,
//           icon: "error",
//         });
//       }
//     }
//   };

//   // ================= LOADING =================
//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <span className="loading loading-spinner loading-lg"></span>
//       </div>
//     );
//   }

//   // ================= ERROR =================
//   if (isError) {
//     return (
//       <div className="text-center mt-10 text-red-500 font-semibold">
//         Failed to load assets ❌
//       </div>
//     );
//   }

//   return (
//     <div className="p-5">
//       {/* HEADER */}
//       <div className="flex justify-between items-center mb-6">
//         <div>
//           <h2 className="text-3xl font-bold">Assets List</h2>

//           <p className="text-gray-500">
//             Total Assets: {assets.length}
//           </p>
//         </div>

//         <Link to="/dashboard/add-asset">
//           <button className="btn btn-primary">
//             Add Asset
//           </button>
//         </Link>
//       </div>

//       {/* TABLE */}
//       <div className="overflow-x-auto bg-base-100 rounded-xl shadow">
//         <table className="table table-zebra">
//           <thead className="bg-base-200">
//             <tr>
//               <th>#</th>
//               <th>Product Name</th>
//               <th>Type</th>
//               <th>Total Qty</th>
//               <th>Available</th>
//               <th>Status</th>
//               <th>Created</th>
//               <th>Action</th>
//             </tr>
//           </thead>

//           <tbody>
//             {assets.length === 0 ? (
//               <tr>
//                 <td
//                   colSpan="8"
//                   className="text-center py-10 text-gray-500"
//                 >
//                   No assets found 😔
//                 </td>
//               </tr>
//             ) : (
//               assets.map((asset, index) => (
//                 <tr key={asset._id}>
//                   <td>{index + 1}</td>

//                   {/* PRODUCT NAME */}
//                   <td className="font-semibold">
//                     {asset.productName}
//                   </td>

//                   {/* TYPE */}
//                   <td>
//                     <span
//                       className={`badge ${
//                         asset.productType === "Returnable"
//                           ? "badge-success"
//                           : "badge-info"
//                       }`}
//                     >
//                       {asset.productType}
//                     </span>
//                   </td>

//                   {/* TOTAL */}
//                   <td>{asset.productQuantity}</td>

//                   {/* AVAILABLE */}
//                   <td>{asset.availableQuantity}</td>

//                   {/* STATUS */}
//                   <td>
//                     {asset.availableQuantity > 0 ? (
//                       <span className="badge badge-success">
//                         Available
//                       </span>
//                     ) : (
//                       <span className="badge badge-error">
//                         Stock Out
//                       </span>
//                     )}
//                   </td>

//                   {/* CREATED */}
//                   <td>
//                     {asset.createdAt
//                       ? new Date(
//                           asset.createdAt
//                         ).toLocaleDateString()
//                       : "N/A"}
//                   </td>

//                   {/* ACTION */}
//                   <td>
//                     <div className="flex gap-2">
//                       <Link
//                         to={`/dashboard/update-asset/${asset._id}`}
//                       >
//                         <button className="btn btn-sm btn-warning">
//                           Update
//                         </button>
//                       </Link>

//                       <button
//                         onClick={() =>
//                           handleDelete(asset._id)
//                         }
//                         className="btn btn-sm btn-error"
//                       >
//                         Delete
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default AssetsList;