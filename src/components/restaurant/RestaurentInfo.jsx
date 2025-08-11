import React from "react";
import { ChefHat, MapPin, Clock, Phone, Star, ArrowLeft } from "lucide-react";

const RestaurantInfo = ({ restaurant, onBackToRestaurants }) => {
  if (!restaurant) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-8 rounded-xl mb-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        {onBackToRestaurants && (
          <button
            onClick={onBackToRestaurants}
            className="flex items-center text-white hover:text-orange-200 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Restaurant Selection
          </button>
        )}

        {/* Header with name and rating */}
        <div className="flex items-center mb-4">
          <ChefHat className="w-8 h-8 mr-3" />
          <h1 className="text-3xl font-bold">{restaurant.name}</h1>
          <div className="flex items-center ml-4">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${
                  i < Math.floor(restaurant.rating || 4.5)
                    ? "fill-current text-yellow-300"
                    : "text-yellow-300"
                }`}
              />
            ))}
            <span className="ml-2 text-lg">{restaurant.rating || "4.5"}</span>
          </div>
        </div>

        {/* Restaurant details grid */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="flex items-center">
            <MapPin className="w-5 h-5 mr-2 flex-shrink-0" />
            <span>
              {restaurant.address || "123 Restaurant Street, Food District"}
            </span>
          </div>
          <div className="flex items-center">
            <Clock className="w-5 h-5 mr-2 flex-shrink-0" />
            <span>
              Open: {restaurant.hours?.weekday || "11:00 AM - 10:00 PM"}
            </span>
          </div>
          <div className="flex items-center">
            <Phone className="w-5 h-5 mr-2 flex-shrink-0" />
            <span>{restaurant.phone || "(555) 123-FOOD"}</span>
          </div>
        </div>

        {/* Description */}
        <p className="mt-4 text-lg opacity-90">
          {restaurant.description ||
            "Experience exceptional dining with our carefully crafted menu and welcoming atmosphere."}
        </p>

        {/* Additional features or highlights */}
        <div className="mt-6 flex flex-wrap gap-4">
          {restaurant.features ? (
            restaurant.features.map((feature, index) => (
              <span
                key={index}
                className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm"
              >
                {feature}
              </span>
            ))
          ) : (
            <>
              <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
                Quality Dining
              </span>
              <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
                Great Service
              </span>
              <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
                Fresh Ingredients
              </span>
              <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
                Perfect Ambiance
              </span>
            </>
          )}
        </div>

        {/* Restaurant ID for reference */}
        <div className="mt-4 text-sm opacity-75">
          Restaurant ID: {restaurant.micrositeName || restaurant.id}
        </div>
      </div>
    </div>
  );
};

export default RestaurantInfo;
