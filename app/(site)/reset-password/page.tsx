import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { ResetPasswordForm } from "./reset-form";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const sp = await searchParams;
  return (
    <Container>
      <PageHeader
        eyebrow="Account"
        title="Reset password"
        description="Choose a new password for your account."
      />
      <ResetPasswordForm token={sp.token ?? ""} />
    </Container>
  );
}
