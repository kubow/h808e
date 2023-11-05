<script>
  import ItemList from "$lib/ItemList.svelte";
  import db from "$lib/store/db.json";

  /* map columns to desired structure:
  ename -> title
  website -> ref
  the rest -> content
  image is not represented yet
  */
  const engines = db.map(
    ({ ename, category, developer, language, point, website }) => ({
      title: ename,
      content: `Developer: ${developer} \n Written in ${language} \n ${point} \n Category: ${category}`,
      image: "/images/database.svg",
      ref: website,
    })
  );
  //console.log(engines);
</script>

<ItemList data_set={engines} />
