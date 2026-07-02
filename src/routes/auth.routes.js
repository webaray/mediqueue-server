import { Router } from "express";
import { issueJWT, logoutJWT } from "../controllers/auth.controller.js";

const router = Router();

router.post("/jwt", issueJWT);
router.post("/logout", logoutJWT);

export default router;
