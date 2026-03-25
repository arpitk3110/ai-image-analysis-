function formatAzureVisionResult(azureResult) {
  const MIN_TAG_CONFIDENCE = 0.7;
  const MIN_OBJECT_CONFIDENCE = 0.5;
  const MAX_TAGS = 5;
  const MAX_OBJECTS = 5;

  const tags =
    (azureResult?.tagsResult?.values || [])
      .filter((tag) => tag.confidence >= MIN_TAG_CONFIDENCE)
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, MAX_TAGS)
      .map((tag) => ({
        name: tag.name,
        confidence: Number(tag.confidence.toFixed(3)),
      })) || [];

  const objects =
    (azureResult?.objectsResult?.values || [])
      .map((obj) => ({
        name: obj.tags?.[0]?.name || "unknown",
        confidence: obj.tags?.[0]?.confidence || 0,
        boundingBox: obj.boundingBox || null,
      }))
      .filter((obj) => obj.confidence >= MIN_OBJECT_CONFIDENCE)
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, MAX_OBJECTS)
      .map((obj) => ({
        name: obj.name,
        confidence: Number(obj.confidence.toFixed(3)),
        boundingBox: obj.boundingBox,
      })) || [];

  const ocrText =
    azureResult?.readResult?.blocks
      ?.flatMap((block) => block.lines || [])
      ?.map((line) => line.text)
      ?.join(" ")
      ?.trim() || "";

  const summaryParts = [];

  if (tags.length > 0) {
    summaryParts.push(`Top tags: ${tags.map((t) => t.name).join(", ")}`);
  }

  if (objects.length > 0) {
    summaryParts.push(`Detected objects: ${objects.map((o) => o.name).join(", ")}`);
  }

  if (ocrText) {
    summaryParts.push("Text was detected in the image.");
  }

  return {
    summary: summaryParts.length > 0
      ? summaryParts.join(" | ")
      : "Image analyzed successfully, but no strong features were detected.",
    detectedTags: tags,
    detectedObjects: objects,
    ocrText,
  };
}

module.exports = {
  formatAzureVisionResult,
};