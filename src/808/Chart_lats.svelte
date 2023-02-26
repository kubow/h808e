<script>
    import { afterUpdate, onDestroy } from 'svelte';

    var chrtLat;
    var ctxLat;
    export let lats;
    export let input_from;
    export let input_to;

    //$: data, createChart;
    $: (input_from || input_to), redefine();
    
    function redefine() {
        setTimeout(() => {
			if (chrtLat) {
                if (input_from) {var f = new Date().setFullYear(input_from);}
                if (input_to) {var t = new Date().setFullYear(input_to);}
                chrtLat.updateOptions({
                    axes: {
                        x : {
                            'valueRange': [f,t], // can be [null, null]
                        }
                    }
                });
            console.log(chrtLat.xAxisRange())
            }
        }, 750);
    };

    function resetZoom() {
       window.myLine.resetZoom();
    };

    function createChart() {
        if (lats) {
            ctxLat = document.getElementById('chrtLat');
            chrtLat = new Dygraph(
                ctxLat, 
                lats.data,
                {
                    title: lats.label,
                    legend: 'always',
                    labels: ['Date', 'Saturn', 'Pluto'],
                    showRoller: false,
                    rollPeriod: 7,
                    animatedZooms: true,
                    //valueRange: [-10,10],
                    drawGrid: true,
                    //connectSeparatedPoints: true,
                    //customBars: true,
                    //drawPoints: true,
                    //drawAxesAtZero: false,
                    //strokeWidth: 0.0,
                    //showRangeSelector: true,
                    //rangeSelectorHeight: 30,
                    //rangeSelectorPlotStrokeColor: 'yellow',
                    //rangeSelectorPlotFillColor: 'lightyellow',
                    axes: {
                        x: {
                            axisLabelWidth: 40,
                            axisLabelFormatter: function(d, gran) {
                                return d.getFullYear() + "/" + (d.getMonth() + 1);
                            },
                            gridLineWidth: 2,
                            drawGrid: true,
                        }
                    }  
                }
            );
        } else {
            console.log("data not loaded yet...");
        }
    };

    afterUpdate(createChart);

    onDestroy(() => { if (chrtLat) chrtLat.destroy()});
</script>

<div id="chrtLat"></div>
<!-- <div id="chrtLat"></div> -->
{#await lats}
    <p>...loading data</p>
{:catch error}
    <p style="color: red">{error.message}</p>
{/await}

<style>
p {
    position: absolute;
    left: 30%;
}
#chrtLat {
    position: absolute; 
    left: 7%; right: 7%; 
    top: 57%;
    width: 80%;
    height: 37%;
    z-index: -1;
}
</style>
