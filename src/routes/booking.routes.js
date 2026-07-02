import { Router } from "express";
import { createBooking, cancelBooking } from "../controllers/booking.controller.js";
import { verifyJWT } from "../middlewares/verifyJWT.js";
import { validateBookingPayload } from "../validators/booking.validator.js";

const router = Router();

router.post("/", verifyJWT, validateBookingPayload, createBooking);
router.patch("/cancel/:id", verifyJWT, cancelBooking);

export default router;
