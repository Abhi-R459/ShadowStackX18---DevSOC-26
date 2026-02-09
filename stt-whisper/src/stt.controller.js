import fs from "fs";
import Groq from "groq-sdk";

export const transcribeAudio = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Audio file missing" });
    }

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY
    });

    // Convert file to Web File object (Groq expects this)
    const buffer = fs.readFileSync(req.file.path);
    const file = new File([buffer], req.file.originalname, {
      type: req.file.mimetype
    });

    const response = await groq.audio.transcriptions.create({
      file,
      model: "whisper-large-v3"
    });

    fs.unlinkSync(req.file.path);

    res.json({
      success: true,
      text: response.text
    });
  } catch (err) {
    console.error("STT error:", err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};