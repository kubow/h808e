<script>
    import { onMount, afterUpdate } from 'svelte';

    var astChart;
    var ctx;
    var json_data;

    var sat_lat = {
        label: 'Saturn latitude',
        borderColor: 'orange',
        pointRadius: 0.5,
        pointHoverRadius: 0.75,
        data: [],
        borderWidth: 0.5
    };
    var sat_lon = {
        label: 'Saturn longitude',
        borderColor: 'orange',
        pointRadius: 0.5,
        pointHoverRadius: 0.75,
        data: [],
        borderWidth: 0.5
    };
    var plt_lat = {
        label: 'Pluto latitude',
        borderColor: 'blue',
        pointRadius: 0.5,
        pointHoverRadius: 0.75,
        data: [],
        borderWidth: 0.5
    };
    var plt_lon = {
        label: 'Pluto longitude',
        borderColor: 'blue',
        pointRadius: 0.5,
        pointHoverRadius: 0.75,
        data: [],
        borderWidth: 0.5
    };
    var zoomPlugin = {
        zoom: {
            // Container for pan options
            pan: {
                // Boolean to enable panning
                enabled: true,

                // Panning directions. Remove the appropriate direction to disable
                // Eg. 'y' would only allow panning in the y direction
                // A function that is called as the user is panning and returns the
                // available directions can also be used:
                //   mode: function({ chart }) {
                //     return 'xy';
                //   },
                mode: 'x',

                rangeMin: {
                    // Format of min pan range depends on scale type
                    x: -90,
                    y: null
                },
                rangeMax: {
                    // Format of max pan range depends on scale type
                    x: 90,
                    y: null
                },

                // Function called while the user is panning
                onPan: function({chart}) { console.log(`I'm panning!!!`); },
                // Function called once panning is completed
                onPanComplete: function({chart}) { console.log(`I was panned!!!`); }
            },

            // Container for zoom options
            zoom: {
                // Boolean to enable zooming
                enabled: true,

                // Enable drag-to-zoom behavior
                drag: true,

                // Drag-to-zoom effect can be customized
                // drag: {
                // 	 borderColor: 'rgba(225,225,225,0.3)'
                // 	 borderWidth: 5,
                // 	 backgroundColor: 'rgb(225,225,225)',
                // 	 animationDuration: 0
                // },

                // Zooming directions. Remove the appropriate direction to disable
                // Eg. 'y' would only allow zooming in the y direction
                // A function that is called as the user is zooming and returns the
                // available directions can also be used:
                //   mode: function({ chart }) {
                //     return 'xy';
                //   },
                mode: 'x',

                rangeMin: {
                    // Format of min zoom range depends on scale type
                    x: -90,
                    y: null
                },
                rangeMax: {
                    // Format of max zoom range depends on scale type
                    x: 90,
                    y: null
                },

                // Speed of zoom via mouse wheel
                // (percentage of zoom on a wheel event)
                speed: 0.1,

                // Function called while the user is zooming
                onZoom: function({chart}) { console.log(`I'm zooming!!!`); },
                // Function called once zooming is completed
                onZoomComplete: function({chart}) { console.log(`I was zoomed!!!`); }
            }
        }
    }
    function resetZoom() {
       window.myLine.resetZoom();
    }

    function createChart() {
        ctx = document.getElementById('astChart').getContext('2d');
        if (astChart) astChart.destroy();
        astChart = new Chart(ctx, {
            type: 'line',
            data: { datasets: [sat_lon, plt_lon] },
            options: {
                title: {
					display: true,
					text: 'Saturn and Pluto movements'
				},
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: false
                        }
                    }],
                    xAxes:[{
                        type: 'time',
                        time: {
                            displayFormats: {
                                year: 'YYYY'
                            }
                        },
                        ticks: {
                            autoSkip: true,
                            maxTicksLimit: 20,
                            maxRotation: 0,
                            minRotation: 0
                        }
                    }],
                },
                pan: {
                    enabled: true,
                    mode: "x",
                    //speed: 1,
                    //threshold: 10
                },
                zoom: {
                    enabled: true,
                    //drag: false,
                    mode: "x",
                    //speed: 0.01,
                    // sensitivity: 0.1,
                    //limits: {
                    //    max: 10,
                    //    min: 0.5
                    //}
                },
                plugins: zoomPlugin
            }
        });
    }

    onMount(async () => {
        try {
            const res = await fetch(`http://127.0.0.1/h808e/data_astrology.php`);
            const text = await res.json(); //.text();
            json_data = text;
        } catch {
            console.log("sample data used ...");
            json_data = [{"date":"0001-01-01","aspect":"999","sat_lat":"-0.790612","sat_lon":"98.9427","plt_lat":"17.2575","plt_lon":"205.382"},{"date":"0001-02-01","aspect":"999","sat_lat":"-0.692615","sat_lon":"97.6604","plt_lat":"17.5253","plt_lon":"205.072"}];
        } finally {
            json_data.forEach(function(entry) {
                sat_lat.data.push({t : new Date(entry.date), y : entry.sat_lat})
                sat_lon.data.push({t : new Date(entry.date), y : entry.sat_lon})
                plt_lat.data.push({t : new Date(entry.date), y : entry.plt_lat})
                plt_lon.data.push({t : new Date(entry.date), y : entry.plt_lon})
            });
            createChart;
        }
    })

    afterUpdate(createChart);
</script>

{#await json_data}
    <p>...waiting</p>
{:then json_data}
    <canvas id="astChart" width="3" height="1"></canvas>
{:catch error}
    <p style="color: red">{error.message}</p>
{/await}


