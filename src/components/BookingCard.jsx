import { FaTrash } from "react-icons/fa";

import api from "../api/axios";

import { useAuth } from "../hooks/useAuth";

const BookingCard = ({ booking, fetchBookings }) => {
  const { selectedUser } = useAuth();

  const isAdmin = selectedUser?.role === "ADMIN";

  const isOwner = selectedUser?.role === "OWNER";

  const isBookingOwner = booking?.userId?._id === selectedUser?._id;

  const canDelete = isAdmin || isOwner || isBookingOwner;

  const handleDelete = async () => {
    try {
      await api.delete(`/bookings/${booking._id}`, {
        headers: {
          "x-user-id": selectedUser._id,
        },
      });

      fetchBookings();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-white p-5 rounded-2xl border">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="font-bold text-lg">{booking.userId?.name}</h2>

          <p className="text-blue-600 text-sm">{booking.userId?.role}</p>
        </div>

        {canDelete && (
          <button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-lg cursor-pointer"
          >
            <FaTrash />
          </button>
        )}
      </div>

      <div className="mt-4 space-y-2">
        <div>
          <p className="text-sm text-gray-500">Start Time</p>

          <p className="font-medium">
            {new Date(booking.startTime).toLocaleString()}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">End Time</p>

          <p className="font-medium">
            {new Date(booking.endTime).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
