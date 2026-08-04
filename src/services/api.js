// -------------------------------------------------------------
// API service layer.
// TwinVerse Backend Integration
// -------------------------------------------------------------

import {
  liveStats,
  predictions,
  decisions,
  recommendations,
  trendSeries,
  trendDay,
  seatMap,
  devices,
  alerts,
  weather,
  historyRows,
  dailySeries,
  weeklySeries,
  monthlySeries,
  heatmap,
  heatmapHours,
} from "@/data/mockData";

export const BASE_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:8000";

/** Simulated network latency */
const delay = (ms = 450) =>
  new Promise((resolve) => setTimeout(resolve, ms));


// ==========================================================
// DASHBOARD
// ==========================================================
export async function getDashboard() {
  try {
    const response = await fetch(
      `${BASE_URL}/api/analytics/dashboard`,
      {
        headers: {
          Accept: "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Dashboard request failed with status ${response.status}`
      );
    }

    const payload = await response.json();

    const normalized =
      payload?.dashboard ??
      payload?.data ??
      payload?.result ??
      payload?.analytics ??
      payload;

    const mapped = {
      // Section 1 - Live Environment
      liveStats: {
        outdoorTemperature: normalized.weather?.temperature ?? liveStats.outdoorTemperature,
        outdoorHumidity: normalized.weather?.humidity ?? liveStats.outdoorHumidity,
        peopleCount: normalized.occupancy?.people_count ?? liveStats.peopleCount,
        outdoorTempTrend: normalized.ai_analytics?.temperature_trend?.trend ?? liveStats.outdoorTempTrend,
        room: normalized.occupancy?.room ?? liveStats.room,
      },

      // Section 2 - AI Prediction Engine
      predictions: {
        predictedIndoorTemp: normalized.predictions?.indoor_temperature ?? predictions.predictedIndoorTemp,
        predictedIndoorHumidity: normalized.predictions?.indoor_humidity ?? predictions.predictedIndoorHumidity,
        predictedComfortScore: normalized.predictions?.comfort_score ?? predictions.predictedComfortScore,
        predictedLearningQuality: normalized.predictions?.learning_quality ?? predictions.predictedLearningQuality,
        predictedCoolingDemand: normalized.predictions?.cooling_demand ?? predictions.predictedCoolingDemand,
      },

      // Section 3 - AI Decision Engine
      decisions: {
        tempTrend: normalized.ai_analytics?.temperature_trend?.trend ?? decisions.tempTrend,
        highOccupancy: normalized.ai_analytics?.occupancy?.status ?? decisions.highOccupancy,
        energyWaste: Array.isArray(normalized.energy_recommendations)
          ? normalized.energy_recommendations[0]
          : decisions.energyWaste,
        alertSeverity: normalized.ai_analytics?.alert?.severity ?? decisions.alertSeverity,
        overallRoomStatus: Array.isArray(normalized.alerts)
          ? normalized.alerts[0]
          : decisions.overallRoomStatus,
      },

      // Section 4 - Recommendations (Single recommendation)
      recommendations: {
        message: Array.isArray(normalized.energy_recommendations)
          ? normalized.energy_recommendations[0]
          : recommendations.coolingDemand,
      },

      // Section 4 - Alerts
      alerts: Array.isArray(normalized.alerts)
        ? normalized.alerts.map((msg, index) => ({
            id: index + 1,
            title: "System Alert",
            message: msg,
            severity: normalized.ai_analytics?.alert?.severity ?? "info",
          }))
        : alerts,

      seatMap: normalized.seatMap ?? seatMap,
      trendSeries: normalized.trendSeries ?? trendSeries,
      trendDay: normalized.trendDay ?? trendDay,
      devices: normalized.devices ?? devices,
    };

    return mapped;
  } catch (error) {
    console.error(
      "Failed to load dashboard data. Falling back to mock data.",
      error
    );
  }

  return {
    liveStats,
    predictions,
    decisions,
    recommendations: {
      message: Array.isArray(recommendations) ? recommendations[0] : "Energy saving mode recommended.",
    },
    trendSeries,
    trendDay,
    seatMap,
    alerts,
    devices,
  };
}


// ==========================================================
// ANALYTICS
// ==========================================================
export async function getAnalytics() {
  await delay();

  return {
    dailySeries,
    weeklySeries,
    monthlySeries,
    heatmap,
    heatmapHours,
  };
}


// ==========================================================
// DEVICES
// ==========================================================
export async function getDevices() {
  await delay();

  return {
    devices,
  };
}


// ==========================================================
// ALERTS
// ==========================================================
export async function getAlerts() {
  await delay();

  return {
    alerts,
  };
}


// ==========================================================
// HISTORY
// ==========================================================
export async function getHistory() {
  try {
    const response = await fetch(`${BASE_URL}/api/analytics/history`, {
      headers: {
        Accept: "application/json",
        "ngrok-skip-browser-warning": "true",
      },
    });

    if (!response.ok) {
      throw new Error(`History request failed with status ${response.status}`);
    }

    const payload = await response.json();
    const rawArray = payload && typeof payload === "object" ? Object.values(payload) : [];

    // Sort by timestamp in ascending order (oldest -> newest)
    const sorted = rawArray.sort(
      (a, b) => new Date(a.timestamp || 0) - new Date(b.timestamp || 0)
    );

    return { records: sorted };
  } catch (error) {
    console.error("Failed to load history data", error);
    throw error;
  }
}


// ==========================================================
// ENVIRONMENT
// ==========================================================
export async function getEnvironment() {
  await delay();

  return {
    weather,
    indoor: liveStats,
  };
}