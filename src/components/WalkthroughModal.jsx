import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Compass, X, ArrowRight, ArrowLeft, CheckCircle2,
  CloudSun, Camera, Sparkles, Brain, Boxes, Building2,
  Layers, Network, Eye
} from "lucide-react";

const TOUR_STEPS = [
  {
    step: 1,
    title: "Outdoor Weather & Live Headcount",
    subtitle: "Real-time Environmental Telemetry & Computer Vision Headcount",
    path: "/dashboard",
    icon: CloudSun,
    badgeColor: "border-sky-500/30 bg-sky-500/10 text-sky-400",
    bullets: [
      "Retrieves real-time outdoor temperature (°C) & humidity (%) from Open-Meteo Weather API.",
      "Uses YOLOv8 computer vision models to track headcount and occupancy in the Seminar Hall.",
      "Polls live sensor telemetry automatically every 5 seconds.",
    ],
  },
  {
    step: 2,
    title: "ML Prediction Models & Comfort Index",
    subtitle: "AI Environmental Forecasts & Thermal Comfort Index",
    path: "/analytics",
    icon: Sparkles,
    badgeColor: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
    bullets: [
      "Infers indoor ambient temperature, humidity, and HVAC cooling demand.",
      "Computes overall thermal Comfort Score (/100) and cognitive Learning Quality Index.",
      "Provides historical trend charts for deep analytics and performance evaluation.",
    ],
  },
  {
    step: 3,
    title: "Three.js 3D Virtual Seminar Hall",
    subtitle: "Interactive 3D WebGL Digital Twin & Physical Layout",
    path: "/digital-twin",
    icon: Boxes,
    badgeColor: "border-purple-500/30 bg-purple-500/10 text-purple-400",
    bullets: [
      "Renders a 1:1 3D virtual representation of the Seminar Hall using Three.js.",
      "Features interactive preset camera views, orbit controls, and ceiling lighting fixtures.",
      "Displays seat allocation maps and HVAC ventilation fan status.",
    ],
  },
  {
    step: 4,
    title: "System Architecture & API Pipeline",
    subtitle: "End-to-End Data Pipeline & Backend Integration",
    path: "/system-architecture",
    icon: Network,
    badgeColor: "border-amber-500/30 bg-amber-500/10 text-amber-400",
    bullets: [
      "Architectural flow: Open-Meteo + YOLOv8 → FastAPI → ML Inference → Firebase DB → React + Three.js.",
      "Exposes REST endpoints: GET /api/analytics/dashboard & GET /api/analytics/history.",
      "Operational status diagnostics for backend services and AI inference engines.",
    ],
  },
];

export default function WalkthroughModal({ isOpen, onClose }) {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const activeStepData = TOUR_STEPS[currentStep];
  const StepIcon = activeStepData.icon;

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      const nextIndex = currentStep + 1;
      setCurrentStep(nextIndex);
      navigate(TOUR_STEPS[nextIndex].path);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      const prevIndex = currentStep - 1;
      setCurrentStep(prevIndex);
      navigate(TOUR_STEPS[prevIndex].path);
    }
  };

  const handleStepClick = (index) => {
    setCurrentStep(index);
    navigate(TOUR_STEPS[index].path);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/75 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          className="relative z-10 w-full max-w-xl rounded-2xl border border-accent/30 bg-sidebar/95 p-6 shadow-[0_0_35px_rgba(56,189,248,0.2)] backdrop-blur-xl space-y-6"
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between border-b border-line pb-4">
            <div className="flex items-center gap-2.5">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-accent/20 text-accent">
                <Compass size={20} className="animate-spin-slow" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-ink">Faculty & Evaluator Tour</h2>
                <p className="text-[11px] text-ink-faint">Step {currentStep + 1} of {TOUR_STEPS.length}</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-ink-faint transition hover:bg-white/10 hover:text-ink"
            >
              <X size={18} />
            </button>
          </div>

          {/* Progress Indicators */}
          <div className="grid grid-cols-4 gap-2">
            {TOUR_STEPS.map((s, idx) => (
              <button
                key={s.step}
                onClick={() => handleStepClick(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentStep
                    ? "bg-accent shadow-[0_0_10px_rgba(56,189,248,0.6)]"
                    : idx < currentStep
                    ? "bg-ok/60"
                    : "bg-white/10"
                }`}
              />
            ))}
          </div>

          {/* Active Step Content */}
          <div className="space-y-4 pt-1">
            <div className="flex items-start gap-4">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/[0.04] border border-line">
                <StepIcon size={24} className="text-accent" />
              </div>
              <div className="space-y-1">
                <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${activeStepData.badgeColor}`}>
                  Step {activeStepData.step}
                </span>
                <h3 className="text-base font-bold text-ink leading-tight">{activeStepData.title}</h3>
                <p className="text-xs text-ink-faint">{activeStepData.subtitle}</p>
              </div>
            </div>

            {/* Bullet Points */}
            <div className="rounded-xl border border-line bg-white/[0.02] p-4 space-y-2.5">
              {activeStepData.bullets.map((point, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 size={15} className="text-accent shrink-0 mt-0.5" />
                  <p className="text-xs text-ink-dim leading-relaxed">{point}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-line">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className={`flex items-center gap-2 rounded-xl border border-line px-4 py-2 text-xs font-semibold transition ${
                currentStep === 0
                  ? "opacity-30 cursor-not-allowed text-ink-faint"
                  : "text-ink hover:bg-white/5"
              }`}
            >
              <ArrowLeft size={14} /> Previous
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="text-xs font-medium text-ink-faint hover:text-ink transition"
              >
                Skip Tour
              </button>

              <button
                onClick={handleNext}
                className="flex items-center gap-2 rounded-xl bg-accent px-4 py-2 text-xs font-bold text-white shadow-lg hover:bg-accent/90 transition"
              >
                {currentStep === TOUR_STEPS.length - 1 ? (
                  <>Finish Tour <CheckCircle2 size={14} /></>
                ) : (
                  <>Next Step <ArrowRight size={14} /></>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
