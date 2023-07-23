<script>
  import { onMount } from "svelte";
  import Clock from "./Clock.svelte"; //TODO: Clock na small zobrazit jako ikonu hodin
  import Burger from "./Burger.svelte"; //Burger zustane porad stejny
  import Search from "./Search.svelte";
  import Logo from "./Logo.svelte"; //TODO: Jen siroke
  import Moon from "./Moon.svelte";
  import enc from "$lib/store/enc.json";

  export let sidebar = false;
  /**
   * @type {string}
   */
  export let query; //vyhledavani v h808e

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

<header id="menu">
  <div class="f-none"><Burger bind:open={sidebar} /></div>
  <div class="f-auto"><Search /></div>
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
</style>
