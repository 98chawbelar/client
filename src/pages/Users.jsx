import { useEffect, useState } from "react";

import api from "../api/axios";

import LoadingSpinner from "../components/LoadingSpinner";

import { useAuth } from "../hooks/useAuth";

const Users = () => {
  const { selectedUser } = useAuth();

  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [creating, setCreating] = useState(false);

  const [deletingId, setDeletingId] = useState(null);

  const [name, setName] = useState("");

  const [role, setRole] = useState("USER");

  // fetch users
  const fetchUsers = async () => {
    try {
      const response = await api.get("/users", {
        headers: {
          "x-user-id": selectedUser?._id,
        },
      });

      setUsers(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  // initial load
  useEffect(() => {
    if (selectedUser?.role !== "ADMIN") return;

    let ignore = false;

    const loadUsers = async () => {
      try {
        const response = await api.get("/users", {
          headers: {
            "x-user-id": selectedUser._id,
          },
        });

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
  }, [selectedUser]);

  // create user
  const handleCreateUser = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      return alert("User name is required");
    }

    try {
      setCreating(true);

      await api.post(
        "/users",
        {
          name,
          role,
        },
        {
          headers: {
            "x-user-id": selectedUser._id,
          },
        },
      );

      setName("");

      setRole("USER");

      await fetchUsers();
    } catch (error) {
      console.log(error);

      alert(error?.response?.data?.message || "Failed to create user");
    } finally {
      setCreating(false);
    }
  };

  // delete user
  const handleDeleteUser = async (id) => {
    if (id === selectedUser?._id) {
      return alert("You cannot delete yourself");
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?",
    );

    if (!confirmDelete) return;

    try {
      setDeletingId(id);

      await api.delete(`/users/${id}`, {
        headers: {
          "x-user-id": selectedUser._id,
        },
      });

      await fetchUsers();
    } catch (error) {
      console.log(error);

      alert(error?.response?.data?.message || "Failed to delete user");
    } finally {
      setDeletingId(null);
    }
  };

  // access protection
  if (selectedUser?.role !== "ADMIN") {
    return (
      <div className="text-center py-20">
        <h2 className="text-3xl font-bold">Access Denied</h2>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* form */}
      <div>
        <form
          onSubmit={handleCreateUser}
          className="bg-white p-6 rounded-2xl border shadow-sm"
        >
          <h2 className="text-2xl font-bold mb-6">Create User</h2>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Enter user name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />

            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="USER">USER</option>

              <option value="OWNER">OWNER</option>

              <option value="ADMIN">ADMIN</option>
            </select>

            <button
              disabled={creating}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white py-3 rounded-lg transition cursor-pointer"
            >
              {creating ? "Creating..." : "Create User"}
            </button>
          </div>
        </form>
      </div>

      {/* users list */}
      <div className="lg:col-span-2">
        <h2 className="text-3xl font-bold mb-6">All Users</h2>

        {loading ? (
          <LoadingSpinner />
        ) : users.length === 0 ? (
          <div className="bg-white p-10 rounded-2xl border text-center">
            No users found
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            {users.map((user) => (
              <div
                key={user._id}
                className="bg-white border rounded-2xl p-5 shadow-sm"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="font-bold text-lg">{user.name}</h2>

                    <p className="text-blue-600 font-medium">{user.role}</p>
                  </div>

                  <button
                    onClick={() => handleDeleteUser(user._id)}
                    disabled={deletingId === user._id}
                    className="bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white px-4 py-2 rounded-lg transition cursor-pointer"
                  >
                    {deletingId === user._id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;
