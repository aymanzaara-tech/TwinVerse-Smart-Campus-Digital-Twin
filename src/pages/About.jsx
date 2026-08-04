import { motion } from "framer-motion";
import {
  Boxes, Info, CheckCircle2, CloudSun, Camera, Sparkles,
  ShieldAlert, Zap, Layers, BarChart3, LayoutDashboard,
  Code2, Palette, Server, Database, Brain, Building2,
  Cpu, Thermometer, Droplets, Smile, Wind, ArrowRight,
  TrendingUp, Award, GraduationCap, Calendar, Compass, ArrowDown,
  Target, Lightbulb, Smartphone
} from "lucide-react";

import PageHeader from "@/components/ui/PageHeader";

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

export default function About() {
  const projectObjectives = [
    { title: "Real-time Monitoring", desc: "Monitor seminar hall environmental conditions in real time.", icon: TrendingUp },
    { title: "Occupancy Detection", desc: "Detect people count and occupancy using YOLOv8 computer vision.", icon: Camera },
    { title: "Predictive AI", desc: "Predict indoor environmental conditions and thermal trends.", icon: Sparkles },
    { title: "Occupant Comfort", desc: "Improve student & faculty indoor comfort score and air quality.", icon: Smile },
    { title: "Energy Optimization", desc: "Optimize HVAC energy consumption and eliminate power waste.", icon: Zap },
    { title: "3D Digital Twin", desc: "Visualize the entire seminar hall using an interactive 3D model.", icon: Boxes },
  ];

  const keyFeatures = [
    { title: "Live Weather Monitoring", desc: "Real-time outdoor weather telemetry from Open-Meteo API.", icon: CloudSun, color: "#38bdf8" },
    { title: "Occupancy Detection", desc: "Automated vision-based headcount monitoring with YOLOv8.", icon: Camera, color: "#f43f5e" },
    { title: "AI Prediction Engine", desc: "Machine Learning models for indoor temp, humidity, and comfort.", icon: Sparkles, color: "#34d399" },
    { title: "Intelligent Alerts", desc: "Automated threshold alerts and risk severity classification.", icon: ShieldAlert, color: "#fbbf24" },
    { title: "Energy Recommendations", desc: "Actionable HVAC cooling recommendations for energy savings.", icon: Zap, color: "#34d399" },
    { title: "Interactive 3D Digital Twin", desc: "Three.js WebGL virtual representation of the seminar hall.", icon: Boxes, color: "#a78bfa" },
    { title: "Historical Data Analysis", desc: "Snapshot history and historical log table reporting.", icon: BarChart3, color: "#38bdf8" },
    { title: "Real-time Dashboard", desc: "Unified dashboard with real-time sensor updates.", icon: LayoutDashboard, color: "#38bdf8" },
  ];

  const techStack = [
    { category: "Frontend", tech: "React + Vite", icon: Code2, color: "#38bdf8" },
    { category: "Styling", tech: "Tailwind CSS", icon: Palette, color: "#38bdf8" },
    { category: "Backend", tech: "FastAPI", icon: Server, color: "#34d399" },
    { category: "Database", tech: "Firebase", icon: Database, color: "#fbbf24" },
    { category: "AI / ML", tech: "Python", icon: Brain, color: "#a78bfa" },
    { category: "Computer Vision", tech: "YOLOv8", icon: Camera, color: "#f43f5e" },
    { category: "Weather API", tech: "Open-Meteo", icon: CloudSun, color: "#38bdf8" },
    { category: "3D Visualization", tech: "Three.js", icon: Boxes, color: "#a78bfa" },
  ];

  const mlOutputs = [
    { label: "Indoor Temperature", desc: "Predicts optimal indoor ambient temperature based on outdoor weather and thermal load.", icon: Thermometer, color: "#38bdf8" },
    { label: "Indoor Humidity", desc: "Estimates expected indoor relative humidity levels for respiratory comfort.", icon: Droplets, color: "#06b6d4" },
    { label: "Comfort Score", desc: "Computes overall comfort score (/100) combining thermal and humidity factors.", icon: Smile, color: "#34d399" },
    { label: "Learning Quality Index", desc: "Calculates cognitive learning quality index (/100) for optimal classroom environment.", icon: Brain, color: "#a78bfa" },
    { label: "Cooling Demand", desc: "Forecasts required HVAC cooling capacity to prevent energy waste and overheating.", icon: Wind, color: "#fbbf24" },
  ];

  const projectBenefits = [
    { title: "Improved Learning Environment", desc: "Optimizes classroom thermal comfort for maximum student focus.", icon: GraduationCap },
    { title: "Energy Efficiency", desc: "Reduces HVAC power waste through ML-guided cooling demand.", icon: Zap },
    { title: "Real-time Monitoring", desc: "Continuous live updates of weather, headcount, and predictions.", icon: TrendingUp },
    { title: "Data-Driven Decision Making", desc: "Actionable AI recommendations replace manual guessing.", icon: Brain },
    { title: "Smart Campus Infrastructure", desc: "Modernizes campus facility management with Industry 4.0 tech.", icon: Building2 },
    { title: "Reduced Manual Monitoring", desc: "Automates environmental tracking and alert severity logging.", icon: CheckCircle2 },
  ];

  const futureScope = [
    { title: "IoT Sensor Integration", desc: "Direct hardware telemetry integration with ESP32 & physical DHT22 sensors.", icon: Cpu },
    { title: "Smart Classroom Expansion", desc: "Scale Digital Twin monitoring to all auditorium and classroom facilities.", icon: Building2 },
    { title: "Multi-Building Digital Twins", desc: "Expand virtual 3D models across the entire campus infrastructure.", icon: Layers },
    { title: "Predictive Maintenance", desc: "ML failure prediction models for HVAC units and lighting fixtures.", icon: Lightbulb },
    { title: "Mobile Application", desc: "Native iOS and Android app for on-the-go facility managers.", icon: Smartphone },
    { title: "Automated Energy Optimization", desc: "Direct BACnet/Modbus control loops for autonomous HVAC actuation.", icon: Target },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section / Page Header */}
      <PageHeader
        title="About TwinVerse"
        subtitle="TwinVerse is a Smart Campus Digital Twin platform that combines Artificial Intelligence, Machine Learning, Computer Vision, real-time environmental monitoring, and interactive 3D visualization to improve seminar hall management, energy efficiency, and learning comfort."
      >
        <span className="flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3.5 py-1.5 text-xs font-semibold text-accent shadow-[0_0_15px_rgba(56,189,248,0.2)]">
          <Info size={14} /> Major Project Documentation
        </span>
      </PageHeader>

      <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-8">
        {/* ============================================================== */}
        {/* SECTION 1: PROJECT OVERVIEW                                    */}
        {/* ============================================================== */}
        <section className="space-y-4">
          <div className="card p-6 bg-gradient-to-br from-card via-card to-sidebar border border-accent/30 shadow-[0_0_20px_rgba(56,189,248,0.12)]">
            <div className="flex items-start gap-4">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-accent/20 text-accent">
                <Boxes size={22} />
              </div>
              <div className="space-y-3">
                <h2 className="text-base font-bold text-ink">Project Overview</h2>
                <div className="space-y-2.5 text-xs text-ink-dim leading-relaxed">
                  <p>
                    <strong className="text-ink">TwinVerse</strong> is a Digital Twin platform developed as a <strong className="text-accent">Final Year Engineering Project</strong>.
                  </p>
                  <p>
                    The system creates a virtual representation of a seminar hall by collecting environmental data, monitoring occupancy using computer vision, predicting indoor conditions using machine learning, and providing intelligent recommendations for better comfort, energy efficiency, and learning quality.
                  </p>
                  <p>
                    The project integrates modern web technologies with AI models to provide a centralized monitoring and decision-support system for smart campus infrastructure.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* SECTION 2: PROJECT OBJECTIVES                                  */}
        {/* ============================================================== */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Target size={18} className="text-accent" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-ink-faint">
              Section 2 · Project Objectives
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projectObjectives.map(({ title, desc, icon: Icon }) => (
              <div key={title} className="card p-5 space-y-2.5 transition-all duration-200 hover:border-line/80">
                <div className="flex items-center gap-2.5">
                  <div className="grid h-8 w-8 place-items-center rounded-xl bg-accent/10 text-accent">
                    <Icon size={18} />
                  </div>
                  <h3 className="text-xs font-bold text-ink">{title}</h3>
                </div>
                <p className="text-xs text-ink-dim leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ============================================================== */}
        {/* SECTION 3: KEY FEATURES                                        */}
        {/* ============================================================== */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-accent" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-ink-faint">
              Section 3 · Key Features
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {keyFeatures.map(({ title, desc, icon: Icon, color }) => (
              <div key={title} className="card p-4 space-y-2.5 transition-all duration-200 hover:border-line/80">
                <div className="flex items-center gap-2.5">
                  <div className="grid h-8 w-8 place-items-center rounded-xl bg-white/[0.04]">
                    <Icon size={18} style={{ color }} />
                  </div>
                  <h3 className="text-xs font-bold text-ink truncate">{title}</h3>
                </div>
                <p className="text-xs text-ink-dim leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ============================================================== */}
        {/* SECTION 4: TECHNOLOGY STACK                                    */}
        {/* ============================================================== */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Code2 size={18} className="text-accent" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-ink-faint">
              Section 4 · Technology Stack
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
            {techStack.map(({ category, tech, icon: Icon, color }) => (
              <div key={category} className="card p-4 flex items-center gap-3.5 transition-all duration-200 hover:border-line/80">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/[0.04] border border-line">
                  <Icon size={20} style={{ color }} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-ink-faint">{category}</p>
                  <p className="text-sm font-bold text-ink">{tech}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ============================================================== */}
        {/* SECTION 5: SYSTEM WORKFLOW                                     */}
        {/* ============================================================== */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Layers size={18} className="text-accent" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-ink-faint">
              Section 5 · System Workflow
            </h2>
          </div>

          <div className="card p-6 overflow-x-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-3 min-w-[700px]">
              {/* Step 1 */}
              <div className="flex-1 rounded-xl border border-line bg-white/[0.02] p-3 text-center space-y-1">
                <CloudSun size={18} className="mx-auto text-sky-400" />
                <p className="text-[11px] font-bold text-ink">Open-Meteo API</p>
                <p className="text-[10px] text-ink-faint">+ YOLOv8 Vision</p>
              </div>

              <ArrowRight size={18} className="text-accent shrink-0 hidden md:block" />
              <ArrowDown size={18} className="text-accent shrink-0 md:hidden" />

              {/* Step 2 */}
              <div className="flex-1 rounded-xl border border-line bg-white/[0.02] p-3 text-center space-y-1">
                <Server size={18} className="mx-auto text-emerald-400" />
                <p className="text-[11px] font-bold text-ink">FastAPI Backend</p>
                <p className="text-[10px] text-ink-faint">Validation & Routing</p>
              </div>

              <ArrowRight size={18} className="text-accent shrink-0 hidden md:block" />
              <ArrowDown size={18} className="text-accent shrink-0 md:hidden" />

              {/* Step 3 */}
              <div className="flex-1 rounded-xl border border-line bg-white/[0.02] p-3 text-center space-y-1">
                <Brain size={18} className="mx-auto text-purple-400" />
                <p className="text-[11px] font-bold text-ink">ML Prediction</p>
                <p className="text-[10px] text-ink-faint">Indoor & Comfort AI</p>
              </div>

              <ArrowRight size={18} className="text-accent shrink-0 hidden md:block" />
              <ArrowDown size={18} className="text-accent shrink-0 md:hidden" />

              {/* Step 4 */}
              <div className="flex-1 rounded-xl border border-line bg-white/[0.02] p-3 text-center space-y-1">
                <Database size={18} className="mx-auto text-amber-400" />
                <p className="text-[11px] font-bold text-ink">Firebase DB</p>
                <p className="text-[10px] text-ink-faint">Persistence & History</p>
              </div>

              <ArrowRight size={18} className="text-accent shrink-0 hidden md:block" />
              <ArrowDown size={18} className="text-accent shrink-0 md:hidden" />

              {/* Step 5 */}
              <div className="flex-1 rounded-xl border border-accent/40 bg-accent/10 p-3 text-center space-y-1 shadow-[0_0_12px_rgba(56,189,248,0.2)]">
                <Boxes size={18} className="mx-auto text-accent" />
                <p className="text-[11px] font-bold text-ink">React Dashboard</p>
                <p className="text-[10px] text-accent">+ Three.js 3D Twin</p>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* SECTION 6: AI PREDICTION OUTPUTS                               */}
        {/* ============================================================== */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Brain size={18} className="text-accent" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-ink-faint">
              Section 6 · AI Prediction Outputs
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {mlOutputs.map(({ label, desc, icon: Icon, color }) => (
              <div key={label} className="card p-4 space-y-2 transition-all duration-200 hover:border-line/80">
                <div className="flex items-center gap-2">
                  <div className="grid h-8 w-8 place-items-center rounded-xl bg-white/[0.04]">
                    <Icon size={16} style={{ color }} />
                  </div>
                  <h3 className="text-xs font-bold text-ink">{label}</h3>
                </div>
                <p className="text-xs text-ink-dim leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ============================================================== */}
        {/* SECTION 7: PROJECT BENEFITS                                    */}
        {/* ============================================================== */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Award size={18} className="text-accent" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-ink-faint">
              Section 7 · Project Benefits
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projectBenefits.map(({ title, desc, icon: Icon }) => (
              <div key={title} className="card p-5 space-y-2 transition-all duration-200 hover:border-line/80">
                <div className="flex items-center gap-2.5">
                  <div className="grid h-8 w-8 place-items-center rounded-xl bg-ok/10 text-ok">
                    <Icon size={18} />
                  </div>
                  <h3 className="text-xs font-bold text-ink">{title}</h3>
                </div>
                <p className="text-xs text-ink-dim leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ============================================================== */}
        {/* SECTION 8: FUTURE SCOPE                                        */}
        {/* ============================================================== */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Compass size={18} className="text-accent" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-ink-faint">
              Section 8 · Future Scope
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {futureScope.map(({ title, desc, icon: Icon }) => (
              <div key={title} className="card p-5 space-y-2 transition-all duration-200 hover:border-line/80">
                <div className="flex items-center gap-2.5">
                  <div className="grid h-8 w-8 place-items-center rounded-xl bg-accent/10 text-accent">
                    <Icon size={18} />
                  </div>
                  <h3 className="text-xs font-bold text-ink">{title}</h3>
                </div>
                <p className="text-xs text-ink-dim leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ============================================================== */}
        {/* SECTION 9: PROJECT INFORMATION                                 */}
        {/* ============================================================== */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <GraduationCap size={18} className="text-accent" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-ink-faint">
              Section 9 · Project Information
            </h2>
          </div>

          <div className="card p-6 bg-white/[0.02]">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-line/40">
              <div className="pt-2 sm:pt-0 sm:px-3 first:px-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-ink-faint block">Project Name</span>
                <span className="text-xs font-bold text-accent mt-1 block">TwinVerse – Smart Campus Digital Twin</span>
              </div>
              <div className="pt-3 sm:pt-0 sm:px-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-ink-faint block">Project Type</span>
                <span className="text-xs font-bold text-ink mt-1 block">Final Year Engineering Project</span>
              </div>
              <div className="pt-3 sm:pt-0 sm:px-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-ink-faint block">Department</span>
                <span className="text-xs font-bold text-ink mt-1 block">Computer Science & Engineering</span>
              </div>
              <div className="pt-3 sm:pt-0 sm:px-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-ink-faint block">Institution</span>
                <span className="text-xs font-bold text-ink mt-1 block">Sai Vidya Institute of Technology</span>
              </div>
              <div className="pt-3 sm:pt-0 sm:px-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-ink-faint block">Academic Year</span>
                <span className="text-xs font-bold text-ok mt-1 block">2026</span>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* SECTION 10: CLOSING CARD                                       */}
        {/* ============================================================== */}
        <section className="space-y-4">
          <div className="card p-6 bg-gradient-to-r from-accent/15 via-card to-purple-500/15 border border-accent/30 shadow-[0_0_30px_rgba(56,189,248,0.18)]">
            <div className="flex items-center gap-4">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-accent to-accent-deep text-white shadow-lg">
                <Boxes size={24} />
              </div>
              <p className="text-xs font-medium text-ink leading-relaxed">
                TwinVerse combines Artificial Intelligence, Machine Learning, Computer Vision, real-time environmental monitoring, and interactive 3D visualization into a single Digital Twin platform for creating smarter, more efficient, and data-driven campus infrastructure.
              </p>
            </div>
          </div>
        </section>
      </motion.div>
    </div>
  );
}
