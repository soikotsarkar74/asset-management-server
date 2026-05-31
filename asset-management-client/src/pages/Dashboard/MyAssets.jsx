// import React from "react";
// import { useQuery } from "@tanstack/react-query";
// import { useNavigate } from "react-router-dom";
// import useAuth from "../../hooks/useAuth";
// import useAxiosSecure from "../../hooks/useAxiosSecure";

// const MyAssets = () => {
//   const { user } = useAuth();
//   const axiosSecure = useAxiosSecure();
//   const navigate = useNavigate();

//   // 🔥 Fetch assets
//   const {
//     data: assets = [],
//     isLoading,
//     isError,
//     refetch,
//   } = useQuery({
//     queryKey: ["my-assets", user?.email],
//     enabled: !!user?.email,
//     queryFn: async () => {
//       if (!user?.email) return [];

//       const res = await axiosSecure.get(
//         `/assets?email=${user.email}`
//       );

//       return res.data;
//     },
//     onError: (error) => {
//       console.log(
//         "❌ ASSETS ERROR:",
//         error.response?.data || error.message
//       );
//     },
//   });

//   // 💳 Payment handler
//   const handleStatusClick = (asset) => {
//     if (asset?.paymentStatus !== "paid") {
//       navigate(`/dashboard/payment/${asset._id}`, {
//         state: {
//           assetName: asset.assetName,
//           price: asset.price,
//         },
//       });
//     }
//   };

//   // 💰 Format price
//   const formatPrice = (price) =>
//     price !== undefined
//       ? new Intl.NumberFormat("en-US", {
//           style: "currency",
//           currency: "USD",
//         }).format(price)
//       : "—";

//   // ⏳ Loading
//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center min-h-[60vh]">
//         <span className="loading loading-spinner loading-lg"></span>
//       </div>
//     );
//   }

//   // ❌ Error
//   if (isError) {
//     return (
//       <div className="text-center text-red-500 mt-10">
//         Failed to load assets
//         <div className="mt-3">
//           <button
//             onClick={() => refetch()}
//             className="btn btn-sm btn-outline"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-4 md:p-6 lg:p-8">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl md:text-3xl font-bold">
//           📦 My Assets
//         </h2>
//         <p className="text-gray-600">
//           Total:{" "}
//           <span className="font-semibold">{assets.length}</span>
//         </p>
//       </div>

//       {/* Empty */}
//       {assets.length === 0 ? (
//         <div className="text-center py-10 border rounded-lg bg-gray-50">
//           <p className="text-gray-500">No assets found</p>
//         </div>
//       ) : (
//         <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
//           <table className="table table-zebra">
//             <thead className="bg-base-200">
//               <tr>
//                 <th>#</th>
//                 <th>Asset</th>
//                 <th>Price</th>
//                 <th>Payment</th>
//                 <th>Tracking ID</th>
//                 <th>Delivery</th>
//                 <th>Date</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>

//             <tbody>
//               {assets.map((asset, index) => (
//                 <tr key={asset._id}>
//                   <th>{index + 1}</th>

//                   {/* Asset */}
//                   <td>
//                     <div className="flex items-center gap-3">
//                       <div className="avatar">
//                         <div className="w-10 rounded-full">
//                           <img
//                             src={
//                               asset.image ||
//                               "https://i.ibb.co/4pDNDk1/avatar.png"
//                             }
//                             alt="asset"
//                           />
//                         </div>
//                       </div>
//                       <div>
//                         <div className="font-semibold">
//                           {asset.assetName || "Untitled"}
//                         </div>
//                         <div className="text-xs text-gray-400">
//                           {asset.assetType || "No type"}
//                         </div>
//                       </div>
//                     </div>
//                   </td>

//                   {/* Price */}
//                   <td className="text-green-600 font-medium">
//                     {formatPrice(asset.price)}
//                   </td>

//                   {/* Payment */}
//                   <td>
//                     <span
//                       className={`badge ${
//                         asset.paymentStatus === "paid"
//                           ? "badge-success"
//                           : "badge-error"
//                       }`}
//                     >
//                       {asset.paymentStatus || "unpaid"}
//                     </span>
//                   </td>

//                   {/* Tracking */}
//                   <td className="text-sm text-gray-500">
//                     {asset.trackingId || "N/A"}
//                   </td>

//                   {/* Delivery */}
//                   <td>
//                     <span
//                       className={`badge ${
//                         asset.deliveryStatus === "delivered"
//                           ? "badge-success"
//                           : asset.deliveryStatus === "shipped"
//                           ? "badge-info"
//                           : asset.deliveryStatus ===
//                             "pending-pickup"
//                           ? "badge-warning"
//                           : asset.deliveryStatus === "assigned"
//                           ? "badge-primary"
//                           : "badge-ghost"
//                       }`}
//                     >
//                       {asset.deliveryStatus || "pending"}
//                     </span>
//                   </td>

//                   {/* Date */}
//                   <td className="text-sm text-gray-400">
//                     {asset.createdAt
//                       ? new Date(
//                           asset.createdAt
//                         ).toLocaleDateString()
//                       : "—"}
//                   </td>

//                   {/* Actions */}
//                   <td className="flex gap-2">
//                     {asset.paymentStatus !== "paid" && (
//                       <button
//                         onClick={() =>
//                           handleStatusClick(asset)
//                         }
//                         className="btn btn-xs btn-error"
//                       >
//                         Pay
//                       </button>
//                     )}

//                     <button className="btn btn-xs btn-outline btn-info">
//                       View
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           {/* Refresh */}
//           <div className="p-4 text-center">
//             <button
//               onClick={refetch}
//               className="btn btn-sm btn-outline"
//             >
//               Refresh Data
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MyAssets;


// import React from "react";
// import { useQuery } from "@tanstack/react-query";
// import { useNavigate } from "react-router-dom";
// import useAuth from "../../hooks/useAuth";
// import useAxiosSecure from "../../hooks/useAxiosSecure";

// const MyAssets = () => {
//   const { user } = useAuth();
//   const axiosSecure = useAxiosSecure();
//   const navigate = useNavigate();

//   // 🔥 Fetch assets safely
//   const {
//     data: assets = [],
//     isLoading,
//     isError,
//     refetch,
//   } = useQuery({
//     queryKey: ["my-assets", user?.email],
//     enabled: !!user?.email,

//     queryFn: async () => {
//       // const res = await axiosSecure.get(
//       //   `/assets?email=${user.email}`
//       // );
//      const res = await axiosSecure.get(`/assigned-assets?email=${user.email}`)

//       // ✅ FIX: ensure array always
//       const data = res.data;

//       if (Array.isArray(data)) return data;
//       if (Array.isArray(data?.data)) return data.data;
//       if (Array.isArray(data?.assets)) return data.assets;

//       return [];
//     },

//     onError: (error) => {
//       console.log("❌ ASSETS ERROR:", error);
//     },
//   });

//   // 💳 Payment handler
//   const handleStatusClick = (asset) => {
//     if (asset?.paymentStatus !== "paid") {
//       navigate(`/dashboard/payment/${asset._id}`, {
//         state: {
//           assetName: asset.assetName,
//           price: asset.price,
//         },
//       });
//     }
//   };

//   // 💰 format price
//   const formatPrice = (price) =>
//     price !== undefined && price !== null
//       ? new Intl.NumberFormat("en-US", {
//           style: "currency",
//           currency: "USD",
//         }).format(price)
//       : "—";

//   // ⏳ Loading UI
//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center min-h-[60vh]">
//         <span className="loading loading-spinner loading-lg"></span>
//       </div>
//     );
//   }

//   // ❌ Error UI
//   if (isError) {
//     return (
//       <div className="text-center text-red-500 mt-10">
//         Failed to load assets
//         <div className="mt-3">
//           <button
//             onClick={() => refetch()}
//             className="btn btn-sm btn-outline"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-4 md:p-6 lg:p-8">

//       {/* Header */}
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl md:text-3xl font-bold">
//           📦 My Assets
//         </h2>
//         <p className="text-gray-600">
//           Total: <span className="font-semibold">{assets.length}</span>
//         </p>
//       </div>

//       {/* Empty State */}
//       {assets.length === 0 ? (
//         <div className="text-center py-10 border rounded-lg bg-gray-50">
//           <p className="text-gray-500">No assets found</p>
//         </div>
//       ) : (
//         <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
//           <table className="table table-zebra">

//             <thead className="bg-base-200">
//               <tr>
//                 <th>#</th>
//                 <th>Asset</th>
//                 <th>Price</th>
//                 <th>Payment</th>
//                 <th>Tracking</th>
//                 <th>Delivery</th>
//                 <th>Date</th>
//                 <th>Action</th>
//               </tr>
//             </thead>

//             <tbody>
//               {assets.map((asset, index) => (
//                 <tr key={asset._id || index}>

//                   <th>{index + 1}</th>

//                   {/* Asset */}
//                   <td>
//                     <div className="flex items-center gap-3">
//                       <div className="avatar">
//                         <div className="w-10 rounded-full">
//                           <img
//                             src={
//                               asset.image ||
//                               "https://i.ibb.co/4pDNDk1/avatar.png"
//                             }
//                             alt="asset"
//                           />
//                         </div>
//                       </div>

//                       <div>
//                         <div className="font-semibold">
//                           {asset.assetName || "Untitled"}
//                         </div>
//                         <div className="text-xs text-gray-400">
//                           {asset.assetType || "No type"}
//                         </div>
//                       </div>
//                     </div>
//                   </td>

//                   {/* Price */}
//                   <td className="text-green-600 font-medium">
//                     {formatPrice(asset.price)}
//                   </td>

//                   {/* Payment */}
//                   <td>
//                     <span
//                       className={`badge ${
//                         asset.paymentStatus === "paid"
//                           ? "badge-success"
//                           : "badge-error"
//                       }`}
//                     >
//                       {asset.paymentStatus || "unpaid"}
//                     </span>
//                   </td>

//                   {/* Tracking */}
//                   <td className="text-sm text-gray-500">
//                     {asset.trackingId || "N/A"}
//                   </td>

//                   {/* Delivery */}
//                   <td>
//                     <span
//                       className={`badge ${
//                         asset.deliveryStatus === "delivered"
//                           ? "badge-success"
//                           : asset.deliveryStatus === "shipped"
//                           ? "badge-info"
//                           : asset.deliveryStatus === "pending-pickup"
//                           ? "badge-warning"
//                           : asset.deliveryStatus === "assigned"
//                           ? "badge-primary"
//                           : "badge-ghost"
//                       }`}
//                     >
//                       {asset.deliveryStatus || "pending"}
//                     </span>
//                   </td>

//                   {/* Date */}
//                   <td className="text-sm text-gray-400">
//                     {asset.createdAt
//                       ? new Date(asset.createdAt).toLocaleDateString()
//                       : "—"}
//                   </td>

//                   {/* Actions */}
//                   <td className="flex gap-2">

//                     {asset.paymentStatus !== "paid" && (
//                       <button
//                         onClick={() => handleStatusClick(asset)}
//                         className="btn btn-xs btn-error"
//                       >
//                         Pay
//                       </button>
//                     )}

//                     <button className="btn btn-xs btn-outline btn-info">
//                       View
//                     </button>

//                   </td>

//                 </tr>
//               ))}
//             </tbody>

//           </table>

//           {/* Refresh */}
//           <div className="p-4 text-center">
//             <button
//               onClick={refetch}
//               className="btn btn-sm btn-outline"
//             >
//               Refresh Data
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MyAssets;


// import React, { useState, useEffect } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { useNavigate } from "react-router-dom";
// import useAuth from "../../hooks/useAuth";
// import useAxiosSecure from "../../hooks/useAxiosSecure";
// import ReturnAsset from "./ReturnAsset";

// const MyAssets = () => {
//   const { user } = useAuth();
//   const axiosSecure = useAxiosSecure();
//   const navigate = useNavigate();
//   const [selectedAsset, setSelectedAsset] = useState(null);

//   useEffect(() => {
//     if (selectedAsset) {
//       console.log("selectedAsset FULL:", selectedAsset);
//     }
//   }, [selectedAsset]);

//   // ================= FETCH ASSETS =================
//   const {
//     data: assets = [],
//     isLoading,
//     isError,
//     refetch,
//   } = useQuery({
//     queryKey: ["my-assets", user?.email],
//     enabled: !!user?.email,
//     queryFn: async () => {

//        const res = await axiosSecure.get(`/assigned-assets?email=${user.email}`)
//       return res.data;
//     },
//   });

//   // ================= PAYMENT =================
//   const handlePayment = (asset) => {
//     navigate(`/dashboard/payment/${asset._id}`, {
//       state: {
//         assetName: asset.assetName,
//         price: asset.price,
//       },
//     });
//   };

//   // ================= FORMAT PRICE =================
//   const formatPrice = (price) =>
//     price
//       ? new Intl.NumberFormat("en-US", {
//           style: "currency",
//           currency: "USD",
//         }).format(price)
//       : "—";

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
//       <div className="text-center text-red-500 mt-10">
//         Failed to load assets
//         <br />
//         <button onClick={refetch} className="btn btn-sm mt-3">
//           Retry
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="p-4 md:p-6">

//       {/* HEADER */}
//       <div className="flex justify-between mb-6">
//         <h2 className="text-2xl font-bold">📦 My Assets</h2>
//         <p>Total: {assets.length}</p>
//       </div>

//       {/* EMPTY */}
//       {assets.length === 0 ? (
//         <div className="text-center py-10">No assets found</div>
//       ) : (
//         <div className="overflow-x-auto border rounded-lg bg-white">

//           <table className="table">
//             <thead>
//               <tr>
//                 <th>#</th>
//                 <th>Asset</th>
//                 <th>Price</th>
//                 <th>Payment</th>
//                 <th>Delivery</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>

//             <tbody>
//               {assets.map((asset, index) => (
//                 <tr key={asset._id}>

//                   <td>{index + 1}</td>

//                   {/* ASSET */}
//                   <td className="flex items-center gap-2">
//                     <img
//                       src={
//                         asset.image ||
//                         "https://i.ibb.co/4pDNDk1/avatar.png"
//                       }
//                       className="w-8 h-8 rounded-full"
//                       alt="asset"
//                     />
//                     <span>{asset.assetName}</span>
//                   </td>

//                   {/* PRICE */}
//                   <td>{formatPrice(asset.price)}</td>

//                   {/* PAYMENT */}
//                   <td>
//                     <span
//                       className={`badge ${
//                         asset.paymentStatus === "paid"
//                           ? "badge-success"
//                           : "badge-error"
//                       }`}
//                     >
//                       {asset.paymentStatus || "unpaid"}
//                     </span>
//                   </td>

//                   {/* DELIVERY */}
//                   <td>
//                     <span className="badge badge-info">
//                       {asset.deliveryStatus || "pending"}
//                     </span>
//                   </td>

//                   {/* ACTIONS */}
//                   <td className="flex gap-2">

//                     {asset.paymentStatus !== "paid" && (
//                       <button
//                         onClick={() => handlePayment(asset)}
//                         className="btn btn-xs btn-error"
//                       >
//                         Pay
//                       </button>
//                     )}

//                     <button
//                       onClick={() => setSelectedAsset(asset)}
//                       className="btn btn-xs btn-outline"
//                     >
//                       View
//                     </button>

//                   </td>
//                 </tr>
//               ))}
//             </tbody>

//           </table>

//           <div className="text-center p-3">
//             <button onClick={refetch} className="btn btn-sm">
//               Refresh
//             </button>
//           </div>

//         </div>
//       )}

//       {/* ================= MODAL ================= */}
//       {selectedAsset && (
//         <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

//           <div className="bg-white w-96 rounded-lg p-6 shadow-lg">

//             <h3 className="text-xl font-bold mb-4">
//               {selectedAsset.assetName}
//             </h3>

//             <div className="space-y-1 text-sm text-gray-700">
//               <p><b>Type:</b> {selectedAsset.assetType || "N/A"}</p>
//               <p><b>Status:</b> {selectedAsset.status}</p>
//               <p><b>Delivery:</b> {selectedAsset.deliveryStatus}</p>
//               <p><b>Price:</b> {selectedAsset.price || "—"}</p>
//             </div>

//             <div className="my-4 border-t"></div>

//             {/* ✅ FIXED: _id PASS */}
//             {selectedAsset.status !== "returned" && (
//               <div className="mb-4">
//                 <ReturnAsset _id={selectedAsset._id} />
//               </div>
//             )}

//             <button
//               onClick={() => setSelectedAsset(null)}
//               className="w-full bg-gray-200 hover:bg-gray-300 text-black py-2 rounded"
//             >
//               Close
//             </button>

//           </div>

//         </div>
//       )}

//     </div>
//   );
// };

// export default MyAssets;


// import React, { useState } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { useNavigate } from "react-router-dom";
// import useAuth from "../../hooks/useAuth";
// import useAxiosSecure from "../../hooks/useAxiosSecure";
// import ReturnAsset from "./ReturnAsset";

// const MyAssets = () => {
//   const { user } = useAuth();
//   const axiosSecure = useAxiosSecure();
//   const navigate = useNavigate();
//   const [selectedAsset, setSelectedAsset] = useState(null);

//   // ================= FETCH ASSETS =================
//   const {
//     data: assets = [],
//     isLoading,
//     isError,
//     refetch,
//   } = useQuery({
//     queryKey: ["my-assets", user?.email],
//     enabled: !!user?.email,

//     queryFn: async () => {
//       const res = await axiosSecure.get(
//         `/assigned-assets?email=${user.email}`
//       );
//       return res.data;
//     },
//   });

//   // ================= PAYMENT =================
//   const handlePayment = (asset) => {
//     navigate(`/dashboard/payment/${asset._id}`);
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
//       <div className="text-center text-red-500 mt-10">
//         Failed to load assets
//         <br />
//         <button onClick={refetch} className="btn btn-sm mt-3">
//           Retry
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="p-4 md:p-6">

//       {/* HEADER */}
//       <div className="flex justify-between mb-6">
//         <h2 className="text-2xl font-bold">📦 My Assets</h2>
//         <p>Total: {assets.length}</p>
//       </div>

//       {/* EMPTY */}
//       {assets.length === 0 ? (
//         <div className="text-center py-10">No assets found</div>
//       ) : (
//         <div className="overflow-x-auto border rounded-lg bg-white">

//           <table className="table">
//             <thead>
//               <tr>
//                 <th>#</th>
//                 <th>Asset</th>
//                 <th>Price</th>
//                 <th>Payment</th>
//                 <th>Delivery</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>

//             <tbody>
//               {assets.map((asset, index) => (
//                 <tr key={asset._id}>

//                   <td>{index + 1}</td>

//                   {/* ASSET */}
//                   <td className="flex items-center gap-2">
//                     <img
//                       src={asset.image || "https://i.ibb.co/4pDNDk1/avatar.png"}
//                       className="w-8 h-8 rounded-full"
//                       alt="asset"
//                     />
//                     <span>{asset.assetName}</span>
//                   </td>

//                   {/* PRICE */}
//                   <td>{asset.price}</td>

//                   {/* PAYMENT */}
//                   <td>
//                     <span
//                       className={`badge ${
//                         asset.paymentStatus === "paid"
//                           ? "badge-success"
//                           : "badge-error"
//                       }`}
//                     >
//                       {asset.paymentStatus || "unpaid"}
//                     </span>
//                   </td>

//                   {/* DELIVERY */}
//                   <td>
//                     <span className="badge badge-info">
//                       {asset.deliveryStatus || "pending"}
//                     </span>
//                   </td>

//                   {/* ACTIONS */}
//                   <td className="flex gap-2">

//                     {asset.paymentStatus !== "paid" && (
//                       <button
//                         onClick={() => handlePayment(asset)}
//                         className="btn btn-xs btn-error"
//                       >
//                         Pay
//                       </button>
//                     )}

//                     <button
//                       onClick={() => setSelectedAsset(asset)}
//                       className="btn btn-xs btn-outline"
//                     >
//                       View
//                     </button>

//                   </td>
//                 </tr>
//               ))}
//             </tbody>

//           </table>

//         </div>
//       )}

//       {/* ================= MODAL ================= */}
//       {selectedAsset && (
//         <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

//           <div className="bg-white w-96 rounded-lg p-6 shadow-lg">

//             <h3 className="text-xl font-bold mb-4">
//               {selectedAsset.assetName}
//             </h3>

//             <div className="space-y-1 text-sm">
//               <p><b>Type:</b> {selectedAsset.assetType}</p>
//               <p><b>Status:</b> {selectedAsset.status}</p>
//               <p><b>Delivery:</b> {selectedAsset.deliveryStatus}</p>
//               <p><b>Price:</b> {selectedAsset.price}</p>
//             </div>

//             <div className="my-4 border-t"></div>

//             {/* RETURN BUTTON */}
//             {selectedAsset.status !== "returned" && (
//               <ReturnAsset
//                 _id={selectedAsset._id}
//                 onClose={() => {
//                   setSelectedAsset(null);
//                   refetch();
//                 }}
//               />
//             )}

//             <button
//               onClick={() => setSelectedAsset(null)}
//               className="w-full bg-gray-200 py-2 rounded mt-2"
//             >
//               Close
//             </button>

//           </div>

//         </div>
//       )}

//     </div>
//   );
// };

// export default MyAssets;

import React, { useMemo, useState } from "react";
import useAssignedAssets from "../../hooks/useAssignedAssets";
import useReturnAsset from "../../hooks/returnAsset";

import {
  FaBoxOpen,
  FaUndo,
  FaSearch,
  FaBuilding,
  FaCalendarAlt,
  FaCheckCircle,
} from "react-icons/fa";

const MyAssets = () => {
  const { assets = [], isLoading, refetch } = useAssignedAssets();
  const returnAsset = useReturnAsset();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filteredAssets = useMemo(() => {
    if (!Array.isArray(assets)) return [];

    return assets.filter((asset) => {
      const name = asset?.assetName?.toLowerCase() || "";

      const matchesSearch = name.includes(search.toLowerCase());

      const matchesFilter =
        filter === "all" ? true : asset?.assetType === filter;

      return matchesSearch && matchesFilter;
    });
  }, [assets, search, filter]);

  const handleReturn = async (id) => {
    try {
      await returnAsset(id);
      refetch();
    } catch (err) {
      console.log(err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold flex gap-2 items-center">
        <FaBoxOpen /> My Assets
      </h1>

      <p className="mb-4 text-gray-500">
        Assigned assets list
      </p>

      {/* search */}
      <input
        className="input input-bordered w-full mb-3"
        placeholder="Search asset..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* filter */}
      <select
        className="select select-bordered w-full mb-5"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      >
        <option value="all">All</option>
        <option value="Returnable">Returnable</option>
        <option value="Non-returnable">Non-returnable</option>
      </select>

      {filteredAssets.length === 0 ? (
        <p>No assets found</p>
      ) : (
        filteredAssets.map((asset) => (
          <div key={asset._id} className="border p-4 mb-3 rounded">

            <h2 className="font-bold">{asset.assetName}</h2>
            <p>{asset.assetType}</p>

            <p>{asset.companyName}</p>

            <p>
              Assigned:{" "}
              {new Date(asset.assignmentDate).toLocaleDateString()}
            </p>

            <span className="badge">
              {asset.returnStatus || "Assigned"}
            </span>

            {asset.assetType === "Returnable" &&
            asset.returnStatus !== "Returned" && (
              <button
                className="btn btn-primary mt-2"
                onClick={() => handleReturn(asset._id)}
              >
                <FaUndo /> Return
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default MyAssets;

// import React, { useMemo, useState } from "react";
// import useAssignedAssets from "../../hooks/useAssignedAssets";
// import useReturnAsset from "../../hooks/returnAsset";

// import {
//   FaBoxOpen,
//   FaUndo,
//   FaSearch,
//   FaBuilding,
//   FaCalendarAlt,
//   FaCheckCircle,
// } from "react-icons/fa";

// const MyAssets = () => {
//   const { assets, isLoading, refetch } =
//     useAssignedAssets();

//   const returnAsset = useReturnAsset();

//   const [search, setSearch] = useState("");
//   const [filter, setFilter] = useState("all");

//   // ======================================================
//   // FILTER + SEARCH
//   // ======================================================

//   const filteredAssets = useMemo(() => {
//     return assets.filter((asset) => {

//       const matchesSearch =
//         asset.assetName
//           ?.toLowerCase()
//           .includes(search.toLowerCase());

//       const matchesFilter =
//         filter === "all"
//           ? true
//           : asset.assetType === filter;

//       return matchesSearch && matchesFilter;
//     });
//   }, [assets, search, filter]);

//   // ======================================================
//   // RETURN HANDLER
//   // ======================================================

//   const handleReturn = async (id) => {
//     try {

//       await returnAsset(id);

//       refetch();

//     } catch (error) {
//       console.log(error);
//     }
//   };

//   // ======================================================
//   // LOADING
//   // ======================================================

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center min-h-[60vh]">
//         <span className="loading loading-spinner loading-lg text-primary"></span>
//       </div>
//     );
//   }

//   // ======================================================
//   // UI
//   // ======================================================

//   return (
//     <div className="p-4 md:p-6">

//       {/* HEADER */}
//       <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">

//         <div>
//           <h1 className="text-3xl font-bold flex items-center gap-3">
//             <FaBoxOpen className="text-primary" />
//             My Assets
//           </h1>

//           <p className="text-base-content/70 mt-2">
//             Manage all assigned company assets
//           </p>
//         </div>

//         <div className="stats shadow border">

//           <div className="stat">
//             <div className="stat-title">
//               Total Assets
//             </div>

//             <div className="stat-value text-primary">
//               {assets.length}
//             </div>
//           </div>

//         </div>

//       </div>

//       {/* FILTERS */}
//       <div className="bg-base-100 rounded-2xl shadow-md border border-base-300 p-5 mb-8">

//         <div className="grid md:grid-cols-2 gap-4">

//           {/* SEARCH */}
//           <div className="relative">

//             <FaSearch className="absolute top-4 left-4 text-base-content/50" />

//             <input
//               type="text"
//               placeholder="Search by asset name..."
//               value={search}
//               onChange={(e) =>
//                 setSearch(e.target.value)
//               }
//               className="input input-bordered w-full pl-12"
//             />
//           </div>

//           {/* FILTER */}
//           <select
//             value={filter}
//             onChange={(e) =>
//               setFilter(e.target.value)
//             }
//             className="select select-bordered w-full"
//           >
//             <option value="all">
//               All Types
//             </option>

//             <option value="Returnable">
//               Returnable
//             </option>

//             <option value="Non-returnable">
//               Non-returnable
//             </option>
//           </select>

//         </div>
//       </div>

//       {/* EMPTY */}
//       {!filteredAssets.length ? (
//         <div className="bg-base-100 rounded-2xl shadow-md p-10 text-center border border-base-300">

//           <img
//             src="https://i.ibb.co/4fXsK1D/empty-box.png"
//             alt="empty"
//             className="w-32 mx-auto mb-4 opacity-70"
//           />

//           <h2 className="text-2xl font-bold mb-2">
//             No Assets Found
//           </h2>

//           <p className="text-base-content/70">
//             You don't have any assigned assets yet.
//           </p>

//         </div>
//       ) : (

//         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

//           {filteredAssets.map((asset) => (

//             <div
//               key={asset._id}
//               className="bg-base-100 rounded-2xl shadow-lg border border-base-300 overflow-hidden hover:shadow-2xl transition duration-300"
//             >

//               {/* IMAGE */}
//               <figure className="h-56 overflow-hidden bg-base-200">

//                 <img
//                   src={
//                     asset.assetImage ||
//                     "https://i.ibb.co/2Wz5b7z/user.png"
//                   }
//                   alt={asset.assetName}
//                   className="w-full h-full object-cover hover:scale-105 transition duration-300"
//                 />

//               </figure>

//               {/* CONTENT */}
//               <div className="p-5 space-y-4">

//                 {/* TITLE */}
//                 <div className="flex items-start justify-between gap-4">

//                   <div>
//                     <h2 className="text-xl font-bold">
//                       {asset.assetName}
//                     </h2>

//                     <p className="text-sm text-base-content/60">
//                       {asset.assetType}
//                     </p>
//                   </div>

//                   <div
//                     className={`badge ${
//                       asset.returnStatus === "Returned"
//                         ? "badge-success"
//                         : "badge-warning"
//                     }`}
//                   >
//                     {asset.returnStatus}
//                   </div>

//                 </div>

//                 {/* INFO */}
//                 <div className="space-y-3 text-sm">

//                   <div className="flex items-center gap-3">

//                     <FaBuilding className="text-primary" />

//                     <span>
//                       {asset.companyName ||
//                         "Unknown Company"}
//                     </span>

//                   </div>

//                   <div className="flex items-center gap-3">

//                     <FaCalendarAlt className="text-primary" />

//                     <span>
//                       Assigned:{" "}
//                       {new Date(
//                         asset.assignmentDate
//                       ).toLocaleDateString()}
//                     </span>

//                   </div>

//                   {asset.returnDate && (
//                     <div className="flex items-center gap-3">

//                       <FaCheckCircle className="text-success" />

//                       <span>
//                         Returned:{" "}
//                         {new Date(
//                           asset.returnDate
//                         ).toLocaleDateString()}
//                       </span>

//                     </div>
//                   )}

//                 </div>

//                 {/* ACTION */}
//                 <div className="pt-3">

//                   {asset.assetType ===
//                     "Returnable" &&
//                   asset.returnStatus !==
//                     "Returned" ? (

//                     <button
//                       onClick={() =>
//                         handleReturn(asset._id)
//                       }
//                       className="btn btn-primary w-full"
//                     >
//                       <FaUndo />
//                       Return Asset
//                     </button>

//                   ) : (
//                     <button
//                       disabled
//                       className="btn btn-success w-full"
//                     >
//                       <FaCheckCircle />
//                       Completed
//                     </button>
//                   )}

//                 </div>

//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default MyAssets;