"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "./Button";

const NAV = [
  { label: "How it works", href: "/how-it-works" },
  { label: "Use cases", href: "/use-cases" },
  { label: "Specs", href: "/specs" },
  { label: "Pricing", href: "/pricing" },
  { label: "Docs", href: "/docs" },
  { label: "FAQ", href: "/faq" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-paper">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <Logo className="h-7 w-7" />
          <span className="font-display text-lg font-bold tracking-widest">QELVYN</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6" aria-label="Primary">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm text-smoke hover:text-ink">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" href="/login">
            Login
          </Button>
          <Button variant="primary" size="sm" href="/waitlist">
            Join waitlist
          </Button>
        </div>
        <button
          className="md:hidden p-2"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {open && (
        <nav className="md:hidden border-t border-ink/10 px-4 py-4" aria-label="Mobile">
          <ul className="flex flex-col gap-3">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block text-sm text-smoke hover:text-ink"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="flex gap-3 pt-2">
              <Button variant="ghost" href="/login">
                Login
              </Button>
              <Button variant="primary" size="sm" href="/waitlist">
                Join waitlist
              </Button>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
