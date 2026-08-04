import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Thermometer, Droplets, TrendingUp, Users, Sparkles,
  Brain, Smile, Wind, Cpu, Flame, AlertTriangle, Zap,
  ArrowRight,
} from "lucide-react";

import PageHeader from "@/components/ui/PageHeader";
import StatCard from "@/components/StatCard";
import PredictionCard from "@/components/PredictionCard";
import DecisionCard from "@/components/DecisionCard";
import TrendChart from "@/components/TrendChart";
import AlertCard from "@/components/AlertCard";

import useLiveData from "@/hooks/useLiveData";
import { currentUser } from "@/data/mockUser";

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

export default function Dashboard() {
  const { data, error } = useLiveData();

  if (error) {
    return (
      <div className="p-6 text-sm text-crit">
        Couldn't reach the sensor API: {error}
      </div>
    );
  }
  if (!data) {
    return <div className="p-6 text-sm text-ink-faint">Loading live data…</div>;
  }

  const s = data.liveStats ?? {};
  const p = data.predictions ?? {};
  const d = data.decisions ?? {};
  const r = data.recommendations ?? {};
  const alerts = data.alerts ?? [];

  // Section 1: Live Environment Cards
  const liveEnvCards = [
    {
      icon: Thermometer,
      label: "Outdoor Temperature",
      value: s.outdoorTemperature ?? "--",
      unit: s.outdoorTemperature !== undefined && s.outdoorTemperature !== "--" ? "°C" : "",
      subtitle: "Source: Open-Meteo",
      color: "#38bdf8",
    },
    {
      icon: Droplets,
      label: "Outdoor Humidity",
      value: s.outdoorHumidity ?? "--",
      unit: s.outdoorHumidity !== undefined && s.outdoorHumidity !== "--" ? "%" : "",
      subtitle: "Source: Open-Meteo",
      color: "#38bdf8",
    },
    {
      icon: Users,
      label: "Occupancy",
      value: s.peopleCount ?? "--",
      unit: s.peopleCount !== undefined && s.peopleCount !== "--" ? "people" : "",
      subtitle: "Source: YOLOv8",
      color: "#a78bfa",
    },
    {
      icon: TrendingUp,
      label: "Outdoor Temp Trend",
      value: s.outdoorTempTrend ?? "--",
      unit: "",
      subtitle: "Source: AI Analytics",
      color: "#34d399",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title={<>Welcome back, {currentUser.name} 👋</>}
        subtitle={`Real-time overview of ${s.room ?? "Seminar Hall"}`}
      >
        <span className="flex items-center gap-2 rounded-full border border-ok/20 bg-ok/10 px-3 py-1.5 text-xs font-medium text-ok">
          <span className="relative flex h-2 w-2">
            <span className="absolute h-full w-full animate-ping rounded-full bg-ok opacity-60" />
            <span className="relative h-2 w-2 rounded-full bg-ok" />
          </span>
          Live · updating
        </span>
      </PageHeader>

      <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
        {/* ============================================================== */}
        {/* SECTION 1: LIVE ENVIRONMENT                                    */}
        {/* ============================================================== */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-ink-faint">
              Section 1 · Live Environment
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {liveEnvCards.map((c) => (
              <StatCard key={c.label} {...c} />
            ))}
          </div>
        </section>

        {/* ============================================================== */}
        {/* SECTION 2: AI PREDICTION ENGINE                                */}
        {/* ============================================================== */}
        <section className="space-y-3">
          <div className="card p-5">
            <div className="mb-4 flex items-center gap-2.5">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-accent/15 text-accent">
                <Sparkles size={18} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-ink">AI Prediction Engine</h3>
                <p className="text-xs text-ink-faint">
                  Machine Learning environmental & comfort predictions
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
              <PredictionCard
                icon={Thermometer}
                title="Predicted Indoor Temperature"
                value={p.predictedIndoorTemp}
                unit="°C"
                color="#38bdf8"
                delay={0.05}
              />
              <PredictionCard
                icon={Droplets}
                title="Predicted Indoor Humidity"
                value={p.predictedIndoorHumidity}
                unit="%"
                color="#38bdf8"
                delay={0.1}
              />
              <PredictionCard
                icon={Smile}
                title="Predicted Comfort Score"
                value={p.predictedComfortScore}
                unit="/100"
                color="#34d399"
                delay={0.15}
              />
              <PredictionCard
                icon={Brain}
                title="Predicted Learning Quality"
                value={p.predictedLearningQuality}
                unit="/100"
                color="#a78bfa"
                delay={0.2}
              />
              <PredictionCard
                icon={Wind}
                title="Predicted Cooling Demand"
                value={p.predictedCoolingDemand}
                color="#fbbf24"
                delay={0.25}
              />
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* SECTION 3: AI DECISION ENGINE                                  */}
        {/* ============================================================== */}
        <section className="space-y-3">
          <div className="card p-5">
            <div className="mb-4 flex items-center gap-2.5">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-accent/15 text-accent">
                <Cpu size={18} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-ink">AI Decision Engine</h3>
                <p className="text-xs text-ink-faint">
                  Real-time automated evaluation & risk classification
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
              <DecisionCard
                icon={TrendingUp}
                title="Temperature Trend"
                value={d.tempTrend}
                delay={0.05}
              />
              <DecisionCard
                icon={Users}
                title="High Occupancy"
                value={d.highOccupancy}
                delay={0.1}
              />
              <DecisionCard
                icon={Flame}
                title="Energy Waste"
                value={d.energyWaste}
                delay={0.15}
              />
              <DecisionCard
                icon={AlertTriangle}
                title="Alert Severity"
                value={d.alertSeverity}
                type="severity"
                delay={0.2}
              />
              <DecisionCard
                icon={Zap}
                title="Overall Room Status"
                value={d.overallRoomStatus}
                type="status"
                delay={0.25}
              />
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* SECTION 4: RECOMMENDATIONS & ALERTS                            */}
        {/* ============================================================== */}
        <section className="grid gap-4 lg:grid-cols-2">
          {/* Recommendations Card */}
          <motion.div
            variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
            className="card flex flex-col p-5"
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold">Recommendations</h3>
                <p className="text-xs text-ink-faint">AI optimization guidance</p>
              </div>
              <span className="rounded-full bg-accent/10 px-2.5 py-1 text-[11px] font-medium text-accent">
                Actionable
              </span>
            </div>

            <div className="space-y-3 flex-1 flex flex-col justify-center">
              {/* Single energy recommendation */}
              <div className="rounded-xl border border-line bg-white/[0.03] p-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-ok">
                  <Zap size={16} />
                  <span>Energy Recommendation</span>
                </div>
                <p className="mt-2 text-sm text-ink-dim leading-relaxed font-medium">
                  {r.message ?? "--"}
                </p>
              </div>
            </div>
          </motion.div>

          {/* System Alerts Feed */}
          <motion.div
            variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
            className="card flex flex-col p-5"
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold">Alerts</h3>
                <p className="text-xs text-ink-faint">Live system feed</p>
              </div>
              <span className="rounded-full bg-crit/10 px-2.5 py-1 text-[11px] font-medium text-crit">
                {alerts.length} active
              </span>
            </div>

            <div className="space-y-2.5 flex-1">
              {alerts.length === 0 ? (
                <p className="text-xs text-ink-faint">No active alerts right now.</p>
              ) : (
                alerts.slice(0, 3).map((a, i) => (
                  <AlertCard key={a.id ?? i} alert={a} />
                ))
              )}
            </div>

            <Link
              to="/alerts"
              className="mt-4 flex items-center justify-center gap-1.5 rounded-xl border border-line bg-white/[0.03] py-2.5 text-xs font-medium text-accent transition-colors hover:bg-white/[0.06]"
            >
              View All Alerts <ArrowRight size={13} />
            </Link>
          </motion.div>
        </section>

        {/* ============================================================== */}
        {/* SECTION 6: HISTORY                                             */}
        {/* ============================================================== */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-ink-faint">
              Section 6 · History
            </h2>
          </div>
          <TrendChart />
        </section>
      </motion.div>
    </div>
  );
}
