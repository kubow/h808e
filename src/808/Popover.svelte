<script>
	let hovering;

	function enter() {
		hovering = true;
	}

	function leave() {
		hovering = false;
	}
</script>

<span class="tooltip-wrapper"><span class="tooltip">
    <slot hovering={hovering}></slot>
</span></span>

<style>
	section, .clockWrapper, .clockDisplay {
		display: flex;
		justify-content: center;
		align-items: center;
	}
	section{
		overflow: hidden;
		min-width: 10%;
	}
	.clockWrapper {
		/*position: relative;*/
      	display: inline;
		margin: auto;
		border-radius: 17px;
		background: #ffffff;
	}
	.clockDisplay {
		font-size: 0.75em;
		background: #000000;
		border-radius: 17px;
		color: #ffffff;
		text-align: center;
		white-space: nowrap;
	}
	.tooltip-wrapper {
		/* tooltip taken from: 
		https://codepen.io/PhilippeVay/pen/AXGaJv?editors=1000 */
      	position: absolute;
      	visibility: hidden;
		background: #000000;
		right: 0!important;
		margin: 3px;
		padding: 10px;
    }
    .tooltip-wrapper {
      	visibility: visible;
      	opacity: 0.7;
		top: 10%;
		z-index: 5;
		/*left: 50%;*/
		/*margin-left: -76px;*/
		/* z-index: 999; defined above with value of 5 */
    }
</style>
