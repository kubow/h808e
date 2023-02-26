<script>
  export let value = 0;
  export let action;
</script>

<button
  class="btn {isNaN(value) ? 'operation' : 'number'}"
  {value}
  on:click={e => action(e.target.value)}>
  {value}
</button>

<style>
  .btn {
    position: relative;
    margin: 0;
    color: #393a42;
    border-radius: 4px;
    cursor: pointer;
    user-select: none;
    z-index: -1;
  }
  .btn:active {
    top: 2px;
    box-shadow: 0 0 0;
  }
  .number {
    border: 1px solid #e3f5fe;
    background-color: #fafdff;
    box-shadow: 0px 2px 0px #cbecfd;
  }
  .number:active {
    background-color: #fafdff;
  }
  .operation {
    color: #fff;
    border: 1px solid #b2f277;
    background-color: #9edaf9;
    box-shadow: 0px 2px 0px #58b7e9;
  }
  .operation:active {
    background-color: #9edaf9;
  }
</style>