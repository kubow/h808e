<script>
  import { onMount } from "svelte";
  import ItemList from "$lib/ItemList.svelte";
  import src from "$lib/store/sources.json";

  let rss = src.filter((x) => x.source_type == "radio");
</script>

{#await rss}
  <p>...data not yet loaded</p>
{:then rss}
  <ItemList data_set={rss} />
{:catch error}
  <p style="color: red">error: {error.message}</p>
{/await}
