<script>
  export let big = false;
  export let ghost = false;
</script>

<button class:big class:ghost>
  <slot />
</button>

<style>
  .big {
    font-size: var(--font-size-3);
    display: block;
    /*width: 100%;*/
  }

  .ghost {
    background-color: transparent;
    /*border: solid currentColor 2px;*/
    border: none;
  }

  button {
    background: 0%;
    font-family: var(--font-sans);
    font: inherit;
    padding: 0.15rem 0.5rem;
    color: var(--surface-text);
    cursor: pointer;
  }

  button:hover,
  button:active {
    box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.35);
  }
</style>
