<script>
  import ItemList from "$lib/ItemList.svelte";
  import src from "$lib/store/sources.json";

  let radio = src.filter((x) => x.source_type == "radio");
</script>

<ItemList data_set={radio} />
