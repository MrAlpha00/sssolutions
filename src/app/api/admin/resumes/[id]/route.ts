import { isPdf, readResume } from "@/lib/uploads";
import { getAdminSession } from "@/lib/auth/session";
import { db } from "@/lib/db";

/**
 * Authenticated resume download.
 *
 * Resumes are never served from `public/`. This route checks the admin session
 * before streaming the file, and refuses any path that does not resolve inside
 * the private upload directory.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getAdminSession();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { id } = await params;
  const application = await db.getApplicationById(id);
  if (!application || !application.resume_path) {
    return new Response("Not found", { status: 404 });
  }

  const file = await readResume(application.resume_path);
  if (!file) {
    return new Response(
      "This resume is stored in a location that is not available on this server.",
      { status: 404 },
    );
  }

  const downloadName = application.resume_name ?? file.fileName;
  const contentType = isPdf(downloadName)
    ? "application/pdf"
    : "application/octet-stream";

  return new Response(new Uint8Array(file.data), {
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${downloadName.replace(/"/g, "")}"`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
