// import React from "react";
// import { useQuery, useQueryClient } from "@tanstack/react-query";
// import Swal from "sweetalert2";
// import useAxiosSecure from "../../hooks/useAxiosSecure";

// const Requests = () => {

//   const axiosSecure = useAxiosSecure();
//   const queryClient = useQueryClient();

//   // ================= GET REQUESTS =================

//   const {
//     data: requests = [],
//     isLoading,
//     isError,
//   } = useQuery({
//     queryKey: ["requests"],
//     queryFn: async () => {

//       const res = await axiosSecure.get("/requests");

//       return Array.isArray(res.data)
//         ? res.data
//         : [];

//     },
//   });

//   // ================= APPROVE =================

//   const handleApprove = async (id) => {

//     try {

//       const res = await axiosSecure.patch(
//         `/requests/approve/${id}`
//       );

//       if (res.data.success) {

//         Swal.fire({
//           icon: "success",
//           title: "Approved!",
//           text: "Request approved successfully",
//           timer: 1500,
//           showConfirmButton: false,
//         });

//         queryClient.invalidateQueries({
//           queryKey: ["requests"],
//         });

//       }

//     } catch (error) {

//       Swal.fire({
//         icon: "error",
//         title: "Approval Failed",
//         text:
//           error?.response?.data?.message ||
//           "Something went wrong",
//       });

//     }
//   };

//   // ================= REJECT =================

//   const handleReject = async (id) => {

//     try {

//       await axiosSecure.patch(
//         `/requests/reject/${id}`
//       );

//       Swal.fire({
//         icon: "success",
//         title: "Rejected!",
//         text: "Request rejected successfully",
//         timer: 1500,
//         showConfirmButton: false,
//       });

//       queryClient.invalidateQueries({
//         queryKey: ["requests"],
//       });

//     } catch (error) {

//       Swal.fire({
//         icon: "error",
//         title: "Reject Failed",
//         text:
//           error?.response?.data?.message ||
//           "Something went wrong",
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
//       <div className="text-center text-red-500 mt-10">
//         Failed to load requests
//       </div>
//     );
//   }

//   // ================= UI =================

//   return (
//     <div className="p-4 md:p-6">

//       {/* HEADER */}

//       <div className="flex justify-between items-center mb-5">

//         <h2 className="text-2xl font-bold">
//           📦 Asset Requests
//         </h2>

//         <div className="badge badge-primary p-4">
//           Total: {requests.length}
//         </div>

//       </div>

//       {/* TABLE */}

//       <div className="overflow-x-auto border rounded-xl bg-base-100">

//         <table className="table table-zebra">

//           <thead>

//             <tr>
//               <th>#</th>
//               <th>Asset</th>
//               <th>Type</th>
//               <th>Employee</th>
//               <th>Status</th>
//               <th>Action</th>
//             </tr>

//           </thead>

//           <tbody>

//             {requests.map((req, index) => (

//               <tr key={req._id}>

//                 <td>{index + 1}</td>

//                 <td className="font-semibold">
//                   {req.assetName}
//                 </td>

//                 <td>
//                   {req.assetType}
//                 </td>

//                 <td>
//                   <div>
//                     <p className="font-medium">
//                       {req.requesterName}
//                     </p>

//                     <p className="text-xs text-gray-500">
//                       {req.requesterEmail}
//                     </p>
//                   </div>
//                 </td>

//                 {/* STATUS */}

//                 <td>

//                   <span
//                     className={`badge ${
//                       req.requestStatus === "pending"
//                         ? "badge-warning"
//                         : req.requestStatus === "approved"
//                         ? "badge-success"
//                         : "badge-error"
//                     }`}
//                   >
//                     {req.requestStatus}
//                   </span>

//                 </td>

//                 {/* ACTION */}

//                 <td>

//                   {req.requestStatus === "pending" ? (

//                     <div className="flex gap-2">

//                       <button
//                         onClick={() =>
//                           handleApprove(req._id)
//                         }
//                         className="btn btn-success btn-xs"
//                       >
//                         Approve
//                       </button>

//                       <button
//                         onClick={() =>
//                           handleReject(req._id)
//                         }
//                         className="btn btn-error btn-xs"
//                       >
//                         Reject
//                       </button>

//                     </div>

//                   ) : (

//                     <span className="text-gray-500 text-sm">
//                       Processed ✔
//                     </span>

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

// export default Requests;



import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const AllRequests = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // ================= FETCH =================
  const { data: requests = [], isLoading, isError } = useQuery({
    queryKey: ["all-requests"],
    queryFn: async () => {
      const res = await axiosSecure.get("/requests");
      return res.data || [];
    },
  });

  // ================= APPROVE =================
  const handleApprove = async (id) => {
    try {
      const confirm = await Swal.fire({
        title: "Approve Request?",
        text: "This asset will be assigned to employee",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, Approve",
      });

      if (!confirm.isConfirmed) return;

      const res = await axiosSecure.patch(
         `/requests/approve/${id}`
       
      );

      console.log("APPROVE RESPONSE:", res.data);

      if (res.data?.success) {
        Swal.fire({
          icon: "success",
          title: "Approved Successfully",
          timer: 1500,
          showConfirmButton: false,
        });

        queryClient.invalidateQueries(["all-requests"]);
      } else {
        throw new Error(res.data?.message || "Approval failed");
      }
    } catch (error) {
      console.log("APPROVE ERROR:", error.response || error);

      Swal.fire({
        icon: "error",
        title: "Approval Failed",
        text:
          error?.response?.data?.message ||
          error.message ||
          "Server Error",
      });
    }
  };

  // ================= REJECT =================
  const handleReject = async (id) => {
    try {
      const confirm = await Swal.fire({
        title: "Reject Request?",
        text: "This request will be rejected",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Reject",
      });

      if (!confirm.isConfirmed) return;

      const res = await axiosSecure.patch(
        `/requests/reject/${id}`
      );

      if (res.data?.modifiedCount || res.data?.success) {
        Swal.fire({
          icon: "success",
          title: "Rejected Successfully",
          timer: 1500,
          showConfirmButton: false,
        });

        queryClient.invalidateQueries(["all-requests"]);
      }
    } catch (error) {
      console.log("REJECT ERROR:", error.response || error);

      Swal.fire({
        icon: "error",
        title: "Reject Failed",
        text:
          error?.response?.data?.message ||
          error.message ||
          "Server Error",
      });
    }
  };

  // ================= UI =================
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-500 mt-10">
        Failed to load requests
      </div>
    );
  }

  return (
    <div className="p-4">

      <h2 className="text-2xl font-bold mb-4">
        All Requests
      </h2>

      <div className="overflow-x-auto">
        <table className="table table-zebra">

          <thead>
            <tr>
              <th>#</th>
              <th>Asset</th>
              <th>Employee</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {requests.map((r, i) => (
              <tr key={r._id}>
                <td>{i + 1}</td>

                <td>{r.assetName}</td>

                <td>
                  {r.requesterName}
                  <br />
                  <span className="text-xs opacity-60">
                    {r.requesterEmail}
                  </span>
                </td>

                <td>
                  <span className="badge">
                    {r.requestStatus}
                  </span>
                </td>

                <td className="flex gap-2">

                  <button
                    disabled={
                      r.requestStatus !== "pending"
                    }
                    onClick={() =>
                      handleApprove(r._id)
                    }
                    className="btn btn-success btn-xs"
                  >
                    Approve
                  </button>

                  <button
                    disabled={
                      r.requestStatus !== "pending"
                    }
                    onClick={() =>
                      handleReject(r._id)
                    }
                    className="btn btn-error btn-xs"
                  >
                    Reject
                  </button>

                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default AllRequests;