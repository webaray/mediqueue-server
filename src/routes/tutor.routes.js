import { Router } from "express";
import {
  getAllTutors,
  getTutorById,
  createTutor,
  updateTutor,
  deleteTutor
} from "../controllers/tutor.controller.js";
import { verifyJWT } from "../middlewares/verifyJWT.js";
import { validateTutorPayload } from "../validators/tutor.validator.js";

const router = Router();

router.get("/", getAllTutors);
router.get("/:id", getTutorById);
router.post("/", verifyJWT, validateTutorPayload, createTutor);
router.patch("/:id", verifyJWT, updateTutor);
router.delete("/:id", verifyJWT, deleteTutor);

export default router;
