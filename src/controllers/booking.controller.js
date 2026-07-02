import Booking from "../models/Booking.model.js";
import Tutor from "../models/Tutor.model.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { BOOKING_STATUS } from "../constants/booking.constants.js";

// POST /api/bookings  (protected)
export const createBooking = asyncHandler(async (req, res, next) => {
  const { studentName, studentEmail, phone, tutorId } = req.body;

  // Email in body must match the JWT-authenticated email
  if (studentEmail !== req.decoded.email) {
    return next(new AppError("Forbidden. Email mismatch with authenticated user.", 403));
  }

  const tutor = await Tutor.findById(tutorId);

  if (!tutor) {
    return next(new AppError("Tutor not found", 404));
  }

  // Session must not have already started
  if (new Date(tutor.sessionStartDate) < new Date()) {
    return next(new AppError("Cannot book. Session has already started.", 400));
  }

  // Slot availability check
  if (tutor.totalSlot <= 0) {
    return next(new AppError("No slots available for this tutor.", 400));
  }

  // Duplicate booking prevention (active bookings only)
  const existingBooking = await Booking.findOne({
    tutorId,
    studentEmail,
    bookingStatus: { $ne: BOOKING_STATUS.CANCELLED }
  });

  if (existingBooking) {
    return next(new AppError("You have already booked this tutor.", 409));
  }

  // Atomic slot decrement — only succeeds if totalSlot is still > 0,
  // preventing race conditions from concurrent booking requests.
  const updatedTutor = await Tutor.findOneAndUpdate(
    { _id: tutorId, totalSlot: { $gt: 0 } },
    { $inc: { totalSlot: -1 } },
    { new: true }
  );

  if (!updatedTutor) {
    return next(new AppError("No slots available for this tutor.", 400));
  }

  try {
    const booking = await Booking.create({
      studentName,
      studentEmail,
      phone,
      tutorId,
      tutorName: tutor.tutorName,
      bookingStatus: BOOKING_STATUS.CONFIRMED
    });

    return res.status(201).json({
      success: true,
      message: "Booking confirmed successfully",
      data: booking
    });
  } catch (error) {
    // Roll back the slot decrement if booking creation fails
    // (e.g. unique index race condition caught at DB level)
    await Tutor.findByIdAndUpdate(tutorId, { $inc: { totalSlot: 1 } });

    if (error.code === 11000) {
      return next(new AppError("You have already booked this tutor.", 409));
    }

    throw error;
  }
});

// GET /api/my-bookings?email=...  (protected)
export const getMyBookings = asyncHandler(async (req, res) => {
  const { email } = req.query;

  const bookings = await Booking.find({ studentEmail: email }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: bookings.length,
    data: bookings
  });
});

// PATCH /api/bookings/cancel/:id  (protected)
export const cancelBooking = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return next(new AppError("Booking not found", 404));
  }

  if (booking.studentEmail !== req.decoded.email) {
    return next(new AppError("Forbidden. This booking does not belong to you.", 403));
  }

  if (booking.bookingStatus === BOOKING_STATUS.CANCELLED) {
    return next(new AppError("Booking is already cancelled.", 400));
  }

  booking.bookingStatus = BOOKING_STATUS.CANCELLED;
  await booking.save();

  // Restore the slot back to the tutor
  await Tutor.findByIdAndUpdate(booking.tutorId, { $inc: { totalSlot: 1 } });

  res.status(200).json({
    success: true,
    message: "Booking cancelled successfully",
    data: booking
  });
});
