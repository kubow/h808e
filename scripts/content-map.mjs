import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const enc = JSON.parse(
  fs.readFileSync(path.join(root, "src/lib/store/enc.json"), "utf8")
);

const markdownCodes = new Set(
  fs
    .readdirSync(path.join(root, "static/assets"))
    .filter((file) => /^\d{3}\.md$/i.test(file))
    .map((file) => file.replace(/\.md$/i, ""))
);

const datasetMap = {
  "413": "mineral.json <- backup/n41_min.csv",
  "425": "herbar.json",
  "526": "sources.json (restaurant)",
  "534": "sources.json (radio)",
  "544": "sources.json (rss_feed)",
  "742": "db.json <- backup/n74_db_engines.csv",
  "744": "sources.json (app)",
};

const rows = enc
  .filter((entry) => markdownCodes.has(entry.code) || datasetMap[entry.code])
  .sort((a, b) => a.code.localeCompare(b.code))
  .map((entry) => ({
    code: entry.code,
    area: entry.area_cz,
    markdown: markdownCodes.has(entry.code) ? `static/assets/${entry.code}.md` : "",
    dataset: datasetMap[entry.code] || "",
  }));

console.table(rows);
