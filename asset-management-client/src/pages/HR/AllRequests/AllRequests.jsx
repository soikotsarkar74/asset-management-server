// import React, { useState, useEffect } from "react";
// import { useQuery, useQueryClient } from "@tanstack/react-query";
// import useAxiosSecure from "../../../hooks/useAxiosSecure";
// import Swal from "sweetalert2";

// import {
//   FaCheckCircle,
//   FaTimesCircle,
//   FaClock,
//   FaClipboardList,
//   FaSearch,
//   FaEye,
//   FaSpinner,
// } from "react-icons/fa";

// const AllRequests = () => {
//   const axiosSecure = useAxiosSecure();
//   const queryClient = useQueryClient();

//   const [statusFilter, setStatusFilter] = useState("all");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [processingId, setProcessingId] = useState(null);

//   // ================= FETCH REQUESTS =================
//   const { 
//     data: requests = [], 
//     isLoading, 
//     isError, 
//     refetch,
//     error 
//   } = useQuery({
//     queryKey: ["all-requests", statusFilter],
//     queryFn: async () => {
//       const params = new URLSearchParams();
      
//       if (statusFilter !== "all") {
//         const statusValue = statusFilter === "Approved" ? "approved" : 
//                            statusFilter === "Rejected" ? "rejected" : "pending";
//         params.append("status", statusValue);
//       }
      
//       const res = await axiosSecure.get(`/requests?${params.toString()}`);
//       console.log("Fetched requests:", res.data);
//       return res.data;
//     },
//   });

//   // ================= SEARCH FILTER =================
//   const filteredRequests = requests.filter((req) => {
//     if (!searchTerm) return true;
    
//     const search = searchTerm.toLowerCase();
    
//     return (
//       req.requesterName?.toLowerCase().includes(search) ||
//       req.requesterEmail?.toLowerCase().includes(search) ||
//       req.assetName?.toLowerCase().includes(search)
//     );
//   });

//   // ================= DEBUG: Check request data =================
//   useEffect(() => {
//     if (filteredRequests.length > 0) {
//       console.log("=== Request Data Debug ===");
//       filteredRequests.forEach(req => {
//         console.log({
//           id: req._id,
//           assetName: req.assetName,
//           assetId: req.assetId,
//           assetIdType: typeof req.assetId,
//           status: req.requestStatus,
//           requesterName: req.requesterName
//         });
//       });
//     }
//   }, [filteredRequests]);

//   // ================= APPROVE REQUEST =================
//   const handleApprove = async (id) => {
//     console.log("Approve clicked for ID:", id);
    
//     const request = filteredRequests.find(r => r._id === id);
//     console.log("Request details:", request);
    
//     if (!request) {
//       Swal.fire("Error", "Request not found", "error");
//       return;
//     }
    
//     if (!request.assetId) {
//       Swal.fire("Error", "This request has no asset ID. Please contact support.", "error");
//       return;
//     }
    
//     const result = await Swal.fire({
//       title: "Approve Request?",
//       html: `
//         <div class="text-left">
//           <p><strong>Employee:</strong> ${request.requesterName}</p>
//           <p><strong>Asset:</strong> ${request.assetName}</p>
//           <p><strong>Asset ID:</strong> ${request.assetId}</p>
//           <p><strong>Type:</strong> ${request.assetType}</p>
//         </div>
//       `,
//       icon: "question",
//       showCancelButton: true,
//       confirmButtonColor: "#10b981",
//       confirmButtonText: "Yes, Approve",
//       cancelButtonText: "Cancel",
//     });

//     if (!result.isConfirmed) return;

//     try {
//       setProcessingId(id);
      
//       Swal.fire({
//         title: "Processing...",
//         text: "Please wait",
//         allowOutsideClick: false,
//         didOpen: () => {
//           Swal.showLoading();
//         },
//       });

//       const res = await axiosSecure.patch(`/requests/approve/${id}`);
//       console.log("Approve response:", res.data);

//       if (res.data.success) {
//         await queryClient.invalidateQueries({ queryKey: ["all-requests"] });
//         await queryClient.invalidateQueries({ queryKey: ["assets"] });
//         await queryClient.invalidateQueries({ queryKey: ["employee-management"] });
//         await queryClient.invalidateQueries({ queryKey: ["my-assets"] });
        
//         await refetch();
        
//         Swal.fire({
//           icon: "success",
//           title: "Approved!",
//           text: res.data.message || "Request approved successfully",
//           timer: 2000,
//           showConfirmButton: false,
//         });
//       } else {
//         throw new Error(res.data.message || "Approval failed");
//       }
//     } catch (err) {
//       console.error("Approve error:", err);
//       Swal.fire({
//         icon: "error",
//         title: "Approval Failed",
//         text: err.response?.data?.message || err.message || "Something went wrong",
//         confirmButtonColor: "#ef4444",
//       });
//     } finally {
//       setProcessingId(null);
//     }
//   };

//   // ================= REJECT REQUEST =================
//   const handleReject = async (id) => {
//     console.log("Reject clicked for ID:", id);
    
//     const request = filteredRequests.find(r => r._id === id);
    
//     const { value: reason } = await Swal.fire({
//       title: "Reject Request",
//       html: `
//         <div class="text-left mb-4">
//           <p><strong>Employee:</strong> ${request?.requesterName}</p>
//           <p><strong>Asset:</strong> ${request?.assetName}</p>
//           <p><strong>Asset ID:</strong> ${request?.assetId}</p>
//         </div>
//       `,
//       input: "textarea",
//       inputLabel: "Reason for rejection (optional)",
//       inputPlaceholder: "Enter reason here...",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#dc2626",
//       confirmButtonText: "Yes, Reject",
//       cancelButtonText: "Cancel",
//     });

//     if (reason === undefined) return;

//     try {
//       setProcessingId(id);
      
//       Swal.fire({
//         title: "Processing...",
//         text: "Please wait",
//         allowOutsideClick: false,
//         didOpen: () => {
//           Swal.showLoading();
//         },
//       });

//       const res = await axiosSecure.patch(`/requests/reject/${id}`, { reason });
//       console.log("Reject response:", res.data);

//       if (res.data.success) {
//         await queryClient.invalidateQueries({ queryKey: ["all-requests"] });
//         await refetch();
        
//         Swal.fire({
//           icon: "success",
//           title: "Rejected!",
//           text: "Request has been rejected",
//           timer: 2000,
//           showConfirmButton: false,
//         });
//       } else {
//         throw new Error(res.data.message || "Rejection failed");
//       }
//     } catch (err) {
//       console.error("Reject error:", err);
//       Swal.fire({
//         icon: "error",
//         title: "Rejection Failed",
//         text: err.response?.data?.message || err.message || "Something went wrong",
//         confirmButtonColor: "#ef4444",
//       });
//     } finally {
//       setProcessingId(null);
//     }
//   };

//   // ================= VIEW DETAILS =================
//   const viewDetails = (req) => {
//     Swal.fire({
//       title: "Request Details",
//       html: `
//         <div class="text-left space-y-3">
//           <div class="border-b pb-2">
//             <p class="text-sm text-gray-500">Employee Information</p>
//             <p class="font-semibold">${req.requesterName || "N/A"}</p>
//             <p class="text-sm">${req.requesterEmail}</p>
//           </div>
//           <div class="border-b pb-2">
//             <p class="text-sm text-gray-500">Asset Information</p>
//             <p class="font-semibold">${req.assetName}</p>
//             <p class="text-sm">Type: ${req.assetType || "N/A"}</p>
//             <p class="text-xs text-gray-500">Asset ID: ${req.assetId}</p>
//           </div>
//           <div class="border-b pb-2">
//             <p class="text-sm text-gray-500">Request Details</p>
//             <p class="text-sm">Date: ${new Date(req.requestDate).toLocaleString()}</p>
//             <p class="text-sm capitalize">Status: ${req.requestStatus}</p>
//             ${req.quantity ? `<p class="text-sm">Quantity: ${req.quantity}</p>` : ''}
//             ${req.description ? `<p class="text-sm">Description: ${req.description}</p>` : ''}
//           </div>
//           ${req.rejectionReason ? `
//             <div>
//               <p class="text-sm text-gray-500">Rejection Reason</p>
//               <p class="text-sm text-red-600">${req.rejectionReason}</p>
//             </div>
//           ` : ''}
//         </div>
//       `,
//       icon: "info",
//       confirmButtonText: "Close",
//       width: '500px',
//     });
//   };

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center h-96">
//         <span className="loading loading-spinner loading-lg text-primary"></span>
//       </div>
//     );
//   }

//   if (isError) {
//     return (
//       <div className="text-center mt-20">
//         <div className="alert alert-error shadow-lg max-w-md mx-auto">
//           <div>
//             <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
//             </svg>
//             <span>Failed to load requests! {error?.message}</span>
//           </div>
//         </div>
//         <button className="btn btn-primary mt-4" onClick={() => refetch()}>
//           Try Again
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
//       {/* HEADER */}
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
//         <div>
//           <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
//             <FaClipboardList className="text-primary" />
//             All Asset Requests
//           </h2>
//           <p className="text-sm text-gray-500 mt-1">
//             Approve or reject employee asset requests
//           </p>
//         </div>

//         <div className="flex flex-col sm:flex-row gap-3">
//           <div className="relative">
//             <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search by employee or asset..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="input input-bordered pl-10 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-primary"
//             />
//           </div>

//           <select
//             value={statusFilter}
//             onChange={(e) => setStatusFilter(e.target.value)}
//             className="select select-bordered w-full sm:w-40"
//           >
//             <option value="all">All Status</option>
//             <option value="pending">Pending</option>
//             <option value="Approved">Approved</option>
//             <option value="Rejected">Rejected</option>
//           </select>

//           <div className="badge badge-primary badge-lg px-4 py-4">
//             Total: {filteredRequests.length}
//           </div>
//         </div>
//       </div>

//       {/* TABLE */}
//       <div className="overflow-x-auto bg-white rounded-2xl shadow-lg border">
//         <table className="table w-full">
//           <thead className="bg-gray-100">
//             <tr className="text-gray-700">
//               <th className="w-16">#</th>
//               <th>Employee</th>
//               <th>Asset</th>
//               <th>Type</th>
//               <th>Status</th>
//               <th>Date</th>
//               <th className="text-center">Actions</th>
//             </tr>
//           </thead>

//           <tbody>
//             {filteredRequests.length === 0 ? (
//               <tr>
//                 <td colSpan="7" className="text-center py-16">
//                   <div className="flex flex-col items-center gap-2">
//                     <FaClipboardList className="text-5xl text-gray-300" />
//                     <h2 className="text-xl font-semibold text-gray-500">No Requests Found</h2>
//                     <p className="text-gray-400">
//                       {searchTerm || statusFilter !== "all"
//                         ? "Try changing your filters"
//                         : "There are currently no asset requests"}
//                     </p>
//                   </div>
//                  </td>
//                </tr>
//             ) : (
//               filteredRequests.map((req, index) => (
//                 <tr key={req._id} className="hover:bg-gray-50 transition duration-150">
//                   <td className="font-semibold">{index + 1}</td>
                  
//                   <td>
//                     <div>
//                       <h3 className="font-semibold">
//                         {req.requesterName || "N/A"}
//                       </h3>
//                       <p className="text-xs text-gray-500">
//                         {req.requesterEmail}
//                       </p>
//                     </div>
//                   </td>
                  
//                   <td>
//                     <div className="flex items-center gap-3">
//                       {req.assetImage ? (
//                         <img
//                           src={req.assetImage}
//                           alt={req.assetName}
//                           className="w-10 h-10 rounded-lg object-cover border"
//                         />
//                       ) : (
//                         <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center">
//                           <FaClipboardList className="text-gray-400" />
//                         </div>
//                       )}
//                       <span className="font-medium">{req.assetName}</span>
//                     </div>
//                   </td>
                  
//                   <td>
//                     <span className={`badge ${
//                       req.assetType === "Returnable" 
//                         ? "badge-info" 
//                         : "badge-secondary"
//                     }`}>
//                       {req.assetType || "N/A"}
//                     </span>
//                   </td>
                  
//                   <td>
//                     <span
//                       className={`badge font-medium gap-1 px-3 py-2 ${
//                         req.requestStatus === "approved" || req.requestStatus === "Approved"
//                           ? "badge-success bg-green-100 text-green-700"
//                           : req.requestStatus === "rejected" || req.requestStatus === "Rejected"
//                           ? "badge-error bg-red-100 text-red-700"
//                           : "badge-warning bg-yellow-100 text-yellow-700"
//                       }`}
//                     >
//                       {(req.requestStatus === "pending" || req.requestStatus === "Pending") && <FaClock className="mr-1" />}
//                       {(req.requestStatus === "approved" || req.requestStatus === "Approved") && <FaCheckCircle className="mr-1" />}
//                       {(req.requestStatus === "rejected" || req.requestStatus === "Rejected") && <FaTimesCircle className="mr-1" />}
//                       {req.requestStatus}
//                     </span>
//                   </td>
                  
//                   <td className="text-sm">
//                     {new Date(req.requestDate).toLocaleDateString()}
//                   </td>
                  
//                   <td>
//                     <div className="flex items-center justify-center gap-2">
//                       <button
//                         type="button"
//                         onClick={() => viewDetails(req)}
//                         className="btn btn-sm btn-info btn-outline"
//                         title="View Details"
//                       >
//                         <FaEye />
//                       </button>

//                       <button
//                         type="button"
//                         disabled={
//                           (req.requestStatus !== "pending" && req.requestStatus !== "Pending") ||
//                           processingId === req._id
//                         }
//                         onClick={() => handleApprove(req._id)}
//                         className={`btn btn-sm ${
//                           (req.requestStatus === "pending" || req.requestStatus === "Pending") && processingId !== req._id
//                             ? "btn-success bg-green-500 hover:bg-green-600 text-white"
//                             : "btn-ghost btn-disabled opacity-50 cursor-not-allowed"
//                         }`}
//                       >
//                         {processingId === req._id ? (
//                           <FaSpinner className="animate-spin mr-1" />
//                         ) : (
//                           <FaCheckCircle className="mr-1" />
//                         )}
//                         Approve
//                       </button>

//                       <button
//                         type="button"
//                         disabled={
//                           (req.requestStatus !== "pending" && req.requestStatus !== "Pending") ||
//                           processingId === req._id
//                         }
//                         onClick={() => handleReject(req._id)}
//                         className={`btn btn-sm ${
//                           (req.requestStatus === "pending" || req.requestStatus === "Pending") && processingId !== req._id
//                             ? "btn-error bg-red-500 hover:bg-red-600 text-white"
//                             : "btn-ghost btn-disabled opacity-50 cursor-not-allowed"
//                         }`}
//                       >
//                         {processingId === req._id ? (
//                           <FaSpinner className="animate-spin mr-1" />
//                         ) : (
//                           <FaTimesCircle className="mr-1" />
//                         )}
//                         Reject
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

// export default AllRequests;





import React, { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

import {
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaClipboardList,
  FaSearch,
  FaEye,
  FaSpinner,
  FaUser,
  FaEnvelope,
  FaBox,
  FaCalendarAlt,
} from "react-icons/fa";

const AllRequests = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [processingId, setProcessingId] = useState(null);

  // ================= FETCH REQUESTS =================
  const { 
    data: responseData, 
    isLoading, 
    isError, 
    refetch,
    error 
  } = useQuery({
    queryKey: ["all-requests", statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      
      if (statusFilter !== "all") {
        // Normalize status value
        let statusValue = statusFilter.toLowerCase();
        if (statusValue === "approved") statusValue = "approved";
        if (statusValue === "rejected") statusValue = "rejected";
        if (statusValue === "pending") statusValue = "pending";
        params.append("status", statusValue);
      }
      
      const res = await axiosSecure.get(`/requests?${params.toString()}`);
      console.log("Raw API Response:", res.data);
      
      let requestsArray = [];
      
      if (res.data && res.data.success === true) {
        requestsArray = Array.isArray(res.data.data) ? res.data.data : [];
      } else if (Array.isArray(res.data)) {
        requestsArray = res.data;
      } else if (res.data && typeof res.data === 'object') {
        requestsArray = res.data.data || res.data.requests || res.data.result || [];
      }
      
      // Normalize status values
      requestsArray = requestsArray.map(req => ({
        ...req,
        requestStatus: normalizeStatus(req.requestStatus),
        requesterName: req.requesterName || req.name || "Unknown User",
        assetType: req.assetType || req.productType || "General"
      }));
      
      console.log("Processed requests:", requestsArray.length);
      return requestsArray;
    },
  });

  // Helper function to normalize status
  const normalizeStatus = (status) => {
    if (!status) return "pending";
    const lowerStatus = status.toLowerCase();
    if (lowerStatus === "approved" || lowerStatus === "approve") return "approved";
    if (lowerStatus === "rejected" || lowerStatus === "reject") return "rejected";
    if (lowerStatus === "pending") return "pending";
    return "pending";
  };

  // Get display status
  const getDisplayStatus = (status) => {
    const normalized = normalizeStatus(status);
    return normalized.charAt(0).toUpperCase() + normalized.slice(1);
  };

  // Get status color
  const getStatusColor = (status) => {
    const normalized = normalizeStatus(status);
    switch(normalized) {
      case "approved": return "badge-success bg-green-100 text-green-700";
      case "rejected": return "badge-error bg-red-100 text-red-700";
      default: return "badge-warning bg-yellow-100 text-yellow-700";
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    const normalized = normalizeStatus(status);
    switch(normalized) {
      case "approved": return <FaCheckCircle className="mr-1" />;
      case "rejected": return <FaTimesCircle className="mr-1" />;
      default: return <FaClock className="mr-1" />;
    }
  };

  const requests = Array.isArray(responseData) ? responseData : [];

  // ================= SEARCH FILTER =================
  const filteredRequests = requests.filter((req) => {
    if (!searchTerm) return true;
    
    const search = searchTerm.toLowerCase();
    
    return (
      req.requesterName?.toLowerCase().includes(search) ||
      req.requesterEmail?.toLowerCase().includes(search) ||
      req.assetName?.toLowerCase().includes(search) ||
      req.assetType?.toLowerCase().includes(search)
    );
  });

  // Format date safely
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid Date";
      return date.toLocaleDateString();
    } catch (error) {
      return "N/A";
    }
  };

  // ================= APPROVE REQUEST =================
  const handleApprove = async (id) => {
    console.log("Approve clicked for ID:", id);
    
    const request = filteredRequests.find(r => r._id === id);
    
    if (!request) {
      Swal.fire("Error", "Request not found", "error");
      return;
    }
    
    if (!request.assetId) {
      Swal.fire("Error", "This request has no asset ID. Please contact support.", "error");
      return;
    }
    
    const result = await Swal.fire({
      title: "Approve Request?",
      html: `
        <div class="text-left">
          <div class="mb-3">
            <p class="text-sm text-gray-500">Employee Information</p>
            <p class="font-semibold">${request.requesterName || "N/A"}</p>
            <p class="text-sm">${request.requesterEmail || "N/A"}</p>
          </div>
          <div class="mb-3">
            <p class="text-sm text-gray-500">Asset Information</p>
            <p class="font-semibold">${request.assetName || "N/A"}</p>
            <p class="text-sm">Type: ${request.assetType || "N/A"}</p>
            <p class="text-xs text-gray-500">Asset ID: ${request.assetId || "N/A"}</p>
          </div>
        </div>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#10b981",
      confirmButtonText: "Yes, Approve",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      setProcessingId(id);
      
      Swal.fire({
        title: "Processing...",
        text: "Please wait",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const res = await axiosSecure.patch(`/requests/approve/${id}`);
      console.log("Approve response:", res.data);

      if (res.data.success) {
        await queryClient.invalidateQueries({ queryKey: ["all-requests"] });
        await queryClient.invalidateQueries({ queryKey: ["assets"] });
        await queryClient.invalidateQueries({ queryKey: ["employee-management"] });
        await queryClient.invalidateQueries({ queryKey: ["my-assets"] });
        await queryClient.invalidateQueries({ queryKey: ["assigned-assets"] });
        
        await refetch();
        
        Swal.fire({
          icon: "success",
          title: "Approved!",
          text: "Request approved successfully",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        throw new Error(res.data.message || "Approval failed");
      }
    } catch (err) {
      console.error("Approve error:", err);
      Swal.fire({
        icon: "error",
        title: "Approval Failed",
        text: err.response?.data?.message || err.message || "Something went wrong",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setProcessingId(null);
    }
  };

  // ================= REJECT REQUEST =================
  const handleReject = async (id) => {
    console.log("Reject clicked for ID:", id);
    
    const request = filteredRequests.find(r => r._id === id);
    
    if (!request) {
      Swal.fire("Error", "Request not found", "error");
      return;
    }
    
    const { value: reason } = await Swal.fire({
      title: "Reject Request",
      html: `
        <div class="text-left mb-4">
          <div class="mb-2">
            <p class="text-sm text-gray-500">Employee</p>
            <p class="font-semibold">${request.requesterName || "N/A"}</p>
          </div>
          <div class="mb-2">
            <p class="text-sm text-gray-500">Asset</p>
            <p class="font-semibold">${request.assetName || "N/A"}</p>
          </div>
        </div>
      `,
      input: "textarea",
      inputLabel: "Reason for rejection (optional)",
      inputPlaceholder: "Enter reason here...",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      confirmButtonText: "Yes, Reject",
      cancelButtonText: "Cancel",
    });

    if (reason === undefined) return;

    try {
      setProcessingId(id);
      
      Swal.fire({
        title: "Processing...",
        text: "Please wait",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const res = await axiosSecure.patch(`/requests/reject/${id}`, { reason });
      console.log("Reject response:", res.data);

      if (res.data.success) {
        await queryClient.invalidateQueries({ queryKey: ["all-requests"] });
        await refetch();
        
        Swal.fire({
          icon: "success",
          title: "Rejected!",
          text: "Request has been rejected",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        throw new Error(res.data.message || "Rejection failed");
      }
    } catch (err) {
      console.error("Reject error:", err);
      Swal.fire({
        icon: "error",
        title: "Rejection Failed",
        text: err.response?.data?.message || err.message || "Something went wrong",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setProcessingId(null);
    }
  };

  // ================= VIEW DETAILS =================
  const viewDetails = (req) => {
    Swal.fire({
      title: "Request Details",
      html: `
        <div class="text-left space-y-4">
          <div class="border-b pb-3">
            <div class="flex items-center gap-2 mb-2">
              <FaUser class="text-gray-500" />
              <p class="text-sm text-gray-500">Employee Information</p>
            </div>
            <p class="font-semibold text-lg">${req.requesterName || "N/A"}</p>
            <div class="flex items-center gap-2 mt-1">
              <FaEnvelope class="text-gray-400 text-sm" />
              <p class="text-sm">${req.requesterEmail || "N/A"}</p>
            </div>
          </div>
          
          <div class="border-b pb-3">
            <div class="flex items-center gap-2 mb-2">
              <FaBox class="text-gray-500" />
              <p class="text-sm text-gray-500">Asset Information</p>
            </div>
            <p class="font-semibold">${req.assetName || "N/A"}</p>
            <p class="text-sm">Type: ${req.assetType || "N/A"}</p>
            <p class="text-xs text-gray-500 mt-1">Asset ID: ${req.assetId || "N/A"}</p>
          </div>
          
          <div class="border-b pb-3">
            <div class="flex items-center gap-2 mb-2">
              <FaCalendarAlt class="text-gray-500" />
              <p class="text-sm text-gray-500">Request Details</p>
            </div>
            <p class="text-sm">Date: ${formatDate(req.requestDate)}</p>
            <p class="text-sm capitalize">Status: ${getDisplayStatus(req.requestStatus)}</p>
            ${req.quantity ? `<p class="text-sm">Quantity: ${req.quantity}</p>` : ''}
            ${req.description ? `<p class="text-sm mt-2">Description: ${req.description}</p>` : ''}
          </div>
          
          ${req.rejectionReason ? `
            <div class="bg-red-50 p-3 rounded-lg">
              <p class="text-sm text-red-600 font-semibold">Rejection Reason</p>
              <p class="text-sm text-red-700">${req.rejectionReason}</p>
            </div>
          ` : ''}
        </div>
      `,
      icon: "info",
      confirmButtonText: "Close",
      width: '550px',
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-primary mx-auto mb-4" />
          <p className="text-gray-500">Loading requests...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center mt-20">
        <div className="alert alert-error shadow-lg max-w-md mx-auto">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Failed to load requests! {error?.message || "Please try again"}</span>
          </div>
        </div>
        <button className="btn btn-primary mt-4" onClick={() => refetch()}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
            <FaClipboardList className="text-primary" />
            All Asset Requests
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Approve or reject employee asset requests
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by employee or asset..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input input-bordered pl-10 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="select select-bordered w-full sm:w-40"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>

          <div className="badge badge-primary badge-lg px-4 py-4">
            Total: {filteredRequests.length}
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto bg-white rounded-2xl shadow-lg border">
        <table className="table w-full">
          <thead className="bg-gray-100">
            <tr className="text-gray-700">
              <th className="w-16">#</th>
              <th>Employee</th>
              <th>Asset</th>
              <th>Type</th>
              <th>Status</th>
              <th>Date</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredRequests.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-16">
                  <div className="flex flex-col items-center gap-2">
                    <FaClipboardList className="text-5xl text-gray-300" />
                    <h2 className="text-xl font-semibold text-gray-500">No Requests Found</h2>
                    <p className="text-gray-400">
                      {searchTerm || statusFilter !== "all"
                        ? "Try changing your filters"
                        : "There are currently no asset requests"}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredRequests.map((req, index) => (
                <tr key={req._id} className="hover:bg-gray-50 transition duration-150">
                  <td className="font-semibold">{index + 1}</td>
                  
                  <td>
                    <div>
                      <h3 className="font-semibold">
                        {req.requesterName || "Unknown User"}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {req.requesterEmail || "No email"}
                      </p>
                    </div>
                  </td>
                  
                  <td>
                    <div className="flex items-center gap-3">
                      {req.assetImage ? (
                        <img
                          src={req.assetImage}
                          alt={req.assetName}
                          className="w-10 h-10 rounded-lg object-cover border"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center">
                          <FaBox className="text-gray-400" />
                        </div>
                      )}
                      <span className="font-medium">{req.assetName || "Unknown Asset"}</span>
                    </div>
                  </td>
                  
                  <td>
                    <span className={`badge ${
                      req.assetType === "Returnable" 
                        ? "badge-info" 
                        : "badge-secondary"
                    }`}>
                      {req.assetType || "General"}
                    </span>
                  </td>
                  
                  <td>
                    <span className={`badge font-medium gap-1 px-3 py-2 ${getStatusColor(req.requestStatus)}`}>
                      {getStatusIcon(req.requestStatus)}
                      {getDisplayStatus(req.requestStatus)}
                    </span>
                  </td>
                  
                  <td className="text-sm">
                    {formatDate(req.requestDate)}
                  </td>
                  
                  <td>
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => viewDetails(req)}
                        className="btn btn-sm btn-info btn-outline"
                        title="View Details"
                      >
                        <FaEye />
                      </button>

                      <button
                        type="button"
                        disabled={
                          normalizeStatus(req.requestStatus) !== "pending" ||
                          processingId === req._id
                        }
                        onClick={() => handleApprove(req._id)}
                        className={`btn btn-sm ${
                          normalizeStatus(req.requestStatus) === "pending" && processingId !== req._id
                            ? "btn-success bg-green-500 hover:bg-green-600 text-white"
                            : "btn-ghost btn-disabled opacity-50 cursor-not-allowed"
                        }`}
                      >
                        {processingId === req._id ? (
                          <FaSpinner className="animate-spin mr-1" />
                        ) : (
                          <FaCheckCircle className="mr-1" />
                        )}
                        Approve
                      </button>

                      <button
                        type="button"
                        disabled={
                          normalizeStatus(req.requestStatus) !== "pending" ||
                          processingId === req._id
                        }
                        onClick={() => handleReject(req._id)}
                        className={`btn btn-sm ${
                          normalizeStatus(req.requestStatus) === "pending" && processingId !== req._id
                            ? "btn-error bg-red-500 hover:bg-red-600 text-white"
                            : "btn-ghost btn-disabled opacity-50 cursor-not-allowed"
                        }`}
                      >
                        {processingId === req._id ? (
                          <FaSpinner className="animate-spin mr-1" />
                        ) : (
                          <FaTimesCircle className="mr-1" />
                        )}
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllRequests;

