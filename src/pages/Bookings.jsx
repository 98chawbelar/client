import { useEffect, useState } from "react";

import api from "../api/axios";

import BookingCard from "../components/BookingCard";
import BookingForm from "../components/BookingForm";
import LoadingSpinner from "../components/LoadingSpinner";

import { useAuth } from "../hooks/useAuth";

const Bookings = () => {
  const { selectedUser } = useAuth();

  const [bookings, setBookings] = useState([]);

  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const response = await api.get("/bookings", {
        headers: {
          "x-user-id": selectedUser._id,
        },
      });

      setBookings(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!selectedUser) return;

    const loadBookings = async () => {
      try {
        setLoading(true);

        await fetchBookings();
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, [selectedUser]);

  if (!selectedUser) {
    return (
      <div className="text-center py-20">
        <h2 className="text-4xl font-bold mb-3">No User Selected</h2>

        <p className="text-gray-500 text-lg">
          Please select a user from the Home page to continue.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current User Info */}
      <div className="bg-white rounded-2xl shadow-xl p-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Booking Management</h1>

          <p className="text-gray-500">
            Create and manage meeting room bookings.
          </p>
        </div>

        <div className="text-right">
          <p className="font-semibold text-lg">{selectedUser.name}</p>

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

      {/* Main Layout */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Booking Form */}
        <div>
          <div className="bg-white rounded-2xl shadow-xl p-5">
            <h2 className="text-2xl font-bold mb-4">Create Booking</h2>

            <BookingForm fetchBookings={fetchBookings} />
          </div>
        </div>

        {/* Booking List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold">All Bookings</h2>

              <p className="text-gray-500 mt-1">
                View all meeting room bookings.
              </p>
            </div>

            <div className="bg-blue-100 text-blue-700 px-5 py-3 rounded-xl">
              <p className="text-sm font-medium">Total Bookings</p>

              <h3 className="text-2xl font-bold">{bookings.length}</h3>
            </div>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : bookings.length === 0 ? (
            <div className="bg-white p-10 rounded-2xl border text-center shadow-xl">
              <h3 className="text-2xl font-bold mb-2">No Bookings Found</h3>

              <p className="text-gray-500">
                Create your first booking using the form.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-5">
              {bookings.map((booking) => (
                <BookingCard
                  key={booking._id}
                  booking={booking}
                  fetchBookings={fetchBookings}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Bookings;
