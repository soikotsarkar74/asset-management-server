// import React from "react";
// import { useQuery } from "@tanstack/react-query";
// import useAuth from "../../hooks/useAuth";
// import useAxiosSecure from "../../hooks/useAxiosSecure";
// import { FaRegCreditCard } from "react-icons/fa";
// const PaymentHistory = () => {
//   const { user } = useAuth();
//   const axiosSecure = useAxiosSecure();

//   const { data: payments = [], isLoading, isError } = useQuery({
//     queryKey: ["payments", user?.email],
//     enabled: !!user?.email,
//     queryFn: async () => {
//       const res = await axiosSecure.get(`/payments?email=${user.email}`);
//       return res.data;
//     },
//   });

//   if (isLoading) {
//     return <p className="text-center mt-10">Loading...</p>;
//   }

//   if (isError) {
//     return <p className="text-center text-red-500">Failed to load payments</p>;
//   }

//   return (
//     <div className="p-6">
     
//         <h2 className="text-2xl font-bold mb-4 flex ">
//         <FaRegCreditCard />Payment History
//       </h2>

//       {payments.length === 0 ? (
//         <p>No payments found</p>
//       ) : (
//         <div className="overflow-x-auto">
//           <table className="table table-zebra w-full">
//             <thead>
//               <tr className="bg-base-300">
//                 <th>#</th>
//                 <th>Transaction ID</th>
//                 <th>Tracking ID</th>
//                 <th>Amount</th>
//                 <th>Currency</th>
//                 <th>Date</th>
//               </tr>
//             </thead>
//             <tbody>
//               {payments.map((pay, index) => (
//                 <tr key={pay._id}>
//                   <td>{index + 1}</td>
//                   <td className="text-xs">{pay.transactionId}</td>
//                   <td className="text-green-500 font-semibold">
//                     {pay.trackingId || "N/A"}
//                   </td>
//                   <td>${pay.amount}</td>
//                   <td className="uppercase">{pay.currency}</td>
//                   <td>
//                     {new Date(pay.paidAt).toLocaleString()}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PaymentHistory;



import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { FaRegCreditCard } from "react-icons/fa";

const PaymentHistory = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: payments = [], isLoading, isError } = useQuery({
  queryKey: ["payments", user?.email],
  enabled: !!user?.email,
  queryFn: async () => {
    const res = await axiosSecure.get(
      `/payments?email=${user.email}`
    );

    console.log("PAYMENTS API RESPONSE:", res.data);

    return res.data;
  },
});

  if (isLoading) {
    return (
      <p className="text-center mt-10">Loading...</p>
    );
  }

  if (isError) {
    return (
      <p className="text-center text-red-500">
        Failed to load payments
      </p>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <FaRegCreditCard />
        Payment History
      </h2>

      {payments.length === 0 ? (
        <p>No payments found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr className="bg-base-300">
                <th>#</th>
                <th>Transaction ID</th>
                <th>Tracking ID</th>
                <th>Amount</th>
                <th>Currency</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {payments.map((pay, index) => (
                <tr key={pay._id}>
                  <td>{index + 1}</td>

                  <td className="text-xs">
                    {pay.transactionId || "Stripe Payment"}
                  </td>

                  <td className="text-green-500 font-semibold">
                    {pay.trackingId || "N/A"}
                  </td>

                  <td>${pay.amount || 0}</td>

                  <td className="uppercase">
                    {pay.currency || "usd"}
                  </td>

                  <td>
                    {pay.paymentDate
                      ? new Date(
                          pay.paymentDate
                        ).toLocaleString()
                      : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;