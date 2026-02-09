import express from "express";
import multer from "multer";
import { transcribeAudio } from "./stt.controller.js";

const router = express.Router();

const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 25 * 1024 * 1024 } // 25MB
});

router.post("/transcribe", upload.single("audio"), transcribeAudio);

export default router;
