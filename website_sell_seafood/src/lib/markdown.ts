// Minimal, safe markdown-to-HTML renderer for blog post bodies.
// Supports: headings (#, ##, ###), bold **x**, italic *x*, links [t](u),
// unordered lists (- ), ordered lists (1. ), blockquotes (>), paragraphs,
// and inline code `x`. Output is escaped to prevent XSS.

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function inline(s: string): string {
  let out = escapeHtml(s);
  // links
  out = out.replace(
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-ocean-300 underline hover:text-white">$1</a>',
  );
  // bold
  out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  // italic
  out = out.replace(/(^|[^*])\*([^*]+)\*/g, "$1<em>$2</em>");
  // inline code
  out = out.replace(
    /`([^`]+)`/g,
    '<code class="rounded bg-deep-700 px-1.5 py-0.5 text-sm text-ocean-200">$1</code>',
  );
  return out;
}

export function renderMarkdown(md: string): string {
  const lines = md.split(/\r?\n/);
  const html: string[] = [];
  let i = 0;
  let listType: "ul" | "ol" | null = null;

  const closeList = () => {
    if (listType) {
      html.push(`</${listType}>`);
      listType = null;
    }
  };

  while (i < lines.length) {
    const raw = lines[i];
    const line = raw.trimEnd();

    if (!line.trim()) {
      closeList();
      i++;
      continue;
    }

    // headings
    const h = /^(#{1,3})\s+(.*)$/.exec(line);
    if (h) {
      closeList();
      const level = h[1].length;
      const sizes = ["text-3xl", "text-2xl", "text-xl"];
      html.push(
        `<h${level} class="mt-8 mb-3 font-display font-bold text-white ${sizes[level - 1]}">${inline(h[2])}</h${level}>`,
      );
      i++;
      continue;
    }

    // blockquote
    if (line.startsWith(">")) {
      closeList();
      const quote = line.replace(/^>\s?/, "");
      html.push(
        `<blockquote class="my-4 border-l-2 border-ocean-400/50 pl-4 italic text-slate-300">${inline(quote)}</blockquote>`,
      );
      i++;
      continue;
    }

    // unordered list
    const ul = /^[-*]\s+(.*)$/.exec(line);
    if (ul) {
      if (listType !== "ul") {
        closeList();
        html.push('<ul class="my-4 list-disc space-y-1.5 pl-6 text-slate-300">');
        listType = "ul";
      }
      html.push(`<li>${inline(ul[1])}</li>`);
      i++;
      continue;
    }

    // ordered list
    const ol = /^\d+\.\s+(.*)$/.exec(line);
    if (ol) {
      if (listType !== "ol") {
        closeList();
        html.push('<ol class="my-4 list-decimal space-y-1.5 pl-6 text-slate-300">');
        listType = "ol";
      }
      html.push(`<li>${inline(ol[1])}</li>`);
      i++;
      continue;
    }

    // paragraph (gather consecutive non-empty, non-special lines)
    closeList();
    const para: string[] = [line];
    let j = i + 1;
    while (
      j < lines.length &&
      lines[j].trim() &&
      !/^(#{1,3})\s+/.test(lines[j]) &&
      !/^[-*]\s+/.test(lines[j]) &&
      !/^\d+\.\s+/.test(lines[j]) &&
      !lines[j].startsWith(">")
    ) {
      para.push(lines[j].trimEnd());
      j++;
    }
    html.push(
      `<p class="my-4 leading-relaxed text-slate-300">${inline(para.join(" "))}</p>`,
    );
    i = j;
  }
  closeList();
  return html.join("\n");
}
