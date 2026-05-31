// import React from "react";
// import useAxiosSecure from "../../hooks/useAxiosSecure";
// import useAuth from "../../hooks/useAuth";

// const RequestForm = () => {
//   const axiosSecure = useAxiosSecure();
//   const { user } = useAuth();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const form = e.target;

//     const requestData = {
//       assetId: form.assetId.value,
//       assetName: form.assetName.value,
//       assetType: form.assetType.value,
//       requesterEmail: user?.email,
//       requesterName: user?.displayName,
//       hrEmail: form.hrEmail.value,
//       companyName: form.companyName.value,
//     };

//     try {
//       const res = await axiosSecure.post("/requests", requestData);
//       console.log("POST RESPONSE:", res.data);
//       alert("Request Sent ✅");
//       form.reset();
//     } catch (error) {
//       console.error(error);
//       alert("Failed ❌");
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} style={{ marginBottom: "30px" }}>
//       <h3>📨 Send Request</h3>

//       <input name="assetId" placeholder="Asset ID" required />
//       <br />

//       <input name="assetName" placeholder="Asset Name" required />
//       <br />

//       <input name="assetType" placeholder="Type" required />
//       <br />

//       <input name="hrEmail" placeholder="HR Email" required />
//       <br />

//       <input name="companyName" placeholder="Company" required />
//       <br />

//       <button type="submit">Send Request</button>
//     </form>
//   );
// };

// export default RequestForm;


// import React, { useState } from "react";
// import useAxiosSecure from "../../hooks/useAxiosSecure";
// import useAuth from "../../hooks/useAuth";
// import Swal from "sweetalert2";

// const RequestForm = () => {
//   const axiosSecure = useAxiosSecure();
//   const { user } = useAuth();
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!user?.email) {
//       return Swal.fire("Error", "User not logged in", "error");
//     }

//     const form = e.target;

//     const requestData = {
//       assetId: form.assetId.value.trim(),
//       assetName: form.assetName.value.trim(),
//       assetType: form.assetType.value.trim(),
//       requesterEmail: user.email,
//       requesterName: user.displayName || "Unknown",
//       hrEmail: form.hrEmail.value.trim(),
//       companyName: form.companyName.value.trim(),
//     };

//     try {
//       setLoading(true);

//       const { data } = await axiosSecure.post("/requests", requestData);

//       Swal.fire({
//         icon: "success",
//         title: "Request Sent",
//         text: "Your request has been submitted successfully",
//         timer: 1500,
//         showConfirmButton: false,
//       });

//       console.log("POST RESPONSE:", data);
//       form.reset();
//     } catch (error) {
//       console.error("REQUEST ERROR:", error);

//       Swal.fire({
//         icon: "error",
//         title: "Failed",
//         text: error?.response?.data?.message || "Something went wrong",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="request-container">
//       <h2 className="title">📨 Request Asset</h2>

//       <form onSubmit={handleSubmit} className="form">
//         <input name="assetId" placeholder="Asset ID" required />
//         <input name="assetName" placeholder="Asset Name" required />
//         <input name="assetType" placeholder="Asset Type" required />
//         <input name="hrEmail" placeholder="HR Email" required />
//         <input name="companyName" placeholder="Company Name" required />

//         <button type="submit" disabled={loading}>
//           {loading ? "Sending..." : "Send Request"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default RequestForm;

import React, { useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import Swal from "sweetalert2";

const RequestForm = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.email) {
      return Swal.fire("Error", "User not logged in", "error");
    }

    const form = e.target;

    const requestData = {
      assetId: form.assetId.value.trim(),
      assetName: form.assetName.value.trim(),
      assetType: form.assetType.value.trim(),
      requesterEmail: user.email,
      requesterName: user.displayName || "Unknown",
      hrEmail: form.hrEmail.value.trim(),
      companyName: form.companyName.value.trim(),
    };

    try {
      setLoading(true);

      await axiosSecure.post("/requests", requestData);

      Swal.fire({
        icon: "success",
        title: "Request Sent",
        text: "Your request has been submitted successfully",
        timer: 1500,
        showConfirmButton: false,
      });

      form.reset();
    } catch (error) {
      Swal.fire("Failed", "Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">

      {/* CARD */}
      <div className="w-full max-w-lg bg-base-100 shadow-2xl rounded-2xl p-6 md:p-8">

        {/* HEADER */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-base-content">
            📨 Request Asset
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Submit asset request to HR
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* ASSET ID */}
          <input
            name="assetId"
            placeholder="Asset ID"
            className="input input-bordered w-full focus:ring-2 focus:ring-primary"
            required
          />

          {/* ASSET NAME */}
          <input
            name="assetName"
            placeholder="Asset Name"
            className="input input-bordered w-full focus:ring-2 focus:ring-primary"
            required
          />

          {/* ASSET TYPE */}
          <input
            name="assetType"
            placeholder="Asset Type"
            className="input input-bordered w-full focus:ring-2 focus:ring-primary"
            required
          />

          {/* HR EMAIL */}
          <input
            name="hrEmail"
            placeholder="HR Email"
            className="input input-bordered w-full focus:ring-2 focus:ring-primary"
            required
          />

          {/* COMPANY NAME */}
          <input
            name="companyName"
            placeholder="Company Name"
            className="input input-bordered w-full focus:ring-2 focus:ring-primary"
            required
          />

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full"
          >
            {loading ? (
              <span className="loading loading-spinner"></span>
            ) : (
              "Send Request"
            )}
          </button>

        </form>
      </div>
    </div>
  );
};

export default RequestForm;