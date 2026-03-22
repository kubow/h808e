<script>
  import { onMount } from "svelte";
  import enc from "$lib/store/enc.json";
  import { buildCategoryHref } from "$lib/h808";
  import { headerSearchQuery } from "$lib/stores";

  const MAX_RESULTS = 8;
  let root;
  let isOpen = false;

  function normalize(value = "") {
    return value
      .toString()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function buildSearchText(entry) {
    return normalize(
      [
        entry.code,
        entry.area_cz,
        entry.area_en,
        entry.kw_cz,
        entry.kw_en,
        entry.folder,
        entry.query,
        entry.header,
      ]
        .filter(Boolean)
        .join(" ")
    );
  }

  $: query = $headerSearchQuery?.trim() ?? "";
  $: normalizedQuery = normalize(query);
  $: results = normalizedQuery
    ? enc
        .filter((entry) => buildSearchText(entry).includes(normalizedQuery))
        .slice(0, MAX_RESULTS)
        .map((entry) => ({
          code: entry.code,
          title: entry.area_cz,
          summary: entry.header || entry.kw_cz || entry.area_en || "",
          href: buildCategoryHref(entry.code),
        }))
    : [];
  $: showResults = isOpen && normalizedQuery && results.length > 0;

  function handleFocus() {
    isOpen = true;
  }

  function handleSelect() {
    isOpen = false;
  }

  function handleKeydown(event) {
    if (event.key === "Escape") {
      isOpen = false;
    }
  }

  onMount(() => {
    function handlePointerDown(event) {
      if (!root?.contains(event.target)) {
        isOpen = false;
      }
    }

    window.addEventListener("pointerdown", handlePointerDown);

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
    };
  });
</script>

<div class="search-stack" bind:this={root}>
  <div class="search-shell">
    <input
      bind:value={$headerSearchQuery}
      class="search-input"
      type="search"
      placeholder="Search H808E"
      autocomplete="off"
      spellcheck="false"
      aria-label="Search H808E taxonomy and current list"
      on:focus={handleFocus}
      on:input={handleFocus}
      on:keydown={handleKeydown}
    />

    {#if showResults}
      <div class="search-results">
        {#each results as result}
          <a class="search-result" href={result.href} on:click={handleSelect}>
            <span class="result-code">{result.code}</span>
            <span class="result-copy">
              <strong>{result.title}</strong>
              {#if result.summary}
                <small>{result.summary}</small>
              {/if}
            </span>
          </a>
        {/each}
      </div>
    {/if}
  </div>

</div>

<style>
  .search-stack {
    position: relative;
    display: block;
    width: min(100%, 22rem);
    background: transparent;
  }

  .search-shell {
    position: relative;
    width: 100%;
    background: transparent;
  }

  .search-input {
    display: block;
    width: 100%;
    border-radius: 999px;
    border: 1px solid rgba(255, 255, 255, 0.38);
    padding: 0.7rem 1rem;
    font-size: var(--font-size-2);
    font-family: var(--font-sans);
    color: white;
    background: rgba(9, 17, 31, 0.72);
    box-shadow: 0 8px 18px rgba(3, 8, 18, 0.16);
    box-sizing: border-box;
    appearance: none;
    -webkit-appearance: none;
    outline: none;
  }

  .search-input:focus,
  .search-input:focus-visible {
    border-color: rgba(255, 255, 255, 0.58);
    background: rgba(9, 17, 31, 0.82);
    box-shadow: 0 8px 18px rgba(3, 8, 18, 0.2);
  }

  .search-input::placeholder {
    color: rgba(255, 255, 255, 0.68);
  }

  .search-input::-webkit-search-decoration,
  .search-input::-webkit-search-cancel-button,
  .search-input::-webkit-search-results-button,
  .search-input::-webkit-search-results-decoration {
    -webkit-appearance: none;
    appearance: none;
    display: none;
  }

  .search-input::-ms-clear,
  .search-input::-ms-reveal {
    display: none;
    width: 0;
    height: 0;
  }

  .search-results {
    position: absolute;
    top: calc(100% + 0.45rem);
    left: 0;
    right: 0;
    z-index: 12;
    display: grid;
    gap: 0.35rem;
    padding: 0.5rem;
    border-radius: 1rem;
    background: rgba(255, 255, 255, 0.95);
    box-shadow:
      0 18px 36px rgba(15, 23, 42, 0.2),
      inset 0 0 0 1px rgba(15, 23, 42, 0.08);
  }

  .search-result {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    gap: 0.8rem;
    align-items: start;
    padding: 0.7rem 0.8rem;
    border-radius: 0.85rem;
    color: #0f172a;
    text-decoration: none;
  }

  .search-result:hover,
  .search-result:focus {
    background: rgba(28, 98, 168, 0.1);
  }

  .result-code {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 3rem;
    padding: 0.2rem 0.5rem;
    border-radius: 999px;
    background: rgba(28, 98, 168, 0.12);
    font-size: var(--font-size-0);
    letter-spacing: 0.08em;
  }

  .result-copy {
    display: grid;
    gap: 0.2rem;
    min-width: 0;
  }

  .result-copy strong,
  .result-copy small {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .result-copy small {
    opacity: 0.68;
  }
</style>
