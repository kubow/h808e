<script>
  const DEFAULT_ZINDEX = 1000;
  import { onMount } from "svelte";
  import Content from "./PopoverContent.svelte";
  let targetRef;

  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  const onOpen = () => {
    dispatch("open");
  };

  export let action = "click";
  export let zIndex = DEFAULT_ZINDEX;
  export let arrow = true;
  export let placement = "auto";
  export let arrowColor = "";
  /**
   * @type {any}
   */
  export let overlayColor;

  export let preventDefault = false;
  export let stopPropagation = false;

  export let open = false;

  const setOpen = () => {
    open = !open;
    if (!open) {
      dispatch("close");
    }
  };
  const eventClick = (
    /** @type {{ preventDefault: () => void; stopPropagation: () => void; }} */ e
  ) => {
    if (preventDefault) e.preventDefault();
    if (stopPropagation) e.stopPropagation();
    setOpen();
  };
  const eventMouseOut = ({ relatedTarget }) => {
    if (relatedTarget.id === "overlay" && !open) {
      setOpen();
    }
  };

  const onTouchEnd = action === "click" ? eventClick : null;
  const onClick = action === "click" ? eventClick : null;

  const setOpenTrue = () => (open = true);

  const onMouseOver = action === "hover" ? setOpenTrue : null;
  const onMouseOut = action === "hover" ? eventMouseOut : null;
</script>

<div class="popover">
  <div
    bind:this={targetRef}
    class="target"
    style={open ? `z-index: ${zIndex + 10}` : ""}
    on:click={onClick}
    on:touchend={onTouchEnd}
    on:mouseover={onMouseOver}
    on:mouseout={onMouseOut}
  >
    <slot name="target" {open} />
  </div>
  {#if open}
    <Content
      on:open={onOpen}
      on:setOpen={setOpen}
      {placement}
      {targetRef}
      {zIndex}
      {arrow}
      {action}
      {overlayColor}
      {arrowColor}
      {preventDefault}
      {stopPropagation}
    >
      <slot name="content" {open} />
    </Content>
  {/if}
</div>

<style>
  .target {
    display: inline-block;
    position: relative;
  }
  .popover {
    position: relative;
  }
</style>
