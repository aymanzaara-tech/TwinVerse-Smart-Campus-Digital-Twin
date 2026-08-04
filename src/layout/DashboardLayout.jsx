import { useState, useEffect, Component } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import useLocalStorage from "@/hooks/useLocalStorage";
import { AlertTriangle, RefreshCw } from "lucide-react";

/** React Error Boundary to catch render crashes and prevent blank screens */
class PageErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("DashboardLayout caught a rendering error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="card m-6 flex flex-col items-center justify-center p-12 text-center space-y-4">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-crit/10 text-crit">
            <AlertTriangle size={24} />
          </div>
          <div>
            <h3 className="text-base font-bold text-ink">Page Render Error</h3>
            <p className="mt-1 text-xs font-mono text-crit/90 max-w-md break-words">
              {this.state.error?.message || "An unexpected error occurred while loading this page."}
            </p>
          </div>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            className="flex items-center gap-2 rounded-xl bg-accent px-4 py-2 text-xs font-bold text-white shadow-lg hover:bg-accent/90 transition"
          >
            <RefreshCw size={14} /> Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useLocalStorage("tv-sidebar-collapsed", false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();

  // Close the mobile drawer whenever the route changes
  useEffect(() => setMobileOpen(false), [pathname]);

  return (
    <div className="flex min-h-screen">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Backdrop behind the mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar onMenuClick={() => setMobileOpen(true)} />

        {/* Page transition with Error Boundary wrapper */}
        <main className="flex-1 p-4 lg:p-6">
          <PageErrorBoundary key={pathname}>
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </PageErrorBoundary>
        </main>

        <Footer />
      </div>
    </div>
  );
}
