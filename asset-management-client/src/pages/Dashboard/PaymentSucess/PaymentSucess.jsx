// import React, { useEffect, useState } from "react";
// import { Link, useSearchParams } from "react-router";
// import useAxiosSecure from "../../../hooks/useAxiosSecure";
// import { FaCheckCircle } from "react-icons/fa";

// const PaymentSuccess = () => {
//   const [searchParams] = useSearchParams();
//   const sessionId = searchParams.get("session_id");
//   const axiosSecure = useAxiosSecure();
//   const [loading, setLoading] = useState(true);
//   const [verified, setVerified] = useState(false);
//   const [transactionId, setTransactionId] = useState("");
//   const [trackingId, setTrackingId] = useState("");

//   useEffect(() => {
//     const verifyPayment = async () => {
//       try {
//         if (sessionId) {
//           const res = await axiosSecure.patch(
//             `/payment-success?session_id=${sessionId}`
//           );

//           if (res.data?.success) {
//             setVerified(true);
//             setTransactionId(res.data.transactionId);
//             setTrackingId(res.data.trackingId);
//           }
//         }
//       } catch (error) {
//         console.error("Payment verification failed:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     verifyPayment();
//   }, [sessionId, axiosSecure]);

//   return (
//     <div className="flex items-center justify-center min-h-[70vh] bg-base-200 px-4">
//       <div className="bg-white shadow-xl rounded-2xl p-8 text-center max-w-md w-full">
        
//         {/* Icon */}
//         <div className="flex justify-center mb-4">
//           <FaCheckCircle className="text-green-500 text-5xl" />
//         </div>

//         {/* Title */}
//         <h1 className="text-2xl font-bold mb-2">
//           {loading
//             ? "Verifying Payment..."
//             : verified
//             ? "Payment Successful 🎉"
//             : "Verification Failed"}
//         </h1>

//         {/* Description */}
//         <p className="text-gray-500 mb-6">
//           {loading
//             ? "Please wait while we confirm your payment."
//             : verified
//             ? "Your payment has been confirmed successfully."
//             : "Something went wrong while verifying your payment."}
//         </p>

//         {/* ✅ Transaction + Tracking */}
//         {!loading && verified && (
//           <div className="bg-base-200 p-4 rounded-lg text-sm mb-4 space-y-3 text-left">
            
//             <div>
//               <p className="font-semibold text-gray-600">Transaction ID:</p>
//               <p className="text-green-600 break-all">
//                 {transactionId}
//               </p>
//             </div>

//             <div>
//               <p className="font-semibold text-gray-600">Tracking ID:</p>
//               <p className="text-blue-600 break-all">
//                 {trackingId}
//               </p>
//             </div>

//           </div>
//         )}

//         {/* Buttons */}
//         <div className="flex gap-3 justify-center">
//           <Link to="/dashboard/payment-history">
//             <button className="btn btn-success">
//               Go to Payment-history
//             </button>
//           </Link>

//           <Link to="/dashboard/my-assets">
//             <button className="btn btn-outline">
//               View Assets
//             </button>
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PaymentSuccess;


// import React, { useEffect, useState } from "react";
// import { Link, useSearchParams } from "react-router-dom";
// import useAxiosSecure from "../../../hooks/useAxiosSecure";
// import { FaCheckCircle } from "react-icons/fa";

// const PaymentSuccess = () => {
//   const [searchParams] = useSearchParams();
//   const sessionId = searchParams.get("session_id");

//   const axiosSecure = useAxiosSecure();

//   const [loading, setLoading] = useState(true);
//   const [verified, setVerified] = useState(false);

//   const [transactionId, setTransactionId] = useState("");
//   const [trackingId, setTrackingId] = useState("");

//   useEffect(() => {
//     const verifyPayment = async () => {
//       try {
//         if (!sessionId) return;

//         const res = await axiosSecure.patch(
//           `/payment-success?session_id=${sessionId}`
         
//         );

//         if (res.data?.success) {
//           setVerified(true);
//           setTransactionId(res.data.transactionId || "N/A");
//           setTrackingId(res.data.trackingId || "N/A");
//         }
//       } catch (error) {
//         console.error("Payment verification failed:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     verifyPayment();
//   }, [sessionId, axiosSecure]);

//   return (
//     <div className="flex items-center justify-center min-h-[70vh] bg-base-200 px-4">
//       <div className="bg-white shadow-xl rounded-2xl p-8 text-center max-w-md w-full">

//         {/* ICON */}
//         <div className="flex justify-center mb-4">
//           <FaCheckCircle className="text-green-500 text-5xl" />
//         </div>

//         {/* TITLE */}
//         <h1 className="text-2xl font-bold mb-2">
//           {loading
//             ? "Verifying Payment..."
//             : verified
//             ? "Payment Successful 🎉"
//             : "Verification Failed"}
//         </h1>

//         {/* DESCRIPTION */}
//         <p className="text-gray-500 mb-6">
//           {loading
//             ? "Please wait while we confirm your payment."
//             : verified
//             ? "Your payment has been confirmed successfully."
//             : "Something went wrong while verifying your payment."}
//         </p>

//         {/* TRANSACTION + TRACKING */}
//         {!loading && verified && (
//           <div className="bg-base-200 p-4 rounded-lg text-sm mb-4 space-y-3 text-left">

//             <div>
//               <p className="font-semibold text-gray-600">Transaction ID:</p>
//               <p className="text-green-600 break-all font-mono">
//                 {transactionId}
//               </p>
//             </div>

//             <div>
//               <p className="font-semibold text-gray-600">Tracking ID:</p>
//               <p className="text-blue-600 break-all font-mono">
//                 {trackingId}
//               </p>
//             </div>

//             {/* COPY BUTTON */}
//             <button
//               onClick={() => navigator.clipboard.writeText(trackingId)}
//               className="btn btn-xs btn-primary mt-2"
//             >
//               Copy Tracking ID
//             </button>

//           </div>
//         )}

//         {/* BUTTONS */}
//         <div className="flex gap-3 justify-center">
//           <Link to="/dashboard/payment-history">
//             <button className="btn btn-success">
//               Go to Payment History
//             </button>
//           </Link>

//           <Link to="/dashboard/my-assets">
//             <button className="btn btn-outline">
//               View Assets
//             </button>
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PaymentSuccess;

// import React, { useEffect, useState } from "react";
// import { useSearchParams, Link } from "react-router-dom";
// import { useQueryClient } from "@tanstack/react-query";
// import useAxiosSecure from "../../../hooks/useAxiosSecure";
// import useAuth from "../../../hooks/useAuth";

// const PaymentSuccess = () => {
//   const [searchParams] = useSearchParams();
//   const sessionId = searchParams.get("session_id");

//   const axiosSecure = useAxiosSecure();
//   const { user } = useAuth();
//   const queryClient = useQueryClient();

//   const [loading, setLoading] = useState(true);
//   const [data, setData] = useState(null);

//   useEffect(() => {
//     const verifyPayment = async () => {
//       try {
//         if (!sessionId) return;

//         const res = await axiosSecure.patch(
//           `/payment-success?session_id=${sessionId}`
//         );

//         if (res.data?.success) {
//           setData(res.data);

//           // 🔥 AUTO REFRESH MY ASSETS
//           queryClient.invalidateQueries([
//             "my-assets",
//             user?.email,
//           ]);
//         }
//       } catch (err) {
//         console.log(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     verifyPayment();
//   }, [sessionId, axiosSecure, queryClient, user?.email]);

//   return (
//     <div className="text-center mt-20">
//       <h2 className="text-3xl font-bold text-green-600">
//         {loading
//           ? "Verifying Payment..."
//           : "Payment Successful 🎉"}
//       </h2>

//       {data && (
//         <div className="mt-5">
//           <p>Transaction ID: {data.transactionId}</p>
//           <p className="text-blue-600">
//             Tracking ID: {data.trackingId}
//           </p>
//         </div>
//       )}

//       <Link to="/dashboard/my-assets">
//         <button className="btn btn-primary mt-5">
//           Go to My Assets
//         </button>
//       </Link>
//     </div>
//   );
// };

// export default PaymentSuccess;


import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";

const PaymentSuccess = () => {

  const [searchParams] = useSearchParams();

  const sessionId =
    searchParams.get("session_id");

  const axiosSecure = useAxiosSecure();

  const { user } = useAuth();

  const queryClient = useQueryClient();

  const [loading, setLoading] = useState(true);

  const [data, setData] = useState(null);

  useEffect(() => {

    const verifyPayment = async () => {

      try {

        if (!sessionId) return;

        const res = await axiosSecure.patch(
          `/payment-success?session_id=${sessionId}`
        );

        if (res.data?.success) {

          setData(res.data);

          // 🔥 refresh user/package info
          queryClient.invalidateQueries([
            "user",
            user?.email,
          ]);

          queryClient.invalidateQueries([
            "payments",
            user?.email,
          ]);
        }

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }
    };

    verifyPayment();

  }, [
    sessionId,
    axiosSecure,
    queryClient,
    user?.email,
  ]);

  return (
    <div className="max-w-xl mx-auto mt-20 text-center bg-base-100 shadow-xl p-10 rounded-2xl">

      <h2 className="text-4xl font-bold text-green-600">

        {loading
          ? "Verifying Payment..."
          : "Payment Successful 🎉"}

      </h2>

      {data && (

        <div className="mt-6 space-y-2">

          <p>
            <strong>Transaction ID:</strong>{" "}
            {data.transactionId}
          </p>

          <p className="text-blue-600">
            <strong>Tracking ID:</strong>{" "}
            {data.trackingId}
          </p>

          <p>
            <strong>Package:</strong>{" "}
            {data.packageName}
          </p>

        </div>
      )}

      <Link to="/dashboard">

        <button className="btn btn-primary mt-8">

          Go To Dashboard

        </button>

      </Link>

    </div>
  );
};

export default PaymentSuccess;