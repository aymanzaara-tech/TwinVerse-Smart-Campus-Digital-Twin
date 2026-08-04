import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Boxes, ArrowRight, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

/**
 * Minimal public landing (hero only for now — the full landing
 * page with features / tech stack / team is the next module).
 */
export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="grid min-h-screen place-items-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl text-center"
      >
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-accent to-accent-deep shadow-[0_0_30px_rgba(56,189,248,0.4)]">
          <Boxes size={26} className="text-white" />
        </div>

        <h1 className="mt-6 text-4xl font-extrabold tracking-tight md:text-5xl">
          Twin<span className="text-gradient">Verse</span>
        </h1>
        <p className="mt-2 text-sm font-medium uppercase tracking-[0.2em] text-ink-faint">
          Smart Campus Digital Twin
        </p>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-ink-dim">
          A real-time digital twin of the campus Seminar Hall — live occupancy from
          YOLOv8 vision, environmental sensing, energy analytics, and a comfort-driven
          Learning Quality Index, all on one industrial dashboard.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-accent to-accent-deep px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(56,189,248,0.5)] transition-transform hover:scale-[1.02]"
            >
              <LayoutDashboard size={16} /> Open Dashboard
            </Link>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-accent to-accent-deep px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(56,189,248,0.5)] transition-transform hover:scale-[1.02]"
            >
              Sign in <ArrowRight size={16} />
            </Link>
          )}
          <Link
            to="/about"
            className="rounded-xl border border-line bg-white/[0.03] px-5 py-2.5 text-sm font-medium text-ink-dim transition-colors hover:bg-white/[0.06] hover:text-ink"
          >
            About the project
          </Link>
        </div>

        <p className="mt-10 text-[11px] text-ink-faint">
          Full landing page (features · tech stack · team) arrives in the next module.
        </p>
      </motion.div>
    </div>
  );
}
