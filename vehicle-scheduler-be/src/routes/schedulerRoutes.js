import express from "express";
import { getSchedule } from "../services/schedulerService.js";
const router = express.Router();
router.get("/schedule", getSchedule);
export default router;