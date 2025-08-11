# Restaurant Booking System Frontend

A modern React-based frontend application for restaurant table booking and management. This application provides a complete booking solution with user authentication, restaurant selection, availability checking, and booking management.

## 🚀 Features

- **User Authentication**: Login and registration system with secure token-based authentication
- **Restaurant Management**: Browse and select from available restaurants
- **Table Booking**: Real-time availability checking and booking creation
- **Booking Management**: View, update, and cancel existing bookings
- **Responsive Design**: Mobile-friendly interface built with Tailwind CSS
- **Modern UI**: Clean interface with Lucide React icons

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 with Vite
- **Styling**: Tailwind CSS with PostCSS and Autoprefixer
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Code Quality**: ESLint with React-specific rules

## 📋 Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager
- Backend API server running on `http://localhost:8547`

## 🏃 Getting Started

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd rest-booking-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to the local development URL (typically `http://localhost:5173`)

### Available Scripts

- `npm run dev` - Start the development server with hot reload
- `npm run build` - Create a production build
- `npm run lint` - Run ESLint to check for code issues
- `npm run preview` - Preview the production build locally

## 🏗️ Project Structure

```
src/
├── components/           # React components
│   ├── auth/            # Authentication components
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   ├── booking/         # Booking-related components
│   │   ├── BookingForm.jsx
│   │   ├── BookingManagement.jsx
│   │   ├── BookingSuccess.jsx
│   │   └── TimeSlotSelector.jsx
│   ├── layout/          # Layout components
│   │   ├── Footer.jsx
│   │   └── Header.jsx
│   └── restaurant/      # Restaurant components
│       ├── RestaurantSelector.jsx
│       └── RestaurentInfo.jsx
├── context/             # React context providers
│   └── AuthContext.jsx
├── hooks/               # Custom React hooks
│   ├── useAuth.js
│   └── useBooking.js
├── services/            # API services
│   └── api.js
├── utils/               # Utility functions and constants
│   ├── constants.js
│   ├── helpers.js
│   └── validation.js
├── assets/              # Static assets
├── App.jsx              # Main application component
├── main.jsx             # Application entry point
└── index.css            # Global styles
```

## 🔧 Configuration

### API Configuration

The application connects to a backend API server. Configure the API base URL in `src/utils/constants.js`:

```javascript
export const API_BASE = "http://localhost:8547";
```

### Time Slots and Party Sizes

Default booking configurations are defined in `src/utils/constants.js`:

- **Available Time Slots**: 11:00 AM - 9:30 PM with 30-minute intervals
- **Party Sizes**: 1-8 people
- **Booking Statuses**: Confirmed, Pending, Cancelled

## 🎯 Key Components

### Authentication Flow
- **Login**: User authentication with email/password
- **Register**: New user registration with profile information
- **AuthContext**: Manages authentication state across the application

### Booking Process
1. **Restaurant Selection**: Browse and select from available restaurants
2. **Availability Search**: Check available time slots for specific dates
3. **Booking Form**: Complete reservation with customer details
4. **Confirmation**: Booking success confirmation and details
5. **Management**: View and manage existing bookings

### API Integration
The application integrates with a REST API providing:
- User authentication endpoints
- Restaurant data retrieval
- Booking creation and management
- Availability searching

## 🎨 UI/UX Features

- **Responsive Design**: Optimized for desktop and mobile devices
- **Modern Styling**: Clean, professional interface with Tailwind CSS
- **Interactive Components**: Real-time feedback and validation
- **Navigation**: Intuitive flow between different application sections

## 🔒 Security Features

- **Token-based Authentication**: Secure JWT token handling
- **Protected Routes**: Authentication required for booking features
- **Input Validation**: Client-side form validation
- **Error Handling**: Comprehensive error management and user feedback

## 🐛 Development

### Code Quality
- ESLint configuration for React development
- Consistent code formatting and best practices
- Component-based architecture for maintainability

### Development Server
The Vite development server provides:
- Hot module replacement (HMR)
- Fast build times
- Modern JavaScript features support

## 📝 API Endpoints

The application communicates with these main API endpoints:

- **Authentication**: `/api/auth/*` (login, register, profile)
- **Restaurants**: `/api/restaurants/*` (list, details)
- **Bookings**: `/api/ConsumerApi/v1/Restaurant/*` (availability, create, manage)

## 🚀 Deployment

To build for production:

```bash
npm run build
```

This creates an optimized build in the `dist` directory ready for deployment to any static hosting service.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run linting: `npm run lint`
5. Build and test: `npm run build`
6. Submit a pull request

## 📄 License

This project is private and proprietary.
