// import React, { useRef, useState } from "react";
// import { useQuery } from "@tanstack/react-query";
// import useAxiosSecure from "../../hooks/useAxiosSecure";

// const AssignProduct = () => {
//   const axiosSecure = useAxiosSecure();
//   const productModalRef = useRef();

//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [selectedEmployee, setSelectedEmployee] = useState("");

//   const {
//     data: products = [],
//     isLoading,
//     isError,
//     refetch,
//   } = useQuery({
//     queryKey: ["products", "pending-pickup"],
//     queryFn: async () => {
//       const res = await axiosSecure.get(
//         `/assets?deliveryStatus=pending-pickup`
//       );
//       return res.data;
//     },
//   });
//   const {
//     data: employees = [],
//     isLoading: employeeLoading,
//   } = useQuery({
//     queryKey: ["employees", selectedProduct?._id],
//     enabled: !!selectedProduct,
//     queryFn: async () => {
//       const res = await axiosSecure.get(`/employees?status=available`);
//       return res.data.data;
//     },
//   });

//   // ✅ Open Modal
//   const openAssignProductModal = (product) => {
//     setSelectedProduct(product);
//     setSelectedEmployee("");
//     productModalRef.current.showModal();
//   };

//   // ✅ Assign API
//   const handleConfirmAssign = async () => {
//     if (!selectedProduct || !selectedEmployee) {
//       alert("Please select an employee");
//       return;
//     }

//     try {
//       await axiosSecure.patch(`/assign-product`, {
//         productId: selectedProduct._id,
//         employeeId: selectedEmployee,
//       });

//       productModalRef.current.close();
//       refetch();
//     } catch (error) {
//       console.error(error);
//     }
//   };

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
//         Failed to load assign products
//       </div>
//     );
//   }

//   return (
//     <div className="p-4 md:p-6 lg:p-8">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl md:text-3xl font-bold">
//           📦 Assign Products (Pending Pickup)
//         </h2>

//         <p className="text-gray-600">
//           Total: <span className="font-semibold">{products.length}</span>
//         </p>
//       </div>

//       {/* Empty */}
//       {products.length === 0 ? (
//         <div className="text-center py-10 border rounded-lg bg-gray-50">
//           <p className="text-gray-500">No pending pickup products</p>
//         </div>
//       ) : (
//         <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
//           <table className="table table-zebra">
//             <thead className="bg-base-200">
//               <tr>
//                 <th>#</th>
//                 <th>Asset</th>
//                 <th>Price</th>
//                 <th>Tracking ID</th>
//                 <th>Payment</th>
//                 <th>Status</th>
//                 <th>Date</th>
//                 <th>Action</th>
//               </tr>
//             </thead>

//             <tbody>
//               {products.map((item, index) => (
//                 <tr key={item._id}>
//                   <th>{index + 1}</th>

//                   <td>
//                     <div className="font-semibold">
//                       {item.assetName || "Untitled"}
//                     </div>
//                     <div className="text-xs text-gray-400">
//                       {item.assetType || "No type"}
//                     </div>
//                   </td>

//                   <td className="text-green-600 font-medium">
//                     ${item.price}
//                   </td>

//                   <td className="text-blue-600 font-mono text-xs">
//                     {item.trackingId}
//                   </td>

//                   <td>
//                     <span
//                       className={`badge ${
//                         item.paymentStatus === "paid"
//                           ? "badge-success"
//                           : "badge-error"
//                       }`}
//                     >
//                       {item.paymentStatus}
//                     </span>
//                   </td>

//                   <td>
//                     <span className="badge badge-warning">
//                       {item.deliveryStatus}
//                     </span>
//                   </td>

//                   <td className="text-sm text-gray-400">
//                     {item.createdAt
//                       ? new Date(item.createdAt).toLocaleDateString()
//                       : "—"}
//                   </td>

//                   <td>
//                     <button
//                       onClick={() => openAssignProductModal(item)}
//                       className="btn btn-xs btn-primary"
//                     >
//                       Assign
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           {/* Refresh */}
//           <div className="p-4 text-center">
//             <button
//               onClick={() => refetch()}
//               className="btn btn-sm btn-outline"
//             >
//               Refresh
//             </button>
//           </div>
//         </div>
//       )}

//       {/* ✅ Modal */}
//       <dialog ref={productModalRef} className="modal modal-middle">
//         <div className="modal-box">
//           <h3 className="font-bold text-lg">Assign Product</h3>

//           <p className="py-2">
//             Product:{" "}
//             <span className="font-semibold text-blue-600">
//               {selectedProduct?.assetName}
//             </span>
//           </p>

//           {/* Employee Select */}
//           {employeeLoading ? (
//             <p className="text-sm text-gray-400">
//               Loading employees...
//             </p>
//           ) : (
//             <select
//               className="select select-bordered w-full mt-3"
//               value={selectedEmployee}
//               onChange={(e) => setSelectedEmployee(e.target.value)}
//             >
//               <option value="">Select Employee</option>
//               {employees.map((emp) => (
//                 <option key={emp._id} value={emp._id}>
//                   {emp.name}
//                 </option>
//               ))}
//             </select>
//           )}

//           <div className="modal-action">
//             <form method="dialog">
//               <button className="btn">Cancel</button>
//             </form>

//             <button
//               onClick={handleConfirmAssign}
//               className="btn btn-primary"
//             >
//               Assign Now
//             </button>
//           </div>
//         </div>
//       </dialog>
//     </div>
//   );
// };

// export default AssignProduct;

// import React, { useRef, useState } from "react";
// import { useQuery } from "@tanstack/react-query";
// import useAxiosSecure from "../../hooks/useAxiosSecure";

// const AssignProduct = () => {
//   const axiosSecure = useAxiosSecure();
//   const productModalRef = useRef();

//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [selectedEmployee, setSelectedEmployee] = useState("");

//   // ✅ Fetch Products
//   const {
//     data: products = [],
//     isLoading,
//     isError,
//     refetch,
//   } = useQuery({
//     queryKey: ["products", "pending-pickup"],
//     queryFn: async () => {
//       const res = await axiosSecure.get(
//         `/assets?deliveryStatus=pending-pickup`
//       );

//       return Array.isArray(res.data)
//         ? res.data
//         : res.data.data || [];
//     },
//   });

//   // ✅ Fetch Employees (Clean Data Handling)
//   const {
//     data: employees = [],
//     isLoading: employeeLoading,
//   } = useQuery({
//     queryKey: ["employees", selectedProduct?._id],
//     enabled: !!selectedProduct,
//     queryFn: async () => {
//       const res = await axiosSecure.get(
//         `/employees?status=available`
//       );

//       const raw = res.data;

//       // 🔥 Clean normalization
//       if (Array.isArray(raw)) return raw;
//       if (Array.isArray(raw?.data)) return raw.data;
//       if (Array.isArray(raw?.employees)) return raw.employees;

//       return [];
//     },
//   });

//   // ✅ Open Modal
//   const openAssignProductModal = (product) => {
//     setSelectedProduct(product);
//     setSelectedEmployee("");
//     productModalRef.current.showModal();
//   };

//   // ✅ Assign Product
//   const handleConfirmAssign = async () => {
//     if (!selectedProduct || !selectedEmployee) {
//       alert("Please select an employee");
//       return;
//     }

//     try {
//       await axiosSecure.patch(`/assign-product`, {
//         productId: selectedProduct._id,
//         employeeId: selectedEmployee,
//       });

//       productModalRef.current.close();
//       refetch();
//     } catch (error) {
//       console.error("Assign error:", error);
//     }
//   };

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
//         Failed to load assign products
//       </div>
//     );
//   }

//   return (
//     <div className="p-4 md:p-6 lg:p-8">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl md:text-3xl font-bold">
//           📦 Assign Products (Pending Pickup)
//         </h2>

//         <p className="text-gray-600">
//           Total: <span className="font-semibold">{products.length}</span>
//         </p>
//       </div>

//       {/* Empty */}
//       {products.length === 0 ? (
//         <div className="text-center py-10 border rounded-lg bg-gray-50">
//           <p className="text-gray-500">
//             No pending pickup products
//           </p>
//         </div>
//       ) : (
//         <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
//           <table className="table table-zebra">
//             <thead className="bg-base-200">
//               <tr>
//                 <th>#</th>
//                 <th>Asset</th>
//                 <th>Price</th>
//                 <th>Tracking ID</th>
//                 <th>Payment</th>
//                 <th>Status</th>
//                 <th>Date</th>
//                 <th>Action</th>
//               </tr>
//             </thead>

//             <tbody>
//               {products.map((item, index) => (
//                 <tr key={item._id}>
//                   <th>{index + 1}</th>

//                   <td>
//                     <div className="font-semibold">
//                       {item.assetName || "Untitled"}
//                     </div>
//                     <div className="text-xs text-gray-400">
//                       {item.assetType || "No type"}
//                     </div>
//                   </td>

//                   <td className="text-green-600 font-medium">
//                     ${item.price}
//                   </td>

//                   <td className="text-blue-600 font-mono text-xs">
//                     {item.trackingId}
//                   </td>

//                   <td>
//                     <span
//                       className={`badge ${
//                         item.paymentStatus === "paid"
//                           ? "badge-success"
//                           : "badge-error"
//                       }`}
//                     >
//                       {item.paymentStatus}
//                     </span>
//                   </td>

//                   <td>
//                     <span className="badge badge-warning">
//                       {item.deliveryStatus}
//                     </span>
//                   </td>

//                   <td className="text-sm text-gray-400">
//                     {item.createdAt
//                       ? new Date(
//                           item.createdAt
//                         ).toLocaleDateString()
//                       : "—"}
//                   </td>

//                   <td>
//                     <button
//                       onClick={() =>
//                         openAssignProductModal(item)
//                       }
//                       className="btn btn-xs btn-primary"
//                     >
//                       Assign
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           {/* Refresh */}
//           <div className="p-4 text-center">
//             <button
//               onClick={() => refetch()}
//               className="btn btn-sm btn-outline"
//             >
//               Refresh
//             </button>
//           </div>
//         </div>
//       )}

//       {/* ✅ Modal */}
//       <dialog
//         ref={productModalRef}
//         className="modal modal-middle"
//       >
//         <div className="modal-box">
//           <h3 className="font-bold text-lg">
//             Assign Product
//           </h3>

//           <p className="py-2">
//             Product:{" "}
//             <span className="font-semibold text-blue-600">
//               {selectedProduct?.assetName}
//             </span>
//           </p>

//           {/* Employee Select */}
//           {employeeLoading ? (
//             <p className="text-sm text-gray-400">
//               Loading employees...
//             </p>
//           ) : (
//             <select
//               className="select select-bordered w-full mt-3"
//               value={selectedEmployee}
//               onChange={(e) =>
//                 setSelectedEmployee(e.target.value)
//               }
//             >
//               <option value="">
//                 Select Employee
//               </option>

//               {employees.length > 0 ? (
//                 employees.map((emp) => (
//                   <option
//                     key={emp._id}
//                     value={emp._id}
//                   >
//                     {emp.name || "No Name"} (
//                     {emp.email || "No Email"})
//                   </option>
//                 ))
//               ) : (
//                 <option disabled>
//                   No employees available
//                 </option>
//               )}
//             </select>
//           )}

//           <div className="modal-action">
//             <form method="dialog">
//               <button className="btn">
//                 Cancel
//               </button>
//             </form>

//             <button
//               onClick={handleConfirmAssign}
//               className="btn btn-primary"
//             >
//               Assign Now
//             </button>
//           </div>
//         </div>
//       </dialog>
//     </div>
//   );
// };

// export default AssignProduct;

// import React, { useRef, useState } from "react";
// import { useQuery } from "@tanstack/react-query";
// import useAxiosSecure from "../../hooks/useAxiosSecure";

// const AssignProduct = () => {
//   const axiosSecure = useAxiosSecure();
//   const productModalRef = useRef();

//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [selectedEmployee, setSelectedEmployee] = useState("");

//   // =========================
//   // 📦 PRODUCTS (pending pickup)
//   // =========================
//   const {
//     data: products = [],
//     isLoading,
//     isError,
//     refetch,
//   } = useQuery({
//     queryKey: ["products"],
//     queryFn: async () => {
//       const res = await axiosSecure.get(
//         "/assets?deliveryStatus=pending-pickup"
//       );
//       return Array.isArray(res.data) ? res.data : [];
//     },
//   });

//   // =========================
//   // 👥 EMPLOYEES (TEAM MEMBERS)
//   // =========================
//   const {
//     data: employees = [],
//     isLoading: employeeLoading,
//   } = useQuery({
//     queryKey: ["team-members", selectedProduct?._id],
//     enabled: !!selectedProduct,
//     queryFn: async () => {
//       const res = await axiosSecure.get("/team-members", {
//         params: {
//           companyName: selectedProduct?.companyName,
//         },
//       });

//       return Array.isArray(res.data) ? res.data : [];
//     },
//   });

//   // =========================
//   // OPEN MODAL
//   // =========================
//   const openModal = (product) => {
//     setSelectedProduct(product);
//     setSelectedEmployee("");
//     productModalRef.current.showModal();
//   };

//   // =========================
//   // ASSIGN PRODUCT
//   // =========================
//   const handleAssign = async () => {
//     if (!selectedProduct || !selectedEmployee) {
//       alert("Please select employee");
//       return;
//     }

//     try {
//       await axiosSecure.patch("/assign-product", {
//         productId: selectedProduct._id,
//         employeeId: selectedEmployee,
//       });

//       productModalRef.current.close();
//       setSelectedEmployee("");
//       setSelectedProduct(null);
//       refetch();
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   // =========================
//   // LOADING
//   // =========================
//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center min-h-[60vh]">
//         <span className="loading loading-spinner loading-lg"></span>
//       </div>
//     );
//   }

//   // =========================
//   // ERROR
//   // =========================
//   if (isError) {
//     return (
//       <div className="text-center text-red-500 mt-10">
//         Failed to load products
//       </div>
//     );
//   }

//   return (
//     <div className="p-4 md:p-6">

//       {/* HEADER */}
//       <div className="flex justify-between mb-5">
//         <h2 className="text-2xl font-bold">
//           📦 Assign Products
//         </h2>

//         <p>Total: {products.length}</p>
//       </div>

//       {/* TABLE */}
//       <div className="overflow-x-auto border rounded-lg">
//         <table className="table table-zebra">
//           <thead>
//             <tr>
//               <th>#</th>
//               <th>Asset</th>
//               <th>Type</th>
//               <th>Price</th>
//               <th>Status</th>
//               <th>Action</th>
//             </tr>
//           </thead>

//           <tbody>
//             {products.map((p, i) => (
//               <tr key={p._id}>
//                 <td>{i + 1}</td>

//                 <td>{p.assetName}</td>

//                 <td>{p.assetType}</td>

//                 <td className="text-green-600">${p.price}</td>

//                 <td>
//                   <span className="badge badge-warning">
//                     {p.deliveryStatus}
//                   </span>
//                 </td>

//                 <td>
//                   <button
//                     onClick={() => openModal(p)}
//                     className="btn btn-sm btn-primary"
//                   >
//                     Assign
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* =========================
//             MODAL
//       ========================= */}
//       <dialog ref={productModalRef} className="modal">
//         <div className="modal-box">

//           <h3 className="font-bold text-lg mb-3">
//             Assign Product
//           </h3>

//           <p className="mb-2">
//             Product:{" "}
//             <span className="font-semibold text-blue-600">
//               {selectedProduct?.assetName}
//             </span>
//           </p>

//           {/* EMPLOYEE SELECT */}
//           {employeeLoading ? (
//             <p>Loading employees...</p>
//           ) : (
//             <select
//               className="select select-bordered w-full"
//               value={selectedEmployee}
//               onChange={(e) => setSelectedEmployee(e.target.value)}
//             >
//               <option value="">Select Employee</option>

//               {employees.map((emp) => (
//                 <option key={emp._id} value={emp._id}>
//                   {emp.name} ({emp.email})
//                 </option>
//               ))}
//             </select>
//           )}

//           {/* ACTIONS */}
//           <div className="modal-action">
//             <form method="dialog">
//               <button className="btn">Cancel</button>
//             </form>

//             <button
//               onClick={handleAssign}
//               className="btn btn-primary"
//             >
//               Assign Now
//             </button>
//           </div>

//         </div>
//       </dialog>
//     </div>
//   );
// };

// export default AssignProduct;




import React, { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const AssignProduct = () => {
  const axiosSecure = useAxiosSecure();
  const modalRef = useRef();

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState("");

  // =========================
  // 📦 PRODUCTS
  // =========================
  const { data: products = [], isLoading, isError, refetch } = useQuery({
    queryKey: ["pending-products"],
    queryFn: async () => {
      const res = await axiosSecure.get(
        "/assets?deliveryStatus=pending-pickup"
      );
      return Array.isArray(res.data) ? res.data : [];
    },
  });

  // =========================
  // 👥 TEAM MEMBERS
  // =========================
  const {
    data: employees = [],
    isLoading: empLoading,
    refetch: refetchEmployees,
  } = useQuery({
    queryKey: ["team-members", selectedProduct?.companyName],
    enabled: !!selectedProduct?.companyName,
    queryFn: async () => {
      const res = await axiosSecure.get("/team-members", {
        params: {
          companyName: selectedProduct.companyName,
        },
      });

      return Array.isArray(res.data) ? res.data : [];
    },
  });

  // =========================
  // OPEN MODAL
  // =========================
  const openModal = (product) => {
    setSelectedProduct(product);
    setSelectedEmployee("");
    modalRef.current.showModal();
  };

  // =========================
  // ASSIGN PRODUCT
  // =========================
  const handleAssign = async () => {
    if (!selectedProduct?._id || !selectedEmployee) {
      alert("Select employee first");
      return;
    }

    try {
      await axiosSecure.post("/assign-direct", {
        assetId: selectedProduct._id,
        employeeEmail: selectedEmployee,
      });

      modalRef.current.close();
      setSelectedEmployee("");
      setSelectedProduct(null);
      refetch();
      refetchEmployees();
    } catch (err) {
      console.log("Assign error:", err);
    }
  };

  // =========================
  // UI STATES
  // =========================
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-center text-red-500 mt-10">
        Failed to load products
      </p>
    );
  }

  return (
    <div className="p-4 md:p-6">

      {/* HEADER */}
      <div className="flex justify-between mb-5">
        <h2 className="text-2xl font-bold">📦 Assign Products</h2>
        <p>Total: {products.length}</p>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>#</th>
              <th>Asset</th>
              <th>Type</th>
              <th>Price</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p, i) => (
              <tr key={p._id}>
                <td>{i + 1}</td>
                <td>{p.assetName}</td>
                <td>{p.assetType}</td>
                <td className="text-green-600">${p.price}</td>
                <td>
                  <span className="badge badge-warning">
                    {p.deliveryStatus}
                  </span>
                </td>
                <td>
                  <button
                    onClick={() => openModal(p)}
                    className="btn btn-sm btn-primary"
                  >
                    Assign
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* =========================
              MODAL
      ========================= */}
      <dialog ref={modalRef} className="modal">
        <div className="modal-box">

          <h3 className="font-bold text-lg mb-2">
            Assign Product
          </h3>

          <p className="mb-3">
            Product:{" "}
            <span className="text-blue-600 font-semibold">
              {selectedProduct?.assetName}
            </span>
          </p>

          {/* EMPLOYEES */}
          {empLoading ? (
            <p>Loading employees...</p>
          ) : employees.length === 0 ? (
            <p className="text-red-500">
              No team members found for this company
            </p>
          ) : (
            <select
              className="select select-bordered w-full"
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
            >
              <option value="">Select Employee</option>

              {employees.map((emp) => (
                <option key={emp._id} value={emp.email}>
                  {emp.employeeName || emp.name} ({emp.employeeEmail || emp.email})
                </option>
              ))}
            </select>
          )}

          {/* ACTIONS */}
          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Cancel</button>
            </form>

            <button
              onClick={handleAssign}
              className="btn btn-primary"
            >
              Assign Now
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default AssignProduct;