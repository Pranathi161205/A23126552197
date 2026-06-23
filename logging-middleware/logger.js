import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
const LOG_API = "http://4.224.186.213/evaluation-service/logs";
const validStacks = ["backend", "frontend"];
const validLevels = ["debug", "info", "warn", "error", "fatal"];
export async function Log(stack, level, packageName, message) {
  try {
    // Validation
    if (!validStacks.includes(stack)) {
      throw new Error(`Invalid stack: ${stack}`);
    }
    if (!validLevels.includes(level)) {
      throw new Error(`Invalid level: ${level}`);
    }
    const response = await axios.post(
      LOG_API,
      {
        stack,
        level,
        package: packageName,
        message,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log("STATUS:", error.response?.status);
    console.log("DATA:", error.response?.data);
    console.log("ERROR:", error.message);
    return null;
  }
}