import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Compass, ArrowLeft } from "lucide-react";

/** 404 page rendered inside the dashboard shell. */
export default function NotFound() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="card flex min-h-[60vh] flex-col items-center justify-center gap-3 p-10 text-center"
    >
      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-crit/10 text-crit">
        <Compass size={26} />
      </span>
      <p className="font-mono text-5xl font-bold text-gradient">404</p>
      <h1 className="text-lg font-semibold">Page not found</h1>
      <p className="max-w-sm text-sm text-ink-dim">
        The route you requested doesn't exist in the TwinVerse dashboard.
      </p>
      <Link
        to="/dashboard"
        className="mt-2 flex items-center gap-2 rounded-xl border border-line bg-white/[0.03] px-4 py-2 text-sm font-medium text-accent transition-colors hover:bg-white/[0.06]"
      >
        <ArrowLeft size={15} /> Back to Dashboard
      </Link>
    </motion.div>
  );
}
