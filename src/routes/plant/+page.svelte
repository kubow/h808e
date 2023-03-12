<script>
  import { onMount } from "svelte";
  import ItemList from "$lib/ItemList.svelte";
  import { h808e } from "$lib/stores.js";

  /**
   * @type {any[]}
   */
  let plants = [];

  onMount(async () => {
    const plants = await $h808e.plants;
  });
</script>

{#await plants}
  <p>...data not yet loaded</p>
{:then plants}
  <ItemList data_set={plants} />
{:catch error}
  <p style="color: red">error: {error.message}</p>
{/await}
