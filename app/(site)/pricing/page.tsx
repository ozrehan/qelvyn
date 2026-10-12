import type { Metadata } from "next";
import { Calculator } from "./Calculator";

export const metadata: Metadata = {
  title: "Pricing — Qelvyn",
  description:
    "Concept pricing for Qelvyn cloud workstations: credits-per-minute estimates. Billing is not enabled yet.",
};

export default function PricingPage() {
  return <Calculator />;
}
