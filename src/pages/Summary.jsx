import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../hooks/useAuth";
import LoadingSpinner from "../components/LoadingSpinner";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

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

  const leaderboard = [...summary].sort((a, b) => {
    const priority = {
      ADMIN: 1,
      OWNER: 2,
      USER: 3,
    };

    const aPriority = priority[a.role];
    const bPriority = priority[b.role];

    if (aPriority !== bPriority) {
      return aPriority - bPriority;
    }

    return b.totalBookings - a.totalBookings;
  });

  const pieData = {
    labels: leaderboard.map((item) => item.userName),
    datasets: [
      {
        label: "Bookings",
        data: leaderboard.map((item) => item.totalBookings),
        backgroundColor: [
          "#EF4444",
          "#8B5CF6",
          "#3B82F6",
          "#10B981",
          "#F59E0B",
          "#06B6D4",
          "#EC4899",
          "#84CC16",
          "#14B8A6",
          "#F97316",
        ],
        borderWidth: 1,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: true,
        text: "Bookings Distribution By User",
      },
    },
  };

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

          {/* Pie Chart */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
            <h2 className="text-2xl font-bold mb-6">Booking Distribution</h2>

            <div className="max-w-xl mx-auto">
              <Pie data={pieData} options={pieOptions} />
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
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          item.role === "ADMIN"
                            ? "bg-red-100 text-red-700"
                            : item.role === "OWNER"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {item.role}
                      </span>
                    </td>

                    <td className="p-4 font-bold text-center">
                      {item.totalBookings}
                    </td>
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
