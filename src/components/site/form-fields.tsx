import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

import { HONEYPOT_FIELD } from "@/lib/forms";
import { cn } from "@/lib/utils";

/** Shared, dependency-free form controls used by the public forms. */

const controlClass =
  "w-full rounded-xl border border-line bg-cream px-4 py-2.5 text-sm text-ink transition-colors placeholder:text-muted/60 focus:border-cyprus focus:outline-none disabled:opacity-60";

function Label({
  htmlFor,
  required,
  children,
}: {
  htmlFor: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-cyprus">
      {children}
      {required ? (
        <span className="text-leaf-dark" aria-hidden>
          {" "}
          *
        </span>
      ) : null}
    </label>
  );
}

type FieldProps = {
  label: string;
  name: string;
  id?: string;
  required?: boolean;
  hint?: string;
  wrapperClassName?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export function Field({
  label,
  name,
  id,
  required,
  hint,
  wrapperClassName,
  ...props
}: FieldProps) {
  const fieldId = id ?? name;
  return (
    <div className={wrapperClassName}>
      <Label htmlFor={fieldId} required={required}>
        {label}
      </Label>
      <input
        id={fieldId}
        name={name}
        required={required}
        className={controlClass}
        {...props}
      />
      {hint ? <p className="mt-1 text-xs text-muted">{hint}</p> : null}
    </div>
  );
}

type TextAreaFieldProps = {
  label: string;
  name: string;
  id?: string;
  required?: boolean;
  hint?: string;
  wrapperClassName?: string;
} & TextareaHTMLAttributes<HTMLTextAreaElement>;

export function TextAreaField({
  label,
  name,
  id,
  required,
  hint,
  wrapperClassName,
  rows = 5,
  ...props
}: TextAreaFieldProps) {
  const fieldId = id ?? name;
  return (
    <div className={wrapperClassName}>
      <Label htmlFor={fieldId} required={required}>
        {label}
      </Label>
      <textarea
        id={fieldId}
        name={name}
        required={required}
        rows={rows}
        className={cn(controlClass, "resize-y")}
        {...props}
      />
      {hint ? <p className="mt-1 text-xs text-muted">{hint}</p> : null}
    </div>
  );
}

type SelectFieldProps = {
  label: string;
  name: string;
  id?: string;
  required?: boolean;
  hint?: string;
  wrapperClassName?: string;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
} & SelectHTMLAttributes<HTMLSelectElement>;

export function SelectField({
  label,
  name,
  id,
  required,
  hint,
  wrapperClassName,
  options,
  placeholder,
  ...props
}: SelectFieldProps) {
  const fieldId = id ?? name;
  return (
    <div className={wrapperClassName}>
      <Label htmlFor={fieldId} required={required}>
        {label}
      </Label>
      <select
        id={fieldId}
        name={name}
        required={required}
        className={cn(controlClass, "appearance-none bg-[length:1rem] pr-10")}
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%235f716b' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 0.85rem center",
        }}
        {...props}
      >
        {placeholder ? <option value="">{placeholder}</option> : null}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {hint ? <p className="mt-1 text-xs text-muted">{hint}</p> : null}
    </div>
  );
}

export function CheckboxField({
  name,
  id,
  required,
  children,
}: {
  name: string;
  id?: string;
  required?: boolean;
  children: ReactNode;
}) {
  const fieldId = id ?? name;
  return (
    <label htmlFor={fieldId} className="flex items-start gap-3 text-sm text-muted">
      <input
        id={fieldId}
        name={name}
        type="checkbox"
        required={required}
        className="mt-0.5 h-4 w-4 shrink-0 rounded border-line text-cyprus focus:ring-cyprus"
      />
      <span>{children}</span>
    </label>
  );
}

/** Visually hidden spam trap. See `lib/forms.ts`. */
export function Honeypot() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute left-[-9999px] top-auto h-px w-px overflow-hidden"
    >
      <label htmlFor={HONEYPOT_FIELD}>Leave this field empty</label>
      <input
        id={HONEYPOT_FIELD}
        name={HONEYPOT_FIELD}
        type="text"
        tabIndex={-1}
        autoComplete="off"
      />
    </div>
  );
}

export function FormAlert({
  tone,
  children,
}: {
  tone: "error" | "success";
  children: ReactNode;
}) {
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "rounded-xl border px-4 py-3 text-sm",
        tone === "error"
          ? "border-red-300 bg-red-50 text-red-800"
          : "border-leaf/40 bg-leaf/10 text-cyprus",
      )}
    >
      {children}
    </div>
  );
}
