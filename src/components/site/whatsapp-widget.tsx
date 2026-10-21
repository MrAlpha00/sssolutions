"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";

import { WhatsAppIcon } from "./brand-icons";

/**
 * Floating WhatsApp contact button. Opens a small card that links to a wa.me
 * deep link. The number comes from the resolved site settings.
 */
export function WhatsAppWidget({
  link,
  number,
  message,
}: {
  link: string;
  number: string;
  message: string;
}) {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={reduce ? { opacity: 1 } : { opacity: 0, y: 12, scale: 0.96 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-label="Chat on WhatsApp"
            className="w-[min(17rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-line bg-cream shadow-2xl"
          >
            <div className="flex items-start justify-between gap-3 bg-cyprus px-4 py-3 text-sand">
              <div>
                <p className="font-heading text-sm font-semibold">WhatsApp</p>
                <p className="text-xs text-sand/70">{number}</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close WhatsApp card"
                className="flex h-7 w-7 items-center justify-center rounded-full text-sand/80 transition-colors hover:bg-white/10 hover:text-sand"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="px-4 py-4">
              <p className="text-sm text-muted">{message}</p>
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-leaf px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-leaf-dark"
              >
                <WhatsAppIcon className="h-4 w-4" />
                Start chat
              </a>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? "Close WhatsApp" : "Chat with us on WhatsApp"}
        aria-expanded={open}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-leaf text-white shadow-[0_16px_40px_-12px_rgba(78,138,92,0.8)] transition-transform hover:-translate-y-0.5 hover:bg-leaf-dark sm:h-14 sm:w-14"
      >
        <WhatsAppIcon className="h-6 w-6 sm:h-7 sm:w-7" />
      </button>
    </div>
  );
}
