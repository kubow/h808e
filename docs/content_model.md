# Content model

H808E now has one category-driven content model.

## Taxonomy

The canonical taxonomy source is `backup/enc.csv`, generated into `src/lib/store/enc.json`.

Each 3-digit code means:

1. First digit: main area.
2. Second digit: section inside the main area.
3. Third digit: topic inside the section.

Examples:

- `400`, `500`, `600`, `700` are the four main H808 areas.
- `410`, `420`, `530`, `740` are second-level sections.
- `431`, `425`, `742`, `744` are third-level topics.

## Route model

Routes should follow the taxonomy code, not hardcoded page names.

- `/` shows the main areas: `400`, `500`, `600`, `700`
- `/<code>` renders a category page for any valid 3-digit taxonomy code

Category behavior:

- Main level like `400` shows its second-level children.
- Section level like `410` shows its markdown plus third-level children.
- Topic level like `431` shows its markdown directly.

There is no extra `/enc` layer in the primary model.

## Content layers

Each category page can render up to three content layers:

1. Taxonomy metadata from `enc.json`
2. Narrative markdown from `static/assets/<code>.md`
3. Structured dataset previews from `src/lib/store/*.json`

This is intentional: markdown and structured JSON are both category content.

## Structured dataset mapping

Some categories are backed by generated JSON datasets.

Current mappings:

- `413` -> `src/lib/store/mineral.json`
  source CSV: `backup/n41_min.csv`
- `425` -> `src/lib/store/herbar.json`
  source CSV: herbarium source imported into the JSON file
- `526` -> `src/lib/store/sources.json` filtered to `restaurant`
- `534` -> `src/lib/store/sources.json` filtered to `radio`
- `544` -> `src/lib/store/sources.json` filtered to `rss_feed`
- `742` -> `src/lib/store/db.json`
  source CSV: `backup/n74_db_engines.csv`
- `744` -> `src/lib/store/sources.json` filtered to `app`

The mapping code lives in `src/lib/categoryDatasets.js`.

To print the current category-to-content connection list, run:

```bash
npm run content:map
```

This reports which taxonomy codes currently have:

- markdown in `static/assets/<code>.md`
- structured dataset mapping from `src/lib/categoryDatasets.js`

## Tools

Some pages are not taxonomy content and belong under tools:

- `/tools`
- `/tools/calc`
- `/tools/astro`
- `/tools/map`
- `/tools/time`

These are utility or exploratory pages, not part of the main H808 encyclopedia hierarchy.

## Practical rule

When adding new content:

1. Add or update the taxonomy row in `enc.csv`.
2. If the category needs narrative text, create `static/assets/<code>.md`.
3. If the category has structured records, generate or update the relevant JSON in `src/lib/store/`.
4. If needed, add or extend the dataset mapping in `src/lib/categoryDatasets.js`.

The category page should then pick the content up automatically.

## Should markdown repeat the detail mapping?

Usually no.

Markdown should describe the subject matter itself.
The structured-data binding should stay in the application layer, because:

- the same dataset may be reused by multiple category pages
- the binding is operational metadata, not reader-facing content
- changing dataset location or filter rules should not require editing narrative markdown

What does make sense in markdown:

- links to deeper topic markdown pages
- explanatory text that tells the reader a structured list exists below
- editorial notes about what the dataset represents
