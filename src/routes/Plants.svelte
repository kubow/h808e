<script>
  import { afterUpdate, onMount } from 'svelte';
  import { loadDataJson } from "../stores.js";

  let plants = '';

  function ximg(img_name) {
      return 'assets/' + img_name;
  };

  onMount(async () => {
    plants = await loadDataJson('herbar.json');
    console.log(plants);
  });
</script>

{#await plants}
    <p>...data not yet loaded</p>
{:then plants}
    <div class="cards-list">
        {#each plants as plant}
        <div class="card">
            <div class="card_image">
                 <img src="https://i.redd.it/b3esnz5ra34y.jpg" alt=""/>
            </div>
            <div class="card_title title-black">
                <p>{plant["Nazev_cz"]}</p>
            </div>
        </div>
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
  box-shadow: 5px 5px 30px 7px rgba(0,0,0,0.25), -5px -5px 30px 7px rgba(0,0,0,0.22);
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
  box-shadow: 5px 5px 30px 15px rgba(0,0,0,0.25), 
    -5px -5px 30px 15px rgba(0,0,0,0.22);
}

.title-white {
  color: white;
}

.title-black {
  color: black;
}

@media all and (max-width: 500px) {
  .card-list {
    /* On small screens, we are no longer using row direction but column */
    flex-direction: column;
  }
}


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