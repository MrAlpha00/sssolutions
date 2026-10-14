"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

import { buttonClasses } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "light" | "leaf" | "ghost";

export function Modal({
  label,
  triggerVariant = "secondary",
  triggerSize = "sm",
  triggerClassName,
  triggerIcon,
  title,
  children,
  panelClassName,
}: {
  label: ReactNode;
  triggerVariant?: Variant;
  triggerSize?: "sm" | "md" | "lg";
  triggerClassName?: string;
  triggerIcon?: ReactNode;
  title: string;
  children: ReactNode;
  panelClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const reduce = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => setMounted(true), []);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    previouslyFocused.current = document.activeElement as HTMLElement | null;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
      }
      if (event.key === "Tab" && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), iframe, input, [tabindex]:not([tabindex="-1"])',
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", onKeyDown);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const timer = window.setTimeout(() => panelRef.current?.focus(), 30);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
      window.clearTimeout(timer);
      previouslyFocused.current?.focus();
    };
  }, [open, close]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={buttonClasses(triggerVariant, triggerSize, triggerClassName)}
      >
        {triggerIcon}
        {label}
      </button>

      {mounted
        ? createPortal(
            <AnimatePresence>
              {open ? (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                  <motion.div
                    className="absolute inset-0 bg-cyprus-dark/60 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={close}
                    aria-hidden
                  />
                  <motion.div
                    ref={panelRef}
                    role="dialog"
                    aria-modal="true"
                    aria-label={title}
                    tabIndex={-1}
                    initial={reduce ? { opacity: 1 } : { opacity: 0, y: 16, scale: 0.98 }}
                    animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
                    exit={reduce ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    className={cn(
                      "relative w-full max-w-3xl overflow-hidden rounded-2xl border border-line bg-cream shadow-2xl outline-none",
                      panelClassName,
                    )}
                  >
                    <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-3">
                      <h2 className="text-base text-cyprus">{title}</h2>
                      <button
                        type="button"
                        onClick={close}
                        aria-label="Close dialog"
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-cyprus transition-colors hover:bg-sand"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    {children}
                  </motion.div>
                </div>
              ) : null}
            </AnimatePresence>,
            document.body,
          )
        : null}
    </>
  );
}
