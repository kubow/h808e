<script>
  import plants from "$lib/store/herbar.json";
  import { page } from "$app/stores";

  /**
   * @param {string} field
   * @param {string} query
   */
  function checkContent(field, query) {
    try {
      if (field.toLowerCase().includes(query)) {
        return true;
      } else {
        return false;
      }
    } catch {
      return false;
    }
  }
  // Get the Nazev_cz value from the URL route parameter
  const { slug } = $page.params;
  const flora = plants.filter(
    (item) =>
      checkContent(item.Nazev_cz, slug) ||
      checkContent(item.Nazev_lidovy, slug) ||
      checkContent(item.Nazev_lat, slug) ||
      checkContent(item.Celed, slug)
  );
</script>

<div>
  <h1>requested <u>{slug}</u> and found:</h1>
</div>
{#if flora.length == 1}
  <p>{flora[0].Nazev_cz}</p>
{:else if flora.length > 1}
  <ul>
    {#each flora as db, index}
      <li>{index} - {db.Nazev_cz}</li>
    {/each}
  </ul>
  <p>Special treatment {flora[0].Nazev_cz}</p>
{:else}
  <p>No data found for the engine .</p>
{/if}
