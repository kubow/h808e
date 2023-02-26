<script>
  import ItemList from "../ItemList.svelte";
  import { loadDataJson, loadDataUrl, h808e } from "../stores.js";

  async function prepareData() {
    const data = await loadDataUrl($h808e.api.newsapi.url.replace("BOBOK", $h808e.api.newsapi.access_key));
    console.log(news);
    return news;
  };
  
  let news = [];
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