<script>
  //import { afterUpdate, onMount } from 'svelte';
  import Btn from "./Btn.svelte";
  import Popover from "$lib/Popover.svelte";

  // Requires data set with following attributes
  /**
   * @type {any}
   */
  export let data_set;
  /** 
   * title ; //(card title)
  content; //(short introdution aspart of the database)
  image; //(path to a thumbnail)
  ref; //referrence to a web page with more details
  */

  /**
   * @type {RequestInfo | URL}
   */
  let addr;
  //

  // instead 4 independent values

  /**
   * @type {() => Promise<string>}
   */
  let currentContent;
  /**
   * @type {() => Promise<string>}
   */
  let imageString;
  /**
   * @param {RequestInfo | URL} source_address
   */
  async function prepareSource(source_address) {
    // console.log(source_address.toString.length);
    if (source_address.toString.length > 10) {
      let content = await fetch(source_address);
      currentContent = await content.text;
    } else {
      console.log(`No URL available, skipping... (${source_address})`);
    }
  }

  /**
   * @param {RequestInfo | URL} image_address
   */
  function prepareImage(image_address) {
    try {
      const response = fetch(image_address);
      return true;
    } catch {
      return false;
    }
  }
</script>

<div class="cards-list">
  {#each data_set as x}
    <Popover
      on:open={() => prepareSource(x)}
      on:close={() => console.log("popover closed")}
      overlayColor="rgba(0, 0, 0, 0.25)"
    >
      <div slot="target">
        <Btn ghost>
          <div class="card">
            <div class="card_image">
              <slot name="card_image">
                {#if prepareImage(x.image)}
                  <img src={x.image} alt="sample content" />
                {:else}
                  <img src="default.png" alt="sample content" />
                {/if}
              </slot>
            </div>
            <div class="card_title">
              <slot name="card_title">
                <p>{x.title}</p>
              </slot>
            </div>
          </div>
        </Btn>
      </div>
      <div slot="content">
        <p>{x.content}</p>
      </div>
    </Popover>
  {/each}
</div>

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
    background-color: hsla(0, 0%, 4%, 0.4);
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
    text-emphasis: pink;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
    border-radius: 0px 0px 40px 40px;
    font-family: sans-serif;
    font-weight: bold;
    font-size: 250%;
    margin-top: -225px;
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
