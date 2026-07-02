import mongoose from "mongoose";
import { BOOKING_STATUS_VALUES, BOOKING_STATUS } from "../constants/booking.constants.js";

const bookingSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: [true, "Student name is required"],
      trim: true
    },
    studentEmail: {
      type: String,
      required: [true, "Student email is required"],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"]
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true
    },
    tutorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tutor",
      required: true
    },
    tutorName: {
      type: String,
      required: true
    },
    bookingStatus: {
      type: String,
      enum: BOOKING_STATUS_VALUES,
      default: BOOKING_STATUS.PENDING
    },
    bookingDate: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// Prevent the same student (by email) from booking the same tutor twice
// while there is an active (non-cancelled) booking.
bookingSchema.index(
  { tutorId: 1, studentEmail: 1 },
  {
    unique: true,
    partialFilterExpression: { bookingStatus: { $ne: BOOKING_STATUS.CANCELLED } }
  }
);

const Booking = mongoose.models.Booking || mongoose.model("Booking", bookingSchema);

export default Booking;
