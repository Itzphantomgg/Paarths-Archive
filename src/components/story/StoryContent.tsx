import React from "react";

interface StoryContentProps {
  content: string;
}

export default function StoryContent({ content }: StoryContentProps) {
  // Parse markdown lines into clean editorial book elements
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];

  let currentParagraph: string[] = [];
  let currentQuote: string[] = [];
  let isFirstParagraph = true;

  const flushParagraph = (key: string) => {
    if (currentParagraph.length > 0) {
      const text = currentParagraph.join(" ").trim();
      if (text) {
        elements.push(
          <p
            key={key}
            className={`font-serif text-lg sm:text-xl md:text-[1.35rem] leading-[1.85] text-neutral-300 font-light my-8 tracking-wide ${
              isFirstParagraph ? "drop-cap" : ""
            }`}
            dangerouslySetInnerHTML={{
              __html: formatInlineMarkdown(text),
            }}
          />
        );
        isFirstParagraph = false;
      }
      currentParagraph = [];
    }
  };

  const flushQuote = (key: string) => {
    if (currentQuote.length > 0) {
      const text = currentQuote.join(" ").trim();
      if (text) {
        elements.push(
          <blockquote
            key={key}
            className="my-10 pl-6 sm:pl-8 border-l border-white/30 italic font-serif text-xl sm:text-2xl text-neutral-200 font-normal leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: formatInlineMarkdown(text),
            }}
          />
        );
      }
      currentQuote = [];
    }
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();

    if (!trimmed) {
      flushParagraph(`p-${idx}`);
      flushQuote(`q-${idx}`);
      return;
    }

    if (trimmed.startsWith("### ")) {
      flushParagraph(`p-${idx}`);
      flushQuote(`q-${idx}`);
      elements.push(
        <h3
          key={`h3-${idx}`}
          className="font-serif text-2xl sm:text-3xl text-white font-normal mt-14 mb-6 tracking-tight italic"
        >
          {trimmed.replace("### ", "")}
        </h3>
      );
    } else if (trimmed.startsWith("## ")) {
      flushParagraph(`p-${idx}`);
      flushQuote(`q-${idx}`);
      elements.push(
        <h2
          key={`h2-${idx}`}
          className="font-serif text-3xl sm:text-4xl text-white font-normal mt-16 mb-8 tracking-tight"
        >
          {trimmed.replace("## ", "")}
        </h2>
      );
    } else if (trimmed.startsWith("> ")) {
      flushParagraph(`p-${idx}`);
      currentQuote.push(trimmed.replace(/^>\s*/, ""));
    } else if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
      flushParagraph(`p-${idx}`);
      flushQuote(`q-${idx}`);
      elements.push(
        <li
          key={`li-${idx}`}
          className="font-serif text-lg text-neutral-300 ml-6 list-disc my-2 leading-relaxed"
          dangerouslySetInnerHTML={{
            __html: formatInlineMarkdown(trimmed.replace(/^[\*\-]\s*/, "")),
          }}
        />
      );
    } else if (/^\d+\.\s/.test(trimmed)) {
      flushParagraph(`p-${idx}`);
      flushQuote(`q-${idx}`);
      elements.push(
        <li
          key={`oli-${idx}`}
          className="font-serif text-lg text-neutral-300 ml-6 list-decimal my-2 leading-relaxed"
          dangerouslySetInnerHTML={{
            __html: formatInlineMarkdown(trimmed.replace(/^\d+\.\s*/, "")),
          }}
        />
      );
    } else {
      flushQuote(`q-${idx}`);
      currentParagraph.push(trimmed);
    }
  });

  flushParagraph("p-last");
  flushQuote("q-last");

  return <div className="space-y-2">{elements}</div>;
}

function formatInlineMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-medium">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic text-neutral-200">$1</em>')
    .replace(/`(.*?)`/g, '<code class="font-mono text-sm px-1.5 py-0.5 bg-neutral-900 border border-white/10 rounded text-neutral-300">$1</code>');
}
