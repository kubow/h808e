<script>
  // atempt to pre-render not good
  import { onMount, afterUpdate, onDestroy } from "svelte";
  import { fade, fly } from "svelte/transition";
  import { page } from "$app/stores";
  import { findLocaleMatch } from "$lib/stores"; // localization will be once the layout done
  import language from "$lib/store/language.json";
  // Menu items components
  import Clock from "$lib/Clock.svelte"; //TODO: Clock na small zobrazit jako ikonu hodin
  import Burger from "$lib/Burger.svelte"; //Burger zustane porad stejny
  import Search from "$lib/Search.svelte";
  import Logo from "$lib/Logo.svelte"; //TODO: Jen siroke
  import Moon from "$lib/Moon.svelte";

  //export const prerender = true;
  // experiment
  let cfg = {
    lang: "",
    logo: true,
    search: "", // active searched value (will be dict with latest searched values)
    side: false, // this will be the open variable
    width: 0,
  };

  let open = false; // side menu
  let pwd = ""; // password protected - not active for now
  let searchQuery = ""; // active searched value (will be dict with latest searched values)
  let lang = {};
  /**
   * @type {{ href: string; name: any; }[]}
   */
  let routes;
  // https://nicobachner.com/sveltekit-theme-switch

  function handleSubmit() {
    if (!searchQuery) return;
    console.log(searchQuery);
  }
  /**
   * @param {any} event
   */
  function tgl(event) {
    open = !open;
    console.log(event);
  }
  /**
   * @param {{ preventDefault: () => void; }} event
   */
  function tgl_pwd(event) {
    if (pwd == "astrolab") {
      open = !open;
      return true;
    } else {
      alert("Prosim zadejte heslo ");
      event.preventDefault();
      return false;
    }
  }
  let mainColor = "#1c62a8";
  let color = "black";
  let bgColor = "white";

  function switch_mode() {
    color = color === "black" ? "white" : "black";
    bgColor = bgColor === "white" ? "black" : "white";
    document.documentElement.style.setProperty("--color", color);
    document.documentElement.style.setProperty("--bg-color", bgColor);
  }

  /**
   * @param {{ target: { value: string; }; }} event
   */
  function select_color(event) {
    mainColor = event.target.value;
    document.documentElement.style.setProperty("--main-color", mainColor);
  }
  /**
   * @param {any} dataset
   */
  function translate(dataset, change = "") {
    let result = {};
    let lang = "";
    if (change) {
      lang = change;
    } else {
      lang = findLocaleMatch();
    }
    if (lang == "cz") {
      for (let entry of dataset) {
        result[entry["field_name"]] = entry["val_cz"];
      }
    } else if (lang == "en") {
      for (let entry of dataset) {
        result[entry["field_name"]] = entry["val_en"];
      }
    } else {
      console.log("no other language: " + lang);
    }
    return result;
  }

  onMount(async () => {
    lang = await translate(language, "cz");
    // this will be transferred from enc.json
    // console.log(lang);
    routes = [
      { href: "/", name: lang.home },
      { href: "/astro", name: lang.planet },
      { href: "/calc", name: lang.calc },
      { href: "/db", name: lang.database },
      { href: "/map", name: lang.maps },
      { href: "/min", name: lang.stone },
      { href: "/plant", name: lang.plant },
      { href: "/radio", name: lang.radio },
      { href: "/rest", name: lang.rest },
      { href: "/rss", name: lang.rss },
      { href: "/test", name: "Test" },
    ];
  });
</script>

<div>
  <!-- Top menu functions -->
  <header id="menu">
    <div class="f-none"><Burger bind:open /></div>
    <div class="f-auto"><Search /></div>
    <div class="f-auto"><Logo /></div>
    <div class="f-none"><Moon /></div>
    <div class="f-none"><Clock /></div>
  </header>
  {#if open}
    <aside class:open in:fly={{ x: -200, duration: 1000 }} out:fade>
      {#await lang}
        <p>waiting for content...</p>
      {:then lang}
        <!-- Main menu items aka routes list -->
        <nav>
          {#each routes as route}
            <a
              href={route.href}
              class:text-blue-300={route.href !== $page.route.id}
              class:active={route.href === $page.route.id}
              on:click={tgl}
            >
              {route.name}
            </a>
          {/each}
          <button on:click={switch_mode}> Switch mode </button>
          <input type="color" bind:value={mainColor} on:change={select_color} />
        </nav>
      {:catch error}
        <p>oooo</p>
      {/await}
    </aside>
  {/if}
  <!-- This is where the page will be rendered -->
  <slot />
</div>

<style>
  :root {
    --color: black;
    --bg-color: white;
    --main-color: #1c62a8;
  }
  :global(body) {
    margin: 0;
    padding: 0;
  }
  div {
    background-color: var(--bg-color);
  }
  nav {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-around;
    align-items: stretch;

    margin: 12px;
    font-size: x-large;
    /* background-color: var(--bg-color); */
  }
  aside {
    position: absolute;
    background-color: var(--bg-color);
    /* width: 100%;
    height: 100%; think about the stretch */
    border-bottom: 1rem ridge var(--main-color);
    border-right: 1rem solid var(--main-color);
    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1),
      0 4px 6px -4px rgb(0 0 0 / 0.1);
    left: -100%;
    /*transition: left 0.3s ease-in-out; svelte code handles */
    z-index: 11;
  }

  a {
    color: var(--color);
    background-color: transparent;
    text-underline-offset: auto;
    padding: 3rem 5rem; /* 8px */
    padding-right: 5rem; /* 8px */
    flex-grow: 4;
    flex-shrink: 2;
    align-content: space-around;
    align-items: baseline;
    align-self: center;
  }

  a:hover,
  a:focus {
    background-color: yellowgreen;
    cursor: pointer;
  }
  a.active {
    color: crimson;
    background-color: aquamarine;
  }
  .open {
    left: 0;
  }
  button {
    border: none;
    border-radius: 4px;
    padding: 0.5rem;
    text-transform: uppercase;
  }
  #menu {
    display: -webkit-box; /* OLD - iOS 6-, Safari 3.1-6 */
    display: -moz-box; /* OLD - Firefox 19- (buggy but mostly works) */
    display: -ms-flexbox; /* TWEENER */
    display: -webkit-flex; /* NEW - Chrome */
    display: flex; /* NEW, Spec - Opera 12.1, Firefox 20+ */
    flex-direction: row;

    justify-content: space-between;
    align-items: center;
    background: var(--main-color);
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
