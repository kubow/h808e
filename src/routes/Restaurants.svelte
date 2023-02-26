<script>
  import { onMount } from 'svelte';
  import ItemList from "../ItemList.svelte";
  import Btn from "../Btn.svelte";
  import { loadDataJson, loadDataUrl, h808e } from "../stores.js";

  let rests;
  let sources = [];

  async function prepareData() {
    let res = await $h808e.sources;
    
    for (const el of res) { // filtering on active restaurants
      if (el.source_type == "restaurant" && el.active > 0) {sources.push(el)}
    }
    console.log(sources);
    return sources;
  };

</script>

{#await prepareData()}
    <p>...data not yet loaded</p>
{:then sources}
    <ItemList data_set={sources} />
{:catch error}
    <p style="color: red">error: {error.message}</p>
{/await}

<style>
</style>