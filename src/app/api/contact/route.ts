import { db } from "@/lib/db";
import {
  contactAcknowledgementEmail,
  contactNotificationEmail,
  contactToEmail,
  sendEmail,
} from "@/lib/email";
import { HONEYPOT_FIELD } from "@/lib/forms";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { verifyTurnstile } from "@/lib/turnstile";
import { contactSchema, firstError } from "@/lib/validation";

/**
 * Public contact form endpoint.
 *
 * Order of defence: in-memory rate limit → honeypot → schema validation →
 * Turnstile → persist → email. The submission is stored even if email delivery
 * is unavailable (Resend not configured), and `email_sent` records honestly
 * whether the notification actually went out.
 */
export async function POST(request: Request) {
  try {
    const limit = rateLimit(clientKey(request, "contact"), 5, 60_000);
    if (!limit.allowed) {
      return Response.json(
        { ok: false, error: "Too many requests. Please wait a moment and try again." },
        { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
      );
    }

    const formData = await request.formData();

    if (String(formData.get(HONEYPOT_FIELD) ?? "").trim().length > 0) {
      // Pretend success so automated senders get no signal.
      return Response.json({ ok: true });
    }

    const parsed = contactSchema.safeParse(Object.fromEntries(formData));
    if (!parsed.success) {
      return Response.json(
        { ok: false, error: firstError(parsed.error) },
        { status: 400 },
      );
    }
    const data = parsed.data;

    const token = formData.get("cf-turnstile-response");
    const captcha = await verifyTurnstile(
      typeof token === "string" ? token : null,
    );
    if (!captcha.ok) {
      return Response.json(
        { ok: false, error: captcha.error ?? "Captcha verification failed." },
        { status: 400 },
      );
    }

    const notification = await sendEmail({
      to: contactToEmail(),
      replyTo: data.email,
      subject: `New website enquiry — ${data.full_name}`,
      html: contactNotificationEmail({
        fullName: data.full_name,
        email: data.email,
        phone: data.phone,
        company: data.company,
        serviceInterest: data.service_interest,
        message: data.message,
      }),
    });

    await db.createContactSubmission({
      full_name: data.full_name,
      email: data.email,
      phone: data.phone ?? null,
      company: data.company ?? null,
      service_interest: data.service_interest ?? null,
      message: data.message,
      status: "new",
      email_sent: notification.sent,
    });

    if (notification.sent) {
      await sendEmail({
        to: data.email,
        subject: "We have received your enquiry — Supportive HR Solutions",
        html: contactAcknowledgementEmail(data.full_name),
      });
    }

    return Response.json({ ok: true });
  } catch (error) {
    console.error("[api/contact]", error);
    return Response.json(
      {
        ok: false,
        error:
          "Something went wrong on our side. Please try again, or call us directly.",
      },
      { status: 500 },
    );
  }
}
