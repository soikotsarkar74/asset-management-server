// import React from "react";
// import { useQuery } from "@tanstack/react-query";
// import useAxiosSecure from "../../hooks/useAxiosSecure";

// const Packages = () => {
//   const axiosSecure = useAxiosSecure();

//   const { data: packages = [], isLoading } = useQuery({
//     queryKey: ["packages"],
//     queryFn: async () => {
//       const res = await axiosSecure.get("/packages");
//       return res.data;
//     },
//   });

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center h-40">
//         <span className="loading loading-spinner loading-lg"></span>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-6xl mx-auto py-10 px-4">

//       <h1 className="text-3xl font-bold text-center mb-10">
//         Choose Your Package
//       </h1>

//       <div className="grid md:grid-cols-3 gap-6">

//         {packages.map((pkg) => (
//           <div
//             key={pkg._id}
//             className="border rounded-xl shadow-md p-6 hover:shadow-xl transition"
//           >

//             <h2 className="text-2xl font-bold text-center">
//               {pkg.name}
//             </h2>

//             <p className="text-center text-xl mt-2">
//               ${pkg.price}
//             </p>

//             <p className="text-center text-gray-500">
//               Employee Limit: {pkg.employeeLimit}
//             </p>

//             <div className="mt-4 space-y-2">
//               {pkg.features?.map((feature, i) => (
//                 <p key={i} className="text-sm">
//                   ✔ {feature}
//                 </p>
//               ))}
//             </div>

//             <button className="btn btn-primary w-full mt-5">
//               Select Plan
//             </button>

//           </div>
//         ))}

//       </div>
//     </div>
//   );
// };

// export default Packages;



import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useNavigate } from "react-router-dom";

const Packages = () => {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const { data: packages = [], isLoading } = useQuery({
    queryKey: ["packages"],
    queryFn: async () => {
      const res = await axiosSecure.get("/packages");
      return res.data;
    },
  });

  // ================= HANDLE SELECT =================

  const handleSelectPlan = (pkg) => {
    navigate("/payment", {
      state: pkg,
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">

      <h1 className="text-3xl font-bold text-center mb-10">
        Choose Your Package
      </h1>

      <div className="grid md:grid-cols-3 gap-6">

        {packages.map((pkg) => (
          <div
            key={pkg._id}
            className="border rounded-xl shadow-md p-6 hover:shadow-xl transition"
          >

            <h2 className="text-2xl font-bold text-center">
              {pkg.name}
            </h2>

            <p className="text-center text-xl mt-2">
              ${pkg.price}
            </p>

            <p className="text-center text-gray-500">
              Employee Limit: {pkg.employeeLimit}
            </p>

            <div className="mt-4 space-y-2">
              {pkg.features?.map((feature, i) => (
                <p key={i} className="text-sm">
                  ✔ {feature}
                </p>
              ))}
            </div>

            <button
              onClick={() => handleSelectPlan(pkg)}
              className="btn btn-primary w-full mt-5"
            >
              Select Plan
            </button>

          </div>
        ))}

      </div>
    </div>
  );
};

export default Packages;