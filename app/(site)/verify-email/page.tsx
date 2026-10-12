import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { VerifyEmailForm } from "./verify-form";

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const sp = await searchParams;
  return (
    <Container>
      <PageHeader
        eyebrow="Account"
        title="Verify email"
        description="Confirming your email address."
      />
      <VerifyEmailForm token={sp.token ?? ""} />
    </Container>
  );
}
