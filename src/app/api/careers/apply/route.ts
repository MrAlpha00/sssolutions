import { db } from "@/lib/db";
import { applicationNotificationEmail, contactToEmail, sendEmail } from "@/lib/email";
import { HONEYPOT_FIELD } from "@/lib/forms";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { verifyTurnstile } from "@/lib/turnstile";
import { saveResume } from "@/lib/uploads";
import { applicationSchema, firstError } from "@/lib/validation";

const MAX_RESUME_BYTES = 5 * 1024 * 1024;

/** Job application endpoint (multipart form including a resume file). */
export async function POST(request: Request) {
  try {
    const limit = rateLimit(clientKey(request, "apply"), 4, 60_000);
    if (!limit.allowed) {
      return Response.json(
        { ok: false, error: "Too many submissions. Please wait a moment and try again." },
        { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
      );
    }

    const formData = await request.formData();

    if (String(formData.get(HONEYPOT_FIELD) ?? "").trim().length > 0) {
      return Response.json({ ok: true });
    }

    const parsed = applicationSchema.safeParse(Object.fromEntries(formData));
    if (!parsed.success) {
      return Response.json(
        { ok: false, error: firstError(parsed.error) },
        { status: 400 },
      );
    }
    const data = parsed.data;

    if (!formData.get("consent")) {
      return Response.json(
        { ok: false, error: "Please confirm your details before submitting." },
        { status: 400 },
      );
    }

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

    const resume = formData.get("resume");
    if (!(resume instanceof File) || resume.size === 0) {
      return Response.json(
        { ok: false, error: "Please attach your resume (PDF, DOC, or DOCX)." },
        { status: 400 },
      );
    }
    if (resume.size > MAX_RESUME_BYTES) {
      return Response.json(
        { ok: false, error: "Your resume must be 5 MB or smaller." },
        { status: 400 },
      );
    }

    let resumePath: string;
    let resumeName: string;
    try {
      const saved = await saveResume(resume);
      resumePath = saved.path;
      resumeName = saved.name;
    } catch (error) {
      return Response.json(
        {
          ok: false,
          error:
            error instanceof Error
              ? error.message
              : "We could not read that file. Please try another.",
        },
        { status: 400 },
      );
    }

    await db.createApplication({
      job_id: data.job_id ?? null,
      position: data.position,
      name: data.name,
      email: data.email,
      phone: data.phone ?? null,
      message: data.message ?? null,
      resume_path: resumePath,
      resume_name: resumeName,
      status: "new",
    });

    await sendEmail({
      to: contactToEmail(),
      replyTo: data.email,
      subject: `New job application — ${data.position}`,
      html: applicationNotificationEmail({
        name: data.name,
        email: data.email,
        phone: data.phone,
        position: data.position,
        message: data.message,
        resumeName,
      }),
    });

    return Response.json({ ok: true });
  } catch (error) {
    console.error("[api/careers/apply]", error);
    return Response.json(
      { ok: false, error: "We could not submit your application. Please try again." },
      { status: 500 },
    );
  }
}

export { MAX_RESUME_BYTES };
