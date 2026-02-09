import express from "express";
import cors from "cors";
import processRoute from "./routes/process.js";
import analyticsRoute from "./routes/analytics.js";
import agentRoute from "./routes/agent.js";
import agentUploadRoute from "./routes/agentUpload.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/process", processRoute);
app.use("/api/analytics/manager", analyticsRoute);
app.use("/api/agent", agentRoute);
app.use("/api", agentUploadRoute);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(5000, () => {
  console.log("Backend running on port 5000");
});
