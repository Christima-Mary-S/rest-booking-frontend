import React, { useState, useEffect, useContext } from "react";
import { ChefHat, MapPin, Star, Clock, ArrowRight, Loader } from "lucide-react";
import { api } from "../../services/api.js";
import { DEFAULT_RESTAURANT_INFO } from "../../utils/constants.js";
import AuthContext from "../../context/AuthContext.jsx";

const RestaurantSelector = ({ onRestaurantSelect, selectedRestaurant }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    if (token) {
      fetchRestaurants();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const response = await api.getRestaurants(token);
      setRestaurants(response.restaurants || []);
    } catch (err) {
      setError("Failed to load restaurants");
      console.error("Error fetching restaurants:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatRestaurantName = (name) => {
    // Convert camelCase or PascalCase to readable format
    return name.replace(/([A-Z])/g, " $1").trim();
  };

  const getRestaurantInfo = (restaurant) => {
    // In a real app, you might fetch detailed info for each restaurant
    // For now, we'll use default info with the restaurant name
    return {
      ...DEFAULT_RESTAURANT_INFO,
      name: formatRestaurantName(restaurant.name),
      micrositeName: restaurant.microsite_name,
      id: restaurant.id,
    };
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center justify-center py-12">
          <Loader className="w-8 h-8 animate-spin text-orange-500 mr-3" />
          <span className="text-gray-600">Loading restaurants...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="text-center py-12">
          <div className="text-red-500 mb-4">
            <ChefHat className="w-12 h-12 mx-auto opacity-50" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Unable to Load Restaurants
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchRestaurants}
            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (restaurants.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="text-center py-12">
          <ChefHat className="w-12 h-12 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            No Restaurants Available
          </h3>
          <p className="text-gray-600">Please check back later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Choose a Restaurant
        </h2>
        <p className="text-gray-600">
          Select a restaurant to make your reservation
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurants.map((restaurant) => {
          const restaurantInfo = getRestaurantInfo(restaurant);
          const isSelected = selectedRestaurant?.id === restaurant.id;

          return (
            <div
              key={restaurant.id}
              className={`border rounded-lg p-6 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                isSelected
                  ? "border-orange-500 bg-orange-50 shadow-lg"
                  : "border-gray-200 hover:border-orange-300"
              }`}
              onClick={() => onRestaurantSelect(restaurantInfo)}
            >
              {/* Restaurant Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <ChefHat
                    className={`w-6 h-6 mr-2 ${
                      isSelected ? "text-orange-500" : "text-gray-600"
                    }`}
                  />
                  <h3 className="font-bold text-lg text-gray-800">
                    {restaurantInfo.name}
                  </h3>
                </div>
                {isSelected && (
                  <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                    <ArrowRight className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>

              {/* Restaurant Details */}
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{restaurantInfo.address}</span>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>Open: {restaurantInfo.hours.weekday}</span>
                </div>

                <div className="flex items-center">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(restaurantInfo.rating)
                            ? "fill-current text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-sm text-gray-600">
                      {restaurantInfo.rating}
                    </span>
                  </div>
                </div>

                {/* Restaurant ID for debugging */}
                <div className="text-xs text-gray-400 font-mono">
                  ID: {restaurant.microsite_name}
                </div>
              </div>

              {/* Action Indicator */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div
                  className={`text-sm font-medium ${
                    isSelected ? "text-orange-600" : "text-gray-500"
                  }`}
                >
                  {isSelected ? "Selected" : "Click to select"}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedRestaurant && (
        <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="flex items-center">
            <ChefHat className="w-5 h-5 text-orange-500 mr-2" />
            <span className="font-medium text-orange-800">
              Selected: {selectedRestaurant.name}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantSelector;
