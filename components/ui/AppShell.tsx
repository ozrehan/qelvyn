"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Server,
  Activity,
  HardDrive,
  CreditCard,
  Settings,
  Users,
  ScrollText,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { Logo } from "./Logo";

export interface AppUser {
  name?: string | null;
  email?: string | null;
  isAdmin: boolean;
}

const NAV = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Workstations", href: "/workstations", icon: Server },
  { label: "Usage", href: "/usage", icon: Activity },
  { label: "Storage", href: "/storage", icon: HardDrive },
  { label: "Billing", href: "/billing", icon: CreditCard },
  { label: "Settings", href: "/settings", icon: Settings },
];

const ADMIN_NAV = [
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Workstations", href: "/admin/workstations", icon: Server },
  { label: "Audit logs", href: "/admin/audit-logs", icon: ScrollText },
];

function NavList({
  items,
  onNavigate,
}: {
  items: typeof NAV;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  return (
    <ul className="flex flex-col gap-1">
      {items.map((item) => {
        const active = pathname === item.href || pathname.startsWith(item.href + "/");
        const Icon = item.icon;
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onNavigate}
              className={`flex items-center gap-3 px-3 py-2 text-sm ${
                active ? "bg-ink text-paper" : "text-smoke hover:text-ink hover:bg-ink/5"
              }`}
              aria-current={active ? "page" : undefined}
            >
              <Icon size={16} />
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export function AppShell({ children, user }: { children: React.ReactNode; user: AppUser }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex fixed inset-y-0 left-0 w-60 flex-col border-r border-ink/10 bg-paper">
        <div className="flex h-16 items-center gap-2.5 border-b border-ink/10 px-4">
          <Logo className="h-6 w-6" />
          <span className="font-display text-sm font-bold tracking-widest">QELVYN</span>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="App">
          <NavList items={NAV} />
          {user.isAdmin && (
            <div className="mt-6">
              <p className="px-3 text-[11px] font-medium uppercase tracking-widest text-smoke">
                Admin
              </p>
              <div className="mt-2">
                <NavList items={ADMIN_NAV} />
              </div>
            </div>
          )}
        </nav>
        <div className="border-t border-ink/10 px-4 py-3">
          <p className="truncate text-sm font-medium">{user.name ?? user.email}</p>
          {user.name && user.email && (
            <p className="truncate text-xs text-smoke">{user.email}</p>
          )}
        </div>
      </aside>

      {/* Mobile topbar + drawer */}
      <div className="md:hidden sticky top-0 z-50 border-b border-ink/10 bg-paper">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2.5">
            <Logo className="h-6 w-6" />
            <span className="font-display text-sm font-bold tracking-widest">QELVYN</span>
          </div>
          <button
            className="p-2"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        {open && (
          <nav className="border-t border-ink/10 px-4 py-4" aria-label="App">
            <NavList items={user.isAdmin ? [...NAV, ...ADMIN_NAV] : NAV} onNavigate={() => setOpen(false)} />
            <form action="/api/auth/signout" method="post" className="mt-4 border-t border-ink/10 pt-4">
              <button
                type="submit"
                className="flex items-center gap-2 text-sm text-smoke hover:text-ink"
              >
                <LogOut size={16} />
                Sign out ({user.email})
              </button>
            </form>
          </nav>
        )}
      </div>

      {/* Main column */}
      <div className="md:pl-60">
        <div className="hidden md:flex h-16 items-center justify-end border-b border-ink/10 px-6">
          <span className="mr-4 text-sm text-smoke">{user.email}</span>
          <form action="/api/auth/signout" method="post">
            <button
              type="submit"
              className="flex items-center gap-2 text-sm text-smoke hover:text-ink"
            >
              <LogOut size={16} />
              Sign out
            </button>
          </form>
        </div>
        <main className="py-8">{children}</main>
      </div>
    </div>
  );
}
