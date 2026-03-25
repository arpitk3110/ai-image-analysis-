function generateHealthAssessment({ detectedTags, detectedObjects, ocrText }) {
  const tagNames = detectedTags.map((tag) => tag.name.toLowerCase());
  const objectNames = detectedObjects.map((obj) => obj.name.toLowerCase());
  const combinedFindings = [...new Set([...tagNames, ...objectNames])];

  let category = "general image review";
  let severity = "low";
  let recommendedAction = "No urgent visual concern detected. Review manually if symptoms are present.";
  let confidenceLevel = "low";

  // Simple keyword-based interpretation rules
  const hasPerson = combinedFindings.includes("person");
  const hasWheelchair = combinedFindings.includes("wheelchair");
  const hasMedicalText = ocrText && ocrText.length > 0;

  const injuryKeywords = ["bandage", "wound", "injury", "bleeding", "bruise", "burn"];
  const skinKeywords = ["rash", "redness", "skin", "lesion", "swelling"];
  const emergencyContextKeywords = ["hospital", "wheelchair", "medical equipment", "ambulance"];

  const hasInjurySignal = combinedFindings.some((item) => injuryKeywords.includes(item));
  const hasSkinSignal = combinedFindings.some((item) => skinKeywords.includes(item));
  const hasEmergencyContext = combinedFindings.some((item) => emergencyContextKeywords.includes(item));

  if (hasInjurySignal) {
    category = "possible visible injury";
    severity = "medium";
    recommendedAction = "Visible injury-related indicators detected. Seek operator or medical review.";
    confidenceLevel = "moderate";
  }

  if (hasSkinSignal) {
    category = "possible skin-related abnormality";
    severity = "medium";
    recommendedAction = "Visible skin-related features detected. Consider medical review if symptoms persist or worsen.";
    confidenceLevel = "moderate";
  }

  if (hasEmergencyContext && hasPerson) {
    category = "possible emergency support context";
    severity = "medium";
    recommendedAction = "Emergency-related visual context detected. Review image with additional patient information.";
    confidenceLevel = "moderate";
  }

  if (hasWheelchair) {
    category = "mobility assistance context detected";
    severity = "medium";
    recommendedAction = "Mobility-related context identified. Check patient condition and surrounding circumstances.";
    confidenceLevel = "moderate";
  }

  if (hasMedicalText) {
    confidenceLevel = confidenceLevel === "low" ? "moderate" : confidenceLevel;
  }

  return {
    category,
    severity,
    recommendedAction,
    confidenceLevel,
    visibleFindings: combinedFindings,
    disclaimer: "This result is decision-support only and not a medical diagnosis.",
  };
}

module.exports = {
  generateHealthAssessment,
};