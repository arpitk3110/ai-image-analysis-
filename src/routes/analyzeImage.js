const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload"); // multer setup
const { analyzeImageWithAzure } = require("../services/azureVision");
const { formatAzureVisionResult } = require("../utils/formatResult");
const { generateEmergencyAssessment } = require("../utils/emergencyAssessment");

router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: "error",
        message: "No image file uploaded.",
      });
    }

    const filePath = req.file.path;

    const azureResult = await analyzeImageWithAzure(filePath);

    const formattedResult = formatAzureVisionResult(azureResult);

    const emergencyAssessment = generateEmergencyAssessment(formattedResult);

    return res.status(200).json({
      status: "success",
      message: "Image analyzed successfully.",
      fileName: req.file.filename,
      ...formattedResult,
      emergencyAssessment,
    });
  } catch (error) {
    console.error("Error:", error);

    return res.status(500).json({
      status: "error",
      message: "Image analysis failed.",
      details: error.message,
    });
  }
});

module.exports = router;
