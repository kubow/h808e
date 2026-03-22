import { error } from "@sveltejs/kit";
import { marked } from "marked";
import enc from "$lib/store/enc.json";
import {
  buildCategoryHref,
  buildCategorySummary,
  findCategoryEntry,
  getCategoryLevel,
  getCategoryTheme,
  getChildCategories,
  normalizeCategoryCode,
} from "$lib/h808";
import { getStructuredDatasetsForCode } from "$lib/categoryDatasets";

export const prerender = true;

export function entries() {
  return enc.map((entry) => ({
    code: normalizeCategoryCode(entry.code),
  }));
}

function slugifyFragment(value = "") {
  return value
    .toString()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/<[^>]*>/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function rewriteMarkdownHref(href = "") {
  if (!href || /^(https?:|mailto:|tel:|#)/i.test(href)) {
    return href;
  }

  const normalized = href
    .trim()
    .replace(/^\.?\//, "")
    .replace(/^static\/assets\//, "")
    .replace(/^assets\//, "")
    .replace(/^\/assets\//, "");

  const markdownMatch = normalized.match(/^(\d{3})\.md(?:#(.+))?$/i);
  if (markdownMatch) {
    const fragment = markdownMatch[2]
      ? `#${slugifyFragment(decodeURIComponent(markdownMatch[2]))}`
      : "";
    return `/${markdownMatch[1]}${fragment}`;
  }

  if (/^640_planet_position_calculator\.htm$/i.test(normalized)) {
    return "/tools/calc";
  }

  return href;
}

function renderMarkdown(markdown) {
  const renderer = new marked.Renderer();

  renderer.link = function ({ href, title, tokens }) {
    const resolvedHref = rewriteMarkdownHref(href);
    const text = this.parser.parseInline(tokens);
    const titleAttribute = title ? ` title="${title}"` : "";

    return `<a href="${resolvedHref}"${titleAttribute}>${text}</a>`;
  };

  renderer.heading = function ({ tokens, depth }) {
    const text = this.parser.parseInline(tokens);
    const id = slugifyFragment(text);
    return `<h${depth} id="${id}">${text}</h${depth}>`;
  };

  return marked.parse(markdown, { renderer });
}

export async function load({ params, fetch }) {
  const code = normalizeCategoryCode(params.code);
  const entry = findCategoryEntry(enc, code);

  if (!entry) {
    throw error(404, `Unknown category ${params.code}`);
  }

  let html = "";
  const response = await fetch(`/assets/${code}.md`);
  if (response.ok) {
    const markdown = await response.text();
    html = renderMarkdown(markdown);
  }

  const children = getChildCategories(enc, code).map((child) => ({
    ...child,
    href: buildCategoryHref(child.code),
    summary: buildCategorySummary(child),
    theme: getCategoryTheme(child.code),
  }));

  return {
    code,
    entry,
    html,
    theme: getCategoryTheme(code),
    level: getCategoryLevel(code),
    children,
    datasets: getStructuredDatasetsForCode(code),
  };
}
