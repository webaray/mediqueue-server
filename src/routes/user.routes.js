import { Router } from "express";
import { createUser, getUsers, getUserByEmail } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/verifyJWT.js";

const router = Router();

router.post("/", createUser);
router.get("/", verifyJWT, getUsers);
router.get("/:email", verifyJWT, getUserByEmail);

export default router;
