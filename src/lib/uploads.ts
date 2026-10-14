import { randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";

import { safeFileName } from "@/lib/utils";

/**
 * Private file storage for CV / resume uploads.
 *
 * Files are written outside `public/` and are only ever served through the
 * authenticated admin route. On serverless hosts with an ephemeral filesystem,
 * move this to a private Supabase Storage bucket (the migration file includes
 * the matching bucket policies) and swap `saveResume`/`readResume`.
 */

const ALLOWED_EXTENSIONS = [".pdf", ".doc", ".docx"];
const ALLOWED_MIME = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const UPLOAD_DIR = path.join(process.cwd(), ".data", "uploads");

export interface StoredFile {
  path: string;
  name: string;
}

export async function saveResume(file: File): Promise<StoredFile> {
  if (!file || file.size === 0) {
    throw new Error("The uploaded file is empty.");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("The file must be 5 MB or smaller.");
  }
  const ext = path.extname(file.name).toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    throw new Error("Please upload a PDF, DOC, or DOCX file.");
  }
  if (file.type && !ALLOWED_MIME.includes(file.type)) {
    throw new Error("Please upload a PDF, DOC, or DOCX file.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const key = `${randomUUID()}${ext}`;
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  await fs.writeFile(path.join(UPLOAD_DIR, key), buffer);
  return { path: `local:${key}`, name: safeFileName(file.name) };
}

export async function readResume(
  storedPath: string,
): Promise<{ data: Buffer; fileName: string } | null> {
  if (!storedPath.startsWith("local:")) return null;
  const key = storedPath.slice("local:".length);
  if (key.includes("/") || key.includes("\\") || key.includes("..")) return null;
  try {
    const data = await fs.readFile(path.join(UPLOAD_DIR, key));
    return { data, fileName: key };
  } catch {
    return null;
  }
}

export function isPdf(fileName: string): boolean {
  return fileName.toLowerCase().endsWith(".pdf");
}
