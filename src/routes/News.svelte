<script>
  import { onMount } from 'svelte';
  import ItemList from "../ItemList.svelte";
  import Btn from "../Btn.svelte";
  import { loadDataJson, loadDataUrl, h808e } from "../stores.js";

  let mode;
  let news;
  let sources = [];

  async function prepareData() {
    if (mode) {
      let res = await $h808e.sources;
      for (const el of res.Sources) { //res.Sources) {
        if (el.source_type == "rss_feed" && el.active > 0) {sources.push(el)}
      }
    } else {
      news = await loadDataUrl($h808e.api.newsapi.url.replace("BOBOK", $h808e.api.newsapi.access_key));
      return news;
    }
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
{:then news}
    <ItemList data_set={news.articles} />
{:catch error}
    <p style="color: red">error: {error.message}</p>
{/await}

<style>
</style>