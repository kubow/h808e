<script>
  import ItemList from "$lib/ItemList.svelte";
  import src from "$lib/store/sources.json";

  let rest = src.filter((x) => x.source_type == "restaurant");
</script>

<ItemList data_set={rest} />
