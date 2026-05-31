import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";

const AssignedAssets = () => {
  const axiosSecure = useAxiosSecure();

  const { data = [], isLoading, refetch } = useQuery({
    queryKey: ["assigned-assets"],
    queryFn: async () => {
      const res = await axiosSecure.get("/assigned-assets"); 
      return res.data;
    },
  });

  return { assets: data, isLoading, refetch };
};

export default AssignedAssets;