// import React from "react";
// import { useQuery } from "@tanstack/react-query";
// import { useNavigate } from "react-router-dom";
// import useAxiosSecure from "../../../hooks/useAxiosSecure";

// const Assets = () => {
//   const axiosSecure = useAxiosSecure();
//   const navigate = useNavigate();

//   // ================= FETCH ASSETS =================
//   const { data: assets = [], isLoading } = useQuery({
//     queryKey: ["assets"],
//     queryFn: async () => {
//       const res = await axiosSecure.get("/assets");
//       return res.data?.data || [];
//     },
//   });

//   // ================= ADD ASSET (NO PAYMENT) =================
//   const handleAddAsset = (asset) => {
//     // শুধু navigate করবে My Assets page এ
//     navigate("/my-assets", {
//       state: {
//         asset,
//       },
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

//   // ================= UI =================
//   return (
//     <div className="max-w-7xl mx-auto px-4 py-10">

//       <h2 className="text-3xl font-bold text-center mb-10">
//         Available Assets
//       </h2>

//       {/* EMPTY STATE */}
//       {assets.length === 0 ? (
//         <p className="text-center text-gray-500">
//           No assets found.
//         </p>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

//           {assets.map((asset) => (
//             <div
//               key={asset._id}
//               className="card bg-base-100 shadow-lg border"
//             >
//               <div className="card-body">

//                 {/* TITLE */}
//                 <h3 className="card-title">
//                   {asset.productName || "Unnamed Asset"}
//                 </h3>

//                 {/* TYPE */}
//                 <p>
//                   <span className="font-semibold">Type:</span>{" "}
//                   {asset.productType || "N/A"}
//                 </p>

//                 {/* QUANTITY */}
//                 <p>
//                   <span className="font-semibold">Quantity:</span>{" "}
//                   {asset.quantity ?? 0}
//                 </p>

//                 {/* STATUS */}
//                 <p>
//                   <span className="font-semibold">Status:</span>{" "}
//                   {asset.quantity > 0 ? (
//                     <span className="text-green-600 font-semibold">
//                       Available
//                     </span>
//                   ) : (
//                     <span className="text-red-500 font-semibold">
//                       Out of Stock
//                     </span>
//                   )}
//                 </p>

//                 {/* ACTION */}
//                 <div className="card-actions justify-end mt-4">

//                   <button
//                     className="btn btn-primary btn-sm"
//                     onClick={() => handleAddAsset(asset)}
//                     disabled={asset.quantity <= 0}
//                   >
//                     Add Asset
//                   </button>

//                 </div>
//               </div>
//             </div>
//           ))}

//         </div>
//       )}
//     </div>
//   );
// };

// export default Assets;

// import React from "react";
// import { useQuery } from "@tanstack/react-query";
// import { useNavigate } from "react-router-dom";
// import useAxiosSecure from "../../../hooks/useAxiosSecure";

// const Assets = () => {
//   const axiosSecure = useAxiosSecure();
//   const navigate = useNavigate();

//   const { data: assets = [], isLoading } = useQuery({
//     queryKey: ["assets"],
//     queryFn: async () => {
//       const res = await axiosSecure.get("/assets");
//       return res.data?.data || [];
//     },
//   });

//   const handleAddAsset = async (asset) => {
//     try {
//       await axiosSecure.post("/my-assets", {
//         assetId: asset._id,
//         assetName: asset.productName,
//         assetType: asset.productType,
//         companyName: asset.companyName,
//         status: "Assigned",
//         assignmentDate: new Date(),
//       });

//       navigate("/dashboard/my-assets");
//     } catch (error) {
//       console.log("ADD ASSET ERROR:", error);
//     }
//   };

//   if (isLoading) {
//     return <div className="loading loading-spinner"></div>;
//   }

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold mb-5">Available Assets</h2>

//       <div className="grid md:grid-cols-3 gap-5">
//         {assets.map((asset) => (
//           <div key={asset._id} className="border p-4 rounded">

//             <h3 className="font-bold">{asset.productName}</h3>
//             <p>Type: {asset.productType}</p>
//             <p>Available: {asset.availableQuantity}</p>

//             <button
//               className="btn btn-primary mt-3"
//               onClick={() => handleAddAsset(asset)}
//               disabled={asset.availableQuantity <= 0}
//             >
//               Add Asset
//             </button>

//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Assets;

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";

const Assets = () => {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const { user } = useAuth();

  // ================= GET ASSETS =================
  const { data: assets = [], isLoading } = useQuery({
    queryKey: ["assets"],
    queryFn: async () => {
      const res = await axiosSecure.get("/assets");

      const data = res.data;

      // ✅ SAFE NORMALIZATION (prevents map crash)
      if (Array.isArray(data)) return data;
      if (Array.isArray(data?.data)) return data.data;

      return [];
    },
  });

  // ================= ASSIGN ASSET =================
  const handleAddAsset = async (asset) => {
    try {
      await axiosSecure.post("/assign-direct", {
        assetId: asset._id,
        employeeEmail: user?.email,
      });

      navigate("/dashboard/my-assets");
    } catch (error) {
      console.log("ADD ASSET ERROR:", error.response?.data || error.message);
    }
  };

  // ================= LOADING =================
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-5">Available Assets</h2>

      {/* SAFE CHECK BEFORE MAP */}
      <div className="grid md:grid-cols-3 gap-5">
        {Array.isArray(assets) && assets.length > 0 ? (
          assets.map((asset) => (
            <div key={asset._id} className="border p-4 rounded">

              {/* IMAGE */}
              <img
                src={asset.productImage}
                alt={asset.productName}
                className="w-full h-40 object-cover rounded mb-3"
              />

              {/* INFO */}
              <h3 className="font-bold">{asset.productName}</h3>
              <p>Type: {asset.productType}</p>
              <p>Available: {asset.availableQuantity}</p>

              {/* BUTTON */}
              <button
                className="btn btn-primary mt-3"
                onClick={() => handleAddAsset(asset)}
                disabled={asset.availableQuantity <= 0}
              >
                Add Asset
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No assets found</p>
        )}
      </div>
    </div>
  );
};

export default Assets;