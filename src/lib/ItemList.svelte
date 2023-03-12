<script>
  //import { afterUpdate, onMount } from 'svelte';
  import Btn from "./Btn.svelte";
  import { h808e, loadDataUrl } from "./stores.js";
  import Popover from "svelte-popover";
  //
  /**
   * @type {any}
   */
  export let data_set;
  /**
   * @type {null}
   */
  let currentContent;

  /**
   * @param {{ source_address: RequestInfo | URL; url: string; }} source
   */
  async function prepareSource(source) {
    currentContent = null;
    console.log("preparing source");
    if (source.source_address) {
      currentContent = await loadDataUrl(source.source_address);
      //currentContent = await loadDataUrl($h808e.api.scrapestack.url.replace("BOBOK", $h808e.api.scrapestack.access_key)+source.source_address);
      console.log(currentContent);
    } else if (source.url) {
      currentContent = await loadDataUrl(
        $h808e.api.scrapestack.url.replace(
          "BOBOK",
          $h808e.api.scrapestack.access_key
        ) + source.url
      );
      console.log(currentContent);
    } else {
      console.log(source);
    }
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
                  {:else if x.source_address}
                    <p>{x.source_name}</p>
                  {:else}
                    <p>some random name</p>
                  {/if}
                </slot>
                <slot name="card_title">
                  {#if x.title}
                    <p>{x.title}</p>
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
