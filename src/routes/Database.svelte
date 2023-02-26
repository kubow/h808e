<svelte:head>
  <title>Database Sysmon</title>
</svelte:head>

<script>
    import { onMount, afterUpdate, onDestroy } from 'svelte';
    import { loadDataJson, parseDate } from "../stores.js";
    import ChS from "../808/chart_synchronizer.js";

    let data = loadDataJson('sysmon.json');
    let id = ["chrtSysmon"];
    let sysmon;
    let ctxSysmon;
    let statistics = [{
            name: 'Kernel',
            enable: false
        },
        {
            name: 'Transactions',
            enable: true
        },
        {
            name: 'Utilization',
            enable: false
        },
    ];
    let restrict = [1, 1000];
    let visilibity;
    let ready;
    let sync;

    let sysmons = {
            chart_id: 'chrtSysmon',
            label: 'Sysmon Performance Graph',
            restrict_x: restrict,
            restrict_y: [],
            data: [],
        };
    
    const updateLimits = e => {
        if (e.charCode === 13) {
            sysmons.restrict_x = restrict;
            lats.restrict_x = restrict;
        };
    };
    function activeStats() {
        visilibity = []
        statistics.forEach(function(entry) {
            visilibity.push(entry.enable);
        })
        visilibity.push(true); // for SaturnPluto aspects = hardcoded
    };

    $: data, prepareData();
    //$: restrict, lats.restrict_x = restrict && sysmons.restrict_x = restrict;
    $: statistics, activeStats();

    function legendFormatter(data) {
        if (data.x == null) {
            // This happens when there's no selection and {legend: 'always'} is set.
            return '<br>' + data.series.map(function(series) { return series.dashHTML + ' ' + series.labelHTML }).join('<br>');
        }

        var html = this.getLabels()[0] + ': ' + data.xHTML;
        data.series.forEach(function(series) {
            if (!series.isVisible) return;
            var labeledData = series.labelHTML + ': ' + series.yHTML;
            if (series.isHighlighted) {
            labeledData = '<b>' + labeledData + '</b>';
            }
            html += '<br>' + series.dashHTML + ' ' + labeledData;
        });
        return html;
        }

    
    async function prepareData() {
        let int_data = await data;
        sysmons.data = [];
        let int_date;
        for(const entry of int_data) {
            int_date = parseDate(entry['date']);
            sysmons.data.push([ //sysmon have one extra row
                int_date, 
                entry['Utilization'], 
                entry['Another'],
            ]);
        };
        ready = true;
        int_data = null;
    };

    async function refreshData() {
        let condition = True;
        if (condition) {
            data = await loadDataJson('sysmon.json').then(prepareData());
        } else {
            console.log('cannot happen...')
        }

    };

    function createSysmonChart() {
        if (data) {
            ctxSysmon = document.getElementById(sysmons.chart_id);
            sysmon = new Dygraph(
                ctxSysmon, 
                sysmons.data,
                {
                    title: sysmons.label,
                    legend: 'always',
                    labels: ['Date', 'Jupiter', 'Saturn', 'Uran', 'Neptun', 'Pluto', 'SaturnPlutoAspects'],
                    visibility: visilibity,
                    width:-1,
                    valueRange: [-100,190],
                    showRoller: false,
                    rollPeriod: 6,
                    plugins: [
                        //doubleClickZoomOutPlugin
                    ],
                    animatedZooms: true,
                    drawGrid: true,
                    series : {
                        SaturnPlutoAspects: {
                            color: 'red',
                            strokeWidth: 0.0,
                            drawPoints: true,
                            pointSize: 3,
                            highlightCircleSize: 6
                            //icon: 'image/hermetica-A016-opposition-2x.svg',
                            //width: 15,
                            //height: 15,
                        }
                    },
                    axes: {
                        x: {
                            axisLabelWidth: 60,
                            /* axisLabelFormatter: function(d, gran) {
                                return d.getFullYear() + "/" + (d.getMonth() + 1);
                            }, */
                            gridLineWidth: 2,
                            drawGrid: true,
                        }
                    }  
                }
            );
        }
    };

    function createChart() {
        if (sysmons.data.length > 0) {
            createSysmonChart();
        } else {
            console.log('data not prepared...')
        }
    };

    afterUpdate(createChart);
</script>

<main>
    <div class="control">
        {#each statistics as metric}
            <label>
                <input type=checkbox bind:checked={metric.enable}>
                {metric.name}
            </label>
        {/each}
    </div>
    <div id="{sysmons.chart_id}"></div>
    {#await ready}
        <p>...loading data, stahuji vypocitane data ...</p>
    {:catch error}
        <p style="color: red">Chart not created because of: {error.message}</p>
    {/await}
    <div class="control">
        <input type="number" on:keypress="{updateLimits}"
            placeholder="{restrict[0]}" bind:value={restrict[0]}>
        <input type="number" on:keypress="{updateLimits}"
            placeholder="{restrict[0]}" bind:value={restrict[1]}>
    </div>
</main>

<style>
    main {
        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
        justify-content: space-around;
        align-items: stretch;
        z-index: -1;
    }
    #chrtSysmon { 
        min-width: 95%;
    }
    .control {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: space-around;
        align-items: stretch;
    }
</style>