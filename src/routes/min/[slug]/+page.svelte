<script>
  import min from "$lib/store/mineral.json";
  import { page } from "$app/stores";

  // Get the ename value from the URL route parameter
  const { slug } = $page.params;

  const mineral = min.filter((item) =>
    item.name_cz.toLowerCase().includes(slug)
  );
</script>

<div>
  <h1>requested <u>{slug}</u> and found:</h1>
</div>
{#if mineral.length == 1}
  <p>{mineral[0].name_cs}</p>
{:else if mineral.length > 1}
  <ul>
    {#each mineral as db, index}
      <li>{index} - {db.name_cs}</li>
    {/each}
  </ul>
  <p>Special treatment {mineral[0].name_cs}</p>
{:else}
  <p>No data found for the engine .</p>
{/if}
