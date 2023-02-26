<script>
    import { afterUpdate, onDestroy } from 'svelte';

    var chrtLon;
    var ctxLon;
    export let lons;
    export let input_from;
    export let input_to;
    
    //$: data, createChart;
    $: (input_from || input_to), redefine();

    function dated(year) {
        var d = new Date();
        return d.setFullYear(year);
    }
    
    function redefine() {
        if (chrtLon) {
            if (input_from) {var f = dated(input_from);}
            if (input_to) {var t = dated(input_to);}
            chrtLon.updateOptions({
                'axes': {
                    'x' : {
                        'dateWindow': [f,t], // can be [null, null]
                    }
                }
            });
            //chrtLon.setXAxisOptions_('valueRange') = [f,t];
            console.log(chrtLon.xAxisRange())
        }
    };

    function resetZoom() {
       window.myLine.resetZoom();
    };

    function createChart() {
        if (lons) {
            ctxLon = document.getElementById('chrtLon');
            chrtLon = new Dygraph(
                ctxLon, 
                lons.data,
                {
                    title: lons.label,
                    legend: 'always',
                    labels: ['Date', 'Saturn', 'Pluto'],
                    showRoller: false,
                    rollPeriod: 7,
                    animatedZooms: true,
                    //valueRange: [-90,90],
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
                            axisLabelFormatter: function(d) {
                                return d.getFullYear() + "/" + (d.getMonth() + 1);
                            },
                            gridLineWidth: 2,
                            drawGrid: true,
                            dateWindow: [dated(-200), dated(500)],
                        }
                    },
                }
            );
        } else {
            console.log("data not loaded yet...");
        }
    };

    afterUpdate(createChart);

    onDestroy(() => { if (chrtLon) chrtLon.destroy()});
</script>

<div id="chrtLon"></div>
{#await lons}
    <p>...loading data (strange if shown --> component created after data receive)</p>
{:catch error}
    <p style="color: red">{error.message}</p>
{/await}

<style>
p {
    position: absolute;
    margin: 0 auto;
    left: 30%;
}
#chrtLon {
    position: absolute; 
    left: 7%; right: 7%; 
    width: 80%;
    height: 37%;
    z-index: -1;
}
</style>
