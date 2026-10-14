import { z } from "zod";

/** Shared validation schemas for public, user-submitted forms. */

const optionalString = (max = 200) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((v) => (v && v.length > 0 ? v : undefined));

export const contactSchema = z.object({
  full_name: z.string().trim().min(2, "Please enter your full name.").max(120),
  email: z.string().trim().email("Please enter a valid email address.").max(200),
  phone: optionalString(40),
  company: optionalString(160),
  service_interest: optionalString(160),
  message: z
    .string()
    .trim()
    .min(10, "Please tell us a little about what you need.")
    .max(5000),
  consent: z
    .union([z.literal("on"), z.literal("true"), z.boolean()])
    .transform((v) => v === "on" || v === "true" || v === true),
});

export type ContactInput = z.infer<typeof contactSchema>;

export const newsletterSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address.").max(200),
  consent: z
    .union([z.literal("on"), z.literal("true"), z.boolean()])
    .transform((v) => v === "on" || v === "true" || v === true),
});

export const applicationSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(120),
  email: z.string().trim().email("Please enter a valid email address.").max(200),
  phone: optionalString(40),
  position: z.string().trim().min(2, "Please tell us the role.").max(160),
  job_id: optionalString(80),
  message: optionalString(4000),
});

export type ApplicationInput = z.infer<typeof applicationSchema>;

/** Flatten zod errors into a single readable message. */
export function firstError(error: z.ZodError): string {
  return error.issues[0]?.message ?? "Please check the form and try again.";
}
