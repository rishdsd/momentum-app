import Link from "next/link";
import { BarChart3, BookOpen, Home, ListChecks, Settings, Target } from "lucide-react";
import { AuthStatus } from "@/components/auth-status";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/log", label: "Log", icon: ListChecks },
  { href: "/journal", label: "Journal", icon: BookOpen },
  { href: "/progress", label: "Progress", icon: BarChart3 },
  { href: "/trackers", label: "Trackers", icon: Target },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link className="brand" href="/">
          <span className="brand-mark">M</span>
          <span>
            <small>Personal OS</small>
            <strong>Momentum</strong>
          </span>
        </Link>
        <nav className="nav-list" aria-label="Primary">
          {navItems.map((item) => (
            <Link className="nav-item" href={item.href} key={item.href}>
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="streak-panel">
          <span>Launch path</span>
          <strong>Supabase ready</strong>
          <p>Prototype UI is becoming real routes, data models, and deployable infrastructure.</p>
        </div>
        <AuthStatus />
      </aside>
      <main className="main-content">{children}</main>
      <nav className="bottom-tabs" aria-label="Mobile primary">
        {navItems.slice(0, 4).map((item) => (
          <Link className={item.href === "/log" ? "log-tab" : ""} href={item.href} key={item.href}>
            <item.icon size={18} />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
