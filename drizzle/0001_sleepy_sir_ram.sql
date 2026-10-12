CREATE TABLE "contact_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"message" text NOT NULL,
	"topic" text DEFAULT 'general' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
