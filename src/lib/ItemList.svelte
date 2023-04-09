<script>
  //import { afterUpdate, onMount } from 'svelte';
  import Btn from "./Btn.svelte";
  import { h808e, loadDataUrl } from "./stores.js";
  import Popover from "svelte-popover";

  /**
   * @type {RequestInfo | URL}
   */
  let addr;
  //
  /**
   * @type {any}
   */
  export let data_set;
  // will be 4 independent values in the future
  // 1. title (card title)
  // 2. content (short introdution aspart of the database)
  // 3. image (path to a thumbnail)
  // 3. ref - referrence to a web page with more details

  /**
   * @type {() => Promise<string>}
   */
  let currentContent;

  /**
   * @param {{ source_address: RequestInfo | URL; url: string; }} source
   */
  async function prepareSource(source) {
    console.log("preparing source");
    if (source.source_address) {
      const addr =
        "https://cors-anywhere.herokuapp.com/" + source.source_address;
    } else if (source.url) {
      const addr = "https://cors-anywhere.herokuapp.com/" + source.url;
    } else if (source.wiki_cs) {
      const addr = "https://cors-anywhere.herokuapp.com/" + source.wiki_cs;
    } else {
      const addr = "https://cors-anywhere.herokuapp.com/https://www.seznam.cz";
      console.log(source);
    }
    let content = await fetch(addr);
    currentContent = await content.text;
  }
</script>

{#await data_set}
  <p>...data not yet loaded</p>
{:then data_set}
  <div class="cards-list">
    {#each data_set as x}
      <Popover
        on:open={() => prepareSource(x)}
        on:close={() => console.log("popover closed")}
      >
        <div slot="target">
          <Btn ghost>
            <div class="card">
              <div class="card_image">
                <slot name="card_image">
                  {#if x.urlToImage}
                    <img src={x.urlToImage} alt="sample content" />
                  {:else}
                    <img
                      src="https://i.redd.it/b3esnz5ra34y.jpg"
                      alt="sample content"
                    />
                  {/if}
                </slot>
              </div>
              <div class="card_title">
                <slot name="card_source">
                  {#if x.source}
                    <p>{x.source.name}</p>
                  {:else if x.name_cs}
                    <p>{x.name_cs}</p>
                  {:else if x.source_address}
                    <p>{x.source_name}</p>
                  {:else if x.Nazev_cz}
                    <p>{x.Nazev_cz}</p>
                  {:else}
                    <p>some random name</p>
                  {/if}
                </slot>
                <slot name="card_title">
                  {#if x.title}
                    <p>{x.title}</p>
                  {:else if x.Nazev_lat}
                    <p>{x.Nazev_lat}</p>
                  {:else}
                    <p>some random name</p>
                  {/if}
                </slot>
              </div>
            </div>
          </Btn>
        </div>
        <div slot="content">
          {currentContent}
        </div>
      </Popover>
    {/each}
  </div>
{:catch error}
  <p style="color: red">error: {error.message}</p>
{/await}

<style>
  .cards-list {
    z-index: 0;
    width: 100%;
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
  }

  .card {
    margin: 30px auto;
    width: 300px;
    height: 300px;
    border-radius: 40px;
    box-shadow: 5px 5px 30px 7px rgba(0, 0, 0, 0.25),
      -5px -5px 30px 7px rgba(0, 0, 0, 0.22);
    cursor: pointer;
    transition: 0.4s;
  }

  .card .card_image {
    width: inherit;
    height: inherit;
    border-radius: 40px;
  }

  .card .card_image img {
    width: inherit;
    height: inherit;
    border-radius: 40px;
    object-fit: cover;
  }

  .card .card_title {
    text-align: center;
    border-radius: 0px 0px 40px 40px;
    font-family: sans-serif;
    font-weight: bold;
    font-size: 30px;
    margin-top: -80px;
    height: 40px;
  }

  .card:hover {
    transform: scale(0.9, 0.9);
    box-shadow: 5px 5px 30px 15px rgba(0, 0, 0, 0.25),
      -5px -5px 30px 15px rgba(0, 0, 0, 0.22);
  }

  /*@media all and (max-width: 500px) {
    .card-list {
      /* On small screens, we are no longer using row direction but column */ /*
      flex-direction: column;
    }
  }*/

  /*
.card {
  margin: 30px auto;
  width: 300px;
  height: 300px;
  border-radius: 40px;
  background-image: url('https://i.redd.it/b3esnz5ra34y.jpg');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  background-repeat: no-repeat;
box-shadow: 5px 5px 30px 7px rgba(0,0,0,0.25), -5px -5px 30px 7px rgba(0,0,0,0.22);
  transition: 0.4s;
}
*/
</style>
