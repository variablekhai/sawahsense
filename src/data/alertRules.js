// Alert thresholds and rules engine
// Returns computed alerts from field + time series data

export const ALERT_RULES = [
  {
    id: "EVI_DROP",
    level: "critical",
    check: (field) => {
      const ts = field.timeSeries;
      if (!ts || ts.length < 6) return null;
      const recent = ts.slice(-5).map((p) => p.evi);
      const prev = ts.slice(-8, -5).map((p) => p.evi);
      const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
      const prevAvg = prev.reduce((a, b) => a + b, 0) / prev.length;
      const dropPct = ((prevAvg - recentAvg) / prevAvg) * 100;
      if (dropPct > 15) {
        return {
          type: "EVI_DROP",
          level: "critical",
          percentDrop: Math.round(dropPct),
          message_ms: `EVI menurun ${Math.round(dropPct)}% — mungkin ada serangan atau kekurangan baja`,
          message_en: `EVI dropped ${Math.round(dropPct)}% — possible pest attack or fertilizer deficiency`,
        };
      }
      return null;
    },
  },
  {
    id: "NDVI_LOW_HEADING",
    level: "critical",
    check: (field) => {
      const { getCurrentStage } = require("./stageDefinitions");
      const { stage } = getCurrentStage(field.transplantingDate);
      if (stage.id === "heading" && field.latestIndices.ndvi < 0.4) {
        return {
          type: "NDVI_LOW_HEADING",
          level: "critical",
          message_ms:
            "NDVI terlalu rendah semasa pembungaan — hasil mungkin terjejas",
          message_en:
            "NDVI critically low during heading — yield may be affected",
        };
      }
      return null;
    },
  },
  {
    id: "LSWI_DROP",
    level: "warning",
    check: (field) => {
      const ts = field.timeSeries;
      if (!ts || ts.length < 5) return null;
      const recent = ts.slice(-3).map((p) => p.lswi);
      const prev = ts.slice(-7, -4).map((p) => p.lswi);
      const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
      const prevAvg = prev.reduce((a, b) => a + b, 0) / prev.length;
      const dropPct = ((prevAvg - recentAvg) / prevAvg) * 100;
      if (dropPct > 20 || field.latestIndices.lswi < 0.25) {
        return {
          type: "LSWI_LOW",
          level: "warning",
          message_ms: "Paras air ladang menurun — semak saluran irigasi",
          message_en: "Field water level dropping — check irrigation channel",
        };
      }
      return null;
    },
  },
  {
    id: "EVI_BELOW_STAGE_AVG",
    level: "warning",
    check: (field) => {
      if (field.latestIndices.evi < 0.45 && field.alertLevel !== "critical") {
        return {
          type: "EVI_BELOW_STAGE",
          level: "warning",
          message_ms: "Pertumbuhan lebih perlahan dari jangkaan musim ini",
          message_en: "Growth slower than expected for this season",
        };
      }
      return null;
    },
  },
  {
    id: "CLOUD_GAP",
    level: "info",
    check: (field) => {
      const ts = field.timeSeries;
      if (!ts) return null;
      const recentCloudy = ts.slice(-4).filter((p) => p.cloudPct > 40).length;
      if (recentCloudy >= 3) {
        return {
          type: "CLOUD_GAP",
          level: "info",
          days: recentCloudy * 6,
          message_ms: `Tiada data satelit baru — cuaca mendung ${recentCloudy * 6} hari`,
          message_en: `No new satellite data — cloudy weather for ${recentCloudy * 6} days`,
        };
      }
      return null;
    },
  },
];

/**
 * Compute alerts for a field given its demo data
 * In production this would use live GEE indices
 */
export const computeAlerts = (field) => {
  const alerts = [];
  for (const rule of ALERT_RULES) {
    // Use pre-defined alert from demoFields if available for consistency
    if (field.activeAlert && field.activeAlert.type === rule.id) {
      alerts.push({
        ...field.activeAlert,
        level: rule.level,
        timestamp: new Date(Date.now() - 86400 * 1000).toISOString(), // "yesterday"
        fieldId: field.id,
        fieldName: field.name,
      });
    }
  }
  return alerts;
};

export const getAllAlerts = (fields) => {
  const all = [];
  for (const field of fields) {
    const fieldAlerts = computeAlerts(field);
    all.push(...fieldAlerts);
  }
  // Sort: critical first, then warning, then info
  const levelOrder = { critical: 0, warning: 1, info: 2 };
  return all.sort((a, b) => levelOrder[a.level] - levelOrder[b.level]);
};
