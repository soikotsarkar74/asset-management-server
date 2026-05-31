// import { useQuery } from "@tanstack/react-query";
// import useAuth from "./useAuth";
// import useAxiosSecure from "./useAxiosSecure";

// const useAssignedAssets = () => {
//   const { user } = useAuth();
//   const axiosSecure = useAxiosSecure();

//   const { data: assets = [], isLoading, refetch } = useQuery({
//     queryKey: ["assigned-assets", user?.email],
//     enabled: !!user?.email,
//     queryFn: async () => {
//       const res = await axiosSecure.get(
//         `/assigned-assets?email=${user.email}`
//       );
//       return res.data;
//     },
//   });

//   return { assets, isLoading, refetch };
// };

// export default useAssignedAssets;

import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";

const useAssignedAssets = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    data: assets = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["assigned-assets", user?.email],
    enabled: !!user?.email,

    queryFn: async () => {
      const res = await axiosSecure.get("/assigned-assets");
      return res.data;
    },
  });

  return { assets, isLoading, refetch };
};

export default useAssignedAssets;