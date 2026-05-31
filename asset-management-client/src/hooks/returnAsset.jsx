import useAxiosSecure from "./useAxiosSecure";

const useReturnAsset = () => {
  const axiosSecure = useAxiosSecure();

  const returnAsset = async (id) => {
    const res = await axiosSecure.patch(
      `/assigned-assets/return/${id}`
    );
    return res.data;
  };

  return returnAsset;
};

export default useReturnAsset;