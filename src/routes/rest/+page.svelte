<script>
  import ItemList from "$lib/ItemList.svelte";
  import src from "$lib/store/sources.json";

  // let rest = src.filter((x) => x.source_type == "restaurant");
  // need to map columns to desired structure
  const rest = src
    .filter((x) => x.source_type == "restaurant")
    .map(({ source_address, source_name }) => ({
      title: source_name,
      content: `${source_name}`,
      image: "images/moon-full.svg",
      ref: source_address,
    }));
  // console.log(rest);
</script>

<ItemList data_set={rest} />
