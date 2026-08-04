import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Boxes, ChevronsLeft, ChevronsRight, X } from "lucide-react";
import { NAV_ITEMS } from "@/routes/nav";
import useMediaQuery from "@/hooks/useMediaQuery";

// Sidebar widths (px)
const EXPANDED = 264;
const COLLAPSED = 84;

/**
 * Collapsible sidebar.
 * - Desktop (lg+): in-flow column whose width animates between
 *   EXPANDED and COLLAPSED. Collapsed mode shows icons + tooltips.
 * - Mobile: off-canvas drawer controlled by `mobileOpen`, closed
 *   via the X button, the backdrop (rendered by DashboardLayout), or
 *   navigating to a page.
 */
export default function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }) {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  // On mobile the drawer is always fully expanded
  const isCollapsed = isDesktop && collapsed;

  return (
    <motion.aside
      animate={{ width: isDesktop ? (isCollapsed ? COLLAPSED : EXPANDED) : EXPANDED }}
      transition={{ type: "spring", stiffness: 260, damping: 30 }}
      className={`fixed inset-y-0 left-0 z-40 flex flex-col border-r border-line bg-sidebar
        transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0
        ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
    >
      {/* ---------- Logo ---------- */}
      <div className="flex items-center gap-3 px-4 py-5">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-accent to-accent-deep shadow-[0_0_20px_rgba(56,189,248,0.35)]">
          <Boxes size={20} className="text-white" />
        </div>

        <AnimatePresence initial={false}>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.18 }}
              className="min-w-0"
            >
              <p className="truncate text-lg font-bold leading-tight">
                Twin<span className="text-gradient">Verse</span>
              </p>
              <p className="truncate text-[11px] text-ink-faint">
                Smart Campus Digital Twin
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Close (mobile only) */}
        <button
          onClick={onMobileClose}
          aria-label="Close menu"
          className="ml-auto rounded-lg p-2 text-ink-dim hover:bg-white/5 hover:text-ink lg:hidden"
        >
          <X size={18} />
        </button>
      </div>

      {/* ---------- Menu ---------- */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-2">
        <ul className="space-y-1">
          {NAV_ITEMS.map(({ path, label, icon: Icon }) => (
            <li key={path} className="group relative">
              <NavLink
                to={path}
                className={({ isActive }) =>
                  `relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium
                   outline-none transition-colors duration-200
                   focus-visible:ring-2 focus-visible:ring-accent/60
                   ${isCollapsed ? "justify-center" : ""}
                    ${
                      isActive
                        ? "border border-sky-400/40 bg-gradient-to-r from-blue-600/40 via-sky-500/20 to-purple-500/20 text-sky-300 shadow-[0_0_25px_rgba(56,189,248,0.35)]"
                        : "border border-transparent text-ink-dim hover:bg-white/5 hover:text-ink"
                    }`
                 }
              >
                {({ isActive }) => (
                  <>
                    {/* Left indicator bar for the active item */}
                    {isActive && !isCollapsed && (
                      <motion.span
                        layoutId="sidebar-active-bar"
                        className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-accent"
                      />
                    )}
                    <Icon size={19} className="shrink-0" />
                    {!isCollapsed && <span className="truncate">{label}</span>}
                  </>
                )}
              </NavLink>

              {/* Tooltip when collapsed (desktop only) */}
              {isCollapsed && (
                <span
                  className="pointer-events-none absolute left-full top-1/2 z-50 ml-3 -translate-y-1/2
                    whitespace-nowrap rounded-lg border border-line bg-card px-2.5 py-1.5 text-xs
                    text-ink opacity-0 shadow-xl transition-opacity duration-150 group-hover:opacity-100"
                >
                  {label}
                </span>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* ---------- System status card ---------- */}
      <div className="px-3 pb-3">
        {isCollapsed ? (
          <div className="grid place-items-center py-3" title="All Systems Operational">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ok opacity-60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-ok" />
            </span>
          </div>
        ) : (
          <div className="card rounded-2xl bg-white/[0.03] p-3.5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-faint">
              System Status
            </p>
            <div className="mt-2 flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ok opacity-60" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-ok" />
              </span>
              <span className="truncate rounded-full bg-ok/10 px-2.5 py-1 text-xs font-medium text-ok">
                All Systems Operational
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ---------- Collapse toggle (desktop only) ---------- */}
      <div className="border-t border-line p-3 max-lg:hidden">
        <button
          onClick={onToggle}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-ink-dim
            transition-colors hover:bg-white/5 hover:text-ink
            ${isCollapsed ? "justify-center" : ""}`}
        >
          {isCollapsed ? <ChevronsRight size={19} /> : <ChevronsLeft size={19} />}
          {!isCollapsed && <span>Collapse</span>}
        </button>
      </div>
    </motion.aside>
  );
}
