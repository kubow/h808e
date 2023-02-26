<script>
//inspire https://svelte.dev/repl/01a5774b53e9416584428c025668407b?version=3.15.0
	let width = 500;
	let height = 250;
    let svg;
    let arcs;
    let links;
    let nodes;

    d3.json("assets/model.json", function(error, json) {
      
      // create a first guess for the projection
      var center = d3.geo.centroid(json)
      var scale  = 150;
      var offset = [width/2, height/2];
      var projection = d3.geo.mercator().scale(scale).center(center)
          .translate(offset);
      // create the path
      var path = d3.geo.path().projection(projection);

      // using the path determine the bounds of the current map and use 
      // these to determine better values for the scale and translation
      var bounds  = path.bounds(json);
      var hscale  = scale*width  / (bounds[1][0] - bounds[0][0]);
      var vscale  = scale*height / (bounds[1][1] - bounds[0][1]);
      var scale   = (hscale < vscale) ? hscale : vscale;
      var offset  = [width - (bounds[0][0] + bounds[1][0])/2,
                        height - (bounds[0][1] + bounds[1][1])/2];

      // new projection
      projection = d3.geo.mercator().center(center)
        .scale(scale).translate(offset);
      path = path.projection(projection);
      
      //nodes = json.objects.collection.geometries;
      //links = json.objects.collection.geometries;
      // add a rectangle to see the bound of the svg
       //svg.append("rect").attr('width', width).attr('height', height)
        //.style('stroke', 'black').style('fill', 'none');

      /*svg.selectAll("path").data(json.features).enter().append("path")
        .attr("d", path)
        .style("fill", "red")
        .style("stroke-width", "1")
        .style("stroke", "black") */
      /* json.forEach(element => {
          console.log(element);
          //links = "";
          //nodes = "";
      }); */
    });

    function getCoord(element, type) {
        if (type == 'x') {
            console.log('xova souradnice');
            return element.coordinates[0];
        } else {
            console.log('yova souradnice');
            return element.coordinates[1];
        }
    }
</script>

<svg {width} {height} viewBox="-1 -1 2 2" bind:this={svg}>
  <!-- <path d={path} vector-effect="non-scaling-stroke" {...$$props} /> -->
<!--     {#each links as link}
    <g stroke='#999' stroke-opacity='0.6'>
      <line x1='{link.source.x}' y1='{d3yScale(link.source.y)}' 
            x2='{link.target.x}' y2='{d3yScale(link.target.y)}'
            transform='translate(0 {height}) scale(1 -1)'>
            <title>{link.source.id}</title>
      </line>
    </g>    
	{/each} -->
    {#await nodes}
        <b>...loading data, stahuji vypocitane data ...</b>
    {:then nodes}
        {#each nodes as point}
        <circle class='node' r='5' fill='black' 
            cx='{getCoord(point, 'x')}' cy='{getCoord(point, 'x')}'
            transform='translate(0 {height}) scale(1 -1)'>
        <!-- <title>{point.id}</title> -->
        </circle>
        {/each}
    {:catch error}
        <b style="color: red">Chart not created because of: {error.message}</b>
    {/await}
</svg>

<style>
  #mapid { height: 500px; }
</style>