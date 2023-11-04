# Main structure

Star Encyklopedia | H808E | Hvězdná encyklopedie

- 400 : Příroda (Nature)
  - [Minerály (Minerals)](static/assets/410.md) ✓
  - [Život (Life)](static/assets/420.md) ✓
  - [Složení (Realization)](static/assets/430.md) ✓
- 500 : Člověk (Human)
  - [Základní potřeby (Basic needs)](static/assets/510.md) ✓
  - [Pohyb (Movement)](static/assets/520.md) ✓
  - [Kultura (Culture)](static/assets/530.md) ✓
  - [Zákony (Laws)](static/assets/540.md) ☒
  - [Magie (Magic)](static/assets/550.md) ☒
- 600 : Vědy (Science)
  - [Matematika (Mathematics)](static/assets/610.md) ✓
  - [Fyzika (Physics)](static/assets/620.md) ✓
  - [Chemie(Chemistry)](static/assets/630.md) ✓
- 700 : Technologie (Technology)
  - [Materiály (Materials)](static/assets/710.md) ✓
  - [Nástroje (Tools)](static/assets/720.md) ☒
  - [Energie (Energy)](static/assets/730.md) ✓
  - [Digital (environment)](static/assets/740.md) ✓
  - [Stavby (Builds)](static/assets/750.md) ✓

## Folder structure

| DATA TYPE | FOLDER LOCATION  | FILE TYPE               | LINK                  |
| --------- | ---------------- | ----------------------- | --------------------- |
| Text      | `static/assets/` | MarkDown                | [x](./static/assets/) |
| Tables    | `src/lib/store/` | JSON                    | [x](./src/lib/store/) |
| Media     | `static/images/` | Images, various content | [x](./static/images/) |

## Layout structure

- Header

| BURGER_BUTTON      | SVG_LOGO                 | POPOVER/SEARCH     | MOON           | CLOCK                    |
| ------------------ | ------------------------ | ------------------ | -------------- | ------------------------ |
| fixed 16,67% width | (not positioned for now) | under construction | not positioned | hover for important days |

- Content
- Footer

# Todos

- font and backround color as css variables
- refresh all enc tables (sqlite > JSON)

# Svelte structure

Sveltekit project powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/master/packages/create-svelte).

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.

## Extraction (meltano)

```shell

meltano discover extractors  # available taps

meltano add extractor tap-csv --variant=meltanolabs
meltano add loader target-jsonl
meltano discover loaders  # available targrets

meltano run tap-csv target-jsonl
```

Sources

- [tap-csv - Meltano Hub](https://hub.meltano.com/extractors/tap-csv)

- [MeltanoLabs/tap-sqlalchemy: A generic Singer tap for any SQLAlchemy data source. Still under development.](https://github.com/MeltanoLabs/tap-sqlalchemy/search?l=shell)
