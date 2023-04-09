<script>
  //import Btn from './Btn.svelte';
  let display = "block";
  /**
   * @type {number}
   */
  let width;
  $: {
    if (width > 1500) {
      display = "block" && console.log("setting visible");
    } else {
      display = "none" && console.log("hiding");
    }
  }
</script>

<svelte:window bind:innerWidth={width} />

<svg style="display: {display};">
  <g>
    <title>Hvezdna encyklopedie</title>
    <path
      stroke="#000"
      id="svg_1"
      d="m5.265594,19.37892l9.499847,0l2.935526,-8.767054l2.935527,8.767054l9.499845,0l-7.685523,5.418275l2.935678,8.767054l-7.685527,-5.418423l-7.685525,5.418423l2.935678,-8.767054l-7.685526,-5.418275z"
      stroke-width="1.5"
      fill="#fff"
    />
    <text
      xml:space="preserve"
      text-anchor="start"
      font-family="Helvetica, Arial, sans-serif"
      font-size="24"
      id="svg_3"
      y="32.423461"
      x="38.633121"
      fill-opacity="null"
      stroke-opacity="null"
      stroke-width="0"
      stroke="#000"
      fill="#000000">H808E</text
    >
    <path
      stroke="#000"
      id="svg_7"
      d="m120.794799,17.921836l6.973613,-6.575118l9.862301,0l6.973613,6.575118l0,9.298738l-6.973613,6.575119l-9.862301,0l-6.973613,-6.575119l0,-9.298738z"
      fill-opacity="null"
      stroke-opacity="null"
      stroke-width="1.5"
      fill="#fff"
    />
  </g>
  <!-- <text x=10 y=15>H808E</text>
	<text x=1 y=27>(c) Kubow</text> -->
</svg>

<style>
  svg {
    /*display: inline-block;*/
    flex: 0 1 auto;
    justify-content: center;
    align-items: center;
    /***/
    height: 50px;
  }
  text {
    fill: currentColor;
  }
</style>
