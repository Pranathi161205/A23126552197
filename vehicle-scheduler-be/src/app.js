import express from "express";
import schedulerRoutes from "./routes/schedulerRoutes.js";
const app = express();
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Vehicle Scheduler API");
});
app.use("/api", schedulerRoutes);
app.listen(3000, () => {
  console.log("Server started");
});