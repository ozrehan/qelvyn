import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { LoginForm } from "./login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const sp = await searchParams;
  return (
    <Container>
      <PageHeader eyebrow="Account" title="Login" description="Sign in to your Qelvyn account." />
      <LoginForm
        callbackUrl={sp.callbackUrl ?? "/dashboard"}
        initialError={sp.error ? "Could not sign in. Please try again." : null}
      />
    </Container>
  );
}
