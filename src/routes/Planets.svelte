<script>
    import { onMount, afterUpdate, onDestroy } from 'svelte';
    //import debounce from 'debounce-promise';
    //import debounce from 'svelte';
    import Chart from "../808/ChartL.svelte";
    import { loadDataJson } from "../stores.js";
    //import ChS from "../808/chart_synchronizer.js";

    let data = loadDataJson();
    let id = ["chrtLon", "chrtLat"];
    let lon = document.getElementById(id[0]);
    let lat = document.getElementById(id[1]);
    let restrict = [1, 1000];
    let ready;
    let lons = {
            label: 'Planets longitudes / délka',
            restrict_x: restrict,
            restrict_y: [],
            data: [],
        };
    let lats = {
            label: 'Planets latitudes / šířka',
            restrict_x: restrict,
            restrict_y: [],
            data: [],
        };
    /* let sync = Dygraph.synchronize(lon, lat, {
        selection: true,
        zoom: true
    }); */
    const updateLimits = e => {
        if (e.charCode === 13) {
            lons.restrict_x = restrict;
            lats.restrict_x = restrict;
        };
    };

    $: data, prepareData();
    //$: restrict, lats.restrict_x = restrict && lons.restrict_x = restrict;

    function parseDate(string) {
        let d = new Date();
        let a = string.split('-');
        if (string[0] == '-') {
            d.setYear('-'+a[1]);
            d.setMonth(a[2]);
            d.setDate(a[3]);
        } else {
            d.setYear(a[0]);
            d.setMonth(a[1]);
            d.setDate(a[2]);
        }
        return d
    };

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

    async function prepareData() {
        let int_data = await data;
        let int_date;
        int_data.forEach(function(entry) {
            int_date = parseDate(entry.date);
            lats.data.push([int_date, parseAngle(entry.sat_lat, false), parseAngle(entry.plt_lat, false)])
            lons.data.push([int_date, parseAngle(entry.sat_lon, true), parseAngle(entry.plt_lon, true)])
        });
        ready = true;
    };
</script>

<main>
    <div id="control">
        <input type="number" on:keypress="{updateLimits}"
            placeholder="{restrict[0]}" bind:value={restrict[0]}>
        <input type="number" on:keypress="{updateLimits}"
            placeholder="{restrict[0]}" bind:value={restrict[1]}>
    </div>
    {#await data}
        <p>...loading data, stahuji vypocitane data ...</p>
    {:then ready}
        <Chart data="{lons}" cid="{id[0]}"/>
        <Chart data="{lats}" cid="{id[1]}"/>
    {:catch error}
        <p style="color: red">Chart not created because of: {error.message}</p>
    {/await}
    <div id="control">
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
        align-items: center;
        justify-content: space-around;
        align-items: stretch;
        z-index: -1;
    }
    #control {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
    }
</style>