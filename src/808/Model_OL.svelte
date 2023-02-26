<script>
  import { afterUpdate, onMount } from 'svelte';
  import { loadDataJson } from '../stores.js';

	let width = 500;
  let height = 250;
  let coord;
  let latt = 0; // Latitude display
  let lngg = 0; // Longitude display
  //let centerpoint = [49.922935, 15.029297];
  let centerpoint = [49.982123, 16.193073];
  //let centerpoint = [16.190073, 49.979123];
  let zoom = 16;
  let mapO;
  export let model_topology;

  function createMap() {
    if (!mapO && model_topology) {
      mapO = ol.Map({
        target: 'mapO',
        layers: [
          new ol.layer.Tile({
            source: new ol.source.OSM()
          })
        ],
        view: new ol.View({
          center: ol.proj.fromLonLat([49.9813, 16.1955]),
          zoom: 4
        })
      });
      
      /* mapO.on('mousemove', function(ev) {
        latt = ev.latlng.lat;
        lngg = ev.latlng.lng;
      }); */

    } else if (!model_topology) {
      console.log("waiting for model_topology input");
    };
  };

  onMount(async () => {
    model_topology = await loadDataJson('model_test.geojson');
    console.log(model_topology);
  });
  afterUpdate(createMap);
</script>

<div id="mapO" style="height: {height}"></div>  
{#await model_topology}
<p>wait for model data to load, then create a map</p>
{:then model_topology}
<div id="coord">tady jsou koordináty: {latt} - {lngg} </div>
{/await} 



<style>
  p { color: black }
  #mapO { height: 500px; z-index: 0;}
  #coord {
    position: flex;
    flex-direction: row;
  }
</style>