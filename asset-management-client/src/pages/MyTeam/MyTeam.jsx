


import React, { useState } from "react";
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

  const [selectedCompany, setSelectedCompany] =
    useState("");

  // ===================================================
  // GET MY COMPANIES
  // ===================================================

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

      return res.data;
    },

    onSuccess: (data) => {
      if (data.length > 0 && !selectedCompany) {
        setSelectedCompany(data[0].companyName);
      }
    },
  });

  // ===================================================
  // GET TEAM MEMBERS
  // ===================================================

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

      return res.data;
    },
  });

  // ===================================================
  // UPCOMING BIRTHDAYS
  // ===================================================

  const { data: birthdays = [] } = useQuery({
    queryKey: ["birthdays", selectedCompany],

    enabled: !!selectedCompany,

    queryFn: async () => {
      const res = await axiosSecure.get(
        `/upcoming-birthdays?companyName=${selectedCompany}`
      );

      return res.data;
    },
  });

  // ===================================================
  // LOADING
  // ===================================================

  if (companyLoading || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  // ===================================================
  // ERROR
  // ===================================================

  if (isError) {
    return (
      <div className="text-center py-10">

        <h2 className="text-2xl font-bold text-red-500">
          Failed to load team ❌
        </h2>

        <button
          onClick={refetch}
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

        {/* COMPANY SELECT */}

        <select
          className="select select-bordered w-full max-w-xs"
          value={selectedCompany}
          onChange={(e) =>
            setSelectedCompany(e.target.value)
          }
        >

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

                <td>

                  <div className="flex items-center gap-2">

                    <FaEnvelope className="text-primary" />

                    {member.email}

                  </div>
                </td>

                <td>
                  <span className="badge badge-primary">
                    Employee
                  </span>
                </td>

                <td>

                  <div className="flex items-center gap-2">

                    <FaBuilding />

                    {selectedCompany}

                  </div>
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
                  alt="user"
                  className="w-14 h-14 rounded-full object-cover"
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
                    {new Date(
                      person.dateOfBirth
                    ).toLocaleDateString()}
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



// import React, { useState, useEffect } from "react";
// import { useQuery } from "@tanstack/react-query";
// import useAuth from "../../hooks/useAuth";
// import useAxiosSecure from "../../hooks/useAxiosSecure";

// const MyTeam = () => {
//   const { user } = useAuth();
//   const axiosSecure = useAxiosSecure();
//   const [selectedCompany, setSelectedCompany] = useState("");

//   // ডিবাগ করার জন্য লগ
//   useEffect(() => {
//     console.log("👤 ইউজার:", user?.email);
//     console.log("🔑 টোকেন:", user?.accessToken?.substring(0, 30));
//   }, [user]);

//   // মাই কোম্পানি
//   const {
//     data: companies = [],
//     isLoading: companyLoading,
//     error: companyError,
//   } = useQuery({
//     queryKey: ["my-companies", user?.email],
//     enabled: !!user?.email,
//     queryFn: async () => {
//       console.log("📡 কোম্পানি ফেচ করছি...");
//       const res = await axiosSecure.get("/my-companies");
//       console.log("📦 কোম্পানি ডাটা:", res.data);
//       return res.data;
//     },
//   });

//   // অটো সিলেক্ট কোম্পানি
//   useEffect(() => {
//     if (companies.length > 0 && !selectedCompany) {
//       setSelectedCompany(companies[0].companyName);
//     }
//   }, [companies, selectedCompany]);

//   // টিম মেম্বার
//   const {
//     data: team = [],
//     isLoading,
//     error: teamError,
//   } = useQuery({
//     queryKey: ["team-members", selectedCompany],
//     enabled: !!selectedCompany,
//     queryFn: async () => {
//       console.log("📡 টিম ফেচ করছি:", selectedCompany);
//       const res = await axiosSecure.get(`/team-members?companyName=${selectedCompany}`);
//       console.log("📦 টিম ডাটা:", res.data);
//       return res.data;
//     },
//   });

//   // এরর হ্যান্ডেলিং
//   if (companyError || teamError) {
//     return (
//       <div className="text-center py-10">
//         <h2 className="text-2xl font-bold text-red-500">
//           ❌ ডাটা লোড করতে সমস্যা হয়েছে!
//         </h2>
//         <p className="text-gray-500 mt-2">
//           {companyError?.message || teamError?.message}
//         </p>
//         <button 
//           onClick={() => window.location.reload()} 
//           className="btn btn-primary mt-4"
//         >
//           রিলোড করুন
//         </button>
//       </div>
//     );
//   }

//   if (companyLoading || isLoading) {
//     return (
//       <div className="flex justify-center items-center min-h-[50vh]">
//         <span className="loading loading-spinner loading-lg"></span>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold">মাই টিম</h1>
      
//       {companies.length === 0 && (
//         <p className="text-gray-500 mt-4">কোন কোম্পানি নেই</p>
//       )}
      
//       {team.length === 0 && selectedCompany && (
//         <p className="text-gray-500 mt-4">এই কোম্পানিতে কোন টিম মেম্বার নেই</p>
//       )}
      
//       {team.map(member => (
//         <div key={member._id} className="border p-2 my-2">
//           <p>{member.name} - {member.email}</p>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default MyTeam;


// import React, { useEffect, useState } from "react";
// import { useQuery } from "@tanstack/react-query";
// import useAxiosSecure from "../../hooks/useAxiosSecure";
// import useAuth from "../../hooks/useAuth";

// const MyTeam = () => {
//   const axiosSecure = useAxiosSecure();
//   const { user } = useAuth();

//   const [selectedCompany, setSelectedCompany] = useState("");

//   // ================= MY COMPANIES =================

//   const {
//     data: companies = [],
//     isLoading: companiesLoading,
//   } = useQuery({
//     queryKey: ["my-companies", user?.email],
//     enabled: !!user?.email,
//     queryFn: async () => {
//       const res = await axiosSecure.get("/my-companies");
//       return res.data;
//     },
//   });

//   // Auto select first company

//   useEffect(() => {
//     if (companies.length > 0) {
//       setSelectedCompany(companies[0].companyName);
//     }
//   }, [companies]);

//   // ================= TEAM MEMBERS =================

//   const {
//     data: teamMembers = [],
//     isLoading: teamLoading,
//     refetch,
//   } = useQuery({
//     queryKey: ["team-members", selectedCompany],
//     enabled: !!selectedCompany,
//     queryFn: async () => {
//       const res = await axiosSecure.get(
//         `/team-members?companyName=${selectedCompany}`
//       );
//       return res.data;
//     },
//   });

//   if (companiesLoading || teamLoading) {
//     return (
//       <div className="flex justify-center items-center min-h-[300px]">
//         <span className="loading loading-spinner loading-lg"></span>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-6xl mx-auto p-6">
//       <h2 className="text-3xl font-bold mb-6">My Team</h2>

//       {/* Company Selector */}

//       {companies.length > 0 && (
//         <div className="mb-6">
//           <select
//             className="select select-bordered w-full max-w-xs"
//             value={selectedCompany}
//             onChange={(e) => setSelectedCompany(e.target.value)}
//           >
//             {companies.map((company) => (
//               <option key={company._id} value={company.companyName}>
//                 {company.companyName}
//               </option>
//             ))}
//           </select>
//         </div>
//       )}

//       {/* No Company */}

//       {companies.length === 0 && (
//         <div className="text-center">
//           <p className="text-gray-500">No company found.</p>
//         </div>
//       )}

//       {/* Team Members */}

//       {teamMembers.length === 0 && selectedCompany && (
//         <div className="text-center">
//           <p className="text-gray-500">
//             No team members found for this company.
//           </p>
//         </div>
//       )}

//       {teamMembers.length > 0 && (
//         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
//           {teamMembers.map((member) => (
//             <div
//               key={member._id}
//               className="card bg-base-100 shadow border"
//             >
//               <div className="card-body">
//                 <img
//                   src={
//                     member.profileImage ||
//                     "https://i.ibb.co/4pDNDk1/avatar.png"
//                   }
//                   alt={member.name}
//                   className="w-16 h-16 rounded-full mx-auto"
//                 />

//                 <h3 className="text-xl font-semibold text-center mt-3">
//                   {member.name}
//                 </h3>

//                 <p className="text-center text-gray-500">
//                   {member.email}
//                 </p>

//                 <div className="badge badge-primary mx-auto">
//                   {member.role}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default MyTeam;