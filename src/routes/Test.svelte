<script>
  import { onMount } from 'svelte';
  import { loadDataMD } from '../stores.js';

  let content

  onMount(async() => {
		content = await loadDataMD();
		//console.log('hey '+ content)
	})
</script>

<div id="md">
  {#await content}
    <p>waiting for content...</p>
  {:then content}
    {@html content}
  {/await}
</div>


<style>
  #md :global(h1) {
    font-size: 2rem;
    color: rgb(48, 106, 212);
  }

  #md :global(h2) {
    font-size: 1.5rem;
    color: blue;
  }

  #md :global(h3) {
    font-size: 1.3rem;
    color: rgb(43, 124, 161);
  }

  #md :global(li) {
    list-style-type: square;
    color: rgb(124, 71, 194);
  }
  

  #md :global(p) {
    font-size: 1rem;
    display: block;
    color: rgb(21, 20, 22);
  }

  #md :global(a) {
    font-size: 1rem;
    display: block;
    color: rgb(37, 172, 120);
  }
  #md {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
</style>
