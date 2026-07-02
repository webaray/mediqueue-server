import mongoose from "mongoose";
import { TEACHING_MODE_VALUES } from "../constants/booking.constants.js";

const tutorSchema = new mongoose.Schema(
  {
    tutorName: {
      type: String,
      required: [true, "Tutor name is required"],
      trim: true,
      maxlength: 100
    },
    tutorPhoto: {
      type: String,
      required: [true, "Tutor photo is required"]
    },
    subject: {
      type: String,
      required: [true, "Subject is required"],
      trim: true
    },
    availableDays: {
      type: [String],
      required: [true, "Available days are required"],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: "At least one available day is required"
      }
    },
    availableTime: {
      type: String,
      required: [true, "Available time is required"]
    },
    hourlyFee: {
      type: Number,
      required: [true, "Hourly fee is required"],
      min: [0, "Hourly fee cannot be negative"]
    },
    totalSlot: {
      type: Number,
      required: [true, "Total slot is required"],
      min: [0, "Total slot cannot be negative"]
    },
    sessionStartDate: {
      type: Date,
      required: [true, "Session start date is required"]
    },
    institution: {
      type: String,
      required: [true, "Institution is required"],
      trim: true
    },
    experience: {
      type: Number,
      required: [true, "Experience is required"],
      min: 0
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true
    },
    teachingMode: {
      type: String,
      enum: TEACHING_MODE_VALUES,
      required: [true, "Teaching mode is required"]
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

tutorSchema.index({ tutorName: "text", subject: "text" });
tutorSchema.index({ sessionStartDate: 1 });
tutorSchema.index({ createdBy: 1 });

const Tutor = mongoose.models.Tutor || mongoose.model("Tutor", tutorSchema);

export default Tutor;
