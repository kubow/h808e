<script>
  import ItemList from "$lib/ItemList.svelte";
  import plants from "$lib/store/herbar.json";

  // need to map columns to desired structure
  const flora = plants.map(
    ({ Botanik_char, Nazev_cz, Nazev_lidovy, Obrazek, Popis }) => ({
      title: Nazev_cz,
      content: `Lidový název: ${Nazev_lidovy} \n Charakteristika: ${Botanik_char} \n ${Popis}`,
      image: Obrazek ? `/images/ros/${Obrazek}` : "/images/moon-new.svg", // Default fallback
      ref: "",
    })
  );
  //console.log(flora);
</script>

<ItemList data_set={flora} />
