import { useState } from "react";
import { api } from "../services/api.js";
import { useAuth } from "./useAuth.js";

export const useBooking = (restaurant) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token, user } = useAuth();

  const getRestaurantMicrosite = () => {
    return (
      restaurant?.micrositeName || restaurant?.microsite_name || restaurant?.id
    );
  };

  const searchAvailability = async (
    date,
    partySize,
    targetRestaurant = null
  ) => {
    const restaurantMicrosite =
      targetRestaurant?.micrositeName || getRestaurantMicrosite();

    if (!restaurantMicrosite) {
      throw new Error("Restaurant not selected");
    }

    setLoading(true);
    setError(null);
    try {
      const result = await api.searchAvailability(
        restaurantMicrosite,
        date,
        partySize,
        token
      );
      return result;
    } catch (err) {
      setError("Failed to check availability");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createBooking = async (bookingData, targetRestaurant = null) => {
    const restaurantMicrosite =
      targetRestaurant?.micrositeName || getRestaurantMicrosite();

    if (!restaurantMicrosite) {
      throw new Error("Restaurant not selected");
    }

    setLoading(true);
    setError(null);
    try {
      const result = await api.createBooking(
        restaurantMicrosite,
        bookingData,
        token
      );
      return result;
    } catch (err) {
      setError("Failed to create booking");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateBooking = async (
    bookingRef,
    updates,
    targetRestaurant = null
  ) => {
    const restaurantMicrosite =
      targetRestaurant?.micrositeName || getRestaurantMicrosite();

    if (!restaurantMicrosite) {
      throw new Error("Restaurant not selected");
    }

    setLoading(true);
    setError(null);
    try {
      const result = await api.updateBooking(
        restaurantMicrosite,
        bookingRef,
        updates,
        token
      );
      return result;
    } catch (err) {
      setError("Failed to update booking");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (bookingRef, targetRestaurant = null) => {
    const restaurantMicrosite =
      targetRestaurant?.micrositeName || getRestaurantMicrosite();

    if (!restaurantMicrosite) {
      throw new Error("Restaurant not selected");
    }

    setLoading(true);
    setError(null);
    try {
      const result = await api.cancelBooking(
        restaurantMicrosite,
        bookingRef,
        token
      );
      return result;
    } catch (err) {
      setError("Failed to cancel booking");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getBooking = async (bookingRef, targetRestaurant = null) => {
    const restaurantMicrosite =
      targetRestaurant?.micrositeName || getRestaurantMicrosite();

    if (!restaurantMicrosite) {
      throw new Error("Restaurant not selected");
    }

    setLoading(true);
    setError(null);
    try {
      const result = await api.getBooking(
        restaurantMicrosite,
        bookingRef,
        token
      );
      return result;
    } catch (err) {
      setError("Failed to fetch booking");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get all user bookings by email
  const getAllUserBookings = async () => {
    if (!user?.email) {
      setError("User not authenticated");
      return null;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await api.getUserBookings(user.email, token);
      return result;
    } catch (err) {
      setError("Failed to fetch bookings");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    restaurant: restaurant,
    restaurantMicrosite: getRestaurantMicrosite(),
    searchAvailability,
    createBooking,
    updateBooking,
    cancelBooking,
    getBooking,
    getAllUserBookings,
    clearError: () => setError(null),
  };
};
