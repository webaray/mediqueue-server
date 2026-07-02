export const BOOKING_STATUS = Object.freeze({
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  CANCELLED: "Cancelled",
  COMPLETED: "Completed"
});

export const BOOKING_STATUS_VALUES = Object.values(BOOKING_STATUS);

export const TEACHING_MODE = Object.freeze({
  ONLINE: "Online",
  OFFLINE: "Offline",
  HYBRID: "Hybrid"
});

export const TEACHING_MODE_VALUES = Object.values(TEACHING_MODE);

export const USER_ROLE = Object.freeze({
  STUDENT: "student",
  TUTOR: "tutor",
  ADMIN: "admin"
});

export const USER_ROLE_VALUES = Object.values(USER_ROLE);
