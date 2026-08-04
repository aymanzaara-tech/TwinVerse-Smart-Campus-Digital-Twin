import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "@/layout/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import Loader from "@/components/Loader";

// Pages are lazy-loaded so each route becomes its own chunk
// (keeps the initial bundle small as the app grows).
const Home = lazy(() => import("@/pages/Home"));
const Login = lazy(() => import("@/pages/Login"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const DigitalTwin = lazy(() => import("@/pages/DigitalTwin"));
const Analytics = lazy(() => import("@/pages/Analytics"));
const Alerts = lazy(() => import("@/pages/Alerts"));
const History = lazy(() => import("@/pages/History"));
const SystemArchitecture = lazy(() => import("@/pages/SystemArchitecture"));
const About = lazy(() => import("@/pages/About"));
const Settings = lazy(() => import("@/pages/Settings"));
const NotFound = lazy(() => import("@/pages/NotFound"));

export default function AppRoutes() {
  return (
    <Suspense fallback={<Loader label="Loading TwinVerse…" />}>
      <Routes>
        {/* ---- Public ---- */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* ---- Protected dashboard shell ---- */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/digital-twin" element={<DigitalTwin />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/history" element={<History />} />
            <Route path="/system-architecture" element={<SystemArchitecture />} />
            <Route path="/about" element={<About />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Route>

        <Route path="/home" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
