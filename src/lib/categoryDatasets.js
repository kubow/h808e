import db from "$lib/store/db.json";
import herbar from "$lib/store/herbar.json";
import mineral from "$lib/store/mineral.json";
import sources from "$lib/store/sources.json";

function makeCard(item) {
  return {
    title: item.title,
    summary: item.summary,
    content: item.content || item.summary || "",
    image: item.image || "",
    href: item.href || "",
    ref: item.href || "",
  };
}

const DATASET_BUILDERS = {
  "413": () => ({
    title: "Mineral dataset",
    description: "Structured records generated from backup/n41_min.csv.",
    items: mineral.map((item) =>
      makeCard({
        title: item.name_cz,
        summary: [item.formula, item.color].filter(Boolean).join(" • "),
        href: item.src_cz || item.src_en || "",
      })
    ),
  }),
  "425": () => ({
    title: "Plant dataset",
    description: "Structured records generated from the herbarium source.",
    items: herbar.map((item) =>
      makeCard({
        title: item.Nazev_cz,
        summary: [item.Celed, item.Nazev_lat].filter(Boolean).join(" • "),
        image: item.Obrazek ? `/images/ROS/${item.Obrazek}` : "",
      })
    ),
  }),
  "526": () => ({
    title: "Restaurant sources",
    description: "Structured source list filtered from sources.json.",
    items: sources
      .filter((item) => item.source_type === "restaurant")
      .map((item) =>
        makeCard({
          title: item.source_name,
          summary: item.source_address,
          href: item.source_address,
        })
      ),
  }),
  "534": () => ({
    title: "Radio sources",
    description: "Structured source list filtered from sources.json.",
    items: sources
      .filter((item) => item.source_type === "radio")
      .map((item) =>
        makeCard({
          title: item.source_name,
          summary: item.source_address,
          href: item.source_address,
        })
      ),
  }),
  "544": () => ({
    title: "RSS sources",
    description: "Structured source list filtered from sources.json.",
    items: sources
      .filter((item) => item.source_type === "rss_feed")
      .map((item) =>
        makeCard({
          title: item.source_name,
          summary: item.source_address,
          href: item.source_address,
        })
      ),
  }),
  "742": () => ({
    title: "Database engines",
    description: "Structured records generated from backup/n74_db_engines.csv.",
    items: db.map((item) =>
      makeCard({
        title: item.ename,
        summary: [item.language, item.point].filter(Boolean).join(" • "),
        href: item.website,
      })
    ),
  }),
  "744": () => ({
    title: "Application sources",
    description: "Structured application/source list filtered from sources.json.",
    items: sources
      .filter((item) => item.source_type === "app")
      .map((item) =>
        makeCard({
          title: item.source_name,
          summary: item.source_address,
          href: item.source_address,
        })
      ),
  }),
};

export function getStructuredDatasetsForCode(code) {
  const build = DATASET_BUILDERS[code];
  if (!build) return [];

  const dataset = build();
  return [
    {
      ...dataset,
      count: dataset.items.length,
      items: dataset.items.slice(0, 24),
    },
  ];
}
