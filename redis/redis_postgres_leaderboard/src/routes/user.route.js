import express from "express";
import {
  viewUser,
  getUserInfo,
  getTopViewers,
  getUniqueUsers,
  resetWeekly,
  getTotalViews
} from "../controllers/user.controller.js";
import { authenticateJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/view", authenticateJWT, viewUser);
router.get("/user/:username", getUserInfo);
router.get("/top-viewers", getTopViewers);
router.get("/unique-users", getUniqueUsers);
router.get("/reset-weekly", resetWeekly);
router.get("/total-views", getTotalViews);

export default router;