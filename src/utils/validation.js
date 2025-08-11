export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone) => {
  const re = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  return re.test(phone);
};

export const validateBookingForm = (data) => {
  const errors = {};

  if (!data.firstName?.trim()) {
    errors.firstName = "First name is required";
  }

  if (!data.surname?.trim()) {
    errors.surname = "Last name is required";
  }

  if (!data.email?.trim()) {
    errors.email = "Email is required";
  } else if (!validateEmail(data.email)) {
    errors.email = "Please enter a valid email";
  }

  if (!data.mobile?.trim()) {
    errors.mobile = "Phone number is required";
  } else if (!validatePhone(data.mobile)) {
    errors.mobile = "Please enter a valid phone number";
  }

  if (!data.date) {
    errors.date = "Date is required";
  }

  if (!data.time) {
    errors.time = "Time is required";
  }

  if (!data.partySize || data.partySize < 1) {
    errors.partySize = "Party size is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
