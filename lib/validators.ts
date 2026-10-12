import { z } from "zod";

const passwordRule = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Za-z]/, "Password must contain a letter")
  .regex(/[0-9]/, "Password must contain a number");

export const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  password: passwordRule,
});

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const waitlistSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  name: z.string().optional(),
  useCase: z.string().optional(),
});

export const workstationCreateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(40),
  plan: z.enum(["creator", "pro", "studio"]),
  region: z.string().default("sin"),
});

export const forgotSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

export const resetSchema = z.object({
  token: z.string().min(1, "Token is required"),
  password: passwordRule,
});

export const settingsSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
});

export const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000),
  topic: z.string().default("general"),
});

export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  password: passwordRule,
});

export const workstationNameSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(40),
});
