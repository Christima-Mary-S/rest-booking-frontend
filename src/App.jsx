import React, { useState } from "react";
import { AuthProvider } from "./context/AuthContext.jsx";
import { useAuth } from "./hooks/useAuth.js";
import Header from "./components/layout/Header.jsx";
import Footer from "./components/layout/Footer.jsx";
import RestaurantSelector from "./components/restaurant/RestaurantSelector.jsx";
import Login from "./components/auth/Login.jsx";
import BookingForm from "./components/booking/BookingForm.jsx";
import BookingSuccess from "./components/booking/BookingSuccess.jsx";
import BookingManagement from "./components/booking/BookingManagement.jsx";
import RestaurantInfo from "./components/restaurant/RestaurentInfo.jsx";

const AppContent = () => {
  const [currentView, setCurrentView] = useState("restaurants");
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [showBookingSuccess, setShowBookingSuccess] = useState(false);
  const [completedBooking, setCompletedBooking] = useState(null);
  const { isAuthenticated } = useAuth();

  const handleRestaurantSelect = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setCurrentView("booking");
  };

  const handleBookingComplete = (booking) => {
    setCompletedBooking({
      ...booking,
      restaurantName: selectedRestaurant?.name,
    });
    setShowBookingSuccess(true);
  };

  const handleNewBooking = () => {
    setShowBookingSuccess(false);
    setCompletedBooking(null);
    setCurrentView("restaurants");
    setSelectedRestaurant(null);
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
    setShowBookingSuccess(false);

    // If switching to booking view but no restaurant selected, go to restaurant selection
    if (view === "booking" && !selectedRestaurant) {
      setCurrentView("restaurants");
    }
  };

  const handleBackToRestaurants = () => {
    setSelectedRestaurant(null);
    setCurrentView("restaurants");
    setShowBookingSuccess(false);
  };

  if (!isAuthenticated) {
    return <Login />;
  }

  const renderMainContent = () => {
    if (showBookingSuccess) {
      return (
        <BookingSuccess
          booking={completedBooking}
          onNewBooking={handleNewBooking}
        />
      );
    }

    switch (currentView) {
      case "restaurants":
        return (
          <RestaurantSelector
            onRestaurantSelect={handleRestaurantSelect}
            selectedRestaurant={selectedRestaurant}
          />
        );

      case "booking":
        if (!selectedRestaurant) {
          return (
            <RestaurantSelector
              onRestaurantSelect={handleRestaurantSelect}
              selectedRestaurant={selectedRestaurant}
            />
          );
        }
        return (
          <div>
            <RestaurantInfo
              restaurant={selectedRestaurant}
              onBackToRestaurants={handleBackToRestaurants}
            />
            <BookingForm
              restaurant={selectedRestaurant}
              onBookingComplete={handleBookingComplete}
            />
          </div>
        );

      case "manage":
        return <BookingManagement />;

      default:
        return (
          <RestaurantSelector
            onRestaurantSelect={handleRestaurantSelect}
            selectedRestaurant={selectedRestaurant}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        currentView={currentView}
        onViewChange={handleViewChange}
        selectedRestaurant={selectedRestaurant}
        onBackToRestaurants={handleBackToRestaurants}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderMainContent()}
      </main>

      <Footer />
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
