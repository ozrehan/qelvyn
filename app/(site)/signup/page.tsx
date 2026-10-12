import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { SignupForm } from "./signup-form";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const sp = await searchParams;
  return (
    <Container>
      <PageHeader eyebrow="Account" title="Sign up" description="Create your Qelvyn account." />
      <SignupForm callbackUrl={sp.callbackUrl ?? "/onboarding"} />
    </Container>
  );
}
