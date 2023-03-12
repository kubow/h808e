<script>
  import { onMount } from "svelte";
  import Clock from "./Clock.svelte"; //TODO: Clock na small zobrazit jako ikonu hodin
  import Burger from "./Burger.svelte"; //Burger zustane porad stejny
  import Logo from "./Logo.svelte"; //TODO: Jen siroke
  import Moon from "./Moon.svelte";
  import { h808e } from "./stores"; //tady je hlavni logika
  import Popover from "svelte-popover";

  export let sidebar = false;
  /**
   * @type {string}
   */
  export let query; //vyhledavani v h808e
  /**
   * @type {any}
   */
  export let handleSubmit;

  /**
   * @type {any[]}
   */
  export let l1 = []; //hlavni oblasti
  /**
   * @type {any[]}
   */
  export let l2 = []; //podoblasti
  /**
   * @type {any[]}
   */
  export let l3 = []; //jednotlive temata

  //export let lang;
  // TODO: translation available
  // search query is a combined effort of
  // https://svelte-popover.now.sh/
  // https://freshman.tech/unsplash-search/
  $: query, query_h808e(query);

  /**
   * @param {string} input
   */
  function query_h808e(input) {
    //console.log(l2);
    if (input) {
      console.log(input);
    }
  }

  onMount(async () => {
    let topics = await $h808e.enc;
    for (const item of topics) {
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

<header id="menu">
  <div class="f-none"><Burger bind:open={sidebar} /></div>
  <div class="f-auto">
    <Popover
      arrowColor="#fff"
      overlayColor="rgba(0,0,0,0.5)"
      placement="bottom-center"
    >
      <div slot="target" class="search">
        <form class="search-form" on:submit|preventDefault={handleSubmit}>
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
  </div>
  <div class="f-auto"><Logo /></div>
  <div class="f-none"><Moon /></div>
  <div class="f-none"><Clock /></div>
</header>

<style>
  #menu {
    display: -webkit-box; /* OLD - iOS 6-, Safari 3.1-6 */
    display: -moz-box; /* OLD - Firefox 19- (buggy but mostly works) */
    display: -ms-flexbox; /* TWEENER */
    display: -webkit-flex; /* NEW - Chrome */
    display: flex; /* NEW, Spec - Opera 12.1, Firefox 20+ */
    flex-direction: row;
    flex-wrap: nowrap;
    flex-grow: 1;
    justify-content: space-between;
    align-items: center;
    background: #1742b6;
    padding: 0px;
    margin: 0px;
  }

  .f-none {
    flex: none;
    background: none;
  }
  .f-auto {
    flex: auto;
    background: none;
  }
  .search-input {
    width: 100%;
    max-width: 800px;
    border-radius: 4px;
    border: 1px solid #ccc;
    padding: 10px 20px;
    font-size: 20px;
    color: black;
  }

  .content {
    padding: 10px;
    background: #fff;
    color: purple;
  }
</style>
