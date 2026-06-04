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
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl border shadow-sm">
      <h1 className="text-4xl font-bold mb-4">Meeting Room Booking System</h1>

      <p className="text-gray-600 mb-8">Select a user to simulate login.</p>

      <select
        value={selectedUser?._id || ""}
        onChange={(e) => {
          const user = users.find((u) => u._id === e.target.value);

          setSelectedUser(user);
        }}
        className="w-full border px-4 py-3 rounded-lg outline-none"
      >
        <option value="">Select User</option>

        {users.map((user) => (
          <option key={user._id} value={user._id}>
            {user.name} ({user.role})
          </option>
        ))}
      </select>

      {selectedUser && (
        <div className="mt-8 bg-blue-50 border border-blue-200 p-5 rounded-xl">
          <h2 className="font-bold text-xl mb-2">Current User</h2>

          <p>
            <span className="font-semibold">Name:</span> {selectedUser.name}
          </p>

          <p>
            <span className="font-semibold">Role:</span> {selectedUser.role}
          </p>
        </div>
      )}
    </div>
  );
};

export default Home;
