// import React from "react";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import useAxiosSecure from "../../hooks/useAxiosSecure";
// import Swal from "sweetalert2";

// const ReturnAsset = ({ _id }) => {
//   const axiosSecure = useAxiosSecure();
//   const queryClient = useQueryClient();

//   const { mutate, isPending } = useMutation({
//     mutationFn: async () => {
//       const res = await axiosSecure.patch(
//         `/assigned-assets/return/${_id}`
//       );
//       return res.data;
//     },

//     onSuccess: () => {
//       Swal.fire({
//         icon: "success",
//         title: "Returned!",
//         text: "Asset returned successfully",
//         timer: 1500,
//         showConfirmButton: false,
//       });

//       queryClient.invalidateQueries(["assigned-assets"]);
//     },

//     onError: (error) => {
//       Swal.fire({
//         icon: "error",
//         title: "Failed",
//         text: error?.response?.data?.message || "Return failed",
//       });
//     },
//   });

//   const handleReturn = () => {
//     Swal.fire({
//       title: "Are you sure?",
//       text: "You want to return this asset?",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonText: "Yes, return it!",
//     }).then((result) => {
//       if (result.isConfirmed) {
//         mutate();
//       }
//     });
//   };

//   return (
//     <button
//       onClick={handleReturn}
//       disabled={isPending}
//       className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
//     >
//       {isPending ? "Returning..." : "Return"}
//     </button>
//   );
// };

// export default ReturnAsset;

// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import useAxiosSecure from "../../hooks/useAxiosSecure";
// import Swal from "sweetalert2";

// const ReturnAsset = ({ _id, onClose }) => {
//   const axiosSecure = useAxiosSecure();
//   const queryClient = useQueryClient();

//   const { mutate, isPending } = useMutation({
//     mutationFn: async () => {
//       const res = await axiosSecure.patch(
//         `/assigned-assets/return/${_id}`
//       );
//       return res.data;
//     },

//     onSuccess: () => {
//       Swal.fire("Success", "Asset Returned", "success");

//       queryClient.invalidateQueries();

//       onClose?.();
//     },

//     onError: (err) => {
//       Swal.fire(
//         "Error",
//         err?.response?.data?.message || "Failed",
//         "error"
//       );
//     },
//   });

//   return (
//     <button
//       onClick={() => mutate()}
//       disabled={isPending}
//       className="btn btn-error btn-sm w-full"
//     >
//       {isPending ? "Returning..." : "Return Asset"}
//     </button>
//   );
// };

// export default ReturnAsset;



import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const ReturnAsset = ({ _id, onClose }) => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const res = await axiosSecure.patch(
        `/assigned-assets/return/${_id}`
      );
      return res.data;
    },

    onSuccess: () => {
      Swal.fire("Success", "Asset Returned", "success");

      // 🔥 refresh data
      queryClient.invalidateQueries({
        queryKey: ["my-assets"],
      });

      onClose?.();
    },

    onError: () => {
      Swal.fire("Error", "Return Failed", "error");
    },
  });

  return (
    <button
      onClick={() => mutate()}
      disabled={isPending}
      className="btn btn-error btn-sm w-full"
    >
      {isPending ? "Returning..." : "Return Asset"}
    </button>
  );
};

export default ReturnAsset;