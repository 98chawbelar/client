import { useState } from "react";

import api from "../api/axios";

import { useAuth } from "../hooks/useAuth";

const BookingForm = ({ fetchBookings }) => {
  const { selectedUser } = useAuth();

  const [startTime, setStartTime] = useState("");

  const [endTime, setEndTime] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    try {
      setLoading(true);

      await api.post(
        "/bookings",
        {
          startTime,
          endTime,
        },
        {
          headers: {
            "x-user-id": selectedUser._id,
          },
        },
      );

      setStartTime("");
      setEndTime("");

      fetchBookings();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to create booking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border">
      <h2 className="text-2xl font-bold mb-6">Create Booking</h2>

      <div className="space-y-4">
        <div>
          <label className="block mb-2 font-medium">Start Time</label>

          <input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
            className="w-full border rounded-lg px-4 py-3 outline-none"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">End Time</label>

          <input
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
            className="w-full border rounded-lg px-4 py-3 outline-none"
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg cursor-pointer"
        >
          {loading ? "Creating..." : "Create Booking"}
        </button>
      </div>
    </form>
  );
};

export default BookingForm;
