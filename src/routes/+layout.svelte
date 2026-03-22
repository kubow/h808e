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
  import Logo from "$lib/Logo.svelte";
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
    document.documentElement.style.setProperty(
      "--surface-color",
      bgColor === "black" ? "#111827" : "#ffffff"
    );
    document.documentElement.style.setProperty(
      "--surface-strong",
      bgColor === "black" ? "#020617" : "#0f172a"
    );
    document.documentElement.style.setProperty(
      "--surface-text",
      bgColor === "black" ? "#f8fafc" : "#f8fafc"
    );
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
      { href: "/400", name: "400 Příroda" },
      { href: "/500", name: "500 Člověk" },
      { href: "/600", name: "600 Vědy" },
      { href: "/700", name: "700 Technologie" },
      { href: "/tools", name: "Tools" },
      { href: "/test", name: "Test" },
    ];
  });
</script>

<div class="app-shell">
  <!-- Top menu functions -->
  <header id="menu">
    <div class="menu-left"><Burger bind:open /></div>
    <div class="f-search"><Search /></div>
    <div class="menu-right">
      <div class="f-none"><Moon /></div>
      <div class="f-none"><Clock /></div>
    </div>
  </header>
  {#if open}
    <aside class:open in:fly={{ x: -200, duration: 1000 }} out:fade>
      {#await lang}
        <p>waiting for content...</p>
      {:then lang}
        <!-- Main menu items aka routes list -->
        <nav>
          <a class="menu-logo" href="/" on:click={tgl} aria-label="H808E home">
            <Logo />
          </a>
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
    --surface-color: #ffffff;
    --surface-strong: #0f172a;
    --surface-text: #f8fafc;
    --border-subtle: rgba(15, 23, 42, 0.12);
    --header-height: 3.5rem;
    --font-sans: "Segoe UI", "Helvetica Neue", Helvetica, Arial, sans-serif;
    --font-size-0: 0.75rem;
    --font-size-1: 0.875rem;
    --font-size-2: 1rem;
    --font-size-3: 1.125rem;
  }
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: var(--font-sans);
    color: var(--color);
    background-color: var(--bg-color);
  }
  .app-shell {
    background-color: var(--bg-color);
    min-height: 100vh;
  }
  .f-search {
    display: flex;
    justify-content: center;
    min-width: 0;
    padding: 0 0.75rem;
  }
  .menu-left {
    display: flex;
    justify-content: flex-start;
  }
  .menu-right {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 0.5rem;
    min-width: 11.5rem;
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
  .menu-logo {
    display: flex;
    justify-content: center;
    width: 100%;
    padding: 1.25rem 1.5rem;
    background: color-mix(in srgb, var(--main-color) 10%, white);
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
  #menu {
    gap: 0.75rem;
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
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: center;
    background: var(--main-color);
    padding: 0 0.5rem;
    margin: 0;
    min-height: var(--header-height);
    color: var(--surface-text);
  }

  .f-none {
    flex: none;
    background: none;
  }

  @media (max-width: 720px) {
    .menu-right {
      min-width: auto;
      gap: 0.25rem;
    }

    #menu {
      grid-template-columns: auto minmax(0, 1fr) auto;
      padding: 0 0.25rem;
    }
  }
</style>
