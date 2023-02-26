<script>
    import { afterUpdate, onDestroy } from 'svelte';
    //import {} from "./chart_synchronizer.js";

    var chrtID;
    var ctxL;
    export let data;
    export let cid;

    $: data.restrict_x, redefine();
    
    function redefine() {
        setTimeout(() => {
			if (chrtID) {
                if (data.restrict_x[0]) {
                    var f = new Date().setFullYear(data.restrict_x[0]);
                    };
                if (data.restrict_x[1]) {
                    var t = new Date().setFullYear(data.restrict_x[1]);
                    };
                //console.log('changing to '+String(f)+' / '+String(t));
                console.log(chrtID);
                chrtID.updateOptions({
                    axes: {
                        x : {
                            'valueRange': [f,t], // can be [null, null]
                        }
                    }
                });
            console.log(chrtID.xAxisRange())
            }
        }, 1250);
    };

    function resetZoom() {
       window.myLine.resetZoom();
    };

    function createChart() {
        if (data) {
            ctxL = document.getElementById(cid);
            chrtID = new Dygraph(
                ctxL, 
                data.data,
                {
                    title: data.label,
                    legend: 'always',
                    labels: ['Date', 'Saturn', 'Pluto'],
                    width:-1,
                    showRoller: false,
                    rollPeriod: 6,
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
                            axisLabelWidth: 60,
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

    onDestroy(() => { if (chrtID) chrtID.destroy()});
</script>

<div id="{cid}"></div>
<!-- <div id="chrtID"></div> -->
{#await data}
    <p>...loading data</p>
{:catch error}
    <p style="color: red">{error.message}</p>
{/await}

<style>
p {
    position: absolute;
    left: 30%;
}
div { 
    min-width: 95%;
}

</style>
