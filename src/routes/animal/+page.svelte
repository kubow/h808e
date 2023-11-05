<script>
  import ItemList from "$lib/ItemList.svelte";
  /**
   * @type {any}
   */
  let min;
  // import __ from "$lib/store/__.json";
  // animals db not yet ready
  // need to map columns to desired structure
  /*const min = __.map(({ name_cz, desc_cz, src_cz, formula }) => ({
    title: name_cz,
    content: `${formula}\n${desc_cz}`,
    image: "images/600.svg",
    ref: src_cz,
  }));*/
  //console.log(min);
</script>

{#await min}
  <p>...data not yet loaded</p>
{:then min}
  <ItemList data_set={min} />
  <p>animals db not yet ready</p>
{:catch error}
  <p style="color: red">error: {error.message}</p>
{/await}
