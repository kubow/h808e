<script>
  import ItemList from "$lib/ItemList.svelte";
  import src from "$lib/store/enc.json";

  // need to map columns to desired structure
  const enc = src.map(({ code, area_cz, folder, header, kw_cz }) => ({
    title: `${code}\n${area_cz}`,
    content: `${folder}: ${header}\n${kw_cz}`,
    image: "images/moon-full.svg",
    ref: folder,
  }));
  //console.log(enc);
</script>

{#await enc}
  <p>...data not yet loaded</p>
{:then rss}
  <ItemList data_set={enc} />
{:catch error}
  <p style="color: red">error: {error.message}</p>
{/await}
