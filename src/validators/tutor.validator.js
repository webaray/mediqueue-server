import { TEACHING_MODE_VALUES } from "../constants/booking.constants.js";
import AppError from "../utils/AppError.js";

export const validateTutorPayload = (req, res, next) => {
  const {
    tutorName,
    tutorPhoto,
    subject,
    availableDays,
    availableTime,
    hourlyFee,
    totalSlot,
    sessionStartDate,
    institution,
    experience,
    location,
    teachingMode
  } = req.body;

  const requiredFields = {
    tutorName,
    tutorPhoto,
    subject,
    availableTime,
    institution,
    location,
    teachingMode
  };

  for (const [field, value] of Object.entries(requiredFields)) {
    if (!value || (typeof value === "string" && !value.trim())) {
      return next(new AppError(`${field} is required`, 400));
    }
  }

  if (!Array.isArray(availableDays) || availableDays.length === 0) {
    return next(new AppError("availableDays must be a non-empty array", 400));
  }

  if (typeof hourlyFee !== "number" || hourlyFee < 0) {
    return next(new AppError("hourlyFee must be a non-negative number", 400));
  }

  if (typeof totalSlot !== "number" || totalSlot < 0) {
    return next(new AppError("totalSlot must be a non-negative number", 400));
  }

  if (!sessionStartDate || isNaN(new Date(sessionStartDate).getTime())) {
    return next(new AppError("sessionStartDate must be a valid date", 400));
  }

  if (typeof experience !== "number" || experience < 0) {
    return next(new AppError("experience must be a non-negative number", 400));
  }

  if (!TEACHING_MODE_VALUES.includes(teachingMode)) {
    return next(
      new AppError(`teachingMode must be one of: ${TEACHING_MODE_VALUES.join(", ")}`, 400)
    );
  }

  next();
};
