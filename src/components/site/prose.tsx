import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Dependency-free renderer for the lightweight Markdown used in service
 * descriptions and articles. It supports `##`/`###` headings, unordered lists,
 * bold text, and paragraphs — which is all the admin editor produces.
 *
 * It renders to React elements (never `dangerouslySetInnerHTML`), so admin
 * content cannot inject markup.
 */

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts
    .map((part, index) => {
      if (!part) return null;
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={`${keyPrefix}-b-${index}`}>{part.slice(2, -2)}</strong>;
      }
      return <span key={`${keyPrefix}-t-${index}`}>{part}</span>;
    })
    .filter((node): node is ReactNode => node !== null);
}

export function Prose({
  content,
  className,
}: {
  content: string;
  className?: string;
}) {
  const lines = content.replace(/\r\n/g, "\n").split("\n");
  const blocks: ReactNode[] = [];
  let list: string[] = [];
  let paragraph: string[] = [];
  let key = 0;

  const flushParagraph = () => {
    if (paragraph.length === 0) return;
    const text = paragraph.join(" ").trim();
    paragraph = [];
    if (!text) return;
    blocks.push(<p key={`p-${key++}`}>{renderInline(text, `p-${key}`)}</p>);
  };

  const flushList = () => {
    if (list.length === 0) return;
    const items = list;
    list = [];
    const listKey = key++;
    blocks.push(
      <ul key={`ul-${listKey}`}>
        {items.map((item, index) => (
          <li key={`li-${listKey}-${index}`}>
            {renderInline(item, `li-${listKey}-${index}`)}
          </li>
        ))}
      </ul>,
    );
  };

  for (const raw of lines) {
    const line = raw.trim();

    if (line.length === 0) {
      flushParagraph();
      flushList();
      continue;
    }

    if (line.startsWith("### ")) {
      flushParagraph();
      flushList();
      const headingKey = key++;
      blocks.push(
        <h3 key={`h3-${headingKey}`}>{renderInline(line.slice(4), `h3-${headingKey}`)}</h3>,
      );
      continue;
    }

    if (line.startsWith("## ") || line.startsWith("# ")) {
      flushParagraph();
      flushList();
      const headingKey = key++;
      const text = line.startsWith("## ") ? line.slice(3) : line.slice(2);
      blocks.push(
        <h2 key={`h2-${headingKey}`}>{renderInline(text, `h2-${headingKey}`)}</h2>,
      );
      continue;
    }

    if (/^[-*]\s+/.test(line)) {
      flushParagraph();
      list.push(line.replace(/^[-*]\s+/, ""));
      continue;
    }

    flushList();
    paragraph.push(line);
  }

  flushParagraph();
  flushList();

  return <div className={cn("prose-custom", className)}>{blocks}</div>;
}
