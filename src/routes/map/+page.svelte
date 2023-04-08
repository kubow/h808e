<script>
  import { afterUpdate } from "svelte";
  import model_topology from "$lib/store/model_test.geojson";

  afterUpdate(() => {
    var dataMap = new dataMap({
      element: document.getElementById("container"),
      scope: "cze",
      projection: "mercator",
      responsive: true, //if true, call `resize()` on the map object when it should adjust it's size
      fills: {
        defaultFill: "rgba(23,22,56,0.5)", // Any hex, color name or rgb/rgba value
      },
      geographyConfig: {
        //dataUrl: 'assets/model.json',
        hideAntarctica: true,
        highlightOnHover: true,
        popupOnHover: true,
      },
      setProjection: function (element) {
        projection = d3.geo
          .mercator()
          .center([14.5, 50.12])
          .rotate([0, 0])
          .scale(25000 / 4)
          .translate([350, 225]);
        path = d3.geo.path().projection(projection);

        return { path: path, projection: projection };
      },
      fills: {
        defaultFill: "#f0af0a",
        lt50: "rgba(0,244,244,0.9)",
        gt50: "red",
      },

      data: {
        "071": { fillKey: "lt50" },
        "001": { fillKey: "gt50" },
      },
    });
  });
</script>

<svelte:head>
  <title>Mapy</title>
</svelte:head>

<h1>Mohla by se použít externí služba (zde umap.openstreetmap.fr)</h1>
<iframe
  title="mapa"
  width="100%"
  height="300px"
  frameborder="0"
  allowfullscreen="false"
  src="//umap.openstreetmap.fr/en/map/czech_places_435461?scaleControl=false&miniMap=false&scrollWheelZoom=false&zoomControl=true&allowEdit=false&moreControl=true&searchControl=null&tilelayersControl=null&embedControl=null&datalayersControl=true&onLoadPanel=undefined&captionBar=false"
/>
<h1>Anebo statický WD/CS model ve formátu GeoJSON/TopoJSON (pomocí Leaflet)</h1>
<!-- <ModelL model_topology={model_topology}/> -->
<h1>DTTO (pomocí OpenLayers) ... teď je to vyplé</h1>
<!-- <ModelO model_topology={model_topology}/> -->
<h1>Anebo by mohla byt přímo interaktivní mapa z shapes (pomocí D3.js)</h1>
<p>S D3.js toho jde dělat víc a jde využít ve všech výše uvedených.</p>
<div id="container" />

<style>
  #container {
    padding-top: 2em;
    display: flex;
    flex: 12;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-around;
    align-items: stretch;
    width: 100%;
    height: 250px;
  }
</style>
