<script>
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  const { slug } = $page.params;
  let enc;
  /**
   * @param {string} id
   */
  async function tryLoad(id) {
    console.log(id);
    return (await import("static/assets/" + String(id) + ".md")).default;
  }

  onMount(async () => {
    enc = await tryLoad(slug);
    // this will be transferred from enc.json
    // console.log(enc);
  });
</script>

{#await slug}
  <p>...data not yet loaded</p>
{:then slug}
  <p>request for {slug}.md:</p>
{:catch error}
  <p style="color: red">error: {error.message}</p>
{/await}
