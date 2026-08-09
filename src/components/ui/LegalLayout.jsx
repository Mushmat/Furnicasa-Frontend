// src/components/ui/LegalLayout.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import PageHeader from "./PageHeader";
import { EASE } from "./motion";

/**
 * Shell for the policy documents: dark header, sticky table of contents that
 * highlights the section you're reading, and a readable measure for the body.
 *
 * `sections` is [{ id, title, body }] — the layout owns the numbering and the
 * scroll-spy so each document only has to supply its content.
 */
export default function LegalLayout({
  title,
  kicker,
  subtitle,
  updated,
  sections,
  crumbs,
}) {
  const [activeId, setActiveId] = useState(sections[0]?.id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: "-25% 0px -65% 0px", threshold: 0 }
    );

    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections]);

  return (
    <div>
      <PageHeader
        kicker={kicker}
        title={title}
        subtitle={subtitle}
        crumbs={crumbs}
        compact
      />

      <div className="container-x py-14">
        <div className="flex flex-col gap-12 lg:flex-row lg:gap-16">
          {/* ── table of contents ── */}
          <nav
            aria-label="On this page"
            className="lg:sticky lg:top-32 lg:h-fit lg:w-64 lg:shrink-0"
          >
            <p className="label mb-4">On this page</p>
            <ol className="space-y-0.5 border-l border-ink-100">
              {sections.map((s, i) => {
                const active = activeId === s.id;
                return (
                  <li key={s.id} className="relative">
                    {active && (
                      <motion.span
                        layoutId="toc-marker"
                        transition={{ duration: 0.3, ease: EASE }}
                        className="absolute -left-px top-0 h-full w-0.5 bg-clay-500"
                      />
                    )}
                    <a
                      href={`#${s.id}`}
                      className={`block py-2 pl-4 text-sm transition-colors ${
                        active
                          ? "font-semibold text-ink-900"
                          : "text-ink-500 hover:text-ink-900"
                      }`}
                    >
                      <span className="mr-2 tabular-nums text-ink-300">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {s.title}
                    </a>
                  </li>
                );
              })}
            </ol>
          </nav>

          {/* ── document ── */}
          <article className="min-w-0 max-w-3xl flex-1">
            {updated && (
              <p className="mb-10 inline-flex items-center gap-2 rounded-full bg-sand-200 px-4 py-1.5 text-xs font-medium text-ink-600">
                Last updated · {updated}
              </p>
            )}

            <div className="doc">
              {sections.map((s, i) => (
                <motion.section
                  key={s.id}
                  id={s.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.05 }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className="scroll-mt-32"
                >
                  <h2>
                    <span className="mr-3 font-mono text-base font-normal text-clay-500">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {s.title}
                  </h2>
                  {s.body}
                </motion.section>
              ))}
            </div>

            <div className="hairline my-12" />

            <p className="text-center text-xs text-ink-400">
              © {new Date().getFullYear()} Furnicasa. All rights reserved.
            </p>
          </article>
        </div>
      </div>
    </div>
  );
}
