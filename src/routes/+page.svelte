<script>
  import CategoryCardGrid from "$lib/CategoryCardGrid.svelte";
  import enc from "$lib/store/enc.json";
  import {
    buildCategoryHref,
    buildCategorySummary,
    getCategoryTheme,
    getMainCategories,
  } from "$lib/h808";

  const mainAreas = getMainCategories(enc).map((entry) => ({
    ...entry,
    href: buildCategoryHref(entry.code),
    summary: buildCategorySummary(entry),
    theme: getCategoryTheme(entry.code),
  }));
</script>

<svelte:head>
  <title>H808E</title>
</svelte:head>

<CategoryCardGrid items={mainAreas} />

<style>
  :global(.catalog) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    min-height: calc(100vh - var(--header-height));
    align-content: center;
  }

  @media (max-width: 768px) {
    :global(.catalog) {
      grid-template-columns: 1fr;
    }
  }
</style>
