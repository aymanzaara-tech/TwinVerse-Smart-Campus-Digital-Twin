import { motion } from "framer-motion";
import { Construction } from "lucide-react";

/**
 * Temporary placeholder rendered by pages that haven't been built yet.
 * Each page module will replace its placeholder with the real UI.
 */
export default function ComingSoon({ title, subtitle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="card flex min-h-[60vh] flex-col items-center justify-center gap-3 p-10 text-center"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent">
        <Construction size={26} />
      </div>
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="max-w-md text-sm text-ink-dim">
        {subtitle ?? "This module is scaffolded and routed. Its UI is generated in an upcoming step."}
      </p>
    </motion.div>
  );
}
