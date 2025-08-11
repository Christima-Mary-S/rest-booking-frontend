import React from "react";
import { MapPin, Phone, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-2 text-gray-300">
              <p className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                Restaurant Booking Platform
              </p>
              <p className="flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                (555) 123-BOOK
              </p>
              <p className="flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                support@restaurantbooking.com
              </p>
            </div>
          </div>

          {/* Platform Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Platform Hours</h3>
            <div className="space-y-2 text-gray-300">
              <p>Available 24/7 for online bookings</p>
              <p>Customer support: 9:00 AM - 9:00 PM</p>
              <p>Individual restaurant hours may vary</p>
            </div>
          </div>

          {/* Policies */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Booking Policies</h3>
            <div className="space-y-2 text-gray-300">
              <p>• Cancellations accepted up to 24 hours before</p>
              <p>• Late arrivals may forfeit table after 15 minutes</p>
              <p>• Special dietary requirements accommodated</p>
              <p>• Policies may vary by restaurant</p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 Restaurant Booking Platform. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
