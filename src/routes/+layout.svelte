<script>
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  // import type { PageLoad } from "./$types";
  import Head from "$lib/Head.svelte";
  import { h808e, translate } from "$lib/stores";

  let open = false; // side menu
  let pwd = ""; // password protected
  let searchQuery = "";
  export let lang = {};

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

  // this will be transferred from enc.json
  const routes = [
    { href: "/", name: "Home" },
    { href: "/about", name: "About" },
    { href: "/about/products", name: "About Our Products" },
    { href: "/contact", name: "Contact Us" },
  ];

  onMount(async () => {
    let l = await $h808e.lang;
    lang = await translate(l, "cz");
  });
</script>

<Head bind:sidebar={open} bind:query={searchQuery} {handleSubmit} />
<aside class="absolute w-full h-full bg-gray-200 shadow-lg" class:open>
  {#await lang}
    <p>waiting for content...</p>
  {:then lang}
    <nav class="m-12 text-xl">
      {#each routes as route}
        <a
          href={route.href}
          class="underline px-2"
          class:text-blue-300={route.href !== $page.path}
          class:text-gray-400={route.href === $page.path}>{route.name}</a
        >
      {/each}
    </nav>
  {:catch error}
    <p>oooo</p>
  {/await}
</aside>

<!-- This is where the page will be rendered -->
<slot />
