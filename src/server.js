const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const analyzeImageRouter = require("./routes/analyzeImage");

// Load environment variables from .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "AI Image Analysis Sample API is running",
    timestamp: new Date().toISOString(),
  });
});

// Feature route
app.use("/analyze-image", analyzeImageRouter);

// Global 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});