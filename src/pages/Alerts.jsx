import { useState, useEffect, useMemo } from "react";
import {
  ShieldAlert, Bell, Clock, Activity, CheckCircle2,
  AlertTriangle, RefreshCw, Zap, ShieldCheck, FileText,
  Sliders
} from "lucide-react";

import PageHeader from "@/components/ui/PageHeader";
import useLiveData from "@/hooks/useLiveData";
import { getHistory } from "@/services/api";

/** Helper to convert any value (object, string, array) safely into a string for React rendering */
function safeString(val, fallback = "") {
  if (val === null || val === undefined) return fallback;
  if (typeof val === "string") return val;
  if (typeof val === "number") return String(val);
  if (typeof val === "boolean") return String(val);
  if (typeof val === "object") {
    if (val.message) return String(val.message);
    if (val.alert) return String(val.alert);
    if (val.text) return String(val.text);
    if (val.title) return String(val.title);
    if (val.severity) return String(val.severity);
    try {
      return JSON.stringify(val);
    } catch (e) {
      return fallback;
    }
  }
  return String(val);
}

/** Severity Badge Component */
function SeverityBadge({ severity }) {
  const clean = safeString(severity, "LOW")
    .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "")
    .trim()
    .toUpperCase();

  let style = "border-ok/30 bg-ok/10 text-ok";
  let dot = "bg-ok";

  if (clean.includes("MEDIUM") || clean.includes("MED") || clean.includes("YELLOW")) {
    style = "border-amber-500/30 bg-amber-500/10 text-amber-400";
    dot = "bg-amber-400";
  } else if (clean.includes("HIGH") || clean.includes("ORANGE")) {
    style = "border-orange-500/30 bg-orange-500/10 text-orange-400";
    dot = "bg-orange-400";
  } else if (clean.includes("CRITICAL") || clean.includes("CRIT") || clean.includes("RED")) {
    style = "border-crit/30 bg-crit/10 text-crit";
    dot = "bg-crit";
  }

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${style}`}>
      <span className={`h-2 w-2 rounded-full ${dot}`} />
      {clean || "LOW"}
    </span>
  );
}

export default function Alerts() {
  const { data: liveData } = useLiveData();
  const [historyRecords, setHistoryRecords] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  async function loadHistory() {
    setHistoryLoading(true);
    try {
      const res = await getHistory();
      setHistoryRecords(res.records || []);
    } catch (err) {
      console.error("Failed to fetch history in Alerts page:", err);
      setHistoryRecords([]);
    } finally {
      setHistoryLoading(false);
    }
  }

  useEffect(() => {
    loadHistory();
  }, []);

  // Normalize current live alerts data with default fallback & safeString mapping
  const alertsList = useMemo(() => {
    if (!liveData) return ["Room conditions are satisfactory."];
    if (Array.isArray(liveData.alerts) && liveData.alerts.length > 0) {
      return liveData.alerts.map((item) => safeString(item, "Room conditions are satisfactory."));
    }
    if (liveData.alerts) {
      return [safeString(liveData.alerts, "Room conditions are satisfactory.")];
    }
    return ["Room conditions are satisfactory."];
  }, [liveData]);

  const rawSeverity = liveData?.ai_analytics?.alert?.severity || liveData?.ai_analytics?.alert || "🟢 LOW";
  const cleanSev = safeString(rawSeverity, "LOW")
    .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "")
    .trim()
    .toUpperCase();

  const systemStatus = useMemo(() => {
    if (cleanSev.includes("HIGH") || cleanSev.includes("CRITICAL") || cleanSev.includes("RED")) {
      return { status: "Critical", color: "text-crit", badgeBg: "bg-crit/10 border-crit/30" };
    }
    if (cleanSev.includes("MEDIUM") || cleanSev.includes("YELLOW")) {
      return { status: "Warning", color: "text-amber-400", badgeBg: "bg-amber-500/10 border-amber-500/30" };
    }
    return { status: "Healthy", color: "text-ok", badgeBg: "bg-ok/10 border-ok/30" };
  }, [cleanSev]);

  const lastUpdatedDisplay = useMemo(() => {
    const d = new Date();
    return d.toLocaleString([], {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }, []);

  const latestRecommendation = useMemo(() => {
    if (!liveData?.energy_recommendations) return "Cooling demand is low. Energy saving mode recommended.";
    if (Array.isArray(liveData.energy_recommendations)) {
      return safeString(liveData.energy_recommendations[0], "Cooling demand is low. Energy saving mode recommended.");
    }
    return safeString(liveData.energy_recommendations, "Cooling demand is low. Energy saving mode recommended.");
  }, [liveData]);

  return (
    <div className="space-y-8">
      {/* 1. Page Header */}
      <PageHeader
        title="Alerts & Notifications"
        subtitle="Monitor active system alerts, their severity, and notification history."
      >
        <div className="flex items-center gap-3">
          {/* Auto Refresh Indicator */}
          <span className="flex items-center gap-2 rounded-full border border-ok/30 bg-ok/10 px-3.5 py-1.5 text-xs font-semibold text-ok shadow-[0_0_12px_rgba(52,211,153,0.15)]">
            <RefreshCw size={14} className="animate-spin text-ok" /> Auto Refresh: Every 5s
          </span>
        </div>
      </PageHeader>

      <div className="space-y-8">
        {/* ============================================================== */}
        {/* 2. ALERT SUMMARY CARDS (TOP 4 CARDS)                           */}
        {/* ============================================================== */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Active Alerts */}
          <div className="card p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-ink-faint">Active Alerts</span>
              <div className="grid h-8 w-8 place-items-center rounded-xl bg-sky-500/15 text-sky-400">
                <Bell size={18} />
              </div>
            </div>
            <div className="flex items-baseline gap-2 pt-1">
              <span className="font-mono text-2xl font-bold text-ink">{alertsList.length}</span>
              <span className="text-xs font-medium text-ink-faint">
                {alertsList.length === 1 ? "alert" : "alerts"}
              </span>
            </div>
            <p className="text-[11px] text-ink-faint">Live Monitor Count</p>
          </div>

          {/* Highest Severity */}
          <div className="card p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-ink-faint">Highest Severity</span>
              <div className="grid h-8 w-8 place-items-center rounded-xl bg-amber-500/15 text-amber-400">
                <ShieldAlert size={18} />
              </div>
            </div>
            <div className="pt-1">
              <SeverityBadge severity={cleanSev} />
            </div>
            <p className="text-[11px] text-ink-faint">Current Threat Level</p>
          </div>

          {/* Last Updated */}
          <div className="card p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-ink-faint">Last Updated</span>
              <div className="grid h-8 w-8 place-items-center rounded-xl bg-purple-500/15 text-purple-400">
                <Clock size={18} />
              </div>
            </div>
            <div className="pt-1">
              <span className="font-mono text-sm font-bold text-ink">{lastUpdatedDisplay}</span>
            </div>
            <p className="text-[11px] text-ink-faint">Telemetry Synchronized</p>
          </div>

          {/* System Status */}
          <div className="card p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-ink-faint">System Status</span>
              <ShieldCheck size={18} className={systemStatus.color} />
            </div>
            <div className="flex items-center gap-2 pt-1">
              <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold ${systemStatus.badgeBg} ${systemStatus.color}`}>
                <span className="h-2 w-2 rounded-full bg-current animate-pulse" />
                {systemStatus.status}
              </span>
            </div>
            <p className="text-[11px] text-ink-faint">Automated Diagnostic</p>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 3 & 4. CURRENT ACTIVE ALERTS & PROMINENT SEVERITY BADGE        */}
        {/* ============================================================== */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Current Active Alerts (2 Cols) */}
          <div className="card p-6 space-y-4 lg:col-span-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-accent/15 text-accent">
                  <Bell size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-ink">Current Active Alerts</h3>
                  <p className="text-xs text-ink-faint">Live alerts dispatched from system monitor</p>
                </div>
              </div>
              <span className="rounded-full bg-accent/10 border border-accent/30 px-3 py-1 text-xs font-semibold text-accent">
                {alertsList.length} Active
              </span>
            </div>

            <div className="space-y-3 pt-2">
              {alertsList.map((alertText, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 rounded-xl border border-line bg-white/[0.02] p-4 transition hover:bg-white/[0.04]"
                >
                  <div className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-accent/10 text-accent">
                    <AlertTriangle size={14} />
                  </div>
                  <div className="space-y-1 flex-1">
                    <p className="text-xs font-semibold text-ink leading-relaxed">{safeString(alertText)}</p>
                    <p className="text-[10px] font-mono text-ink-faint">Logged: {lastUpdatedDisplay}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Alert Severity Badge Card (1 Col) */}
          <div className="card p-6 flex flex-col justify-between space-y-4 bg-gradient-to-br from-card to-sidebar border border-accent/20">
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-amber-500/15 text-amber-400">
                  <ShieldAlert size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-ink">Alert Severity</h3>
                  <p className="text-xs text-ink-faint">Current threat classification</p>
                </div>
              </div>

              <div className="pt-4 flex flex-col items-center justify-center p-6 rounded-2xl border border-line bg-white/[0.02] space-y-3 text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-ink-faint">Severity Rating</span>
                <SeverityBadge severity={cleanSev} />
                <p className="text-xs text-ink-dim pt-2 leading-relaxed">
                  Calculated automatically based on environmental threshold parameters.
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-line bg-white/[0.03] p-3 text-[11px] text-ink-faint flex items-center justify-between">
              <span>Threshold Monitor</span>
              <span className="font-semibold text-accent">Active</span>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 5. ALERT TIMELINE                                              */}
        {/* ============================================================== */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Activity size={18} className="text-accent" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-ink-faint">
              Section 5 · Alert Timeline
            </h2>
          </div>

          <div className="card p-6">
            <div className="relative border-l border-line ml-4 pl-6 space-y-6">
              {alertsList.map((msg, i) => (
                <div key={i} className="relative">
                  <span className="absolute -left-[33px] top-0 grid h-6 w-6 place-items-center rounded-full border border-accent/40 bg-sidebar text-xs text-accent">
                    <Clock size={12} />
                  </span>
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-1">
                    <span className="text-xs font-mono font-bold text-accent">
                      {lastUpdatedDisplay.split(",")[1] || "13:47"}
                    </span>
                    <SeverityBadge severity={cleanSev} />
                  </div>
                  <p className="text-xs font-medium text-ink leading-relaxed pt-1">
                    {safeString(msg)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 6. NOTIFICATION HISTORY TABLE                                  */}
        {/* ============================================================== */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText size={18} className="text-accent" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-ink-faint">
                Section 6 · Notification History
              </h2>
            </div>
            <button
              onClick={loadHistory}
              className="flex items-center gap-2 rounded-xl border border-line bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-ink hover:bg-white/[0.06] transition"
            >
              <RefreshCw size={12} className="text-accent" /> Refresh History
            </button>
          </div>

          <div className="card overflow-x-auto p-4">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-line text-ink-faint uppercase font-bold text-[10px]">
                  <th className="pb-3 pr-4 w-44">Time</th>
                  <th className="pb-3 pr-4 w-32">Severity</th>
                  <th className="pb-3">Alert Message</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/40">
                {historyLoading ? (
                  <tr>
                    <td colSpan={3} className="py-6 text-center text-xs text-ink-faint">
                      Loading notification history…
                    </td>
                  </tr>
                ) : historyRecords.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-6 text-center text-xs text-ink-faint">
                      No historical alert records found.
                    </td>
                  </tr>
                ) : (
                  historyRecords.map((r, idx) => {
                    const timeStr = r.timestamp
                      ? new Date(r.timestamp).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
                      : `Snapshot #${idx + 1}`;

                    const sev = r.ai_analytics?.alert?.severity || "🟢 LOW";
                    const rawAlert = Array.isArray(r.alerts) ? r.alerts[0] : r.alerts;
                    const alertMsg = safeString(rawAlert, "Room conditions are satisfactory.");

                    return (
                      <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3 pr-4 font-mono text-ink-dim whitespace-nowrap">{timeStr}</td>
                        <td className="py-3 pr-4">
                          <SeverityBadge severity={sev} />
                        </td>
                        <td className="py-3 text-ink font-medium leading-relaxed">{alertMsg}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 7 & 8. ALERT DETAILS & AUTO REFRESH INDICATOR                   */}
        {/* ============================================================== */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Section 7: Alert Details Card */}
          <div className="card p-6 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-accent/15 text-accent">
                <Sliders size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-ink">Alert Details</h3>
                <p className="text-xs text-ink-faint">Deep-dive notification breakdown</p>
              </div>
            </div>

            <div className="space-y-3 pt-1">
              <div className="rounded-xl border border-line bg-white/[0.02] p-3.5 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-ink-faint">Alert Message</span>
                <p className="text-xs font-semibold text-ink leading-relaxed">{safeString(alertsList[0], "Room conditions are satisfactory.")}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-line bg-white/[0.02] p-3.5 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-ink-faint">Severity</span>
                  <div>
                    <SeverityBadge severity={cleanSev} />
                  </div>
                </div>
                <div className="rounded-xl border border-line bg-white/[0.02] p-3.5 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-ink-faint">Diagnostic Status</span>
                  <p className="text-xs font-bold text-ok">{systemStatus.status}</p>
                </div>
              </div>

              <div className="rounded-xl border border-line bg-white/[0.02] p-3.5 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-ink-faint">Recommended Action</span>
                <p className="text-xs font-medium text-ink-dim leading-relaxed">{safeString(latestRecommendation)}</p>
              </div>
            </div>
          </div>

          {/* Section 8: Auto Refresh & System Health Card */}
          <div className="card p-6 flex flex-col justify-between space-y-4 bg-gradient-to-br from-card via-card to-sidebar border border-accent/20 shadow-[0_0_20px_rgba(56,189,248,0.12)]">
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-ok/15 text-ok">
                  <Zap size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-ink">Auto Refresh Engine</h3>
                  <p className="text-xs text-ink-faint">Real-time polling synchronization</p>
                </div>
              </div>

              <div className="pt-3 p-5 rounded-2xl border border-line bg-white/[0.02] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-ink">Polling Frequency</span>
                  <span className="text-xs font-mono font-bold text-ok">Every 5 seconds</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-ok animate-pulse w-full" />
                </div>
                <p className="text-[11px] text-ink-faint pt-1 leading-relaxed">
                  System alerts synchronize automatically with live telemetry polled from <code className="text-accent">GET /api/analytics/dashboard</code>.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-ink-faint pt-2">
              <CheckCircle2 size={14} className="text-ok" />
              <span>Real-Time Alert Pipeline Operational</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
