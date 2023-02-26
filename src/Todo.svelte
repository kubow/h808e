<script>
    import {createEventDispatcher} from 'svelte';
    import {fade} from 'svelte/transition';
    const dispatch = createEventDispatcher();
    export let todo;  //to make it prop
</script>

<li transition:fade>
    <input type="checkbox" checked={todo.done} on:change={() => dispatch('toggleDone')} />
    <span class={'done-' + todo.done}>{todo.text}</span>
    <button on:click={() => dispatch('delete')}>Delete</button>
</li>

<style>
    .done-true {
        color: gray;
        text-decoration: line-through;
    }
    li {
        margin-top: 5px;
    }
</style>