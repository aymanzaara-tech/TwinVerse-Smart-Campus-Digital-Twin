import { motion } from "framer-motion";
import {
  Building2, CloudSun, Camera, Server, Database, Sparkles,
  Cpu, Boxes, Code2, Palette, Brain, Layers, ArrowDown,
  CheckCircle2, Activity, Zap, Thermometer, Droplets, Smile,
  Wind, ShieldCheck, FileCode, Check
} from "lucide-react";

import PageHeader from "@/components/ui/PageHeader";

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

export default function SystemArchitecture() {
  const techStack = [
    { title: "Frontend", tech: "React + Vite", icon: Code2, color: "#38bdf8" },
    { title: "Styling", tech: "Tailwind CSS", icon: Palette, color: "#38bdf8" },
    { title: "3D Engine", tech: "Three.js", icon: Boxes, color: "#a78bfa" },
    { title: "Backend", tech: "FastAPI", icon: Server, color: "#34d399" },
    { title: "Database", tech: "Firebase", icon: Database, color: "#fbbf24" },
    { title: "AI / ML", tech: "Python", icon: Brain, color: "#a78bfa" },
    { title: "Weather API", tech: "Open-Meteo API", icon: CloudSun, color: "#38bdf8" },
    { title: "Computer Vision", tech: "YOLOv8", icon: Camera, color: "#f43f5e" },
  ];

  const systemComponents = [
    {
      title: "Weather API",
      desc: "Retrieves real-time outdoor temperature and humidity from Open-Meteo.",
      icon: CloudSun,
      color: "#38bdf8",
    },
    {
      title: "Occupancy Detection",
      desc: "Uses YOLOv8 computer vision to detect people count and occupancy.",
      icon: Camera,
      color: "#f43f5e",
    },
    {
      title: "Prediction Engine",
      desc: "Predicts indoor temperature, humidity, comfort score, learning quality and cooling demand.",
      icon: Sparkles,
      color: "#34d399",
    },
    {
      title: "Decision Engine",
      desc: "Generates recommendations, alert severity, occupancy status and temperature trends.",
      icon: Cpu,
      color: "#a78bfa",
    },
    {
      title: "Firebase",
      desc: "Stores current data and historical analytics records.",
      icon: Database,
      color: "#fbbf24",
    },
    {
      title: "Digital Twin",
      desc: "Interactive Three.js visualization of the seminar hall.",
      icon: Boxes,
      color: "#38bdf8",
    },
  ];

  const dataFlowSteps = [
    { step: 1, text: "Weather data retrieved from Open-Meteo API." },
    { step: 2, text: "YOLOv8 detects occupancy." },
    { step: 3, text: "Backend validates and processes data." },
    { step: 4, text: "ML model predicts indoor conditions." },
    { step: 5, text: "Decision engine generates recommendations and alerts." },
    { step: 6, text: "Data stored in Firebase." },
    { step: 7, text: "Dashboard fetches live data." },
    { step: 8, text: "Three.js Digital Twin visualizes the seminar hall." },
  ];

  const mlOutputs = [
    { label: "Indoor Temperature", icon: Thermometer, color: "#38bdf8" },
    { label: "Indoor Humidity", icon: Droplets, color: "#06b6d4" },
    { label: "Comfort Score", icon: Smile, color: "#34d399" },
    { label: "Learning Quality", icon: Brain, color: "#a78bfa" },
    { label: "Cooling Demand", icon: Wind, color: "#fbbf24" },
  ];

  const systemStatuses = [
    { name: "Backend", status: "Online", color: "green" },
    { name: "Firebase", status: "Connected", color: "green" },
    { name: "Weather API", status: "Connected", color: "green" },
    { name: "AI Model", status: "Running", color: "blue" },
    { name: "Dashboard", status: "Connected", color: "green" },
    { name: "Digital Twin", status: "Active", color: "blue" },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <PageHeader
        title="System Architecture"
        subtitle="Overview of the TwinVerse Digital Twin system architecture, data flow, AI pipeline, and technology stack."
      >
        <span className="flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3.5 py-1.5 text-xs font-semibold text-accent shadow-[0_0_15px_rgba(56,189,248,0.2)]">
          <Layers size={14} /> System Blueprint v2.0
        </span>
      </PageHeader>

      <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-8">
        {/* ============================================================== */}
        {/* SECTION 1: OVERALL ARCHITECTURE DIAGRAM                        */}
        {/* ============================================================== */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Layers size={18} className="text-accent" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-ink-faint">
              Section 1 · Overall Architecture Flow
            </h2>
          </div>

          <div className="card p-6 space-y-6 bg-gradient-to-b from-card to-sidebar/90">
            {/* Flow Level 1: Physical Environment */}
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-3 rounded-2xl border border-accent/40 bg-accent/10 px-6 py-3.5 shadow-[0_0_20px_rgba(56,189,248,0.25)]">
                <Building2 size={22} className="text-accent" />
                <span className="text-sm font-bold text-ink">Physical Seminar Hall</span>
              </div>
              <ArrowDown size={20} className="my-3 text-ink-faint animate-bounce" />
            </div>

            {/* Flow Level 2: Data Collection Layer */}
            <div className="flex flex-col items-center">
              <div className="w-full rounded-2xl border border-line bg-white/[0.02] p-4 text-center">
                <span className="text-xs font-bold uppercase tracking-wider text-accent block mb-3">
                  Data Collection Layer
                </span>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="flex items-center justify-center gap-2.5 rounded-xl border border-line bg-card p-3">
                    <CloudSun size={18} className="text-sky-400" />
                    <span className="text-xs font-semibold text-ink">Open-Meteo Weather API</span>
                  </div>
                  <div className="flex items-center justify-center gap-2.5 rounded-xl border border-line bg-card p-3">
                    <Camera size={18} className="text-rose-400" />
                    <span className="text-xs font-semibold text-ink">YOLOv8 People Detection</span>
                  </div>
                </div>
              </div>
              <ArrowDown size={20} className="my-3 text-ink-faint" />
            </div>

            {/* Flow Level 3: Data Processing Layer */}
            <div className="flex flex-col items-center">
              <div className="w-full rounded-2xl border border-line bg-white/[0.02] p-4 text-center">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-3">
                  Data Processing Layer
                </span>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="flex items-center justify-center gap-2.5 rounded-xl border border-line bg-card p-3">
                    <Server size={18} className="text-emerald-400" />
                    <span className="text-xs font-semibold text-ink">FastAPI Backend</span>
                  </div>
                  <div className="flex items-center justify-center gap-2.5 rounded-xl border border-line bg-card p-3">
                    <ShieldCheck size={18} className="text-emerald-400" />
                    <span className="text-xs font-semibold text-ink">Data Validation</span>
                  </div>
                  <div className="flex items-center justify-center gap-2.5 rounded-xl border border-line bg-card p-3">
                    <Database size={18} className="text-amber-400" />
                    <span className="text-xs font-semibold text-ink">Firebase Database</span>
                  </div>
                </div>
              </div>
              <ArrowDown size={20} className="my-3 text-ink-faint" />
            </div>

            {/* Flow Level 4: AI Prediction Engine */}
            <div className="flex flex-col items-center">
              <div className="w-full rounded-2xl border border-line bg-white/[0.02] p-4 text-center">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-400 block mb-3">
                  AI Prediction Engine
                </span>
                <div className="flex flex-wrap justify-center gap-2.5">
                  {["Indoor Temperature", "Indoor Humidity", "Comfort Score", "Learning Quality", "Cooling Demand"].map((item) => (
                    <span key={item} className="rounded-xl border border-purple-500/30 bg-purple-500/10 px-3 py-1.5 text-xs font-medium text-purple-300">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              <ArrowDown size={20} className="my-3 text-ink-faint" />
            </div>

            {/* Flow Level 5: AI Decision Engine */}
            <div className="flex flex-col items-center">
              <div className="w-full rounded-2xl border border-line bg-white/[0.02] p-4 text-center">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 block mb-3">
                  AI Decision Engine
                </span>
                <div className="flex flex-wrap justify-center gap-2.5">
                  {["Recommendations", "Alerts", "Occupancy Status", "Temperature Trend", "Alert Severity"].map((item) => (
                    <span key={item} className="rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-3 py-1.5 text-xs font-medium text-indigo-300">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              <ArrowDown size={20} className="my-3 text-ink-faint" />
            </div>

            {/* Flow Level 6: Final Layer */}
            <div className="flex flex-col items-center">
              <div className="w-full rounded-2xl border border-accent/40 bg-accent/5 p-4 text-center shadow-[0_0_20px_rgba(56,189,248,0.15)]">
                <span className="text-xs font-bold uppercase tracking-wider text-accent block mb-3">
                  Final Presentation Layer
                </span>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="flex items-center justify-center gap-2.5 rounded-xl border border-accent/30 bg-card p-3">
                    <Code2 size={18} className="text-accent" />
                    <span className="text-xs font-bold text-ink">React Dashboard</span>
                  </div>
                  <div className="flex items-center justify-center gap-2.5 rounded-xl border border-accent/30 bg-card p-3">
                    <Boxes size={18} className="text-purple-400" />
                    <span className="text-xs font-bold text-ink">Three.js Digital Twin</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* SECTION 2: TECHNOLOGY STACK                                    */}
        {/* ============================================================== */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Code2 size={18} className="text-accent" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-ink-faint">
              Section 2 · Technology Stack
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {techStack.map(({ title, tech, icon: Icon, color }) => (
              <div key={title} className="card p-4 flex items-center gap-3.5 transition-all duration-200 hover:border-line/80">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/[0.04] border border-line">
                  <Icon size={20} style={{ color }} />
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-faint">{title}</p>
                  <p className="text-sm font-bold text-ink">{tech}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ============================================================== */}
        {/* SECTION 3: SYSTEM COMPONENTS                                   */}
        {/* ============================================================== */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Cpu size={18} className="text-accent" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-ink-faint">
              Section 3 · System Components
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {systemComponents.map(({ title, desc, icon: Icon, color }) => (
              <div key={title} className="card p-5 space-y-3 transition-all duration-200 hover:border-line/80">
                <div className="flex items-center gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-white/[0.04] border border-line">
                    <Icon size={18} style={{ color }} />
                  </div>
                  <h3 className="text-sm font-bold text-ink">{title}</h3>
                </div>
                <p className="text-xs text-ink-dim leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ============================================================== */}
        {/* SECTION 4: API ARCHITECTURE                                    */}
        {/* ============================================================== */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <FileCode size={18} className="text-accent" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-ink-faint">
              Section 4 · API Architecture
            </h2>
          </div>

          <div className="card overflow-x-auto p-4">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-line text-ink-faint uppercase font-bold text-[10px]">
                  <th className="pb-3 pr-4">Endpoint</th>
                  <th className="pb-3 pr-4 w-24">Method</th>
                  <th className="pb-3">Purpose</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/40">
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 pr-4 font-mono font-bold text-accent">GET /api/analytics/dashboard</td>
                  <td className="py-3.5 pr-4">
                    <span className="inline-flex rounded-full border border-ok/30 bg-ok/10 px-2.5 py-0.5 text-[10px] font-bold text-ok">
                      GET
                    </span>
                  </td>
                  <td className="py-3.5 text-ink-dim leading-relaxed">
                    Returns live dashboard data including weather, occupancy, ML predictions, alerts and AI analytics.
                  </td>
                </tr>
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 pr-4 font-mono font-bold text-accent">GET /api/analytics/history</td>
                  <td className="py-3.5 pr-4">
                    <span className="inline-flex rounded-full border border-ok/30 bg-ok/10 px-2.5 py-0.5 text-[10px] font-bold text-ok">
                      GET
                    </span>
                  </td>
                  <td className="py-3.5 text-ink-dim leading-relaxed">
                    Returns historical records used for charts and historical analysis.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ============================================================== */}
        {/* SECTION 5: DATA FLOW TIMELINE                                  */}
        {/* ============================================================== */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Activity size={18} className="text-accent" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-ink-faint">
              Section 5 · Data Flow Timeline
            </h2>
          </div>

          <div className="card p-6">
            <div className="relative border-l border-line/60 ml-4 pl-6 space-y-6">
              {dataFlowSteps.map(({ step, text }) => (
                <div key={step} className="relative group">
                  {/* Step circle indicator */}
                  <span className="absolute -left-[35px] top-0 grid h-7 w-7 place-items-center rounded-full border border-accent/40 bg-sidebar text-xs font-bold text-accent shadow-[0_0_10px_rgba(56,189,248,0.2)]">
                    {step}
                  </span>
                  <p className="text-xs font-medium text-ink leading-relaxed pt-0.5">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* SECTION 6: AI PREDICTION OUTPUTS                               */}
        {/* ============================================================== */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-accent" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-ink-faint">
              Section 6 · AI Prediction Outputs
            </h2>
          </div>

          <div className="card p-5 space-y-4">
            <p className="text-xs text-ink-faint">
              Outputs generated by the Machine Learning inference pipeline for environmental & comfort optimization:
            </p>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
              {mlOutputs.map(({ label, icon: Icon, color }) => (
                <div key={label} className="rounded-xl border border-line bg-white/[0.02] p-3.5 flex items-center gap-3">
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-white/[0.04]">
                    <Icon size={16} style={{ color }} />
                  </div>
                  <span className="text-xs font-semibold text-ink">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* SECTION 7: SYSTEM STATUS                                       */}
        {/* ============================================================== */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} className="text-ok" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-ink-faint">
              Section 7 · System Operational Status
            </h2>
          </div>

          <div className="card p-5">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {systemStatuses.map(({ name, status, color }) => (
                <div key={name} className="flex flex-col items-center justify-center p-3 rounded-xl border border-line bg-white/[0.02] text-center space-y-1.5">
                  <span className="text-[11px] font-semibold text-ink-faint">{name}</span>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                      color === "green"
                        ? "border border-ok/30 bg-ok/10 text-ok"
                        : "border border-sky-500/30 bg-sky-500/10 text-sky-400"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        color === "green" ? "bg-ok" : "bg-sky-400"
                      }`}
                    />
                    {status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* SECTION 8: ARCHITECTURE SUMMARY                                */}
        {/* ============================================================== */}
        <section className="space-y-4">
          <div className="card p-6 bg-gradient-to-r from-accent/15 via-card to-purple-500/10 border border-accent/30 shadow-[0_0_25px_rgba(56,189,248,0.15)]">
            <div className="flex items-start gap-4">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent/20 text-accent">
                <Zap size={20} />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-ink">
                  TwinVerse Smart Campus Digital Twin
                </h3>
                <p className="text-xs text-ink-dim leading-relaxed">
                  TwinVerse integrates weather data, computer vision, machine learning and real-time visualization into a unified Digital Twin platform for monitoring and improving seminar hall conditions.
                </p>
              </div>
            </div>
          </div>
        </section>
      </motion.div>
    </div>
  );
}
