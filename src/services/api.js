import { API_BASE } from "../utils/constants.js";

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const config = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  // Authentication endpoints
  async login(email, password) {
    return this.request("/api/auth/login", {
      method: "POST",
      body: new URLSearchParams({ email, password }),
    });
  }

  async register(userData) {
    return this.request("/api/auth/register", {
      method: "POST",
      body: new URLSearchParams({
        email: userData.email,
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone,
        confirmPassword: userData.confirmPassword,
      }),
    });
  }

  async logout() {
    return this.request("/api/auth/logout", {
      method: "POST",
    });
  }

  async getUserProfile(token) {
    return this.request("/api/auth/profile", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Restaurant endpoints
  async getRestaurants(token) {
    const headers = {};
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    return this.request("/api/restaurants/", {
      headers,
      method: "GET"
    });
  }

  async getRestaurant(restaurantId) {
    return this.request(`/api/restaurants/${restaurantId}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  // Booking endpoints
  async searchAvailability(restaurantMicrosite, date, partySize, token) {
    return this.request(
      `/api/ConsumerApi/v1/Restaurant/${restaurantMicrosite}/AvailabilitySearch`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: new URLSearchParams({
          VisitDate: date,
          PartySize: partySize.toString(),
          ChannelCode: "ONLINE",
        }),
      }
    );
  }

  async createBooking(restaurantMicrosite, bookingData, token) {
    const formData = new URLSearchParams({
      VisitDate: bookingData.date,
      VisitTime: bookingData.time,
      PartySize: bookingData.partySize.toString(),
      ChannelCode: "ONLINE",
      SpecialRequests: bookingData.specialRequests || "",
      "Customer[FirstName]": bookingData.firstName,
      "Customer[Surname]": bookingData.surname,
      "Customer[Email]": bookingData.email,
      "Customer[Mobile]": bookingData.mobile,
    });

    return this.request(
      `/api/ConsumerApi/v1/Restaurant/${restaurantMicrosite}/BookingWithStripeToken`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );
  }

  async getBooking(restaurantMicrosite, bookingRef, token) {
    return this.request(
      `/api/ConsumerApi/v1/Restaurant/${restaurantMicrosite}/Booking/${bookingRef}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
  }

  async updateBooking(restaurantMicrosite, bookingRef, updates, token) {
    return this.request(
      `/api/ConsumerApi/v1/Restaurant/${restaurantMicrosite}/Booking/${bookingRef}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: new URLSearchParams(updates),
      }
    );
  }

  async cancelBooking(restaurantMicrosite, bookingRef, token) {
    return this.request(
      `/api/ConsumerApi/v1/Restaurant/${restaurantMicrosite}/Booking/${bookingRef}/Cancel`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: new URLSearchParams({
          micrositeName: restaurantMicrosite,
          bookingReference: bookingRef,
          cancellationReasonId: "1",
        }),
      }
    );
  }

  // Get all bookings for a user by email
  async getUserBookings(email, token) {
    return this.request(`/api/ConsumerApi/v1/Restaurant/Customer/${encodeURIComponent(email)}/Bookings`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  }
}

export const api = new ApiService();
