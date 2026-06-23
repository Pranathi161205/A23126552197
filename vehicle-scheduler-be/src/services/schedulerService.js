import axios from "axios";
import dotenv from "dotenv";
import findBestTasks from "../utils/knapsack.js";
import { Log } from "../../../logging-middleware/logger.js";

dotenv.config();

const DEPOT_API =
  "http://4.224.186.213/evaluation-service/depots";

const VEHICLE_API =
  "http://4.224.186.213/evaluation-service/vehicles";

export const getSchedule = async (req, res) => {
  try {
    const headers = {
      Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
    };

    Log(
  "backend",
  "info",
  "service",
  "Fetching depot data"
).catch(() => {});

    const depotResponse = await axios.get(DEPOT_API, { headers });

    Log(
  "backend",
  "info",
  "service",
  "Fetching depot data"
).catch(() => {});

    Log(
  "backend",
  "info",
  "service",
  "Fetching vehicle data"
).catch(() => {});
    const vehicleResponse = await axios.get(VEHICLE_API, { headers });

    Log(
  "backend",
  "info",
  "service",
  "Fetching vehicle data success "
).catch(() => {});

    const depots = depotResponse.data.depots;
    const vehicles = vehicleResponse.data.vehicles;

     Log(
      "backend",
      "debug",
      "service",
      `Processing ${depots.length} depots`
    );

    const schedules = [];

    for (const depot of depots) {
      const result = findBestTasks(
        vehicles,
        depot.MechanicHours
      );

      schedules.push({
  depotId: depot.ID,
  mechanicHours: depot.MechanicHours,
  totalImpact: result.totalImpact,
  selectedTaskCount: result.tasks.length,
  taskIds: result.tasks.map(task => task.TaskID),
});
    }

     Log(
      "backend",
      "info",
      "service",
      "Schedule generation completed"
    );

    res.status(200).json({
      success: true,
      schedules,
    });
  } catch (err) {
     Log(
      "backend",
      "error",
      "service",
      err.message
    );

    console.error(err.response?.data || err.message);

    res.status(500).json({
      success: false,
      error: err.response?.data || err.message,
    });
  }
};