"use client";

import { ReactNode, useId, useState } from "react";

type Props = {
  title: string;
  count?: number;
  defaultOpen?: boolean;
  children: ReactNode;
};

export function CollapsibleSection({ title, count, defaultOpen = false, children }: Props) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const contentId = useId();

  return (
    <section className="rounded-2xl border border-[var(--line)] bg-white p-3">
      <button
        type="button"
        className="flex w-full items-center justify-between text-left"
        aria-expanded={isOpen}
        aria-controls={contentId}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className="text-base font-semibold text-[var(--ink)]">
          {title}
          {typeof count === "number" ? ` (${count}건)` : ""}
        </span>
        <span className="text-sm text-[var(--muted)]">{isOpen ? "접기 ▲" : "펼치기 ▼"}</span>
      </button>

      <div id={contentId} className={isOpen ? "mt-3 block" : "hidden"}>
        {children}
      </div>
    </section>
  );
}
