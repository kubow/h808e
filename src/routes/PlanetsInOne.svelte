<script>
    import { onMount, afterUpdate, onDestroy } from 'svelte';
    //import Chart from "../808/ChartL.svelte";
    import { loadDataJson } from "../stores.js";
    import ChS from "../808/chart_synchronizer.js";

    let data = loadDataJson('planets_test.json');
    let scoops = 5; // bind to data value
    let id = ["chrtLon", "chrtLat", "chrtAu", "chrtZod"];
    let au;
    let ctxAu;
    let lon;
    let ctxLon;
    let lat;
    let ctxLat;
    let zod;
    let ctxZod;
    let planets = [{
            name: 'Jupiter',
            enable: false
        },
        {
            name: 'Saturn',
            enable: true
        },
        {
            name: 'Uran',
            enable: false
        },
        {
            name: 'Neptun',
            enable: false
        },
        {
            name: 'Pluto',
            enable: true
        },
    ];
    let restrict = [1, 1000];
    let visilibity;
    let ready;
    let sync;
    let aus = {
            chart_id: 'chrtAu',
            label: 'Planets distances / vzdálenost [AU]',
            restrict_x: restrict,
            restrict_y: [],
            data: [],
        };
    let lons = {
            chart_id: 'chrtLon',
            label: 'Planets longitudes / délka',
            restrict_x: restrict,
            restrict_y: [],
            data: [],
        };
    let lats = {
            chart_id: 'chrtLat',
            label: 'Planets latitudes / šířka',
            restrict_x: restrict,
            restrict_y: [],
            data: [],
        };
    let zods = {
            chart_id: 'chrtZod',
            label: 'zodiacal representation',
            restrict_x: restrict,
            restrict_y: [],
            data: [],
        };
    const updateLimits = e => {
        if (e.charCode === 13) {
            lons.restrict_x = restrict;
            lats.restrict_x = restrict;
        };
    };
    function activePlanets() {
        visilibity = []
        planets.forEach(function(entry) {
            visilibity.push(entry.enable);
        })
        visilibity.push(true); // for SaturnPluto aspects = hardcoded
    };

    $: data, prepareData();
    //$: restrict, lats.restrict_x = restrict && lons.restrict_x = restrict;
    $: scoops, refreshData();
    $: planets, activePlanets();

    function parseDate(s) {
        let d = new Date();
        let a = s.split('-');
        if (s[0] == '-') {
            d.setYear('-'+a[1]);
            d.setMonth(a[2]);
            d.setDate(a[3]);
        } else {
            d.setFullYear(a[0], a[1], a[2]);
        };
        return d
    };

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

    function zodiacFormatter(data) {
        let s = [
            "Beran", "Býk", "Blíženci",
            "Rak", "Lev", "Panna",
            "Váhy", "Štír", "Střelec",
            "Kozoroh", "Vodnář", "Ryby",
        ];
        let sign = s[Math.round(data)-1];
        let degree = (data - Math.round(data)) * 100;
        degree = Number(degree.toFixed(2));
        return sign + " " + degree + "°";
    }

    function parseAngle(number, normalize=false) {
        if (normalize) { // longitudes representation 0-90deg
            if (number >= 90 && number < 270) {
                return parseFloat(180 - number);
            } else if (number >= 270) {
                return parseFloat(-1*(360-number));
            } else {
                return parseFloat(number);
            }
        } else { // latitudes and all others without modify
            return parseFloat(number)
        }    
    };

    function difference(first, second) {
        if (first < 0 && second < 0) {
            if (first >= second) {
                return Math.abs(first) - Math.abs(second)
            } else {
                return Math.abs(second) - Math.abs(first)
            }            
        } else {
            if (first >= second) {
                return first - second
            } else {
                return second - first
            }
        }
    };

    function aspected(a, b) {
        //let a = Math.round(first);
        //let b = Math.round(second);
            if (difference(a,b) < 1 && difference(a,b) >= 0) { // conjunction
                return 0;
            } else if (difference(a,b) < 180.25 && difference(a,b) >= 179.75) { //oposition
                return 180;
            } else if (difference(a,b) < 90.25 && difference(a,b) >= 89.75) { //kvadrature
                return 90;
            } else {
                return null;
            }
    };

    function zodiacal(longitude) {
        let sign_no = Math.round(longitude / 30);
        if (sign_no == 0) {sign_no = 12};
        let degree = (longitude % 30) / 100;
        return sign_no + degree
    };

    async function prepareData() {
        let int_data = await data;
        aus.data = [];
        lats.data = [];
        lons.data = [];
        zods.data = [];
        let int_date;
        int_data.forEach(function(entry) {
            int_date = parseDate(entry['date']);
            aus.data.push([
                int_date, 
                parseAngle(entry['jup_au'], false),
                parseAngle(entry['sat_au'], false),
                parseAngle(entry['urn_au'], false),
                parseAngle(entry['npt_au'], false),
                parseAngle(entry['plt_au'], false)
            ]);
            lats.data.push([
                int_date, 
                parseAngle(entry['jup_lat'], false),
                parseAngle(entry['sat_lat'], false),
                parseAngle(entry['urn_lat'], false),
                parseAngle(entry['npt_lat'], false),
                parseAngle(entry['plt_lat'], false)
            ]);
            lons.data.push([ //longitudes have one extra row
                int_date, 
                parseAngle(entry['jup_lon'], true), //show normalized (true)
                parseAngle(entry['sat_lon'], true), //show normalized (true)
                parseAngle(entry['urn_lon'], true), //show normalized (true)
                parseAngle(entry['npt_lon'], true), //show normalized (true)
                parseAngle(entry['plt_lon'], true), //show normalized (true)
                aspected(entry['sat_lon'], entry['plt_lon'])
            ]);
            zods.data.push([
                int_date,
                parseAngle(zodiacal(entry['jup_lon']), false), //show normalized
                parseAngle(zodiacal(entry['sat_lon']), false), //show normalized
                parseAngle(zodiacal(entry['urn_lon']), false), //show normalized
                parseAngle(zodiacal(entry['npt_lon']), false), //show normalized
                parseAngle(zodiacal(entry['plt_lon']), false), //show normalized
            ]);
        });
        ready = true;
        int_data = null;
    };

    async function refreshData() {
        if (scoops == 1) {
            data = await loadDataJson('planets_BC2.json').then(prepareData());
        } else if (scoops == 2) {
            data = await loadDataJson('planets_BC1.json').then(prepareData());
        } else if (scoops == 3) {
            data = await loadDataJson('planets_AD1.json').then(prepareData());
        } else if (scoops == 4) {
            data = await loadDataJson('planets_AD2.json').then(prepareData());
        } else if (scoops == 5) {
            data = await loadDataJson('planets_test.json').then(prepareData());
        } else {
            console.log('cannot happen...')
        }

    };

    function createLonChart() {
        if (data) {
            ctxLon = document.getElementById(lons.chart_id);
            lon = new Dygraph(
                ctxLon, 
                lons.data,
                {
                    title: lons.label,
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

    function createLatChart() {
        if (lats.data) {
            ctxLat = document.getElementById(lats.chart_id);
            lat = new Dygraph(
                ctxLat, 
                lats.data,
                {
                    title: lats.label,
                    legend: 'always',
                    labels: ['Date', 'Jupiter', 'Saturn', 'Uran', 'Neptun', 'Pluto'],
                    visibility: visilibity,
                    width:-1,
                    showRoller: false,
                    rollPeriod: 6,
                    plugins: [
                        //doubleClickZoomOutPlugin
                    ],
                    animatedZooms: true,
                    drawGrid: true,
                    //strokeWidth: 5, //default line width
                    axes: {
                        x: {
                            axisLabelWidth: 60,
                            axisLabelFormatter: function(d, gran) {
                                return d.getFullYear() + "/" + (d.getMonth() + 1);
                            },
                            gridLineWidth: 2,
                            drawGrid: true,
                        }
                    },
                    series: {
                        
                    }  
                }
            );
        }
    };

    function createZodChart() {
        if (zods.data) {
            ctxZod = document.getElementById(zods.chart_id);
            zod = new Dygraph(
                ctxZod, 
                zods.data,
                {
                    title: zods.label,
                    legend: 'always',
                    legendFormatter: legendFormatter,
                    valueFormatter: zodiacFormatter,
                    labels: ['Date', 'Jupiter', 'Saturn', 'Uran', 'Neptun', 'Pluto'],
                    visibility: visilibity,
                    width:-1,
                    showRoller: false,
                    rollPeriod: 6,
                    plugins: [
                        //doubleClickZoomOutPlugin
                    ],
                    animatedZooms: true,
                    drawGrid: true,
                    //strokeWidth: 5, //default line width
                    axes: {
                        x: {
                            axisLabelWidth: 60,
                            axisLabelFormatter: function(d, gran) {
                                return d.getFullYear() + "/" + (d.getMonth() + 1);
                            },
                            gridLineWidth: 2,
                            drawGrid: true,
                        }
                    }, 
                }
            );
        }
    };

    function createAuChart() {
        if (aus.data) {
            ctxAu = document.getElementById(aus.chart_id);
            au = new Dygraph(
                ctxAu, 
                aus.data,
                {
                    title: aus.label,
                    legend: 'always',
                    labels: ['Date', 'Jupiter', 'Saturn', 'Uran', 'Neptun', 'Pluto'],
                    visibility: visilibity,
                    width:-1,
                    showRoller: false,
                    rollPeriod: 6,
                    plugins: [
                        //doubleClickZoomOutPlugin
                    ],
                    animatedZooms: true,
                    drawGrid: true,
                    //strokeWidth: 5, //default line width
                    axes: {
                        x: {
                            axisLabelWidth: 60,
                            axisLabelFormatter: function(d, gran) {
                                return d.getFullYear() + "/" + (d.getMonth() + 1);
                            },
                            gridLineWidth: 2,
                            drawGrid: true,
                        }
                    },
                    series: {
                        
                    }  
                }
            );
        }
    };


    function createChart() {
        if (lons.data.length > 0) {
            createLatChart();
            createLonChart();
            createAuChart();
            createZodChart();
            //sync.detach();
            sync = Dygraph.synchronize(lon, lat, au, zod, {
                selection: true,
                zoom: true,
                range: false
            });
            // lon.ready(function() {
            //     lon.setAnnotations([
            //         {
            //         series: "SaturnPlutoAspects",
            //         x: [0, null],
            //         tickHeight: 10,
            //         }
            //     ]);
            // });
        } else {
            //console.log('data not prepared...')
        }
    };

    afterUpdate(createChart);
</script>

<main>
    <div class="control">
        <label><input type=radio bind:group={scoops} value={1}>[BC 10k-5k]</label>
        <label><input type=radio bind:group={scoops} value={2}>[BC 5k-0]</label>
        <label><input type=radio bind:group={scoops} value={3}>[AD 0-5k]</label>
        <label><input type=radio bind:group={scoops} value={4}>[AD 5k-10k]</label>
        <label><input type=radio bind:group={scoops} value={5}>[AD 2015-2025]</label>
    </div>
    <div class="control">
        {#each planets as planet}
            <label>
                <input type=checkbox bind:checked={planet.enable}>
                {planet.name}
            </label>
        {/each}
    </div>
    <div id="{lons.chart_id}"></div>
    <div id="{lats.chart_id}"></div>
    <div id="{zods.chart_id}"></div>
    <div id="{aus.chart_id}"></div>
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
    #chrtLon, #chrtLat, #chrtAu, #chrtZod { 
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