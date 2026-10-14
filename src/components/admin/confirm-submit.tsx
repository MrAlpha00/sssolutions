"use client";

import type { ReactNode } from "react";

/**
 * Submit button for destructive or state-changing server-action forms.
 * Shows a native confirmation prompt before allowing submission.
 */
export function ConfirmSubmit({
  children,
  confirmMessage,
  className,
  title,
}: {
  children: ReactNode;
  confirmMessage?: string;
  className?: string;
  title?: string;
}) {
  return (
    <button
      type="submit"
      title={title}
      className={className}
      onClick={(event) => {
        if (confirmMessage && !window.confirm(confirmMessage)) {
          event.preventDefault();
        }
      }}
    >
      {children}
    </button>
  );
}
