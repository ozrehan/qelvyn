import Link from "next/link";
import { Logo } from "./Logo";

const COLUMNS: Array<{ heading: string; links: Array<{ label: string; href: string }> }> = [
  {
    heading: "Product",
    links: [
      { label: "How it works", href: "/how-it-works" },
      { label: "Specs", href: "/specs" },
      { label: "Pricing", href: "/pricing" },
      { label: "Compatibility", href: "/compatibility" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Security", href: "/security" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Acceptable use", href: "/acceptable-use" },
      { label: "Refunds", href: "/refunds" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Docs", href: "/docs" },
      { label: "Status", href: "/status" },
      { label: "FAQ", href: "/faq" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-ink/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          <div>
            <div className="flex items-center gap-2.5">
              <Logo className="h-6 w-6" />
              <span className="font-display text-sm font-bold tracking-widest">QELVYN</span>
            </div>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.heading}>
              <h3 className="text-[11px] font-medium uppercase tracking-widest text-smoke">
                {col.heading}
              </h3>
              <ul className="mt-3 flex flex-col gap-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-smoke hover:text-ink">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-12 border-t border-ink/10 pt-6 text-xs text-smoke">
          © 2026 Qelvyn. Concept direction only — unbuilt features are labeled as Concept.
        </p>
      </div>
    </footer>
  );
}
