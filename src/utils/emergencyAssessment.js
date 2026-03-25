function generateEmergencyAssessment({ detectedTags, detectedObjects, ocrText }) {
  const tagNames = detectedTags.map((tag) => tag.name.toLowerCase());
  const objectNames = detectedObjects.map((obj) => obj.name.toLowerCase());
  const findings = [...new Set([...tagNames, ...objectNames])];

  const fireSignals = ["fire", "flame", "smoke", "burning"];
  const injurySignals = ["wound", "injury", "burn", "bleeding", "bruise", "bandage"];
  const skinSignals = ["skin", "rash", "swelling", "redness", "lesion", "irritation"];
  const trafficSignals = ["car", "vehicle", "truck", "bus", "road", "traffic", "accident"];
  const policeSignals = ["weapon", "gun", "knife", "violence", "threat", "fight"];

  let category = "Unclear / Manual Review";
  let severity = "Low";
  let recommendedUnit = "Operator Review Required";
  let recommendedAction = "No clear emergency category detected. Manual operator review is recommended.";
  let confidenceLevel = "low";
  let reasoning = "The current image findings do not strongly match a supported emergency category.";

  const hasSignal = (signals) => findings.some((item) => signals.includes(item));

  if (hasSignal(fireSignals)) {
    category = "Fire";
    severity = "High";
    recommendedUnit = "Fire Truck";
    recommendedAction = "Dispatch fire services immediately and escalate for manual operator review.";
    confidenceLevel = "moderate";
    reasoning = "Fire-related visual signals were detected in the image.";
  } else if (hasSignal(injurySignals)) {
    category = "Medical Injury";
    severity = "Medium";
    recommendedUnit = "Ambulance";
    recommendedAction = "Dispatch ambulance services and assess the visible injury further.";
    confidenceLevel = "moderate";
    reasoning = "Visible injury-related signals were detected in the image.";
  } else if (hasSignal(skinSignals)) {
    category = "Medical Skin Issue";
    severity = "Medium";
    recommendedUnit = "Ambulance";
    recommendedAction = "Request medical review and dispatch ambulance support if symptoms appear urgent.";
    confidenceLevel = "moderate";
    reasoning = "Skin-related abnormality signals were detected in the image.";
  } else if (hasSignal(trafficSignals)) {
    category = "Traffic / Accident";
    severity = "High";
    recommendedUnit = "Ambulance + Police";
    recommendedAction = "Dispatch ambulance and police units to assess the accident scene.";
    confidenceLevel = "moderate";
    reasoning = "Traffic or accident-related visual signals were detected in the image.";
  } else if (hasSignal(policeSignals)) {
    category = "Police / Public Safety";
    severity = "High";
    recommendedUnit = "Police";
    recommendedAction = "Dispatch police and escalate the case for public safety review.";
    confidenceLevel = "moderate";
    reasoning = "Public safety or threat-related visual signals were detected in the image.";
  }

  if (ocrText && ocrText.trim().length > 0 && confidenceLevel === "low") {
    confidenceLevel = "moderate";
  }

  return {
    category,
    severity,
    recommendedUnit,
    recommendedAction,
    confidenceLevel,
    reasoning,
    visibleFindings: findings,
    disclaimer: "This result is decision-support only and not a final emergency diagnosis."
  };
}

module.exports = {
  generateEmergencyAssessment,
};