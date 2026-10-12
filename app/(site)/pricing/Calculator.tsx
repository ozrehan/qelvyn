"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { FormField } from "@/components/ui/FormField";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { Alert } from "@/components/ui/Alert";
import { Card, CardContent, CardTitle } from "@/components/ui/Card";
import { WORKSTATION_PLANS, estimateCost } from "@/lib/providers";

function formatCredits(n: number): string {
  return n.toLocaleString("en-US", { maximumFractionDigits: 1 });
}

export function Calculator() {
  const [planId, setPlanId] = useState<string>(WORKSTATION_PLANS[0].id);
  const [hoursPerDay, setHoursPerDay] = useState(4);
  const [daysPerMonth, setDaysPerMonth] = useState(20);

  const minutes = hoursPerDay * 60 * daysPerMonth;
  let credits: number | null = null;
  try {
    credits = estimateCost(planId, minutes);
  } catch {
    credits = null;
  }

  return (
    <Container>
      <PageHeader
        eyebrow="Pricing"
        title="Estimate your usage"
        description="Workstations are billed in credits, metered per minute while your machine runs."
      />

      <div className="max-w-2xl pb-16">
        <div className="flex items-center gap-3 pb-6">
          <Badge tone="concept">Concept pricing</Badge>
          <p className="text-sm text-smoke">Estimates only — Concept pricing.</p>
        </div>

        <div className="space-y-8">
          <FormField label="Plan" name="plan">
            <Select
              id="plan"
              name="plan"
              value={planId}
              onChange={(e) => setPlanId(e.target.value)}
            >
              {WORKSTATION_PLANS.map((plan) => (
                <option key={plan.id} value={plan.id}>
                  {plan.name} — {plan.creditsPerMin} credits/min
                </option>
              ))}
            </Select>
          </FormField>

          <FormField label={`Hours per day: ${hoursPerDay}`} name="hours">
            <input
              id="hours"
              name="hours"
              type="range"
              min={1}
              max={24}
              value={hoursPerDay}
              onChange={(e) => setHoursPerDay(Number(e.target.value))}
              className="w-full accent-black"
              aria-label="Hours per day"
            />
          </FormField>

          <FormField label={`Days per month: ${daysPerMonth}`} name="days">
            <input
              id="days"
              name="days"
              type="range"
              min={1}
              max={31}
              value={daysPerMonth}
              onChange={(e) => setDaysPerMonth(Number(e.target.value))}
              className="w-full accent-black"
              aria-label="Days per month"
            />
          </FormField>

          <Card>
            <CardContent className="pt-6">
              <CardTitle>Estimated monthly usage</CardTitle>
              <p className="mt-3 font-display text-4xl font-bold">
                {credits !== null ? formatCredits(credits) : "—"}
                <span className="text-lg font-normal text-smoke"> credits</span>
              </p>
              <p className="mt-2 text-sm text-smoke">
                {formatCredits(minutes)} minutes of machine time
              </p>
              <p className="mt-3 text-sm text-smoke">Estimates only — Concept pricing.</p>
            </CardContent>
          </Card>

          <Alert tone="info" title="Billing is not enabled yet">
            <p>
              Qelvyn is pre-launch. There is no way to pay us and no charges can
              be made. The credit rates shown here are concept pricing for
              planning purposes only and will be finalized — and verified —
              before launch.
            </p>
          </Alert>
        </div>
      </div>
    </Container>
  );
}
