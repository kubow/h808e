<script>
  import { afterUpdate } from "svelte";
  import model_topology from "$lib/store/model_test.json";

  afterUpdate(() => {
    var dataMap = new dataMap({
      element: document.getElementById("container"),
      scope: "cze",
      projection: "mercator",
      responsive: true,
      fills: {
        defaultFill: "rgba(23,22,56,0.5)",
      },
      geographyConfig: {
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
  <title>Tools | Maps</title>
</svelte:head>

<section class="page">
  <header>
    <h1>Maps</h1>
    <p>Geographic tools and map experiments collected under the tools section.</p>
  </header>

  <section class="panel">
    <h2>Embedded map</h2>
    <iframe
      title="mapa"
      width="100%"
      height="300"
      frameborder="0"
      allowfullscreen="false"
      src="//umap.openstreetmap.fr/en/map/czech_places_435461?scaleControl=false&miniMap=false&scrollWheelZoom=false&zoomControl=true&allowEdit=false&moreControl=true&searchControl=null&tilelayersControl=null&embedControl=null&datalayersControl=true&onLoadPanel=undefined&captionBar=false"
    ></iframe>
  </section>

  <section class="panel">
    <h2>GeoJSON / TopoJSON experiments</h2>
    <p>Leaflet and OpenLayers variants are still disabled, but the dataset is kept in the app.</p>
    <p>Loaded topology sample: {model_topology.length} records.</p>
  </section>

  <section class="panel">
    <h2>D3 map experiment</h2>
    <p>A custom D3 map surface can live here when the renderer is re-enabled.</p>
    <div id="container"></div>
  </section>
</section>

<style>
  .page {
    display: grid;
    gap: 1.5rem;
    padding: 1.5rem;
  }

  .panel {
    display: grid;
    gap: 0.75rem;
    padding: 1.25rem;
    border-radius: 1rem;
    background: rgba(255, 255, 255, 0.78);
    box-shadow: inset 0 0 0 1px rgba(15, 23, 42, 0.08);
  }

  h1,
  h2,
  p {
    margin: 0;
  }

  #container {
    padding-top: 2em;
    display: flex;
    justify-content: space-around;
    align-items: stretch;
    width: 100%;
    height: 250px;
  }
</style>
