// import { useQuery } from "@tanstack/react-query";
// import useAuth from "./useAuth";
// import useAxiosSecure from "./useAxiosSecure";


// const useRole = () => {
//   const { user } = useAuth();
//   const axiosSecure = useAxiosSecure();

//   const { data: role = "user", isLoading: roleLoading } = useQuery({
//     queryKey: ["user-role", user?.email],
//     enabled: !!user?.email,
//     queryFn: async () => {
//       const res = await axiosSecure.get(`/users/${user.email}/role`);
//       return res.data?.role || "user";
//     },
//   });

//   return { role, roleLoading };
// };

// export default useRole;

// import { useQuery } from "@tanstack/react-query";
// import useAuth from "./useAuth";
// import useAxiosSecure from "./useAxiosSecure";

// const useRole = () => {
//   const { user, loading } = useAuth();
//   const axiosSecure = useAxiosSecure();

//   const {
//     data: role = "employee",
//     isLoading: roleLoading,
//   } = useQuery({
//     queryKey: ["user-role", user?.email],
//     enabled: !loading && !!user?.email,
//     queryFn: async () => {
//       const res = await axiosSecure.get(
//         `/users/${user.email}/role`
//       );
//       return res.data?.role || "employee";
//     },
//   });

//   return { role, roleLoading };
// };

// export default useRole;


import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";

const useRole = () => {
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    data,
    isLoading: roleLoading,
  } = useQuery({
    queryKey: ["role", user?.email],
    enabled: !loading && !!user?.email,

    queryFn: async () => {
      const res = await axiosSecure.get(
        `/users/${user.email}/role`
      );

      return {
        role: res.data?.role || "employee",
        companyId: res.data?.companyId || null,
      };
    },
  });

  return {
    role: data?.role,
    companyId: data?.companyId,
    roleLoading,
  };
};

export default useRole;