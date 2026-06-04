import { useEffect, useState } from "react";

import api from "../api/axios";
import { useAuth } from "../hooks/useAuth";
import LoadingSpinner from "../components/LoadingSpinner";

const Summary = () => {
  const { selectedUser } = useAuth();

  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (selectedUser?.role !== "OWNER" && selectedUser?.role !== "ADMIN") {
      return;
    }

    const loadSummary = async () => {
      try {
        const response = await api.get("/bookings/summary", {
          headers: {
            "x-user-id": selectedUser._id,
          },
        });

        setSummary(response.data.data || []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    loadSummary();
  }, [selectedUser]);

  if (selectedUser?.role !== "OWNER" && selectedUser?.role !== "ADMIN") {
    return (
      <div className="text-center py-20">
        <h2 className="text-3xl font-bold">Access Denied</h2>

        <p className="text-gray-500 mt-2">
          Only Owner and Admin can view analytics.
        </p>
      </div>
    );
  }

  const totalBookings = summary.reduce(
    (total, item) => total + item.totalBookings,
    0,
  );

  const totalUsers = summary.length;

  const leaderboard = [...summary].sort(
    (a, b) => b.totalBookings - a.totalBookings,
  );

  return (
    <div>
      <h1 className="text-4xl font-bold mb-5">Booking Analytics Dashboard</h1>

      {loading ? (
        <LoadingSpinner />
      ) : summary.length === 0 ? (
        <div className="bg-white p-10 rounded-2xl border text-center">
          No booking data available
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-2xl hover:shadow-2xl  p-6 shadow-xl">
              <p className="text-gray-500 mb-2">Users With Bookings</p>

              <h2 className="text-5xl font-bold">{totalUsers}</h2>
            </div>

            <div className="bg-white rounded-2xl hover:shadow-2xl p-6 shadow-xl">
              <p className="text-gray-500 mb-2">Total Bookings</p>

              <h2 className="text-5xl font-bold text-blue-600">
                {totalBookings}
              </h2>
            </div>
          </div>

          {/* Leaderboard */}
          <div className="bg-white rounded-2xl hover:shadow-2xl p-6 shadow-xl mb-8">
            <h2 className="text-2xl font-bold mb-6">Booking Leaderboard</h2>

            <div className="space-y-4">
              {leaderboard.map((user, index) => (
                <div
                  key={user._id}
                  className="flex items-center justify-between  border-b pb-4 last:border-b-0"
                >
                  <div>
                    <h3 className="font-semibold text-lg">
                      #{index + 1} {user.userName}
                    </h3>

                    <p className="text-gray-500 text-sm">{user.role}</p>
                  </div>

                  <div className="text-right">
                    <h3 className="text-3xl font-bold text-blue-600">
                      {user.totalBookings}
                    </h3>

                    <p className="text-gray-500 text-sm">bookings</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary Table */}
          <div className="bg-white rounded-2xl hover:shadow-2xl shadow-xl overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold">User Booking Summary</h2>
            </div>

            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-left">Rank</th>

                  <th className="p-4 text-left">User Name</th>

                  <th className="p-4 text-left">Role</th>

                  <th className="p-4 text-left">Total Bookings</th>
                </tr>
              </thead>

              <tbody>
                {leaderboard.map((item, index) => (
                  <tr key={item._id} className="border-t hover:bg-gray-50">
                    <td className="p-4 font-bold">#{index + 1}</td>

                    <td className="p-4 font-medium">{item.userName}</td>

                    <td className="p-4">
                      <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm">
                        {item.role}
                      </span>
                    </td>

                    <td className="p-4 font-bold">{item.totalBookings}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default Summary;
