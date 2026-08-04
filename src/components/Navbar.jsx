import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu, Search, Bell, ChevronDown, CalendarDays, Clock3,
  UserRound, Settings, LogOut, AlertTriangle, Info, Flame, Moon,
  Compass
} from "lucide-react";
import { NAV_ITEMS } from "@/routes/nav";
import { alerts } from "@/data/mockAlerts";
import { currentUser } from "@/data/mockUser";
import { useAuth } from "@/context/AuthContext";
import useClock from "@/hooks/useClock";
import useClickOutside from "@/hooks/useClickOutside";
import WalkthroughModal from "@/components/WalkthroughModal";

// Shared dropdown animation
const drop = {
  initial: { opacity: 0, y: -6, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -6, scale: 0.98 },
  transition: { duration: 0.15 },
};

const severityIcon = {
  critical: { Icon: Flame, cls: "bg-crit/10 text-crit" },
  warning: { Icon: AlertTriangle, cls: "bg-warn/10 text-warn" },
  info: { Icon: Info, cls: "bg-accent/10 text-accent" },
};

export default function Navbar({ onMenuClick }) {
  const navigate = useNavigate();
  const { date, time } = useClock();
  const { user, logout } = useAuth();
  const profile = user ?? currentUser;

  const [open, setOpen] = useState(null);
  const [query, setQuery] = useState("");
  const [tourOpen, setTourOpen] = useState(false);

  const bellRef = useRef(null);
  const profileRef = useRef(null);
  const searchRef = useRef(null);
  useClickOutside(bellRef, () => open === "bell" && setOpen(null));
  useClickOutside(profileRef, () => open === "profile" && setOpen(null));
  useClickOutside(searchRef, () => open === "search" && setOpen(null));

  const results = query.trim()
    ? NAV_ITEMS.filter((i) =>
        i.label.toLowerCase().includes(query.trim().toLowerCase())
      )
    : [];

  const goTo = (path) => {
    setQuery("");
    setOpen(null);
    navigate(path);
  };

  const searchBox = (
    <div className="relative w-full" ref={searchRef}>
      <Search
        size={16}
        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint"
      />
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && results[0]) goTo(results[0].path);
          if (e.key === "Escape") setQuery("");
        }}
        placeholder="Search pages…"
        aria-label="Search pages"
        className="w-full rounded-xl border border-line bg-white/[0.04] py-2 pl-10 pr-4 text-sm
          text-ink placeholder:text-ink-faint outline-none transition-colors
          focus:border-accent/50 focus:bg-white/[0.06]"
      />
      <AnimatePresence>
        {results.length > 0 && (
          <motion.ul {...drop} className="glass absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden p-1.5">
            {results.map(({ path, label, icon: Icon }) => (
              <li key={path}>
                <button
                  onClick={() => goTo(path)}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm
                    text-ink-dim transition-colors hover:bg-white/5 hover:text-ink"
                >
                  <Icon size={16} className="text-accent" />
                  {label}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <>
      <header className="sticky top-0 z-20 border-b border-line bg-bg/80 backdrop-blur-md">
        <div className="flex items-center gap-3 px-4 py-3 lg:px-6">
          {/* Mobile: open sidebar drawer */}
          <button
            onClick={onMenuClick}
            aria-label="Open menu"
            className="rounded-lg p-2 text-ink-dim hover:bg-white/5 hover:text-ink lg:hidden"
          >
            <Menu size={20} />
          </button>

          {/* Search */}
          <div className="hidden max-w-md flex-1 md:block">{searchBox}</div>
          <button
            onClick={() => setOpen(open === "search" ? null : "search")}
            aria-label="Search"
            className="rounded-lg p-2 text-ink-dim hover:bg-white/5 hover:text-ink md:hidden"
          >
            <Search size={19} />
          </button>

          <div className="flex-1 md:hidden" />

          {/* ---- Faculty Tour Button ---- */}
          <button
            onClick={() => setTourOpen(true)}
            className="flex items-center gap-2 rounded-xl border border-accent/40 bg-accent/10 px-3.5 py-1.5 text-xs font-bold text-accent shadow-[0_0_15px_rgba(56,189,248,0.2)] transition hover:bg-accent/20"
          >
            <Compass size={15} className="animate-spin-slow text-accent" />
            <span className="hidden sm:inline">Start Tour</span>
          </button>

          {/* ---- Live date & time ---- */}
          <div className="hidden items-center gap-4 rounded-xl border border-line bg-white/[0.03] px-4 py-2 xl:flex">
            <span className="flex items-center gap-2 text-xs text-ink-dim">
              <CalendarDays size={14} className="text-accent" />
              {date}
            </span>
            <span className="h-4 w-px bg-line" />
            <span className="flex items-center gap-2 font-mono text-xs text-ink">
              <Clock3 size={14} className="text-accent" />
              {time}
            </span>
          </div>

          {/* ---- Dark theme indicator ---- */}
          <span
            title="Dark theme active"
            className="hidden rounded-lg border border-line bg-white/[0.03] p-2 text-accent sm:grid sm:place-items-center"
          >
            <Moon size={17} />
          </span>

          {/* ---- Notifications ---- */}
          <div className="relative" ref={bellRef}>
            <button
              onClick={() => setOpen(open === "bell" ? null : "bell")}
              aria-label={`Notifications (${alerts.length} unread)`}
              className="relative rounded-lg p-2 text-ink-dim transition-colors hover:bg-white/5 hover:text-ink"
            >
              <Bell size={19} />
              <span className="absolute right-1 top-1 grid h-4 w-4 place-items-center rounded-full bg-crit text-[10px] font-bold text-white">
                {alerts.length}
              </span>
            </button>

            <AnimatePresence>
              {open === "bell" && (
                <motion.div {...drop} className="glass absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden">
                  <div className="flex items-center justify-between border-b border-line px-4 py-3">
                    <p className="text-sm font-semibold">Notifications</p>
                    <span className="rounded-full bg-crit/10 px-2 py-0.5 text-[11px] font-medium text-crit">
                      {alerts.length} new
                    </span>
                  </div>
                  <ul className="max-h-72 overflow-y-auto p-1.5">
                    {alerts.map((a) => {
                      const { Icon, cls } = severityIcon[a.severity];
                      return (
                        <li key={a.id}>
                          <button
                            onClick={() => goTo("/alerts")}
                            className="flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-white/5"
                          >
                            <span className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg ${cls}`}>
                              <Icon size={15} />
                            </span>
                            <span className="min-w-0">
                              <span className="block truncate text-sm font-medium">{a.title}</span>
                              <span className="block truncate text-xs text-ink-dim">{a.description}</span>
                              <span className="mt-0.5 block text-[11px] text-ink-faint">{a.time}</span>
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                  <button
                    onClick={() => goTo("/alerts")}
                    className="block w-full border-t border-line py-2.5 text-center text-xs font-medium text-accent transition-colors hover:bg-white/5"
                  >
                    View all alerts
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ---- Profile ---- */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setOpen(open === "profile" ? null : "profile")}
              className="flex items-center gap-3 rounded-xl border border-line bg-white/[0.03] py-1.5 pl-1.5 pr-3
                transition-colors hover:bg-white/[0.06]"
            >
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-accent to-accent-deep text-sm font-bold text-white">
                {profile.initials}
              </span>
              <span className="hidden text-left sm:block">
                <span className="block text-sm font-semibold leading-tight">{profile.name}</span>
                <span className="block text-[11px] leading-tight text-ink-faint">{profile.role}</span>
              </span>
              <ChevronDown
                size={14}
                className={`hidden text-ink-faint transition-transform sm:block ${open === "profile" ? "rotate-180" : ""}`}
              />
            </button>

            <AnimatePresence>
              {open === "profile" && (
                <motion.div {...drop} className="glass absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden p-1.5">
                  <div className="border-b border-line px-3 py-2.5">
                    <p className="text-sm font-semibold">{profile.name}</p>
                    <p className="truncate text-xs text-ink-faint">{profile.email}</p>
                  </div>
                  <button
                    onClick={() => goTo("/settings")}
                    className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-ink-dim transition-colors hover:bg-white/5 hover:text-ink"
                  >
                    <UserRound size={16} /> Profile
                  </button>
                  <button
                    onClick={() => goTo("/settings")}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-ink-dim transition-colors hover:bg-white/5 hover:text-ink"
                  >
                    <Settings size={16} /> Settings
                  </button>
                  <button
                    onClick={() => { logout(); goTo("/login"); }}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-crit transition-colors hover:bg-crit/10"
                  >
                    <LogOut size={16} /> Log out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile search panel */}
        <AnimatePresence>
          {open === "search" && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden border-t border-line px-4 pb-3 pt-2 md:hidden"
            >
              {searchBox}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Guided Walkthrough Tour Modal */}
      <WalkthroughModal isOpen={tourOpen} onClose={() => setTourOpen(false)} />
    </>
  );
}
