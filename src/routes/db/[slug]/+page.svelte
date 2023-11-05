<script>
  import db from "$lib/store/db.json";
  import ItemList from "$lib/ItemList.svelte";
  import { page } from "$app/stores";

  // Get the ename value from the URL route parameter
  const { slug } = $page.params;

  /* map columns to desired structure:
  ename -> title
  website -> ref
  the rest -> content
  image is not represented yet
  */
  const engines = db.map(
    ({ ename, category, developer, language, point, website }) => ({
      title: ename,
      content: `Developer: ${developer} \n Written in ${language} \n ${point} \n Category: ${category}`,
      image: "/images/database.svg",
      ref: website,
    })
  );
  // Logic to find data based on the ename value
  const filtered = engines.filter((item) =>
    item.title.toLowerCase().includes(slug)
  );
</script>

<div>
  <h1>requested <u>{slug}</u> and found:</h1>
</div>
{#if filtered.length > 0}
  <ItemList data_set={filtered} />
{:else if filtered.length > 1}
  <p>Special treatment {filtered[0].title}</p>
{:else}
  <p>No data found for the engine .</p>
{/if}
