const axios = require("axios");
require("dotenv").config();

const endpoint = process.env.AZURE_VISION_ENDPOINT;
const apiKey = process.env.AZURE_VISION_KEY;

async function analyzeImageWithAzure(imagePath) {
  const fs = require("fs");
  const imageData = fs.readFileSync(imagePath);

  const url = `${endpoint}/computervision/imageanalysis:analyze?api-version=2024-02-01&features=tags,objects,read`;




  try {
    const response = await axios.post(url, imageData, {
      headers: {
        "Ocp-Apim-Subscription-Key": apiKey,
        "Content-Type": "application/octet-stream",
      },
    });

    return response.data;
  } catch (error) {
    const details =
      error.response?.data
        ? JSON.stringify(error.response.data)
        : error.message;

    throw new Error(`Azure API error: ${details}`);
  }

}

module.exports = {
  analyzeImageWithAzure,
};