import axios from "axios";
import dotenv from "dotenv";
import findBestTasks from "../utils/knapsack.js";

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

    const depotResponse = await axios.get(DEPOT_API, { headers });
    const vehicleResponse = await axios.get(VEHICLE_API, { headers });

    const depots = depotResponse.data.depots;
    const vehicles = vehicleResponse.data.vehicles;

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
        selectedTasks: result.tasks,
      });
    }

    res.status(200).json({
      success: true,
      schedules,
    });
  } catch (err) {
    console.error(err.response?.data || err.message);

    res.status(500).json({
      success: false,
      error: err.response?.data || err.message,
    });
  }
};