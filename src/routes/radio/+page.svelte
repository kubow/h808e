<script>
  import { onMount } from "svelte";
  import ItemList from "$lib/ItemList.svelte";
  import { h808e } from "$lib/stores.js";

  /**
   * @type {any[]}
   */
  let sources = [];

  onMount(async () => {
    const res = await $h808e.sources;
    for (const el of res) {
      //res.Sources) {
      if (el.source_type == "radio" && el.active > 0) {
        sources.push(el);
      }
    }
  });
</script>

{#await sources}
  <p>...data not yet loaded</p>
{:then sources}
  <ItemList data_set={sources} />
{:catch error}
  <p style="color: red">error: {error.message}</p>
{/await}
