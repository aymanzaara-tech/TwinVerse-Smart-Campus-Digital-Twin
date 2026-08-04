// -------------------------------------------------------------
// Single source of truth for app navigation.
// Sidebar, Router, and search all read from here.
// -------------------------------------------------------------
import {
  LayoutDashboard, Building2, TrendingUp,
  AlertTriangle, ScrollText, Network, Info, Settings,
} from "lucide-react";

export const NAV_ITEMS = [
  { path: "/dashboard",          label: "Dashboard",            icon: LayoutDashboard },
  { path: "/digital-twin",       label: "Digital Twin",         icon: Building2 },
  { path: "/analytics",          label: "Analytics",            icon: TrendingUp },
  { path: "/alerts",             label: "Alerts",               icon: AlertTriangle },
  { path: "/history",            label: "History",              icon: ScrollText },
  { path: "/system-architecture",label: "System Architecture",  icon: Network },
  { path: "/about",              label: "About Project",        icon: Info },
  { path: "/settings",           label: "Settings",             icon: Settings },
];
