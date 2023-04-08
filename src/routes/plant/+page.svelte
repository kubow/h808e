<script>
  import ItemList from "$lib/ItemList.svelte";
  import plants from "$lib/store/herbar.json";
</script>

<ItemList data_set={plants} />
