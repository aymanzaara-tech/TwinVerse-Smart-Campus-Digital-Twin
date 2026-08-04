import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Thermometer, Droplets, Users, Sparkles, Brain, Smile,
  Wind, AlertTriangle, RefreshCw, Cpu, ShieldAlert,
  Zap, Filter, BarChart3, TrendingUp,
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, LineChart, Line,
  XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";

import PageHeader from "@/components/ui/PageHeader";
import StatCard from "@/components/StatCard";
import { getHistory } from "@/services/api";

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

/** Custom Dark Glassmorphism Tooltip */
function CustomTooltip({ active, payload, label, unit = "" }) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-line bg-sidebar/95 p-3 shadow-2xl backdrop-blur-md">
        <p className="text-[11px] font-semibold text-ink-faint">{label}</p>
        <p className="mt-1 text-xs font-bold text-accent">
          {payload[0].name}: {payload[0].value} {unit}
        </p>
      </div>
    );
  }
  return null;
}

/** Severity Badge Component */
function SeverityBadge({ severity }) {
  if (!severity) return <span className="text-xs text-ink-faint">Not Available</span>;

  const cleanText = String(severity)
    .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "")
    .trim()
    .toUpperCase();

  let style = "border-line bg-white/5 text-ink-dim";

  if (cleanText.includes("LOW") || cleanText.includes("GREEN")) {
    style = "border-ok/30 bg-ok/10 text-ok";
  } else if (cleanText.includes("MEDIUM") || cleanText.includes("MED") || cleanText.includes("YELLOW")) {
    style = "border-amber-500/30 bg-amber-500/10 text-amber-400";
  } else if (cleanText.includes("HIGH") || cleanText.includes("ORANGE")) {
    style = "border-orange-500/30 bg-orange-500/10 text-orange-400";
  } else if (cleanText.includes("CRITICAL") || cleanText.includes("CRIT") || cleanText.includes("RED")) {
    style = "border-crit/30 bg-crit/10 text-crit";
  }

  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold ${style}`}>
      {cleanText || "UNKNOWN"}
    </span>
  );
}

export default function Analytics() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeframe, setTimeframe] = useState("all"); // 'all' | '24h' | '7d' | '30d'

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const data = await getHistory();
      setRecords(data.records || []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Unable to load analytics data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  // Filter records based on timeframe
  const filteredRecords = useMemo(() => {
    if (!records.length) return [];
    if (timeframe === "all") return records;

    const now = new Date().getTime();
    const timeLimit =
      timeframe === "24h"
        ? 24 * 60 * 60 * 1000
        : timeframe === "7d"
        ? 7 * 24 * 60 * 60 * 1000
        : 30 * 24 * 60 * 60 * 1000;

    return records.filter((r) => {
      if (!r.timestamp) return true;
      const itemTime = new Date(r.timestamp).getTime();
      return now - itemTime <= timeLimit;
    });
  }, [records, timeframe]);

  // Latest record for KPIs
  const latestRecord = useMemo(() => {
    if (!filteredRecords.length) return null;
    return filteredRecords[filteredRecords.length - 1];
  }, [filteredRecords]);

  // Calculated Overview KPIs
  const kpis = useMemo(() => {
    if (!filteredRecords.length) {
      return {
        avgTemp: "--",
        avgHumidity: "--",
        occupancy: "--",
        comfortScore: "--",
        learningQuality: "--",
        coolingDemand: "--",
      };
    }

    const tempSum = filteredRecords.reduce((acc, r) => acc + (r.weather?.temperature || 0), 0);
    const humSum = filteredRecords.reduce((acc, r) => acc + (r.weather?.humidity || 0), 0);

    const avgT = (tempSum / filteredRecords.length).toFixed(1);
    const avgH = (humSum / filteredRecords.length).toFixed(1);

    const lat = filteredRecords[filteredRecords.length - 1];

    return {
      avgTemp: avgT,
      avgHumidity: avgH,
      occupancy: lat.occupancy?.people_count ?? "--",
      comfortScore: lat.predictions?.comfort_score ?? "--",
      learningQuality: lat.predictions?.learning_quality ?? "--",
      coolingDemand: lat.predictions?.cooling_demand ?? "--",
    };
  }, [filteredRecords]);

  // Format chart data for Recharts matching exact keys
  const chartData = useMemo(() => {
    const mapped = filteredRecords.map((r, i) => {
      let timeLabel = `T${i + 1}`;
      if (r.timestamp) {
        try {
          timeLabel = new Date(r.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        } catch (e) {
          timeLabel = String(r.timestamp);
        }
      }

      return {
        time: timeLabel,
        temperature: r.weather?.temperature ?? 0,
        humidity: r.weather?.humidity ?? 0,
        occupancy: r.occupancy?.people_count ?? 0,
        comfortScore: r.predictions?.comfort_score ?? 0,
        learningQuality: r.predictions?.learning_quality ?? 0,
        coolingDemand: r.predictions?.cooling_demand ?? 0,
        indoorTemperature: r.predictions?.indoor_temperature ?? 0,
        indoorHumidity: r.predictions?.indoor_humidity ?? 0,
      };
    });

    console.log("[Chart Data]", mapped);
    return mapped;
  }, [filteredRecords]);

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Analytics & Trends" subtitle="ML Predictions & Environmental Analytics" />
        <div className="flex h-64 items-center justify-center rounded-2xl border border-line bg-card p-6 text-sm text-ink-faint">
          <div className="flex items-center gap-3">
            <RefreshCw className="h-5 w-5 animate-spin text-accent" />
            Loading analytics data…
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Analytics & Trends" subtitle="ML Predictions & Environmental Analytics" />
        <div className="card flex flex-col items-center justify-center p-12 text-center space-y-4">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-crit/10 text-crit">
            <AlertTriangle size={24} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-ink">Unable to load analytics data.</h3>
            <p className="mt-1 text-xs text-ink-faint">{error}</p>
          </div>
          <button
            onClick={loadData}
            className="flex items-center gap-2 rounded-xl bg-accent px-4 py-2 text-xs font-semibold text-white shadow-lg transition hover:bg-accent/90"
          >
            <RefreshCw size={14} /> Retry
          </button>
        </div>
      </div>
    );
  }

  const ai = latestRecord?.ai_analytics;
  const latestRec = Array.isArray(latestRecord?.energy_recommendations)
    ? latestRecord.energy_recommendations[0]
    : latestRecord?.energy_recommendations || "--";
  const latestAlertMsg = Array.isArray(latestRecord?.alerts)
    ? latestRecord.alerts[0]
    : latestRecord?.alerts || "--";

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Analytics & Trends"
        subtitle="Visualizing historical sensor data, ML predictions, and AI model performance"
      >
        <div className="flex flex-wrap items-center gap-3">
          {/* Timeframe Filter Bar */}
          <div className="flex items-center gap-1 rounded-xl border border-line bg-white/[0.03] p-1 text-xs font-medium">
            <Filter size={14} className="ml-2 text-ink-faint" />
            {[
              { id: "all", label: "All Records" },
              { id: "24h", label: "Last 24h" },
              { id: "7d", label: "Last 7 Days" },
              { id: "30d", label: "Last 30 Days" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setTimeframe(tab.id)}
                className={`rounded-lg px-2.5 py-1 transition ${
                  timeframe === tab.id
                    ? "bg-accent text-white font-semibold shadow"
                    : "text-ink-dim hover:text-ink hover:bg-white/5"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            onClick={loadData}
            className="flex items-center gap-2 rounded-xl border border-line bg-white/[0.03] px-3.5 py-2 text-xs font-medium text-ink transition hover:bg-white/[0.06]"
          >
            <RefreshCw size={14} className="text-accent" /> Refresh
          </button>
        </div>
      </PageHeader>

      <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
        {/* ============================================================== */}
        {/* SECTION 1: ANALYTICS OVERVIEW (6 KPI CARDS)                    */}
        {/* ============================================================== */}
        <section className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-ink-faint">
            Section 1 · Analytics Overview
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            <StatCard
              icon={Thermometer}
              label="Avg Outdoor Temp"
              value={kpis.avgTemp}
              unit="°C"
              subtitle="Filtered Average"
              color="#38bdf8"
            />
            <StatCard
              icon={Droplets}
              label="Avg Outdoor Humidity"
              value={kpis.avgHumidity}
              unit="%"
              subtitle="Filtered Average"
              color="#06b6d4"
            />
            <StatCard
              icon={Users}
              label="Latest Occupancy"
              value={kpis.occupancy}
              unit="people"
              subtitle="Latest Record"
              color="#a78bfa"
            />
            <StatCard
              icon={Smile}
              label="Latest Comfort Score"
              value={kpis.comfortScore}
              unit="/100"
              subtitle="ML Prediction"
              color="#34d399"
            />
            <StatCard
              icon={Brain}
              label="Latest Learning Quality"
              value={kpis.learningQuality}
              unit="/100"
              subtitle="ML Prediction"
              color="#a78bfa"
            />
            <StatCard
              icon={Wind}
              label="Latest Cooling Demand"
              value={kpis.coolingDemand}
              unit=""
              subtitle="ML Prediction"
              color="#fbbf24"
            />
          </div>
        </section>

        {/* ============================================================== */}
        {/* SECTION 2: WEATHER ANALYTICS                                   */}
        {/* ============================================================== */}
        <section className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-ink-faint">
            Section 2 · Weather Analytics
          </h2>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {/* Outdoor Temp vs Time */}
            <div className="card p-5">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-sky-500/15 text-sky-400">
                    <Thermometer size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-ink">Outdoor Temperature vs Time</h3>
                    <p className="text-[11px] text-ink-faint">Historical temperature trends (°C)</p>
                  </div>
                </div>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={11} tickLine={false} unit="°C" />
                    <Tooltip content={<CustomTooltip unit="°C" />} />
                    <Area type="monotone" dataKey="temperature" name="Temperature" stroke="#38bdf8" strokeWidth={2.5} fillOpacity={1} fill="url(#colorTemp)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Outdoor Humidity vs Time */}
            <div className="card p-5">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-cyan-500/15 text-cyan-400">
                    <Droplets size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-ink">Outdoor Humidity vs Time</h3>
                    <p className="text-[11px] text-ink-faint">Historical humidity trends (%)</p>
                  </div>
                </div>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorHum" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={11} tickLine={false} unit="%" />
                    <Tooltip content={<CustomTooltip unit="%" />} />
                    <Area type="monotone" dataKey="humidity" name="Humidity" stroke="#06b6d4" strokeWidth={2.5} fillOpacity={1} fill="url(#colorHum)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* SECTION 3: OCCUPANCY ANALYTICS                                 */}
        {/* ============================================================== */}
        <section className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-ink-faint">
            Section 3 · Occupancy Analytics
          </h2>
          <div className="card p-5">
            <div className="mb-4 flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-purple-500/15 text-purple-400">
                <Users size={18} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-ink">People Count vs Time</h3>
                <p className="text-[11px] text-ink-faint">Occupancy variation over time</p>
              </div>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPeople" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#a78bfa" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                  <Tooltip content={<CustomTooltip unit="people" />} />
                  <Area type="monotone" dataKey="occupancy" name="Occupancy" stroke="#a78bfa" strokeWidth={2.5} fillOpacity={1} fill="url(#colorPeople)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* SECTION 4: ML PREDICTION ANALYTICS                             */}
        {/* ============================================================== */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-accent" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-ink-faint">
              Section 4 · ML Prediction Analytics
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Indoor Temp vs Time */}
            <div className="card p-4">
              <div className="mb-2 flex items-center gap-2">
                <Thermometer size={16} className="text-sky-400" />
                <span className="text-xs font-medium text-ink">Indoor Temp vs Time</span>
              </div>
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height={170}>
                  <LineChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={10} tickLine={false} unit="°C" />
                    <Tooltip content={<CustomTooltip unit="°C" />} />
                    <Line type="monotone" dataKey="indoorTemperature" name="Indoor Temp" stroke="#38bdf8" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Indoor Humidity vs Time */}
            <div className="card p-4">
              <div className="mb-2 flex items-center gap-2">
                <Droplets size={16} className="text-cyan-400" />
                <span className="text-xs font-medium text-ink">Indoor Humidity vs Time</span>
              </div>
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height={170}>
                  <LineChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={10} tickLine={false} unit="%" />
                    <Tooltip content={<CustomTooltip unit="%" />} />
                    <Line type="monotone" dataKey="indoorHumidity" name="Indoor Humidity" stroke="#06b6d4" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Comfort Score vs Time */}
            <div className="card p-4">
              <div className="mb-2 flex items-center gap-2">
                <Smile size={16} className="text-emerald-400" />
                <span className="text-xs font-medium text-ink">Comfort Score vs Time</span>
              </div>
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height={170}>
                  <LineChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                    <Tooltip content={<CustomTooltip unit="/100" />} />
                    <Line type="monotone" dataKey="comfortScore" name="Comfort Score" stroke="#34d399" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Learning Quality vs Time */}
            <div className="card p-4">
              <div className="mb-2 flex items-center gap-2">
                <Brain size={16} className="text-purple-400" />
                <span className="text-xs font-medium text-ink">Learning Quality vs Time</span>
              </div>
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height={170}>
                  <LineChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                    <Tooltip content={<CustomTooltip unit="/100" />} />
                    <Line type="monotone" dataKey="learningQuality" name="Learning Quality" stroke="#a78bfa" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Cooling Demand vs Time */}
            <div className="card p-4 sm:col-span-2 lg:col-span-1">
              <div className="mb-2 flex items-center gap-2">
                <Wind size={16} className="text-amber-400" />
                <span className="text-xs font-medium text-ink">Cooling Demand vs Time</span>
              </div>
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height={170}>
                  <LineChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="coolingDemand" name="Cooling Demand" stroke="#fbbf24" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* SECTION 5: AI ANALYTICS INSIGHTS                               */}
        {/* ============================================================== */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <Cpu size={16} className="text-accent" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-ink-faint">
              Section 5 · AI Analytics Insights
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Temperature Trend */}
            <div className="card p-4">
              <div className="flex items-center gap-2 text-xs font-medium text-ink-faint">
                <TrendingUp size={15} className="text-sky-400" />
                <span>Temperature Trend</span>
              </div>
              <div className="mt-2 text-sm font-mono font-semibold text-ink">
                {ai?.temperature_trend ? (
                  `${ai.temperature_trend.previous_temperature}°C → ${ai.temperature_trend.current_temperature}°C ${ai.temperature_trend.trend}`
                ) : (
                  "Not Available"
                )}
              </div>
            </div>

            {/* Occupancy Status */}
            <div className="card p-4">
              <div className="flex items-center gap-2 text-xs font-medium text-ink-faint">
                <Users size={15} className="text-purple-400" />
                <span>Occupancy Status</span>
              </div>
              <div className="mt-2 text-sm font-semibold text-ink">
                {ai?.occupancy?.status ?? "Not Available"}
              </div>
            </div>

            {/* Occupancy Density */}
            <div className="card p-4">
              <div className="flex items-center gap-2 text-xs font-medium text-ink-faint">
                <BarChart3 size={15} className="text-accent" />
                <span>Occupancy Density</span>
              </div>
              <div className="mt-2 text-sm font-mono font-semibold text-ink">
                {ai?.occupancy?.occupancy_density !== undefined ? ai.occupancy.occupancy_density : "Not Available"}
              </div>
            </div>

            {/* Alert Severity */}
            <div className="card p-4">
              <div className="flex items-center gap-2 text-xs font-medium text-ink-faint">
                <AlertTriangle size={15} className="text-warn" />
                <span>Alert Severity</span>
              </div>
              <div className="mt-2">
                <SeverityBadge severity={ai?.alert?.severity} />
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* SECTIONS 6 & 7: RECOMMENDATIONS & ALERTS                       */}
        {/* ============================================================== */}
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Section 6: Recommendation Insights */}
          <div className="card flex flex-col p-5">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap size={16} className="text-ok" />
                <h3 className="text-sm font-semibold text-ink">Latest Recommendation</h3>
              </div>
              <span className="rounded-full bg-ok/10 px-2.5 py-0.5 text-[10px] font-semibold text-ok">
                Actionable
              </span>
            </div>
            <div className="flex-1 rounded-xl border border-line bg-white/[0.03] p-4 flex items-center">
              <p className="text-xs font-medium text-ink-dim leading-relaxed">
                {latestRec}
              </p>
            </div>
          </div>

          {/* Section 7: Alert Analytics */}
          <div className="card flex flex-col p-5">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert size={16} className="text-crit" />
                <h3 className="text-sm font-semibold text-ink">Latest Alert</h3>
              </div>
              <SeverityBadge severity={ai?.alert?.severity} />
            </div>
            <div className="flex-1 rounded-xl border border-line bg-white/[0.03] p-4 flex items-center">
              <p className="text-xs font-medium text-ink-dim leading-relaxed">
                {latestAlertMsg}
              </p>
            </div>
          </div>
        </section>
      </motion.div>
    </div>
  );
}
