import { Resend } from "resend";

import { env, isResendConfigured } from "@/lib/env";
import { siteConfig, getFormattedAddress } from "@/lib/site-config";

/**
 * Email delivery via Resend. All transmission stays server-side.
 *
 * When Resend is not configured the send is skipped (never faked) and the
 * failure reason is returned so callers can record it honestly.
 */

export interface SendResult {
  sent: boolean;
  skipped?: boolean;
  error?: string;
}

interface SendEmailInput {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}

export async function sendEmail({
  to,
  subject,
  html,
  replyTo,
}: SendEmailInput): Promise<SendResult> {
  if (!isResendConfigured()) {
    console.warn(
      `[email] Resend is not configured — skipped "${subject}". Set RESEND_API_KEY and RESEND_FROM_EMAIL.`,
    );
    return {
      sent: false,
      skipped: true,
      error: "Email is not configured.",
    };
  }

  try {
    const resend = new Resend(env.resendApiKey);
    const { error } = await resend.emails.send({
      from: `${siteConfig.name} <${env.resendFromEmail}>`,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      ...(replyTo ? { replyTo } : {}),
    });
    if (error) return { sent: false, error: error.message };
    return { sent: true };
  } catch (error) {
    return { sent: false, error: (error as Error).message };
  }
}

/* ------------------------------------------------------------- templates ---- */

export const contactToEmail = () => env.contactToEmail ?? siteConfig.email;

function layout(heading: string, body: string): string {
  return `<!doctype html>
<html>
  <body style="margin:0;background:#f0ede4;font-family:Inter,Arial,sans-serif;color:#16302c;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f0ede4;padding:32px 16px;">
      <tr><td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #ddd8c8;">
          <tr><td style="background:#004741;padding:24px 32px;">
            <p style="margin:0;color:#f0ede4;font-size:18px;font-weight:600;">${siteConfig.name}</p>
            <p style="margin:4px 0 0;color:#9dc3b4;font-size:13px;">${siteConfig.tagline}</p>
          </td></tr>
          <tr><td style="padding:32px;">
            <h1 style="margin:0 0 16px;font-size:20px;color:#004741;">${heading}</h1>
            ${body}
          </td></tr>
          <tr><td style="padding:20px 32px;background:#faf8f2;border-top:1px solid #ddd8c8;">
            <p style="margin:0;font-size:12px;color:#5f716b;">${getFormattedAddress()}</p>
            <p style="margin:4px 0 0;font-size:12px;color:#5f716b;">${siteConfig.phone} · ${siteConfig.email}</p>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;
}

function rows(items: Array<[string, string | null | undefined]>): string {
  return items
    .filter(([, value]) => value != null && String(value).length > 0)
    .map(
      ([label, value]) =>
        `<tr><td style="padding:6px 0;font-size:13px;color:#5f716b;width:170px;">${label}</td><td style="padding:6px 0;font-size:14px;color:#16302c;">${escapeHtml(
          String(value),
        )}</td></tr>`,
    )
    .join("");
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function contactNotificationEmail(data: {
  fullName: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  serviceInterest?: string | null;
  message: string;
}): string {
  return layout(
    "New website enquiry",
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      ${rows([
        ["Name", data.fullName],
        ["Email", data.email],
        ["Phone", data.phone],
        ["Company", data.company],
        ["Service of interest", data.serviceInterest],
      ])}
      <tr><td colspan="2" style="padding-top:16px;">
        <p style="margin:0 0 6px;font-size:13px;color:#5f716b;">Message</p>
        <p style="margin:0;font-size:14px;white-space:pre-wrap;">${escapeHtml(data.message)}</p>
      </td></tr>
    </table>`,
  );
}

export function contactAcknowledgementEmail(name: string): string {
  return layout(
    `Thank you, ${escapeHtml(name)}`,
    `<p style="margin:0 0 12px;font-size:14px;">We have received your enquiry and a member of our team will get back to you shortly.</p>
     <p style="margin:0;font-size:14px;">If your matter is urgent, you can reach us on ${siteConfig.phone}.</p>`,
  );
}

export function applicationNotificationEmail(data: {
  name: string;
  email: string;
  phone?: string | null;
  position: string;
  message?: string | null;
  resumeName?: string | null;
}): string {
  return layout(
    "New job application",
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      ${rows([
        ["Name", data.name],
        ["Email", data.email],
        ["Phone", data.phone],
        ["Position", data.position],
        ["Resume", data.resumeName],
      ])}
      ${
        data.message
          ? `<tr><td colspan="2" style="padding-top:16px;"><p style="margin:0;font-size:14px;white-space:pre-wrap;">${escapeHtml(
              data.message,
            )}</p></td></tr>`
          : ""
      }
    </table>`,
  );
}

export function subscriberNotificationEmail(email: string): string {
  return layout(
    "New newsletter subscriber",
    `<p style="margin:0;font-size:14px;">A new subscriber joined the mailing list: <strong>${escapeHtml(
      email,
    )}</strong></p>`,
  );
}
