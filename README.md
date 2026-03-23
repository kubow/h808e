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

## Data structure

| DATA TYPE | FOLDER LOCATION  | FILE TYPE               | LINK                  |
| --------- | ---------------- | ----------------------- | --------------------- |
| Text      | `static/assets/` | MarkDown                | [x](./static/assets/) |
| Tables    | `src/lib/store/` | JSON                    | [x](./src/lib/store/) |
| Media     | `static/images/` | Images, various content | [x](./static/images/) |


## Layout structure

Written in `svelte-kit`, compiled with `vite`, all `css` happens in svelte files (no extra modules).

- Header

| BURGER_BUTTON      | SVG_LOGO                 | POPOVER/SEARCH     | MOON           | CLOCK                    |
| ------------------ | ------------------------ | ------------------ | -------------- | ------------------------ |
| fixed 16,67% width | (not positioned for now) | under construction | not positioned | hover for important days |

- Side panel activated by Burger button
	- links to all areas
	- theme + dark mode switcher
- Content
- Footer

## Data updates

The app reads prepared JSON tables from `src/lib/store/`.
CSV ingestion is documented in [docs/data_ingest.md](docs/data_ingest.md) as an external workflow, not as project-owned runtime logic.
Application content behavior is documented in [docs/content_model.md](docs/content_model.md).

- TO-DO: MySQL (@kubow.cz) database will be the middle piece.

## Minimal PHP API

This project is built as a static SvelteKit site, so database access needs a small server-side layer.

- PHP API entrypoints live in `static/api/`
- `load.php` reads rows from a whitelisted table
- `store.php` inserts rows into a whitelisted table
- `config.example.php` is the template for server-only DB credentials and allowed tables
- `schema.example.sql` is the matching demo table

Setup on hosting:

1. Copy `static/api/config.example.php` to `static/api/config.php`
2. Fill in MySQL credentials
3. Adjust the `tables` whitelist to your real table names and columns
4. Create the table in MySQL
5. Deploy so `/api/load.php` and `/api/store.php` are accessible on the same domain

Frontend usage example:

```js
import { loadRows, storeRow } from '$lib/phpApi';

const rows = await loadRows('notes', { limit: 10 });

await storeRow('notes', {
  title: 'Hello',
  body: 'Stored from Svelte'
});
```

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
