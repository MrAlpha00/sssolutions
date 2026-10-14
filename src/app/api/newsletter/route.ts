import { DuplicateSubscriberError } from "@/lib/db";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { contactToEmail } from "@/lib/email";
import { HONEYPOT_FIELD } from "@/lib/forms";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { verifyTurnstile } from "@/lib/turnstile";
import { firstError, newsletterSchema } from "@/lib/validation";

const escape = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Newsletter subscription endpoint. */
export async function POST(request: Request) {
  try {
    const limit = rateLimit(clientKey(request, "newsletter"), 5, 60_000);
    if (!limit.allowed) {
      return Response.json(
        { ok: false, error: "Too many requests. Please try again shortly." },
        { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
      );
    }

    const formData = await request.formData();

    if (String(formData.get(HONEYPOT_FIELD) ?? "").trim().length > 0) {
      return Response.json({ ok: true });
    }

    const parsed = newsletterSchema.safeParse(Object.fromEntries(formData));
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

    try {
      await db.createSubscriber({
        email: data.email,
        status: "subscribed",
        consent: data.consent,
        source: "website",
      });
    } catch (error) {
      if (error instanceof DuplicateSubscriberError) {
        return Response.json({ ok: true });
      }
      throw error;
    }

    await sendEmail({
      to: contactToEmail(),
      subject: "New newsletter subscriber",
      html: `<p style="font-size:14px;">New subscriber: <strong>${escape(data.email)}</strong></p>`,
    });

    return Response.json({ ok: true });
  } catch (error) {
    console.error("[api/newsletter]", error);
    return Response.json(
      { ok: false, error: "We could not complete your subscription. Please try again." },
      { status: 500 },
    );
  }
}
