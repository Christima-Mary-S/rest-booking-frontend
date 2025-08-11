import React, { useState } from "react";
import { ChefHat, LogOut, Menu, X, ArrowLeft } from "lucide-react";
import { useAuth } from "../../hooks/useAuth.js";

const Header = ({
  currentView,
  onViewChange,
  selectedRestaurant,
  onBackToRestaurants,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const navigationItems = [
    { id: "restaurants", label: "Select Restaurant" },
    { id: "booking", label: "New Booking", disabled: !selectedRestaurant },
    { id: "manage", label: "My Bookings" },
  ];

  const handleViewChange = (view) => {
    onViewChange(view);
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
  };

  const handleBackToRestaurants = () => {
    onBackToRestaurants();
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Restaurant Context */}
          <div className="flex items-center">
            <ChefHat className="w-8 h-8 text-orange-500 mr-3" />
            <div>
              <h1 className="text-xl font-bold text-gray-800">
                Restaurant Booking
              </h1>
              {selectedRestaurant && (
                <div className="flex items-center text-sm text-gray-600">
                  <span>Selected: {selectedRestaurant.name}</span>
                  <button
                    onClick={handleBackToRestaurants}
                    className="ml-2 text-orange-500 hover:text-orange-600 flex items-center"
                  >
                    <ArrowLeft className="w-3 h-3 mr-1" />
                    Change
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleViewChange(item.id)}
                disabled={item.disabled}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  item.disabled
                    ? "text-gray-400 cursor-not-allowed"
                    : currentView === item.id
                    ? "text-orange-500 border-b-2 border-orange-500"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {item.label}
                {item.disabled && (
                  <span className="ml-1 text-xs">
                    (Select restaurant first)
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* Desktop User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={logout}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-1" />
              Logout
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-gray-900"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-2">
              {/* Selected Restaurant Info */}
              {selectedRestaurant && (
                <div className="px-3 py-2 bg-orange-50 rounded-lg mb-2">
                  <div className="text-sm font-medium text-orange-800">
                    Current: {selectedRestaurant.name}
                  </div>
                  <button
                    onClick={handleBackToRestaurants}
                    className="text-xs text-orange-600 hover:text-orange-700 flex items-center mt-1"
                  >
                    <ArrowLeft className="w-3 h-3 mr-1" />
                    Change Restaurant
                  </button>
                </div>
              )}

              {/* Navigation Items */}
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleViewChange(item.id)}
                  disabled={item.disabled}
                  className={`block w-full text-left px-3 py-2 text-sm font-medium transition-colors ${
                    item.disabled
                      ? "text-gray-400 cursor-not-allowed"
                      : currentView === item.id
                      ? "text-orange-500 bg-orange-50"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {item.label}
                  {item.disabled && (
                    <div className="text-xs text-gray-400 mt-1">
                      Select a restaurant first
                    </div>
                  )}
                </button>
              ))}

              {/* User Menu */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full text-left px-3 py-2 text-sm text-gray-600 hover:text-gray-900"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
