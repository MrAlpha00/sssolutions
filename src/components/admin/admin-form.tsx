"use client";

import { AlertCircle, CheckCircle2 } from "lucide-react";
import { useActionState, type ReactNode } from "react";

import { Button, ButtonLink } from "@/components/ui/button";
import type { ActionResult } from "@/app/admin/actions";
import { cn } from "@/lib/utils";

export type AdminFieldType =
  | "text"
  | "email"
  | "number"
  | "textarea"
  | "checkbox"
  | "select"
  | "date"
  | "datetime-local"
  | "url";

export interface AdminField {
  name: string;
  label: string;
  type?: AdminFieldType;
  required?: boolean;
  hint?: string;
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
  defaultValue?: string | number | boolean | null;
  rows?: number;
  fullWidth?: boolean;
}

const control =
  "w-full rounded-xl border border-line bg-cream px-3.5 py-2.5 text-sm text-ink placeholder:text-muted/60 transition-colors focus:border-cyprus focus:outline-none";

function FieldControl({ field }: { field: AdminField }) {
  const id = `field-${field.name}`;
  const type = field.type ?? "text";

  if (type === "checkbox") {
    return (
      <label htmlFor={id} className="flex items-center gap-3 text-sm text-ink">
        <input
          id={id}
          name={field.name}
          type="checkbox"
          defaultChecked={Boolean(field.defaultValue)}
          className="h-4 w-4 rounded border-line text-cyprus focus:ring-cyprus"
        />
        <span>{field.hint ?? field.label}</span>
      </label>
    );
  }

  if (type === "textarea") {
    return (
      <textarea
        id={id}
        name={field.name}
        rows={field.rows ?? 5}
        required={field.required}
        placeholder={field.placeholder}
        defaultValue={(field.defaultValue as string | undefined) ?? ""}
        className={cn(control, "resize-y")}
      />
    );
  }

  if (type === "select") {
    return (
      <select
        id={id}
        name={field.name}
        required={field.required}
        defaultValue={(field.defaultValue as string | undefined) ?? ""}
        className={control}
      >
        {field.options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }

  return (
    <input
      id={id}
      name={field.name}
      type={type}
      required={field.required}
      placeholder={field.placeholder}
      defaultValue={(field.defaultValue as string | number | undefined) ?? ""}
      className={control}
    />
  );
}

export function AdminForm({
  action,
  fields,
  hidden,
  submitLabel = "Save",
  cancelHref,
  children,
}: {
  action: (state: ActionResult, formData: FormData) => Promise<ActionResult>;
  fields: AdminField[];
  hidden?: Array<{ name: string; value: string }>;
  submitLabel?: string;
  cancelHref?: string;
  children?: ReactNode;
}) {
  const [state, formAction, pending] = useActionState(action, null);

  return (
    <form action={formAction} className="space-y-6">
      {hidden?.map((item) => (
        <input key={item.name} type="hidden" name={item.name} value={item.value} />
      ))}

      <div className="grid gap-5 sm:grid-cols-2">
        {fields.map((field) => (
          <div
            key={field.name}
            className={cn(
              (field.type === "checkbox" || field.fullWidth) && "sm:col-span-2",
            )}
          >
            {field.type !== "checkbox" ? (
              <label
                htmlFor={`field-${field.name}`}
                className="mb-1.5 block text-sm font-medium text-cyprus"
              >
                {field.label}
                {field.required ? (
                  <span className="text-leaf-dark" aria-hidden>
                    {" "}
                    *
                  </span>
                ) : null}
              </label>
            ) : null}
            <FieldControl field={field} />
            {field.type !== "checkbox" && field.hint ? (
              <p className="mt-1 text-xs text-muted">{field.hint}</p>
            ) : null}
          </div>
        ))}
      </div>

      {children}

      {state && !state.ok && state.error ? (
        <p
          role="alert"
          className="flex items-center gap-2 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          <AlertCircle className="h-4 w-4 shrink-0" />
          {state.error}
        </p>
      ) : null}

      {state && state.ok ? (
        <p
          role="status"
          className="flex items-center gap-2 rounded-xl border border-leaf/40 bg-leaf/10 px-4 py-3 text-sm text-cyprus"
        >
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          Your changes have been saved.
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : submitLabel}
        </Button>
        {cancelHref ? (
          <ButtonLink href={cancelHref} variant="secondary">
            Cancel
          </ButtonLink>
        ) : null}
      </div>
    </form>
  );
}
