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
        <h2 className="text-3xl font-bold">
          Please Select User From Home Page !
        </h2>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* booking form */}
      <div>
        <BookingForm fetchBookings={fetchBookings} />
      </div>

      {/* booking list */}
      <div className="lg:col-span-2">
        <h2 className="text-3xl font-bold mb-6">All Bookings</h2>

        {loading ? (
          <LoadingSpinner />
        ) : bookings.length === 0 ? (
          <div className="bg-white p-10 rounded-2xl border text-center">
            No bookings found
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
  );
};

export default Bookings;
