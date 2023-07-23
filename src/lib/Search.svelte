<script>
  import { onMount } from "svelte";
  import enc from "$lib/store/enc.json";
  import Popover from "$lib/Popover.svelte";

  /**
   * @type {string}
   */
  let query; //vyhledavani v h808e
  /**
   * @type {any[]}
   */
  let l1 = []; //hlavni oblasti
  /**
   * @type {any[]}
   */
  let l2 = []; //podoblasti
  /**
   * @type {any[]}
   */
  let l3 = []; //jednotlive temata

  onMount(async () => {
    for (const item of enc) {
      if (Math.trunc(item["code"]) % 10 == 0) {
        if (Math.trunc(item["code"]) % 100 == 0) {
          l1.push(item);
        } else {
          l2.push(item);
        }
      } else {
        l3.push(item);
      }
    }
  });
</script>

<Popover
  arrowColor="#fff"
  overlayColor="rgba(0,0,0,0.5)"
  placement="bottom-center"
>
  <div slot="target" class="search">
    <form
      class="search-form"
      on:submit|preventDefault={() => {
        console.log("clicked form....");
      }}
    >
      <input
        bind:value={query}
        class="search-input"
        type="search"
        placeholder="Search H808E"
      />
    </form>
  </div>
  <div slot="content" class="content">
    <select bind:value={l2}>
      {#await l2}
        <p>...waiting</p>
      {:then l2}
        <p>hey</p>
        {#each l2 as option}
          <option value={option.name}>{option.code}</option>
        {/each}
      {:catch error}
        <p style="color: red">{error.message}</p>
      {/await}
    </select>
  </div>
  <!-- <input type="text" bind:value={$h808e}> -->
</Popover>

<style>
  .search-input {
    width: 100%;
    max-width: 800px;
    border-radius: 4px;
    border: 1px solid #ccc;
    padding: 10px 20px;
    font-size: 20px;
  }

  .content {
    padding: 10px;
    background: #fff;
  }
</style>
