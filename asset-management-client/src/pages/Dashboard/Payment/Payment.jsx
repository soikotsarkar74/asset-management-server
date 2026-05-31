// import React from "react";
// import { useQuery } from "@tanstack/react-query";
// import { useParams } from "react-router-dom";
// import useAxiosSecure from "../../../hooks/useAxiosSecure";
// import useAuth from "../../../hooks/useAuth";

// const Payment = () => {
//   const { assetId } = useParams(); 
//   const axiosSecure = useAxiosSecure();
//   const { user } = useAuth();

//   // 🔥 Fetch asset
//   const {
//     isLoading,
//     isError,
//     data: asset,
//   } = useQuery({
//     queryKey: ["asset", assetId],
//     enabled: !!assetId,
//     queryFn: async () => {
//       const res = await axiosSecure.get(`/assigned-assets/${assetId}`);
//       return res.data;
//     },
//   });



//   // ⏳ Loading
//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center h-[60vh]">
//         <span className="loading loading-spinner loading-lg"></span>
//       </div>
//     );
//   }

//   // ❌ Error
//   if (isError) {
//     return (
//       <p className="text-center mt-10 text-red-500">
//         Failed to load asset
//       </p>
//     );
//   }

//   // ❌ Not found
//   if (!asset) {
//     return (
//       <p className="text-center mt-10 text-gray-500">
//         Asset not found
//       </p>
//     );
//   }

//   // 💳 Payment handler
//   const handlePayment = async () => {
//     try {
//       const paymentData = {
//         assetId: assetId, 
//         assetName: asset.assetName,
//         price: Number(asset.price),
//         quantity: Number(asset.quantity || 1),
//         email: user?.email,
//       };

//       console.log("PAYMENT DATA 👉", paymentData);

//       const res = await axiosSecure.post(
//         "/create-checkout-session",
//         paymentData
//       );

//       window.location.href = res.data.url;
//     } catch (error) {
//       console.error("PAYMENT ERROR:", error);
//     }
//   };

//   return (
//     <div className="max-w-xl mx-auto mt-10 p-6 bg-yellow-100 shadow rounded-xl">
//       <h1 className="text-2xl font-bold mb-4 text-center">
//         💳 Payment Page
//       </h1>

//       {/* Asset Info */}
//       <div className="space-y-2 text-sm">
//         <p><strong>Asset:</strong> {asset.assetName}</p>
//         <p><strong>Email:</strong> {asset.email}</p>
//         <p><strong>Quantity:</strong> {asset.quantity}</p>
//         <p><strong>Price:</strong> {asset.price} ৳</p>
//       </div>

//       {/* Status */}
//       <div className="mt-4">
//         {asset.paymentStatus === "paid" ? (
//           <span className="badge badge-success">
//             Already Paid
//           </span>
//         ) : (
//           <span className="badge badge-warning">
//             Pending Payment
//           </span>
//         )}
//       </div>

//       {/* Button */}
//       {asset.paymentStatus !== "paid" && (
//         <button
//           onClick={handlePayment}
//           className="btn btn-primary w-full mt-6"
//         >
//           Pay Now
//         </button>
//       )}
//     </div>
//   );
// };

// export default Payment;





import React from "react";
import { useLocation } from "react-router-dom";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";

const Payment = () => {
  const location = useLocation();

  const packageData = location.state;

  const axiosSecure = useAxiosSecure();

  const { user } = useAuth();

  // ❌ No data found
  if (!packageData) {
    return (
      <p className="text-center mt-10 text-red-500">
        No package selected
      </p>
    );
  }

  // 💳 Handle Payment
  const handlePayment = async () => {
    try {

      const paymentData = {
        packageName: packageData.name,
        price: Number(packageData.price),
        employeeLimit: Number(packageData.employeeLimit),
        hrEmail: user?.email,
      };

      console.log(paymentData);

      const res = await axiosSecure.post(
        "/create-checkout-session",
        paymentData
      );

      window.location.href = res.data.url;

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-base-100 shadow rounded-xl">

      <h1 className="text-3xl font-bold text-center mb-6">
        Payment Page
      </h1>

      <div className="space-y-3">

        <p>
          <strong>Package:</strong> {packageData.name}
        </p>

        <p>
          <strong>Price:</strong> ${packageData.price}
        </p>

        <p>
          <strong>Employee Limit:</strong>{" "}
          {packageData.employeeLimit}
        </p>

      </div>

      <button
        onClick={handlePayment}
        className="btn btn-primary w-full mt-6"
      >
        Pay Now
      </button>

    </div>
  );
};

export default Payment;