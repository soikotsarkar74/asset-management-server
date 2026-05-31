import useAxiosSecure from "./useAxiosSecure";

const useRequests = () => {
  const axiosSecure = useAxiosSecure();

  // 🔥 GET all requests
  const getRequests = async () => {
    const res = await axiosSecure.get("/requests");
    return res.data.data;
  };

  // 🔥 CREATE request
  const createRequest = async (requestData) => {
    const res = await axiosSecure.post("/requests", requestData);
    return res.data;
  };

  // 🔥 APPROVE request
  const approveRequest = async (id) => {
    const res = await axiosSecure.patch(`/requests/approve/${id}`);
    return res.data;
  };

  // 🔥 REJECT request
  const rejectRequest = async (id) => {
    const res = await axiosSecure.patch(`/requests/reject/${id}`);
    return res.data;
  };

  return {
    getRequests,
    createRequest,
    approveRequest,
    rejectRequest,
  };
};

export default useRequests;