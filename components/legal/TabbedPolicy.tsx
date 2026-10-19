"use client";

import { useState, Fragment } from "react";
import { PolicyBlock, PolicySection } from "@/data/privacy-policy";

const LINK_PATTERN = /\[([^\]]+)\]\(([^)]+)\)/g;

function RichText({ text }: { text: string }) {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  LINK_PATTERN.lastIndex = 0;
  while ((match = LINK_PATTERN.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(<Fragment key={key++}>{text.slice(lastIndex, match.index)}</Fragment>);
    }
    const [, label, href] = match;
    const isExternal = href.startsWith("http");
    parts.push(
      <a
        key={key++}
        href={href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        className="link-underline font-semibold text-lepas-black"
      >
        {label}
      </a>
    );
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    parts.push(<Fragment key={key++}>{text.slice(lastIndex)}</Fragment>);
  }
  return <>{parts}</>;
}

function Blocks({ blocks }: { blocks: PolicyBlock[] }) {
  return (
    <div className="space-y-5">
      {blocks.map((block, i) => {
        if (block.type === "h3") {
          return (
            <h3 key={i} className="pt-2 text-lg font-bold text-lepas-black">
              {block.text}
            </h3>
          );
        }
        if (block.type === "ul") {
          return (
            <ul key={i} className="space-y-3">
              {block.items.map((item, j) => (
                <li key={j} className="flex gap-3 text-sm text-lepas-steel">
                  <span className="mt-1 shrink-0 text-lepas-amber">—</span>
                  <span>
                    <RichText text={typeof item === "string" ? item : item.text} />
                    {typeof item !== "string" && (
                      <ul className="mt-3 space-y-3 ps-4">
                        {item.items.map((sub, k) => (
                          <li key={k} className="flex gap-3">
                            <span className="mt-1 shrink-0 text-lepas-ash">–</span>
                            <span>
                              <RichText text={sub} />
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i} className="text-sm leading-relaxed text-lepas-steel">
            <RichText text={block.text} />
          </p>
        );
      })}
    </div>
  );
}

export default function TabbedPolicy({
  introBlocks,
  introTitle,
  sections,
  contentsLabel,
}: {
  introBlocks: PolicyBlock[];
  introTitle: string;
  sections: PolicySection[];
  contentsLabel: string;
}) {
  const [activeId, setActiveId] = useState<string>("intro");

  const isIntro = activeId === "intro";
  const activeSection = sections.find((s) => s.id === activeId);

  return (
    <div className="grid gap-10 lg:grid-cols-[280px_1fr]">
      <aside className="lg:sticky lg:top-28 lg:max-h-[calc(100vh-8rem)] lg:self-start lg:overflow-y-auto">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest2 text-lepas-ash">
          {contentsLabel}
        </p>
        <nav className="flex flex-col border-s border-lepas-fog">
          <button
            onClick={() => setActiveId("intro")}
            className={`border-s-2 px-4 py-2.5 text-start text-sm transition-colors ${
              isIntro
                ? "border-lepas-amber font-semibold text-lepas-black"
                : "border-transparent text-lepas-steel hover:text-lepas-black"
            }`}
          >
            {introTitle}
          </button>
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveId(section.id)}
              className={`border-s-2 px-4 py-2.5 text-start text-sm transition-colors ${
                activeId === section.id
                  ? "border-lepas-amber font-semibold text-lepas-black"
                  : "border-transparent text-lepas-steel hover:text-lepas-black"
              }`}
            >
              {section.title}
            </button>
          ))}
        </nav>
      </aside>

      <div className="min-w-0">
        <h2 className="text-2xl font-bold tracking-tight text-lepas-black md:text-3xl">
          {isIntro ? introTitle : activeSection?.title}
        </h2>
        <div className="mt-6">
          <Blocks blocks={isIntro ? introBlocks : activeSection?.blocks ?? []} />
        </div>
      </div>
    </div>
  );
}
