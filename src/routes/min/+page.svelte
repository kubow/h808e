<script>
  import ItemList from "$lib/ItemList.svelte";
  import mineral from "$lib/store/mineral.json";
  // need to map columns to desired structure
  const min = mineral.map(({ name_cz, desc_cz, src_cz, formula }) => ({
    title: name_cz,
    content: `${formula}\n${desc_cz}`,
    image: "images/600.svg",
    ref: src_cz,
  }));
  //console.log(min);
</script>

{#await min}
  <p>...data not yet loaded</p>
{:then rss}
  <ItemList data_set={min} />
{:catch error}
  <p style="color: red">error: {error.message}</p>
{/await}
