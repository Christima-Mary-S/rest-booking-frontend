import React, { useState } from "react";
import {
  Calendar,
  Clock,
  Users,
  User,
  Mail,
  Phone,
  AlertCircle,
  X,
} from "lucide-react";
import { useBooking } from "../../hooks/useBooking.js";
import { TIME_SLOTS, PARTY_SIZES } from "../../utils/constants.js";
import { formatTime, getTodayDate } from "../../utils/helpers.js";
import { validateBookingForm } from "../../utils/validation.js";
import TimeSlotSelector from "./TimeSlotSelector.jsx";

const BookingForm = ({ restaurant, onBookingComplete }) => {
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    date: "",
    time: "",
    partySize: 2,
    firstName: "",
    surname: "",
    email: "",
    mobile: "",
    specialRequests: "",
  });
  const [availableSlots, setAvailableSlots] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});

  const { loading, error, searchAvailability, createBooking, clearError } =
    useBooking(restaurant);

  // Ensure we have a restaurant selected
  if (!restaurant) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="text-gray-500 mb-4">
          <Calendar className="w-12 h-12 mx-auto opacity-50" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          No Restaurant Selected
        </h3>
        <p className="text-gray-600">
          Please select a restaurant first to make a booking.
        </p>
      </div>
    );
  }

  const updateBookingData = (updates) => {
    setBookingData((prev) => ({ ...prev, ...updates }));
    // Clear validation errors for updated fields
    const updatedFields = Object.keys(updates);
    if (updatedFields.some((field) => validationErrors[field])) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        updatedFields.forEach((field) => delete newErrors[field]);
        return newErrors;
      });
    }
  };

  const handleCheckAvailability = async () => {
    if (!bookingData.date || !bookingData.partySize) {
      setValidationErrors({
        date: !bookingData.date ? "Please select a date" : "",
        partySize: !bookingData.partySize ? "Please select party size" : "",
      });
      return;
    }

    try {
      clearError();
      await searchAvailability(bookingData.date, bookingData.partySize);
      // For demo purposes, we'll use all time slots as available
      // In a real app, this would come from the API response
      setAvailableSlots(TIME_SLOTS);
      setStep(2);
    } catch (err) {
      console.error("Availability check failed:", err);
    }
  };

  const handleSubmitBooking = async () => {
    const validation = validateBookingForm(bookingData);

    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return;
    }

    try {
      clearError();
      const result = await createBooking(bookingData);
      onBookingComplete({
        ...bookingData,
        reference:
          result?.bookingReference ||
          Math.random().toString(36).substr(2, 7).toUpperCase(),
        restaurantName: restaurant.name,
        restaurantMicrosite: restaurant.micrositeName,
      });
    } catch (err) {
      console.error("Booking creation failed:", err);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-between mb-4">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Make a Reservation</h2>
        <p className="text-sm text-gray-600">at {restaurant.name}</p>
      </div>
      <div className="flex space-x-2">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
              step >= i
                ? "bg-orange-500 text-white"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            {i}
          </div>
        ))}
      </div>
    </div>
  );

  const renderStepDescription = () => {
    const descriptions = {
      1: "Step 1: Choose date and party size",
      2: "Step 2: Select time slot",
      3: "Step 3: Enter your details",
    };

    return (
      <div className="text-sm text-gray-600 mb-6">{descriptions[step]}</div>
    );
  };

  const renderError = () => {
    if (!error) return null;

    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center">
        <AlertCircle className="w-4 h-4 mr-2" />
        {error}
        <button onClick={clearError} className="ml-auto">
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="w-4 h-4 inline mr-2" />
            Preferred Date
          </label>
          <input
            type="date"
            min={getTodayDate()}
            value={bookingData.date}
            onChange={(e) => updateBookingData({ date: e.target.value })}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
              validationErrors.date ? "border-red-500" : "border-gray-300"
            }`}
            required
          />
          {validationErrors.date && (
            <p className="text-red-500 text-xs mt-1">{validationErrors.date}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Users className="w-4 h-4 inline mr-2" />
            Party Size
          </label>
          <select
            value={bookingData.partySize}
            onChange={(e) =>
              updateBookingData({ partySize: parseInt(e.target.value) })
            }
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
              validationErrors.partySize ? "border-red-500" : "border-gray-300"
            }`}
          >
            {PARTY_SIZES.map((size) => (
              <option key={size} value={size}>
                {size} {size === 1 ? "Guest" : "Guests"}
              </option>
            ))}
          </select>
          {validationErrors.partySize && (
            <p className="text-red-500 text-xs mt-1">
              {validationErrors.partySize}
            </p>
          )}
        </div>
      </div>

      <button
        onClick={handleCheckAvailability}
        disabled={loading || !bookingData.date}
        className="w-full bg-orange-500 text-white p-3 rounded-lg hover:bg-orange-600 transition-colors font-semibold disabled:opacity-50"
      >
        {loading ? "Checking Availability..." : "Check Availability"}
      </button>
    </div>
  );

  const renderStep2 = () => (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Available Times for {bookingData.date}
        </h3>
        <TimeSlotSelector
          slots={availableSlots}
          selectedSlot={bookingData.time}
          onSlotSelect={(time) => updateBookingData({ time })}
        />
      </div>

      <div className="flex space-x-4">
        <button
          onClick={() => setStep(1)}
          className="flex-1 bg-gray-200 text-gray-700 p-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
        >
          Back
        </button>
        <button
          onClick={() => setStep(3)}
          disabled={!bookingData.time}
          className="flex-1 bg-orange-500 text-white p-3 rounded-lg hover:bg-orange-600 transition-colors font-semibold disabled:opacity-50"
        >
          Continue
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div>
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <User className="w-4 h-4 inline mr-2" />
            First Name
          </label>
          <input
            type="text"
            value={bookingData.firstName}
            onChange={(e) => updateBookingData({ firstName: e.target.value })}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
              validationErrors.firstName ? "border-red-500" : "border-gray-300"
            }`}
            required
          />
          {validationErrors.firstName && (
            <p className="text-red-500 text-xs mt-1">
              {validationErrors.firstName}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Last Name
          </label>
          <input
            type="text"
            value={bookingData.surname}
            onChange={(e) => updateBookingData({ surname: e.target.value })}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
              validationErrors.surname ? "border-red-500" : "border-gray-300"
            }`}
            required
          />
          {validationErrors.surname && (
            <p className="text-red-500 text-xs mt-1">
              {validationErrors.surname}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Mail className="w-4 h-4 inline mr-2" />
            Email
          </label>
          <input
            type="email"
            value={bookingData.email}
            onChange={(e) => updateBookingData({ email: e.target.value })}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
              validationErrors.email ? "border-red-500" : "border-gray-300"
            }`}
            required
          />
          {validationErrors.email && (
            <p className="text-red-500 text-xs mt-1">
              {validationErrors.email}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Phone className="w-4 h-4 inline mr-2" />
            Mobile
          </label>
          <input
            type="tel"
            value={bookingData.mobile}
            onChange={(e) => updateBookingData({ mobile: e.target.value })}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
              validationErrors.mobile ? "border-red-500" : "border-gray-300"
            }`}
            required
          />
          {validationErrors.mobile && (
            <p className="text-red-500 text-xs mt-1">
              {validationErrors.mobile}
            </p>
          )}
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Special Requests (Optional)
        </label>
        <textarea
          value={bookingData.specialRequests}
          onChange={(e) =>
            updateBookingData({ specialRequests: e.target.value })
          }
          rows="3"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          placeholder="Any dietary requirements, seating preferences, or special occasions..."
        />
      </div>

      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h4 className="font-semibold text-gray-800 mb-2">Booking Summary</h4>
        <div className="text-sm text-gray-600 space-y-1">
          <p>
            <span className="font-medium">Restaurant:</span> {restaurant.name}
          </p>
          <p>
            <span className="font-medium">Date:</span> {bookingData.date}
          </p>
          <p>
            <span className="font-medium">Time:</span>{" "}
            {formatTime(bookingData.time)}
          </p>
          <p>
            <span className="font-medium">Party Size:</span>{" "}
            {bookingData.partySize}{" "}
            {bookingData.partySize === 1 ? "Guest" : "Guests"}
          </p>
          <p>
            <span className="font-medium">Name:</span> {bookingData.firstName}{" "}
            {bookingData.surname}
          </p>
        </div>
      </div>

      <div className="flex space-x-4">
        <button
          onClick={() => setStep(2)}
          className="flex-1 bg-gray-200 text-gray-700 p-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
        >
          Back
        </button>
        <button
          onClick={handleSubmitBooking}
          disabled={loading}
          className="flex-1 bg-orange-500 text-white p-3 rounded-lg hover:bg-orange-600 transition-colors font-semibold disabled:opacity-50"
        >
          {loading ? "Creating Booking..." : "Confirm Booking"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="mb-8">
        {renderStepIndicator()}
        {renderStepDescription()}
      </div>

      {renderError()}

      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
    </div>
  );
};

export default BookingForm;
