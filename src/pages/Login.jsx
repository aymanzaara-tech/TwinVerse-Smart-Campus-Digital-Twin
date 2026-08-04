import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Boxes, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

/**
 * Login page — glassmorphism card over the blueprint background.
 * Demo auth: any email + password (4+ chars). On success the
 * user is sent back to wherever ProtectedRoute intercepted them.
 */
export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from ?? "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!email.includes("@")) return setError("Please enter a valid email address.");
    if (password.length < 4) return setError("Password must be at least 4 characters.");
    login(email);
    navigate(redirectTo, { replace: true });
  };

  const field =
    "w-full rounded-xl border border-line bg-white/[0.04] py-2.5 pl-10 pr-10 text-sm " +
    "text-ink placeholder:text-ink-faint outline-none transition-colors " +
    "focus:border-accent/50 focus:bg-white/[0.06]";

  return (
    <div className="grid min-h-screen place-items-center p-4">
      {/* ambient glow behind the card */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-accent/10 blur-[110px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="glass w-full max-w-sm p-7"
      >
        {/* Brand */}
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-accent to-accent-deep shadow-[0_0_24px_rgba(56,189,248,0.4)]">
            <Boxes size={22} className="text-white" />
          </div>
          <h1 className="mt-3 text-xl font-bold">
            Twin<span className="text-gradient">Verse</span>
          </h1>
          <p className="text-xs text-ink-faint">Smart Campus Digital Twin · Sign in</p>
        </div>

        <form onSubmit={submit} className="space-y-3.5">
          <div className="relative">
            <Mail size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" />
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              placeholder="harini@twinverse.edu"
              aria-label="Email"
              className={field}
            />
          </div>

          <div className="relative">
            <Lock size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" />
            <input
              type={showPw ? "text" : "password"}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              placeholder="Password"
              aria-label="Password"
              className={field}
            />
            <button
              type="button"
              onClick={() => setShowPw((s) => !s)}
              aria-label={showPw ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink"
            >
              {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg border border-crit/20 bg-crit/10 px-3 py-2 text-xs text-crit"
            >
              {error}
            </motion.p>
          )}

          <motion.button
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.985 }}
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent to-accent-deep
              py-2.5 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(56,189,248,0.5)]"
          >
            Sign in <ArrowRight size={15} />
          </motion.button>
        </form>

        <p className="mt-4 text-center text-[11px] text-ink-faint">
          Demo build — any email &amp; password (4+ chars) works.
        </p>

        <Link
          to="/"
          className="mt-4 block text-center text-xs text-ink-dim transition-colors hover:text-accent"
        >
          ← Back to home
        </Link>
      </motion.div>
    </div>
  );
}
