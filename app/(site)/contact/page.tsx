import type { Metadata } from "next";
import { ContactForm } from "./ContactForm";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Contact — Qelvyn",
  description: "Contact the Qelvyn team.",
};

export default function ContactPage() {
  return (
    <Container>
      <PageHeader
        eyebrow="Contact"
        title="Get in touch"
        description="Questions about Qelvyn? Send us a message."
      />
      <div className="max-w-md pb-24">
        <ContactForm />
      </div>
    </Container>
  );
}
