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
  let mapL;
  export let model_topology;

  // Integrate TopoJSON into Leaflet
  // CURRENTLY DEACTIVATED !!!
  /* L.TopoJSON = L.GeoJSON.extend({  
    addData: function(jsonData) {    
      if (jsonData.type === 'Topology') {
        for (key in jsonData.objects) {
          geojson = topojson.feature(jsonData, jsonData.objects[key]);
          L.GeoJSON.prototype.addData.call(this, geojson);
        }
      }    
      else {
        L.GeoJSON.prototype.addData.call(this, jsonData);
      }
    }  
  }); */
  // Copyright (c) 2013 Ryan Clark
  //const topoLayer = new L.TopoJSON();

/*   function onEachFeature(feature, layer) {
    var popupContent = "<p>new " + feature.geometry.type + " !</p>";
    if (feature.properties && feature.properties.popupContent) {
      popupContent += feature.properties.popupContent;
    }
    layer.bindPopup(popupContent);
  }; */
  var getModelStyle = function(feature){
    var modelStyle = {
      weight: 1,
      color: 'blue',
      opacity: 1,
      fillOpacity: 0.3,
      fillColor: 'red'
    };
    if (feature.geometry.type == 'LineString') {
      if (feature.properties.diameter > 349) {modelStyle.weight = 4;}
      else if (feature.properties.diameter > 149) {modelStyle.weight = 3;}
      else if (feature.properties.diameter > 89) {modelStyle.weight = 2;}
      else if (feature.properties.diameter > 1) {modelStyle.weight = 1;};
    } else if (feature.geometry.type == 'Point') {
      
      if (feature.properties.typeno == 1) {modelStyle.weight = 4;}
      else if (feature.properties.typeno == 2) {modelStyle.weight = 3;}
      else if (feature.properties.typeno == 3) {modelStyle.weight = 2;}
      else if (feature.properties.typeno == 4) {modelStyle.weight = 1;};
    }
    return modelStyle;
  };

  function createMap() {
    if (!mapL && model_topology) {
      mapL = L.map('map', {
        //svgSprite: false,
        //zoomControl: false,
        //center: center,
        zoom: zoom
      }).setView(centerpoint, zoom);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18
        }).addTo(mapL);

      L.geoJSON(model_topology, {
        style: getModelStyle,
        /* pointToLayer: function (feature, latlng) {
          return L.marker(latlng, {icon: L.Icon({
            iconUrl: 'image/hermetica-A015-conjunction-2x.svg',
            iconSize: [10,10]
          })});
        }, */
        onEachFeature: function (feature, layer) {
          var content = feature.properties.muid + "/" + feature.properties.altid
          layer.bindPopup(content);
        }
      }).addTo(mapL);

        //topoLayer.addTo(mapL);
        //var marker = L.marker([15.029, 49.9229]).addTo(mapL);

      //coord = model_topology.features[0].geometry.coordinates;
      //mapL.setView(L.GeoJSON.coordsToLatLngs(coord), 18);
      
      mapL.on('mousemove', function(ev) {
        latt = ev.latlng.lat;
        lngg = ev.latlng.lng;
      });

    } else if (!model_topology) {
      console.log("waiting for waypoints input");
    };
  };

  /* onMount(async () => {
    model_topology = await loadDataJson('model_test.geojson');
    console.log(model_topology);
  }); */
  afterUpdate(createMap);
</script>


{#await model_topology}
<p>wait for model data to load, then create a map</p>
{:then model_topology}
<div id="map" style="height: {height}"></div>  
<div id="coord">tady jsou koordináty: {latt} - {lngg} </div>
{/await} 



<style>
  p { color: black }
  #map { height: 500px; z-index: 0;}
  #coord {
    position: flex;
    flex-direction: row;
  }
</style>