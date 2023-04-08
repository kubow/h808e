<script>
  import { onMount } from "svelte";
  import { fade, fly } from "svelte/transition";
  import { page } from "$app/stores";
  import Mode from "$lib/Mode.svelte";
  import Head from "$lib/Head.svelte";
  import { translate } from "$lib/stores";
  // JSON files
  import language from "$lib/store/language.json";
  import enc from "$lib/store/enc.json";

  let open = false; // side menu
  let pwd = ""; // password protected
  let searchQuery = "";
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
  function tgl() {
    open = !open;
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

<Head bind:sidebar={open} bind:query={searchQuery} {handleSubmit} />
{#if open}
  <aside class:open in:fly={{ x: -200, duration: 1000 }} out:fade>
    {#await lang}
      <p>waiting for content...</p>
    {:then lang}
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
        <Mode />
      </nav>
    {:catch error}
      <p>oooo</p>
    {/await}
  </aside>
{/if}
<!-- This is where the page will be rendered -->
<slot />

<style>
  :global(body) {
    /*background-color: var(--bg, whitesmoke);
    color: var(--font, midnightblue);
    transition: background-color 0.3s;*/
    background-color: whitesmoke;
    color: midnightblue;
    /* important to set body-wide */
    margin: 0;
    padding: 0;
  }

  :global(body.dark-mode) {
    /*background-color: var(--bg, #1d3040);
    color: var(--font, #bfc2c7);*/
    background-color: #1d3040;
    color: #bfc2c7;
  }
  nav {
    background-color: whitesmoke;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-around;
    align-items: stretch;

    margin: 12px;
    font-size: x-large;
  }
  aside {
    position: absolute;
    /*width: 100%;
    height: 100%;*/
    background-color: whitesmoke;
    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1),
      0 4px 6px -4px rgb(0 0 0 / 0.1);
    left: -100%;
    /*transition: left 0.3s ease-in-out;*/
    z-index: 11;
  }

  a {
    text-underline-offset: auto;
    padding: 3rem 5rem; /* 8px */
    padding-right: 5rem; /* 8px */
    flex-grow: 4;
    flex-shrink: 2;
    align-content: space-around;
    align-items: baseline;
    align-self: center;
  }

  a.active {
    background-color: aquamarine;
  }
  .open {
    left: 0;
  }

  /*select {
    display: block; width: 100px; max-width: 100%;
  }*/
</style>
