import React from "react";
import {
  Check,
  Calendar,
  Clock,
  Users,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import { formatTime, formatDate } from "../../utils/helpers.js";
import { RESTAURANT_INFO } from "../../utils/constants.js";

const BookingSuccess = ({ booking, onNewBooking }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-2xl mx-auto">
      {/* Success Icon */}
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Check className="w-8 h-8 text-green-500" />
      </div>

      {/* Success Message */}
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Booking Confirmed!
      </h2>
      <p className="text-gray-600 mb-8">
        Your table has been successfully reserved. We look forward to welcoming
        you!
      </p>

      {/* Booking Details Card */}
      <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
        <h3 className="font-semibold text-gray-800 mb-4 text-center">
          Reservation Details
        </h3>

        <div className="space-y-4">
          {/* Booking Reference */}
          <div className="flex justify-between items-center pb-2 border-b border-gray-200">
            <span className="text-gray-600">Booking Reference:</span>
            <span className="font-mono font-bold text-lg text-orange-600">
              {booking?.reference || "ABC1234"}
            </span>
          </div>

          {/* Restaurant */}
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Restaurant:</span>
            <span className="font-medium">{RESTAURANT_INFO.name}</span>
          </div>

          {/* Date & Time */}
          <div className="flex justify-between items-center">
            <span className="text-gray-600 flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              Date & Time:
            </span>
            <span className="font-medium">
              {booking?.date && formatDate(booking.date)} at{" "}
              {booking?.time && formatTime(booking.time)}
            </span>
          </div>

          {/* Party Size */}
          <div className="flex justify-between items-center">
            <span className="text-gray-600 flex items-center">
              <Users className="w-4 h-4 mr-1" />
              Party Size:
            </span>
            <span className="font-medium">
              {booking?.partySize}{" "}
              {booking?.partySize === 1 ? "guest" : "guests"}
            </span>
          </div>

          {/* Special Requests */}
          {booking?.specialRequests && (
            <div className="pt-2 border-t border-gray-200">
              <span className="text-gray-600 text-sm">Special Requests:</span>
              <p className="text-gray-800 mt-1">{booking.specialRequests}</p>
            </div>
          )}
        </div>
      </div>

      {/* Important Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
        <h4 className="font-semibold text-blue-800 mb-2">
          Important Information
        </h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• A confirmation email has been sent to your email address</li>
          <li>• Please arrive 10 minutes before your reservation time</li>
          <li>• Late arrivals may forfeit the table after 15 minutes</li>
          <li>• For any changes, please call us at {RESTAURANT_INFO.phone}</li>
        </ul>
      </div>

      {/* Contact Information */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h4 className="font-semibold text-gray-800 mb-3">
          Contact Information
        </h4>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center justify-center md:justify-start">
            <MapPin className="w-4 h-4 mr-2 text-gray-600" />
            <span>{RESTAURANT_INFO.address}</span>
          </div>
          <div className="flex items-center justify-center md:justify-start">
            <Phone className="w-4 h-4 mr-2 text-gray-600" />
            <span>{RESTAURANT_INFO.phone}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={onNewBooking}
          className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors font-semibold"
        >
          Make Another Booking
        </button>

        <button
          onClick={() => window.print()}
          className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
        >
          Print Confirmation
        </button>
      </div>

      {/* Additional Actions */}
      {/* <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-sm text-gray-600 mb-3">
          Add this reservation to your calendar or share with friends:
        </p>
        <div className="flex justify-center space-x-4">
          <button className="text-orange-500 hover:underline text-sm">
            Add to Calendar
          </button>
          <button className="text-orange-500 hover:underline text-sm">
            Share Booking
          </button>
        </div>
      </div> */}
    </div>
  );
};

export default BookingSuccess;
