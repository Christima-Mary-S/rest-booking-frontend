import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Users,
  Edit3,
  Trash2,
  AlertCircle,
  X,
  Check,
} from "lucide-react";
import { useBooking } from "../../hooks/useBooking.js";
import { formatTime, formatDate } from "../../utils/helpers.js";
import { BOOKING_STATUS } from "../../utils/constants.js";

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [editingBooking, setEditingBooking] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [showCancelConfirm, setShowCancelConfirm] = useState(null);

  const { loading, error, updateBooking, cancelBooking, getAllUserBookings, clearError } =
    useBooking();

  // Load user bookings on component mount
  useEffect(() => {
    const loadBookings = async () => {
      try {
        const response = await getAllUserBookings();
        if (response && response.bookings) {
          // Transform backend data to match frontend format
          const transformedBookings = response.bookings.map(booking => ({
            id: booking.booking_reference,
            date: booking.visit_date,
            time: booking.visit_time,
            partySize: booking.party_size,
            status: booking.status,
            specialRequests: booking.special_requests || "",
            customerName: `${response.customer.first_name} ${response.customer.surname}`,
            restaurantName: booking.restaurant,
          }));
          setBookings(transformedBookings);
        }
      } catch (err) {
        console.error("Failed to load bookings:", err);
      }
    };

    loadBookings();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case BOOKING_STATUS.CONFIRMED:
        return "bg-green-100 text-green-800";
      case BOOKING_STATUS.PENDING:
        return "bg-yellow-100 text-yellow-800";
      case BOOKING_STATUS.CANCELLED:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleEdit = (booking) => {
    setEditingBooking(booking.id);
    setEditForm({
      partySize: booking.partySize,
      specialRequests: booking.specialRequests,
    });
  };

  const handleCancelEdit = () => {
    setEditingBooking(null);
    setEditForm({});
    clearError();
  };

  const handleSaveEdit = async (bookingId) => {
    try {
      const booking = bookings.find(b => b.id === bookingId);
      const targetRestaurant = booking ? { micrositeName: booking.restaurantName } : null;
      
      // Map frontend field names to backend field names
      const backendUpdates = {
        PartySize: editForm.partySize,
        SpecialRequests: editForm.specialRequests || "",
      };
      
      await updateBooking(bookingId, backendUpdates, targetRestaurant);

      // Update local state
      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === bookingId ? { ...booking, ...editForm } : booking
        )
      );

      setEditingBooking(null);
      setEditForm({});
    } catch (err) {
      console.error("Failed to update booking:", err);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      const booking = bookings.find(b => b.id === bookingId);
      const targetRestaurant = booking ? { micrositeName: booking.restaurantName } : null;
      
      await cancelBooking(bookingId, targetRestaurant);

      // Update local state
      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === bookingId
            ? { ...booking, status: BOOKING_STATUS.CANCELLED }
            : booking
        )
      );

      setShowCancelConfirm(null);
    } catch (err) {
      console.error("Failed to cancel booking:", err);
    }
  };

  const isBookingEditable = (booking) => {
    const bookingDate = new Date(booking.date);
    const today = new Date();
    const timeDiff = bookingDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    return daysDiff >= 1 && booking.status === BOOKING_STATUS.CONFIRMED;
  };

  const isBookingCancellable = (booking) => {
    const bookingDate = new Date(booking.date);
    const today = new Date();
    const timeDiff = bookingDate.getTime() - today.getTime();
    const hoursDiff = Math.ceil(timeDiff / (1000 * 3600));

    return hoursDiff >= 24 && booking.status === BOOKING_STATUS.CONFIRMED;
  };

  const renderEditForm = (booking) => (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
      <h4 className="font-medium text-gray-800 mb-3">Edit Booking</h4>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Party Size
          </label>
          <select
            value={editForm.partySize}
            onChange={(e) =>
              setEditForm((prev) => ({
                ...prev,
                partySize: parseInt(e.target.value),
              }))
            }
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map((size) => (
              <option key={size} value={size}>
                {size} {size === 1 ? "Guest" : "Guests"}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Special Requests
          </label>
          <textarea
            value={editForm.specialRequests}
            onChange={(e) =>
              setEditForm((prev) => ({
                ...prev,
                specialRequests: e.target.value,
              }))
            }
            rows="2"
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="Any special requests or dietary requirements..."
          />
        </div>
      </div>

      <div className="flex space-x-2">
        <button
          onClick={() => handleSaveEdit(booking.id)}
          disabled={loading}
          className="flex items-center px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors disabled:opacity-50"
        >
          <Check className="w-4 h-4 mr-1" />
          {loading ? "Saving..." : "Save Changes"}
        </button>
        <button
          onClick={handleCancelEdit}
          className="flex items-center px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
        >
          <X className="w-4 h-4 mr-1" />
          Cancel
        </button>
      </div>
    </div>
  );

  const renderCancelConfirmation = (booking) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Cancel Booking
        </h3>
        <p className="text-gray-600 mb-6">
          Are you sure you want to cancel your reservation for{" "}
          {formatDate(booking.date)} at {formatTime(booking.time)}? This action
          cannot be undone.
        </p>

        <div className="flex space-x-4">
          <button
            onClick={() => handleCancelBooking(booking.id)}
            disabled={loading}
            className="flex-1 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors disabled:opacity-50"
          >
            {loading ? "Cancelling..." : "Yes, Cancel Booking"}
          </button>
          <button
            onClick={() => setShowCancelConfirm(null)}
            className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded hover:bg-gray-300 transition-colors"
          >
            Keep Booking
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">My Bookings</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center">
          <AlertCircle className="w-4 h-4 mr-2" />
          {error}
          <button onClick={clearError} className="ml-auto">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="space-y-4">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="border border-gray-200 rounded-lg p-6"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {/* Booking Header */}
                <div className="flex items-center mb-3">
                  <span className="font-mono text-sm bg-gray-100 px-3 py-1 rounded">
                    {booking.id}
                  </span>
                  <span
                    className={`ml-3 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                      booking.status
                    )}`}
                  >
                    {booking.status.charAt(0).toUpperCase() +
                      booking.status.slice(1)}
                  </span>
                  {booking.status === BOOKING_STATUS.CANCELLED && (
                    <span className="ml-2 text-xs text-gray-500">
                      (Cancelled)
                    </span>
                  )}
                </div>

                {/* Booking Details */}
                <div className="grid md:grid-cols-5 gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    {formatDate(booking.date)}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    {formatTime(booking.time)}
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    {booking.partySize}{" "}
                    {booking.partySize === 1 ? "guest" : "guests"}
                  </div>
                  <div className="text-gray-800 font-medium">
                    {booking.customerName}
                  </div>
                  <div className="text-orange-600 font-medium">
                    {booking.restaurantName}
                  </div>
                </div>

                {/* Special Requests */}
                {booking.specialRequests && (
                  <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                    <span className="font-medium">Special requests:</span>{" "}
                    {booking.specialRequests}
                  </p>
                )}

                {/* Edit Form */}
                {editingBooking === booking.id && renderEditForm(booking)}
              </div>

              {/* Action Buttons */}
              {booking.status === BOOKING_STATUS.CONFIRMED && (
                <div className="flex space-x-2 ml-4">
                  {isBookingEditable(booking) && (
                    <button
                      onClick={() => handleEdit(booking)}
                      disabled={editingBooking === booking.id}
                      className="p-2 text-gray-600 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors disabled:opacity-50"
                      title="Edit booking"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  )}
                  {isBookingCancellable(booking) && (
                    <button
                      onClick={() => setShowCancelConfirm(booking)}
                      className="p-2 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Cancel booking"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {bookings.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No bookings found</h3>
            <p>You don't have any reservations yet.</p>
          </div>
        )}
      </div>

      {/* Booking Policies */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="font-semibold text-gray-800 mb-3">Booking Policies</h3>
        <div className="text-sm text-gray-600 space-y-1">
          <p>
            • Bookings can be modified up to 24 hours before the reservation
          </p>
          <p>• Cancellations must be made at least 24 hours in advance</p>
          <p>• Late arrivals (15+ minutes) may result in table forfeiture</p>
          <p>
            • For same-day changes, please call us directly at{" "}
            {/* RESTAURANT_INFO.phone would be imported */}(555) 123-FOOD
          </p>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && renderCancelConfirmation(showCancelConfirm)}
    </div>
  );
};

export default BookingManagement;
