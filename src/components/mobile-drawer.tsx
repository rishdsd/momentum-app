"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BarChart3, BookOpen, Home, ListChecks, LogOut, Menu, Settings, Target, X } from "lucide-react";
import { signOut } from "@/app/actions";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/log", label: "Log", icon: ListChecks },
  { href: "/journal", label: "Journal", icon: BookOpen },
  { href: "/progress", label: "Progress", icon: BarChart3 },
  { href: "/trackers", label: "Trackers", icon: Target },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function MobileDrawer() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  function closeDrawer() {
    setIsOpen(false);
    triggerRef.current?.focus();
  }

  return (
    <>
      <header className="mobile-app-bar">
        <button
          aria-controls="mobile-navigation-drawer"
          aria-expanded={isOpen}
          aria-label="Open navigation menu"
          className="mobile-menu-button"
          onClick={() => setIsOpen(true)}
          ref={triggerRef}
          type="button"
        >
          <Menu size={24} />
        </button>
        <Link className="mobile-brand" href="/">
          <span className="brand-mark">M</span>
          <strong>Momentum</strong>
        </Link>
      </header>

      <div className={`drawer-layer ${isOpen ? "open" : ""}`} aria-hidden={!isOpen}>
        <button aria-label="Close navigation menu" className="drawer-backdrop" onClick={closeDrawer} type="button" />
        <aside
          aria-label="Mobile navigation"
          aria-modal="true"
          className="mobile-drawer"
          id="mobile-navigation-drawer"
          role="dialog"
        >
          <div className="drawer-header">
            <Link className="brand" href="/" onClick={closeDrawer}>
              <span className="brand-mark">M</span>
              <span>
                <small>Personal OS</small>
                <strong>Momentum</strong>
              </span>
            </Link>
            <button
              aria-label="Close navigation menu"
              className="mobile-menu-button"
              onClick={closeDrawer}
              ref={closeRef}
              type="button"
            >
              <X size={22} />
            </button>
          </div>

          <nav className="drawer-nav" aria-label="Mobile primary">
            {navItems.map((item) => {
              const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <Link
                  aria-current={isActive ? "page" : undefined}
                  className={isActive ? "active" : ""}
                  href={item.href}
                  key={item.href}
                  onClick={closeDrawer}
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <form action={signOut} className="drawer-logout">
            <button type="submit">
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </form>
        </aside>
      </div>
    </>
  );
}
