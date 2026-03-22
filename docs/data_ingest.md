# Data ingest

This repository should stay focused on the SvelteKit frontend.
The frontend consumes JSON files from `src/lib/store/`; it does not need to own a CSV ingestion toolchain.

## Goal

For every source CSV you want to expose in the UI:

1. Keep the canonical CSV file in `backup/`.
2. Convert that CSV into a JSON array file in `src/lib/store/`.
3. Ensure the JSON shape matches what the Svelte components expect.
4. Commit the resulting JSON so the frontend can build without extra ingest steps.

## Current mapping examples

| CSV source | JSON output |
| --- | --- |
| `backup/enc.csv` | `src/lib/store/enc.json` |
| `backup/language.csv` | `src/lib/store/language.json` |
| `backup/n41_min.csv` | `src/lib/store/mineral.json` |
| `backup/n74_db_engines.csv` | `src/lib/store/db.json` |

## Recommended workflow

Use any external script or tool you prefer to do:

1. Read CSV with UTF-8 encoding.
2. Preserve header names as JSON object keys.
3. Output one JSON object per row.
4. Combine rows into a single JSON array.
5. Write the final file into `src/lib/store/<name>.json`.

This can be implemented with:

- a small Node.js script
- a Python script using `csv` or `pandas`
- a shell pipeline with `csvkit` and `jq`
- Meltano, if you want a Singer-based pipeline outside this repo

## Meltano as an alternative

If you prefer Meltano, keep it as a separate data pipeline project or local-only workflow.
The responsibilities are:

1. Define each CSV file as an input stream.
2. Set the primary key for each stream where relevant.
3. Load the stream output into a local directory.
4. Convert line-delimited JSON output into standard JSON arrays if needed.
5. Copy the final JSON files into `src/lib/store/`.

## Acceptance check

Before committing an ingest update:

1. Open the generated JSON and confirm it is a valid array.
2. Check that field names still match the frontend usage.
3. Run the frontend checks and build.
