<script>
  function toggle() {
    window.document.body.classList.toggle("dark-mode");
    console.log("switching mode");
  }
</script>

<button on:click={toggle}> Switch me & Click me </button>

<style>
  button {
    background-color: var(--main-color);
    color: var(--surface-text);
    border: none;
    border-radius: 4px;
    padding: 0.5rem;
    text-transform: uppercase;
    font-family: var(--font-sans);
    font-size: var(--font-size-1);
  }
  :global(body.dark-mode) button {
    background-color: color-mix(in srgb, var(--main-color) 70%, black);
    color: var(--surface-text);
  }
</style>
