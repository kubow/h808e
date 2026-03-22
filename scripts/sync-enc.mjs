import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const sourcePath = path.join(root, "backup/enc.csv");
const targetPath = path.join(root, "src/lib/store/enc.json");

function parseCsvLine(line) {
  const cells = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    const next = line[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      cells.push(current);
      current = "";
      continue;
    }

    current += char;
  }

  cells.push(current);
  return cells;
}

function parseCsv(text) {
  const lines = text.replace(/\r\n/g, "\n").trim().split("\n");
  const [headerLine, ...dataLines] = lines;
  const headers = parseCsvLine(headerLine);

  return dataLines
    .filter((line) => line.trim().length > 0)
    .map((line, index) => {
      const values = parseCsvLine(line);
      const row = {
        _sdc_source_file: "./backup/enc.csv",
        _sdc_source_file_mtime: fs.statSync(sourcePath).mtime.toISOString(),
        _sdc_source_lineno: index + 1,
      };

      headers.forEach((header, headerIndex) => {
        row[header] = values[headerIndex] ?? "";
      });

      return row;
    });
}

const source = fs.readFileSync(sourcePath, "utf8");
const rows = parseCsv(source);

fs.writeFileSync(targetPath, `${JSON.stringify(rows, null, 2)}\n`);

console.log(`Synced ${rows.length} taxonomy rows to ${path.relative(root, targetPath)}`);
