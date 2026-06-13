
// import React, { useState } from "react";
// import { useQuery } from "@tanstack/react-query";

// import useAuth from "../../hooks/useAuth";
// import useAxiosSecure from "../../hooks/useAxiosSecure";

// import {
//   FaUsers,
//   FaBuilding,
//   FaEnvelope,
//   FaBirthdayCake,
// } from "react-icons/fa";

// const MyTeam = () => {
//   const { user } = useAuth();
//   const axiosSecure = useAxiosSecure();

//   const [selectedCompany, setSelectedCompany] = useState("");


//   const {
//     data: companies = [],
//     isLoading: companyLoading,
//   } = useQuery({
//     queryKey: ["my-companies", user?.email],
//     enabled: !!user?.email,

//     queryFn: async () => {
//       const res = await axiosSecure.get(
//         `/my-companies?email=${user.email}`
        
//       );

//       return Array.isArray(res.data) ? res.data : [];
//     },

//     onSuccess: (data) => {
//       if (Array.isArray(data) && data.length > 0 && !selectedCompany) {
//         setSelectedCompany(data[0]?.companyName || "");
//       }
//     },
//   });

//   // ================= GET TEAM MEMBERS =================
//   const {
//     data: team = [],
//     isLoading,
//     isError,
//     refetch,
//   } = useQuery({
//     queryKey: ["team-members", selectedCompany],
//     enabled: !!selectedCompany,

//     queryFn: async () => {
//       const res = await axiosSecure.get(
//         `/team-members?companyName=${selectedCompany}`
//       );

//       return Array.isArray(res.data) ? res.data : [];
//     },
//   });

//   // ================= UPCOMING BIRTHDAYS =================
//   const { data: birthdays = [] } = useQuery({
//     queryKey: ["birthdays", selectedCompany],
//     enabled: !!selectedCompany,

//     queryFn: async () => {
//       const res = await axiosSecure.get(
//         `/upcoming-birthdays?companyName=${selectedCompany}`
//       );

//       return Array.isArray(res.data) ? res.data : [];
//     },
//   });

//   // ================= LOADING =================
//   if (companyLoading || isLoading) {
//     return (
//       <div className="flex justify-center items-center min-h-[50vh]">
//         <span className="loading loading-spinner loading-lg text-primary"></span>
//       </div>
//     );
//   }

//   // ================= ERROR =================
//   if (isError) {
//     return (
//       <div className="text-center py-10">
//         <h2 className="text-2xl font-bold text-red-500">
//           Failed to load team ❌
//         </h2>

//         <button
//           onClick={refetch}
//           className="btn btn-outline btn-primary mt-4"
//         >
//           Retry
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 space-y-8">

//       {/* HEADER */}
//       <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

//         <div>
//           <h1 className="text-3xl font-bold flex items-center gap-3">
//             <FaUsers className="text-primary" />
//             My Team
//           </h1>

//           <p className="text-gray-500 mt-2">
//             View your colleagues across affiliated companies
//           </p>
//         </div>

//         {/* COMPANY SELECT */}
//         <select
//           className="select select-bordered w-full max-w-xs"
//           value={selectedCompany}
//           onChange={(e) => setSelectedCompany(e.target.value)}
//         >
//           <option value="">Select Company</option>

//           {Array.isArray(companies) &&
//             companies.map((company) => (
//               <option
//                 key={company._id}
//                 value={company.companyName}
//               >
//                 {company.companyName}
//               </option>
//             ))}
//         </select>
//       </div>

//       {/* STATS */}
//       <div className="grid md:grid-cols-2 gap-6">

//         <div className="bg-base-100 shadow-xl rounded-2xl p-6 border">
//           <div className="flex items-center gap-4">
//             <div className="bg-primary/10 p-4 rounded-full">
//               <FaUsers className="text-2xl text-primary" />
//             </div>

//             <div>
//               <h3 className="text-lg font-semibold">
//                 Total Members
//               </h3>
//               <p className="text-3xl font-bold">
//                 {team.length}
//               </p>
//             </div>
//           </div>
//         </div>

//         <div className="bg-base-100 shadow-xl rounded-2xl p-6 border">
//           <div className="flex items-center gap-4">
//             <div className="bg-secondary/10 p-4 rounded-full">
//               <FaBirthdayCake className="text-2xl text-secondary" />
//             </div>

//             <div>
//               <h3 className="text-lg font-semibold">
//                 Upcoming Birthdays
//               </h3>
//               <p className="text-3xl font-bold">
//                 {birthdays.length}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* TEAM TABLE */}
//       <div className="bg-base-100 shadow-xl rounded-2xl border overflow-x-auto">

//         <table className="table table-zebra w-full">
//           <thead className="bg-base-200">
//             <tr>
//               <th>#</th>
//               <th>Employee</th>
//               <th>Email</th>
//               <th>Role</th>
//               <th>Company</th>
//             </tr>
//           </thead>

//           <tbody>
//             {Array.isArray(team) &&
//               team.map((member, index) => (
//                 <tr key={member._id}>
//                   <td>{index + 1}</td>

//                   <td>
//                     <div className="flex items-center gap-3">
//                       <img
//                         src={
//                           member.profileImage ||
//                           "https://i.ibb.co/2Wz5b7z/user.png"
//                         }
//                         alt="user"
//                         className="w-12 h-12 rounded-full object-cover"
//                       />

//                       <div>
//                         <h3 className="font-bold">
//                           {member.name}
//                         </h3>
//                         <p className="text-sm text-gray-500">
//                           Team Member
//                         </p>
//                       </div>
//                     </div>
//                   </td>

//                   <td className="flex items-center gap-2">
//                     <FaEnvelope className="text-primary" />
//                     {member.email}
//                   </td>

//                   <td>
//                     <span className="badge badge-primary">
//                       Employee
//                     </span>
//                   </td>

//                   <td className="flex items-center gap-2">
//                     <FaBuilding />
//                     {selectedCompany}
//                   </td>
//                 </tr>
//               ))}
//           </tbody>
//         </table>

//         {team.length === 0 && (
//           <div className="text-center py-10 text-gray-500">
//             No team members found
//           </div>
//         )}
//       </div>

//       {/* BIRTHDAYS */}
//       <div className="bg-base-100 shadow-xl rounded-2xl p-6 border">

//         <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
//           <FaBirthdayCake className="text-pink-500" />
//           Upcoming Birthdays
//         </h2>

//         {birthdays.length === 0 ? (
//           <p className="text-gray-500">
//             No birthdays this month 🎉
//           </p>
//         ) : (
//           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">

//             {birthdays.map((person) => (
//               <div
//                 key={person._id}
//                 className="border rounded-xl p-5 flex items-center gap-4"
//               >
//                 <img
//                   src={
//                     person.profileImage ||
//                     "https://i.ibb.co/2Wz5b7z/user.png"
//                   }
//                   className="w-14 h-14 rounded-full object-cover"
//                   alt="user"
//                 />

//                 <div>
//                   <h3 className="font-bold">
//                     {person.name}
//                   </h3>

//                   <p className="text-sm text-gray-500">
//                     {person.email}
//                   </p>

//                   <p className="text-sm mt-1">
//                     🎂{" "}
//                     {person.dateOfBirth
//                       ? new Date(
//                           person.dateOfBirth
//                         ).toLocaleDateString()
//                       : "N/A"}
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//     </div>
//   );
// };

// export default MyTeam;


import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";

import {
  FaUsers,
  FaBuilding,
  FaEnvelope,
  FaBirthdayCake,
} from "react-icons/fa";

const MyTeam = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [selectedCompany, setSelectedCompany] = useState("");

  // ================= GET COMPANIES =================
  const {
    data: companies = [],
    isLoading: companyLoading,
  } = useQuery({
    queryKey: ["my-companies", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/my-companies?email=${user.email}`
      );

      return Array.isArray(res.data) ? res.data : [];
    },
  });

  // Set default company
  useEffect(() => {
    if (companies.length > 0 && !selectedCompany) {
      setSelectedCompany(companies[0].companyName);
    }
  }, [companies, selectedCompany]);

  // ================= GET TEAM MEMBERS =================
  const {
    data: team = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["team-members", selectedCompany],
    enabled: !!selectedCompany,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/team-members?companyName=${selectedCompany}`
      );

      return Array.isArray(res.data) ? res.data : [];
    },
  });

  // ================= UPCOMING BIRTHDAYS =================
  const { data: birthdays = [] } = useQuery({
    queryKey: ["birthdays", selectedCompany],
    enabled: !!selectedCompany,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/upcoming-birthdays?companyName=${selectedCompany}`
      );

      return Array.isArray(res.data) ? res.data : [];
    },
  });

  // ================= LOADING =================
  if (companyLoading || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  // ================= ERROR =================
  if (isError) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold text-red-500">
          Failed to load team ❌
        </h2>

        <button
          onClick={() => refetch()}
          className="btn btn-outline btn-primary mt-4"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <FaUsers className="text-primary" />
            My Team
          </h1>

          <p className="text-gray-500 mt-2">
            View your colleagues across affiliated companies
          </p>
        </div>

        <select
          className="select select-bordered w-full max-w-xs"
          value={selectedCompany}
          onChange={(e) => setSelectedCompany(e.target.value)}
        >
          <option value="">Select Company</option>

          {companies.map((company) => (
            <option
              key={company._id}
              value={company.companyName}
            >
              {company.companyName}
            </option>
          ))}
        </select>
      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-2 gap-6">

        <div className="bg-base-100 shadow-xl rounded-2xl p-6 border">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 p-4 rounded-full">
              <FaUsers className="text-2xl text-primary" />
            </div>

            <div>
              <h3 className="text-lg font-semibold">
                Total Members
              </h3>

              <p className="text-3xl font-bold">
                {team.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-base-100 shadow-xl rounded-2xl p-6 border">
          <div className="flex items-center gap-4">
            <div className="bg-secondary/10 p-4 rounded-full">
              <FaBirthdayCake className="text-2xl text-secondary" />
            </div>

            <div>
              <h3 className="text-lg font-semibold">
                Upcoming Birthdays
              </h3>

              <p className="text-3xl font-bold">
                {birthdays.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* TEAM TABLE */}
      <div className="bg-base-100 shadow-xl rounded-2xl border overflow-x-auto">

        <table className="table table-zebra w-full">
          <thead className="bg-base-200">
            <tr>
              <th>#</th>
              <th>Employee</th>
              <th>Email</th>
              <th>Role</th>
              <th>Company</th>
            </tr>
          </thead>

          <tbody>
            {team.map((member, index) => (
              <tr key={member._id}>
                <td>{index + 1}</td>

                <td>
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        member.profileImage ||
                        "https://i.ibb.co/2Wz5b7z/user.png"
                      }
                      alt="user"
                      className="w-12 h-12 rounded-full object-cover"
                    />

                    <div>
                      <h3 className="font-bold">
                        {member.name}
                      </h3>

                      <p className="text-sm text-gray-500">
                        Team Member
                      </p>
                    </div>
                  </div>
                </td>

                <td className="flex items-center gap-2">
                  <FaEnvelope className="text-primary" />
                  {member.email}
                </td>

                <td>
                  <span className="badge badge-primary">
                    {member.role || "Employee"}
                  </span>
                </td>

                <td className="flex items-center gap-2">
                  <FaBuilding />
                  {selectedCompany}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {team.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            No team members found
          </div>
        )}
      </div>

      {/* BIRTHDAYS */}
      <div className="bg-base-100 shadow-xl rounded-2xl p-6 border">

        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <FaBirthdayCake className="text-pink-500" />
          Upcoming Birthdays
        </h2>

        {birthdays.length === 0 ? (
          <p className="text-gray-500">
            No birthdays this month 🎉
          </p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">

            {birthdays.map((person) => (
              <div
                key={person._id}
                className="border rounded-xl p-5 flex items-center gap-4"
              >
                <img
                  src={
                    person.profileImage ||
                    "https://i.ibb.co/2Wz5b7z/user.png"
                  }
                  className="w-14 h-14 rounded-full object-cover"
                  alt="user"
                />

                <div>
                  <h3 className="font-bold">
                    {person.name}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {person.email}
                  </p>

                  <p className="text-sm mt-1">
                    🎂{" "}
                    {person.dateOfBirth
                      ? new Date(
                          person.dateOfBirth
                        ).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  );
};

export default MyTeam;