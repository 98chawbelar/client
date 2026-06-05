import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../hooks/useAuth";
import LoadingSpinner from "../components/LoadingSpinner";

const Home = () => {
  const { selectedUser, setSelectedUser } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    const loadUsers = async () => {
      try {
        const response = await api.get("/users/public");

        if (!ignore) {
          setUsers(response.data.data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadUsers();

    return () => {
      ignore = true;
    };
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Hero Section */}
      <div className="bg-white rounded-3xl shadow-xl p-10 mb-8">
        <h1 className="text-5xl font-bold mb-4">Meeting Room Booking System</h1>

        <p className="text-gray-600 text-lg leading-relaxed mb-8">
          A role-based room booking management system built with Node.js,
          Express, MongoDB, and React. Users can create bookings, Owners can
          manage booking activity, and Admins can manage users and permissions.
        </p>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-5">
          <div className="border rounded-2xl p-5 bg-blue-50">
            <h2 className="font-bold text-lg mb-2">USER</h2>

            <ul className="text-gray-600 space-y-1 text-sm">
              <li>• Create bookings</li>
              <li>• View bookings</li>
              <li>• Delete own bookings</li>
            </ul>
          </div>

          <div className="border rounded-2xl p-5 bg-purple-50">
            <h2 className="font-bold text-lg mb-2">OWNER</h2>

            <ul className="text-gray-600 space-y-1 text-sm">
              <li>• Manage bookings</li>
              <li>• View analytics</li>
              <li>• View grouped bookings</li>
            </ul>
          </div>

          <div className="border rounded-2xl p-5 bg-red-50">
            <h2 className="font-bold text-lg mb-2">ADMIN</h2>

            <ul className="text-gray-600 space-y-1 text-sm">
              <li>• Create users</li>
              <li>• Delete users</li>
              <li>• Change roles</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Login Simulation */}
      <div className="bg-white rounded-3xl shadow-xl p-8">
        <h2 className="text-3xl font-bold mb-3">Select User</h2>

        <p className="text-gray-500 mb-6">
          Select a user below to simulate login and explore role-based features.
        </p>

        <select
          value={selectedUser?._id || ""}
          onChange={(e) => {
            const user = users.find((u) => u._id === e.target.value);

            setSelectedUser(user);
          }}
          className="w-full border px-4 py-4 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select User</option>

          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.name} ({user.role})
            </option>
          ))}
        </select>

        {/* Current User */}
        {selectedUser && (
          <div className="mt-8 border rounded-2xl p-6 bg-gray-50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2">Current User</h3>

                <p className="text-lg">
                  <span className="font-semibold">Name:</span>{" "}
                  {selectedUser.name}
                </p>
              </div>

              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  selectedUser.role === "ADMIN"
                    ? "bg-red-100 text-red-700"
                    : selectedUser.role === "OWNER"
                      ? "bg-purple-100 text-purple-700"
                      : "bg-blue-100 text-blue-700"
                }`}
              >
                {selectedUser.role}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
