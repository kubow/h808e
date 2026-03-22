<script>
  import CategoryCardGrid from "$lib/CategoryCardGrid.svelte";
  import CategoryBackground from "$lib/CategoryBackground.svelte";
  import ItemList from "$lib/ItemList.svelte";

  export let data;

  let activeView = "text";

  $: hasListView = data.datasets.length > 0;
  $: listItems = data.datasets.flatMap((dataset) => dataset.items);
  $: listCount = data.datasets.reduce((total, dataset) => total + dataset.count, 0);
  $: if (!data.html && hasListView) {
    activeView = "list";
  }
</script>

<svelte:head>
  <title>{data.code} | {data.entry.area_cz}</title>
</svelte:head>

<div class="page-shell">
  <div class="page-bg">
    <CategoryBackground
      code={data.code}
      showLegend={false}
    />
  </div>

  <section class="page">
  <header class="hero">
    <div class="hero-copy">
      <div class="hero-meta">
        <div class="kicker">
          <span>{data.code}</span>
          <span>{data.theme.label}</span>
        </div>
        <h1>{data.entry.area_cz}</h1>
      </div>
      <p>{data.entry.header || data.entry.kw_cz || "Category overview"}</p>
      <div class="controls">
        <a class="back" href="/">Main overview</a>
        {#if hasListView}
          <div class="tabs" role="tablist" aria-label="Category view switcher">
            <button
              type="button"
              class:active={activeView === "text"}
              on:click={() => (activeView = "text")}
            >
              Text
            </button>
            <button
              type="button"
              class:active={activeView === "list"}
              on:click={() => (activeView = "list")}
            >
              List
            </button>
          </div>
        {/if}
      </div>
    </div>
  </header>

  {#if activeView === "text"}
    <article class="markdown panel">
      {#if data.html}
        {@html data.html}
      {:else}
        <p>No markdown content yet for {data.code}.</p>
      {/if}
    </article>
  {:else if hasListView}
    <section class="list-panel">
      <div class="dataset-head">
        <div>
          <h2>Structured content</h2>
          <p>
            {data.datasets.map((dataset) => dataset.title).join(" / ")}
          </p>
        </div>
        <span>{listCount} records</span>
      </div>
      <ItemList data_set={listItems} />
    </section>
  {/if}

  {#if data.children.length > 0}
    <section class="children panel">
      <div class="children-head">
        <h2>
          {data.level === "main" ? "Second level categories" : "Subcategories"}
        </h2>
        <p>Generated directly from the H808 taxonomy.</p>
      </div>
      <CategoryCardGrid items={data.children} />
    </section>
  {/if}
</section>
</div>

<style>
  .page-shell {
    position: relative;
    min-height: calc(100vh - var(--header-height));
  }

  .page-bg {
    position: absolute;
    inset: 0;
  }

  .page {
    position: relative;
    z-index: 1;
    display: grid;
    gap: 1.5rem;
    padding: 1.5rem;
  }

  .hero {
    position: relative;
    border-radius: 1.35rem;
    overflow: clip;
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 18px 36px rgba(15, 23, 42, 0.22);
    background: linear-gradient(180deg, rgba(5, 8, 18, 0.18), rgba(5, 8, 18, 0.46));
  }

  .hero-copy {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: minmax(0, auto) minmax(0, 1fr) auto;
    gap: 1rem;
    align-items: center;
    min-height: calc(var(--header-height) + 1rem);
    padding: 0.75rem 1.1rem;
    color: white;
    background: linear-gradient(90deg, rgba(0, 0, 0, 0.22), rgba(0, 0, 0, 0.4));
  }

  .hero-meta {
    display: flex;
    align-items: center;
    gap: 0.85rem;
    min-width: 0;
  }

  .kicker {
    display: flex;
    gap: 0.45rem;
    flex-wrap: nowrap;
    font-size: 0.72rem;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }

  .kicker span,
  .back {
    display: inline-flex;
    width: fit-content;
    padding: 0.45rem 0.8rem;
    border-radius: 999px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(8px);
  }

  .back {
    color: white;
    text-decoration: none;
  }

  .controls {
    display: flex;
    gap: 0.75rem;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: flex-end;
  }

  .tabs {
    display: inline-flex;
    padding: 0.25rem;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.18);
    backdrop-filter: blur(8px);
  }

  .tabs button {
    border: 0;
    background: transparent;
    color: rgba(255, 255, 255, 0.78);
    padding: 0.45rem 0.85rem;
    border-radius: 999px;
    font: inherit;
    cursor: pointer;
  }

  .tabs button.active {
    background: rgba(255, 255, 255, 0.22);
    color: white;
  }

  h1,
  p {
    margin: 0;
  }

  h1 {
    max-width: 18ch;
    font-size: clamp(1.1rem, 2vw, 1.7rem);
    line-height: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .hero p {
    max-width: none;
    min-width: 0;
    font-size: 0.95rem;
    line-height: 1.35;
    opacity: 0.88;
  }

  .panel {
    padding: min(4vw, 2rem);
    border-radius: 1.5rem;
    background: rgba(255, 255, 255, 0.82);
    box-shadow:
      inset 0 0 0 1px rgba(15, 23, 42, 0.08),
      0 18px 40px rgba(15, 23, 42, 0.14);
    backdrop-filter: blur(16px);
  }

  .markdown {
    line-height: 1.75;
  }

  .list-panel,
  .children {
    display: grid;
    gap: 1rem;
  }

  .list-panel {
    padding: 1rem 0 0;
  }

  .dataset-head,
  .children-head {
    display: flex;
    justify-content: space-between;
    align-items: end;
    gap: 1rem;
  }

  .dataset-head h2,
  .children-head h2,
  .children-head p,
  .dataset-head p {
    margin: 0;
  }

  .dataset-head p,
  .children-head p {
    opacity: 0.72;
  }

  .dataset-head span {
    white-space: nowrap;
    opacity: 0.72;
  }

  .dataset-head {
    padding: 0 1rem;
    color: white;
    text-shadow: 0 2px 12px rgba(0, 0, 0, 0.32);
  }

  .markdown :global(h2),
  .markdown :global(h3) {
    margin-top: 1.75em;
  }

  .markdown :global(table) {
    width: 100%;
    border-collapse: collapse;
  }

  .markdown :global(th),
  .markdown :global(td) {
    padding: 0.6rem;
    border: 1px solid rgba(15, 23, 42, 0.12);
    text-align: left;
  }

  @media (max-width: 640px) {
    .page {
      padding: 1rem;
    }

    .hero-copy {
      grid-template-columns: 1fr;
      align-items: start;
      padding: 1rem;
    }

    .hero-meta {
      flex-wrap: wrap;
    }

    .kicker {
      flex-wrap: wrap;
    }

    .dataset-head,
    .children-head {
      align-items: start;
      flex-direction: column;
    }

    .dataset-head {
      padding: 0 0.2rem;
    }

    .controls {
      flex-wrap: wrap;
      justify-content: flex-start;
    }

    h1 {
      white-space: normal;
    }
  }
</style>
