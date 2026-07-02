import mongoose from "mongoose";
import AppError from "../utils/AppError.js";

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

export const validateBookingPayload = (req, res, next) => {
  const { studentName, studentEmail, phone, tutorId } = req.body;

  if (!studentName || !studentName.trim()) {
    return next(new AppError("studentName is required", 400));
  }

  if (!studentEmail || !EMAIL_REGEX.test(studentEmail)) {
    return next(new AppError("A valid studentEmail is required", 400));
  }

  if (!phone || !phone.trim()) {
    return next(new AppError("phone is required", 400));
  }

  if (!tutorId || !mongoose.Types.ObjectId.isValid(tutorId)) {
    return next(new AppError("A valid tutorId is required", 400));
  }

  next();
};
