import express from "express";
import { getSchedule } from "../services/schedulerService.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    status: "running"
  });
});

router.get("/schedule", getSchedule);

export default router;