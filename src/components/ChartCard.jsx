import { motion } from "framer-motion";

/**
 * Generic card frame for charts: title, subtitle, optional
 * header actions, animated entrance. Keeps chart pages DRY.
 */
export default function ChartCard({ title, subtitle, actions, children, className = "" }) {
  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4 }}
      className={`card flex flex-col p-5 ${className}`}
    >
      {(title || actions) && (
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            {title && <h3 className="text-sm font-semibold">{title}</h3>}
            {subtitle && <p className="text-xs text-ink-faint">{subtitle}</p>}
          </div>
          {actions}
        </div>
      )}
      {children}
    </motion.div>
  );
}
