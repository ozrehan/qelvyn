import { Container } from "@/components/ui/Container";
import { Alert } from "@/components/ui/Alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export const dynamic = "force-dynamic";

export default function BillingPage() {
  return (
    <Container>
      <div className="py-8">
        <p className="text-[11px] font-medium uppercase tracking-widest text-smoke">Payments</p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">Billing</h1>
      </div>

      <Alert tone="info" title="Billing is coming soon">
        Billing is coming soon — no charges can be made yet. Workstation time is tracked
        in credits (see Usage), but there is no way to pay or be charged today.
      </Alert>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-ink/10 text-[11px] uppercase tracking-widest text-smoke">
                  <th className="py-2 pr-4 font-medium">Invoice</th>
                  <th className="py-2 pr-4 font-medium">Date</th>
                  <th className="py-2 pr-4 font-medium">Amount</th>
                  <th className="py-2 pr-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={4} className="py-6 text-center text-sm text-smoke">
                    No invoices yet.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      <div className="pb-16" />
    </Container>
  );
}
