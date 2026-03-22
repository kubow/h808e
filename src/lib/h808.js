const AREA_THEMES = {
  4: {
    label: "Nature",
    primary: "#1d8348",
    secondary: "#8fd694",
    accent: "#d9f99d",
    surface: "#041814",
    glow: "rgba(123, 255, 177, 0.35)",
    emblemSides: 5,
  },
  5: {
    label: "Human",
    primary: "#c05621",
    secondary: "#f6ad55",
    accent: "#fed7aa",
    surface: "#21110b",
    glow: "rgba(255, 190, 92, 0.35)",
    emblemSides: 6,
  },
  6: {
    label: "Science",
    primary: "#2563eb",
    secondary: "#67e8f9",
    accent: "#dbeafe",
    surface: "#07111f",
    glow: "rgba(84, 184, 255, 0.32)",
    emblemSides: 3,
  },
  7: {
    label: "Technology",
    primary: "#475569",
    secondary: "#f97316",
    accent: "#fdba74",
    surface: "#0f172a",
    glow: "rgba(249, 115, 22, 0.28)",
    emblemSides: 8,
  },
};

const FALLBACK_THEME = {
  label: "Archive",
  primary: "#334155",
  secondary: "#94a3b8",
  accent: "#e2e8f0",
  surface: "#020617",
  glow: "rgba(148, 163, 184, 0.3)",
  emblemSides: 4,
};

export function normalizeCategoryCode(value) {
  const digits = String(value ?? "").replace(/\D/g, "").slice(0, 3);
  return digits.padStart(3, "0");
}

export function parseCategoryCode(value) {
  const code = normalizeCategoryCode(value);

  return {
    code,
    mainArea: Number(code[0]),
    category: Number(code[1]),
    subcategory: Number(code[2]),
  };
}

export function getCategoryTheme(value) {
  const { code, mainArea, category, subcategory } = parseCategoryCode(value);
  const base = AREA_THEMES[mainArea] ?? FALLBACK_THEME;
  const density = 4 + ((category + subcategory) % 5);

  return {
    code,
    ...base,
    mainArea,
    category,
    subcategory,
    density,
    orbitCount: 2 + (category % 3),
    orbitSpread: 18 + subcategory * 4,
    emblemSides: base.emblemSides + (category % 2),
    rotationOffset: category * 12 + subcategory * 7,
    animationSeconds: 18 - Math.min(category + subcategory, 8),
    pulseSeconds: 7 + (subcategory % 4),
    gridTilt: -16 + category * 3,
    stripeOffset: 8 + subcategory * 2,
    seed: mainArea * 100 + category * 10 + subcategory,
  };
}

export function buildCategoryHref(code) {
  return `/${normalizeCategoryCode(code)}`;
}

export function getCategoryLevel(value) {
  const code = normalizeCategoryCode(value);

  if (code.endsWith("00")) return "main";
  if (code.endsWith("0")) return "section";
  return "topic";
}

export function buildCategorySummary(entry) {
  return entry.header || entry.kw_cz || entry.kw_en || entry.folder || "";
}

export function sortCategories(entries) {
  return [...entries].sort((a, b) => Number(a.code) - Number(b.code));
}

export function findCategoryEntry(entries, code) {
  const normalized = normalizeCategoryCode(code);
  return entries.find((entry) => normalizeCategoryCode(entry.code) === normalized);
}

export function getMainCategories(entries) {
  return sortCategories(entries).filter(
    (entry) => getCategoryLevel(entry.code) === "main"
  );
}

export function getChildCategories(entries, code) {
  const normalized = normalizeCategoryCode(code);
  const level = getCategoryLevel(normalized);

  if (level === "main") {
    const prefix = normalized[0];
    return sortCategories(entries).filter(
      (entry) =>
        entry.code[0] === prefix && getCategoryLevel(entry.code) === "section"
    );
  }

  if (level === "section") {
    const prefix = normalized.slice(0, 2);
    return sortCategories(entries).filter(
      (entry) =>
        entry.code.slice(0, 2) === prefix && getCategoryLevel(entry.code) === "topic"
    );
  }

  return [];
}
