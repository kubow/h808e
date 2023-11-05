<script>
  import ItemList from "$lib/ItemList.svelte";
  import src from "$lib/store/sources.json";
  // need to map columns to desired structure
  const rss = src
    .filter((x) => x.source_type == "radio")
    .map(({ source_address, source_name }) => ({
      title: source_name,
      content: `${source_name}`,
      image: "images/moon-full.svg",
      ref: source_address,
    }));
  // console.log(rss);
</script>

{#await rss}
  <p>...data not yet loaded</p>
{:then rss}
  <ItemList data_set={rss} />
{:catch error}
  <p style="color: red">error: {error.message}</p>
{/await}
