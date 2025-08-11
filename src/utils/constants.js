// src/utils/constants.js
export const API_BASE = "http://localhost:8547";

export const TIME_SLOTS = [
  "11:00:00",
  "11:30:00",
  "12:00:00",
  "12:30:00",
  "13:00:00",
  "13:30:00",
  "14:00:00",
  "14:30:00",
  "18:00:00",
  "18:30:00",
  "19:00:00",
  "19:30:00",
  "20:00:00",
  "20:30:00",
  "21:00:00",
];

export const PARTY_SIZES = [1, 2, 3, 4, 5, 6, 7, 8];

export const BOOKING_STATUS = {
  CONFIRMED: "confirmed",
  PENDING: "pending",
  CANCELLED: "cancelled",
};

// Default restaurant info structure (fallback)
export const DEFAULT_RESTAURANT_INFO = {
  hours: {
    weekday: "11:00 AM - 10:00 PM",
    weekend: "10:00 AM - 11:00 PM",
  },
  rating: 4.5,
  phone: "(555) 123-FOOD",
  email: "info@restaurant.com",
  address: "123 Restaurant Street, Food District",
};

export const RESTAURANT_INFO = DEFAULT_RESTAURANT_INFO;
