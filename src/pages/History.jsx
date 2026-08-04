import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle, RefreshCw, Cpu, ShieldAlert,
  Zap, Clock, FileText, Database, Layers,
} from "lucide-react";

import PageHeader from "@/components/ui/PageHeader";
import { getHistory } from "@/services/api";

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

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

export default function History() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const data = await getHistory();
      setRecords(data.records || []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Unable to load history.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Historical Records Log" subtitle="Complete sensor & AI decision logs from TwinVerse" />
        <div className="flex h-64 items-center justify-center rounded-2xl border border-line bg-card p-6 text-sm text-ink-faint">
          <div className="flex items-center gap-3">
            <RefreshCw className="h-5 w-5 animate-spin text-accent" />
            Loading historical records…
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Historical Records Log" subtitle="Complete sensor & AI decision logs from TwinVerse" />
        <div className="card flex flex-col items-center justify-center p-12 text-center space-y-4">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-crit/10 text-crit">
            <AlertTriangle size={24} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-ink">Unable to load history.</h3>
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

  if (!records || records.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader title="Historical Records Log" subtitle="Complete sensor & AI decision logs from TwinVerse" />
        <div className="card flex flex-col items-center justify-center p-12 text-center">
          <Clock className="h-10 w-10 text-ink-faint mb-3 opacity-60" />
          <p className="text-sm font-semibold text-ink-faint">No historical data available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Historical Records Log"
        subtitle="Historical snapshots and system logs from TwinVerse backend"
      >
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3.5 py-1.5 text-xs font-semibold text-accent shadow-[0_0_12px_rgba(56,189,248,0.2)]">
            <Database size={14} />
            Total Historical Records: {records.length}
          </span>

          <button
            onClick={loadData}
            className="flex items-center gap-2 rounded-xl border border-line bg-white/[0.03] px-3.5 py-1.5 text-xs font-medium text-ink transition hover:bg-white/[0.06]"
          >
            <RefreshCw size={14} className="text-accent" /> Refresh
          </button>
        </div>
      </PageHeader>

      <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
        {/* ============================================================== */}
        {/* SECTION 1: MASTER HISTORICAL RECORDS TABLE                     */}
        {/* ============================================================== */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <FileText size={16} className="text-accent" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-ink-faint">
              Section 1 · Historical Snapshot Records
            </h2>
          </div>

          <div className="card overflow-x-auto p-4">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-line text-ink-faint uppercase font-bold text-[10px]">
                  <th className="pb-3 pr-3 whitespace-nowrap">Timestamp</th>
                  <th className="pb-3 pr-3 whitespace-nowrap">Outdoor Temp</th>
                  <th className="pb-3 pr-3 whitespace-nowrap">Outdoor Hum</th>
                  <th className="pb-3 pr-3 whitespace-nowrap">People Count</th>
                  <th className="pb-3 pr-3 whitespace-nowrap">Indoor Temp</th>
                  <th className="pb-3 pr-3 whitespace-nowrap">Indoor Hum</th>
                  <th className="pb-3 pr-3 whitespace-nowrap">Comfort Score</th>
                  <th className="pb-3 pr-3 whitespace-nowrap">Learning Quality</th>
                  <th className="pb-3 pr-3 whitespace-nowrap">Cooling Demand</th>
                  <th className="pb-3 pr-3 whitespace-nowrap">Alert</th>
                  <th className="pb-3 whitespace-nowrap">Recommendation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/40">
                {records.map((r, i) => {
                  const timeDisplay = r.timestamp
                    ? new Date(r.timestamp).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
                    : `Snapshot #${i + 1}`;

                  const outTemp = r.weather?.temperature !== undefined ? `${r.weather.temperature}°C` : "--";
                  const outHum = r.weather?.humidity !== undefined ? `${r.weather.humidity}%` : "--";
                  const people = r.occupancy?.people_count !== undefined ? r.occupancy.people_count : "--";
                  
                  const inTemp = r.predictions?.indoor_temperature !== undefined ? `${r.predictions.indoor_temperature}°C` : "--";
                  const inHum = r.predictions?.indoor_humidity !== undefined ? `${r.predictions.indoor_humidity}%` : "--";
                  const comfort = r.predictions?.comfort_score !== undefined ? `${r.predictions.comfort_score}/100` : "--";
                  const learning = r.predictions?.learning_quality !== undefined ? `${r.predictions.learning_quality}/100` : "--";
                  const cooling = r.predictions?.cooling_demand !== undefined ? r.predictions.cooling_demand : "--";

                  const alertMsg = Array.isArray(r.alerts) ? r.alerts[0] : r.alerts || "--";
                  const recMsg = Array.isArray(r.energy_recommendations) ? r.energy_recommendations[0] : r.energy_recommendations || "--";

                  return (
                    <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 pr-3 font-mono text-ink-dim whitespace-nowrap">{timeDisplay}</td>
                      <td className="py-3 pr-3 font-mono text-sky-400 font-medium whitespace-nowrap">{outTemp}</td>
                      <td className="py-3 pr-3 font-mono text-cyan-400 font-medium whitespace-nowrap">{outHum}</td>
                      <td className="py-3 pr-3 font-mono text-purple-400 font-medium whitespace-nowrap">{people}</td>
                      <td className="py-3 pr-3 font-mono text-sky-300 whitespace-nowrap">{inTemp}</td>
                      <td className="py-3 pr-3 font-mono text-cyan-300 whitespace-nowrap">{inHum}</td>
                      <td className="py-3 pr-3 font-mono text-emerald-400 font-medium whitespace-nowrap">{comfort}</td>
                      <td className="py-3 pr-3 font-mono text-purple-300 whitespace-nowrap">{learning}</td>
                      <td className="py-3 pr-3 font-mono text-amber-400 font-medium whitespace-nowrap">{cooling}</td>
                      <td className="py-3 pr-3 text-ink max-w-xs truncate">{alertMsg}</td>
                      <td className="py-3 text-ink max-w-xs truncate">{recMsg}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* ============================================================== */}
        {/* SECTION 2: AI ANALYTICS HISTORY TABLE                          */}
        {/* ============================================================== */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <Cpu size={16} className="text-accent" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-ink-faint">
              Section 2 · AI Analytics History
            </h2>
          </div>
          <div className="card overflow-x-auto p-4">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-line text-ink-faint uppercase font-bold text-[10px]">
                  <th className="pb-3 pr-4 w-44">Timestamp</th>
                  <th className="pb-3 pr-4">Temperature Trend</th>
                  <th className="pb-3 pr-4">Occupancy Status</th>
                  <th className="pb-3">Alert Severity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/40">
                {records.map((r, i) => {
                  const ai = r.ai_analytics;
                  const timeDisplay = r.timestamp
                    ? new Date(r.timestamp).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
                    : `Log #${i + 1}`;

                  if (!ai) {
                    return (
                      <tr key={i} className="hover:bg-white/[0.02]">
                        <td className="py-3 pr-4 font-mono text-ink-dim">{timeDisplay}</td>
                        <td colSpan={3} className="py-3 text-ink-faint italic">Not Available</td>
                      </tr>
                    );
                  }

                  const trend = ai.temperature_trend?.trend ?? "Not Available";
                  const status = ai.occupancy?.status ?? "Not Available";
                  const severity = ai.alert?.severity;

                  return (
                    <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 pr-4 font-mono text-ink-dim whitespace-nowrap">{timeDisplay}</td>
                      <td className="py-3 pr-4 font-mono text-ink">{trend}</td>
                      <td className="py-3 pr-4 font-medium text-ink">{status}</td>
                      <td className="py-3">
                        <SeverityBadge severity={severity} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* ============================================================== */}
        {/* SECTION 3: ALERTS HISTORY SECTION                              */}
        {/* ============================================================== */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <ShieldAlert size={16} className="text-crit" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-ink-faint">
              Section 3 · Alerts History
            </h2>
          </div>
          <div className="card overflow-x-auto p-4">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-line text-ink-faint uppercase font-bold text-[10px]">
                  <th className="pb-3 pr-4 w-44">Timestamp</th>
                  <th className="pb-3">Alert Message</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/40">
                {records.map((r, i) => {
                  const timeDisplay = r.timestamp
                    ? new Date(r.timestamp).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
                    : `Log #${i + 1}`;
                  const alertMessage = Array.isArray(r.alerts)
                    ? r.alerts[0]
                    : r.alerts || "--";

                  return (
                    <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 pr-4 font-mono text-ink-dim whitespace-nowrap">{timeDisplay}</td>
                      <td className="py-3 text-ink font-medium">{alertMessage}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* ============================================================== */}
        {/* SECTION 4: ENERGY RECOMMENDATIONS HISTORY                      */}
        {/* ============================================================== */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <Zap size={16} className="text-ok" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-ink-faint">
              Section 4 · Energy Recommendations History
            </h2>
          </div>
          <div className="card overflow-x-auto p-4">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-line text-ink-faint uppercase font-bold text-[10px]">
                  <th className="pb-3 pr-4 w-44">Timestamp</th>
                  <th className="pb-3">Recommendation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/40">
                {records.map((r, i) => {
                  const timeDisplay = r.timestamp
                    ? new Date(r.timestamp).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
                    : `Log #${i + 1}`;
                  const recMessage = Array.isArray(r.energy_recommendations)
                    ? r.energy_recommendations[0]
                    : r.energy_recommendations || "--";

                  return (
                    <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 pr-4 font-mono text-ink-dim whitespace-nowrap">{timeDisplay}</td>
                      <td className="py-3 text-ink font-medium">{recMessage}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </motion.div>
    </div>
  );
}
