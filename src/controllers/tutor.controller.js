import Tutor from "../models/Tutor.model.js";
import User from "../models/User.model.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";

// GET /api/tutors  (public, supports search + date filter)
export const getAllTutors = asyncHandler(async (req, res) => {
  const { search, sessionStartDate, page = 1, limit = 12 } = req.query;

  const query = {};

  if (search) {
    query.tutorName = { $regex: search, $options: "i" };
  }

  if (sessionStartDate) {
    const date = new Date(sessionStartDate);
    query.sessionStartDate = { $gte: date };
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [tutors, total] = await Promise.all([
    Tutor.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Tutor.countDocuments(query)
  ]);

  res.status(200).json({
    success: true,
    count: tutors.length,
    total,
    page: Number(page),
    totalPages: Math.ceil(total / Number(limit)),
    data: tutors
  });
});

// GET /api/tutors/:id  (public)
export const getTutorById = asyncHandler(async (req, res, next) => {
  const tutor = await Tutor.findById(req.params.id);

  if (!tutor) {
    return next(new AppError("Tutor not found", 404));
  }

  res.status(200).json({ success: true, data: tutor });
});

// POST /api/tutors  (protected)
export const createTutor = asyncHandler(async (req, res, next) => {
  const creatorEmail = req.decoded.email;

  const user = await User.findOne({ email: creatorEmail });

  if (!user) {
    return next(new AppError("User not found. Cannot create tutor.", 404));
  }

  const tutor = await Tutor.create({ ...req.body, createdBy: user._id });

  res.status(201).json({
    success: true,
    message: "Tutor created successfully",
    data: tutor
  });
});

// PATCH /api/tutors/:id  (protected, owner only)
export const updateTutor = asyncHandler(async (req, res, next) => {
  const tutor = await Tutor.findById(req.params.id);

  if (!tutor) {
    return next(new AppError("Tutor not found", 404));
  }

  const user = await User.findOne({ email: req.decoded.email });

  if (!user || tutor.createdBy.toString() !== user._id.toString()) {
    return next(new AppError("Forbidden. You do not own this tutor listing.", 403));
  }

  const updatableFields = [
    "tutorName",
    "tutorPhoto",
    "subject",
    "availableDays",
    "availableTime",
    "hourlyFee",
    "totalSlot",
    "sessionStartDate",
    "institution",
    "experience",
    "location",
    "teachingMode"
  ];

  updatableFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      tutor[field] = req.body[field];
    }
  });

  await tutor.save();

  res.status(200).json({
    success: true,
    message: "Tutor updated successfully",
    data: tutor
  });
});

// DELETE /api/tutors/:id  (protected, owner only)
export const deleteTutor = asyncHandler(async (req, res, next) => {
  const tutor = await Tutor.findById(req.params.id);

  if (!tutor) {
    return next(new AppError("Tutor not found", 404));
  }

  const user = await User.findOne({ email: req.decoded.email });

  if (!user || tutor.createdBy.toString() !== user._id.toString()) {
    return next(new AppError("Forbidden. You do not own this tutor listing.", 403));
  }

  await tutor.deleteOne();

  res.status(200).json({
    success: true,
    message: "Tutor deleted successfully"
  });
});

// GET /api/my-tutors  (protected)
export const getMyTutors = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.decoded.email });

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  const tutors = await Tutor.find({ createdBy: user._id }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: tutors.length,
    data: tutors
  });
});
