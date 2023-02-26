<script>
    import page from "page.js";
    import { getContext } from "svelte";
    import { current_path } from "./stores.js";
    export let path;
    $current_path = getContext("current");
    page(path, () => $current_path = path)
</script>

{#if path == $current_path}
<slot />
{/if}

<style>
</style>