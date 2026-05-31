import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const MyCompanies = () => {
  const axiosSecure = useAxiosSecure();

  // ================= FETCH COMPANIES =================
  const {
    data: companies = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["my-companies"],
    queryFn: async () => {
      const res = await axiosSecure.get("/my-companies");
      return res.data;
    },
  });

  // ================= LOADING STATE =================
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  // ================= ERROR STATE =================
  if (isError) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-semibold text-red-500">
          Failed to load companies ❌
        </h2>

        <p className="text-gray-500 mt-2">
          {error?.message}
        </p>

        <button
          onClick={refetch}
          className="btn btn-primary mt-4"
        >
          Retry
        </button>
      </div>
    );
  }

  // ================= UI =================
  return (
    <div className="max-w-4xl mx-auto p-6">
      
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold">
          My Companies
        </h2>
        <p className="text-gray-500">
          Companies you are currently affiliated with
        </p>
      </div>

      {/* Empty State */}
      {companies.length === 0 ? (
        <div className="text-center py-10 border rounded-xl bg-base-100">
          <h3 className="text-lg font-semibold">
            No companies found
          </h3>
          <p className="text-gray-500 mt-2">
            You are not assigned to any company yet
          </p>
        </div>
      ) : (
        /* Company List */
        <div className="grid gap-4">
          {companies.map((company) => (
            <div
              key={company._id}
              className="p-4 border rounded-xl shadow-sm bg-base-100 hover:shadow-md transition"
            >
              <h4 className="text-lg font-semibold">
                {company.companyName}
              </h4>

              <p className="text-sm text-gray-500">
                Status: {company.status || "active"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCompanies;