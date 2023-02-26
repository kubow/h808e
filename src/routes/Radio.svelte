<script>
  //import { onMount } from 'svelte';
  import ItemList from "../ItemList.svelte";
  import Btn from "../Btn.svelte";
  import { loadDataJson, loadDataUrl, h808e } from "../stores.js";

  let news;
  let sources = [];

  async function prepareData() {
    const res = await $h808e.sources;
    
    for (const el of res.Sources) { //res.Sources) {
      if (el.source_type == "radio" && el.active > 0) {sources.push(el)}
    }
    console.log(res);
    return sources;
  };

  async function prepareSource(link) {
    // this hack because of CORS
    const res = await loadDataUrl($h808e.api.scrapestack.url.replace("BOBOK", $h808e.api.scrapestack.access_key)&link);
    console.log(res);
    return res
  }

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