import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sttRoutes from "./stt.routes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/stt", sttRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`STT backend running on port ${PORT}`);
});

console.log("GROQ_API_KEY loaded:", !!process.env.GROQ_API_KEY);
