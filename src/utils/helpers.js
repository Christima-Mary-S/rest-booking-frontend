export const formatTime = (time) => {
  return new Date(`2000-01-01T${time}`).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const getTodayDate = () => {
  return new Date().toISOString().split("T")[0];
};

export const generateBookingReference = () => {
  return Math.random().toString(36).substr(2, 7).toUpperCase();
};
