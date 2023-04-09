<script>
  // import p5 from "p5-svelte";
  // let width = 55;
  // let height = 55;

  const sketch = () => {
    /*p5.setup = () => {
      p5.createCanvas(700, 700);
    };

    p5.draw = () => {
      //p5.ellipse(p5.width / 2, p5.height / 2, width, height);
      p5.push();
      p5.translate(width * 0.2, height * 0.5);
      p5.rotate(frameCount / 200.0);
      polygon(0, 0, 82, 3);
      p5.pop();
    };*/
    console.log("will aproach with p5 in future");
  };

  /*function polygon(x, y, radius, npoints) {
    let angle = TWO_PI / npoints;
    beginShape();
    for (let a = 0; a < TWO_PI; a += angle) {
      let sx = x + cos(a) * radius;
      let sy = y + sin(a) * radius;
      vertex(sx, sy);
    }
    endShape(CLOSE);
  }*/
</script>

<main>
  <div>
    <!-- 400 Příroda -->
    <svg width="100%" viewBox="0 0 200 200">
      <polygon fill="blue" stroke-width="0" points="15,35 185,35 185,160" />
      <polygon fill="red" stroke-width="0" points="15,40 185,165 15,165" />
    </svg>
  </div>
  <div>
    <!-- 500 Člověk -->
    <svg width="100%" viewBox="0 0 200 200">
      <polygon
        fill="blue"
        stroke-width="1"
        points="100,10 40,198 190,78 10,78 160,198"
      />
    </svg>
  </div>
  <div>
    <!-- 600 Vědy -->
    <svg width="100%" viewBox="0 0 200 200">
      <polygon fill="red" stroke-width="0" points="100,10 10,160 190,160" />
      <polygon fill="blue" stroke-width="0" points="100,190 10,60 190,60" />
    </svg>
  </div>
  <div>
    <!-- 700 Technologie -->
    <svg width="100%" viewBox="0 0 200 200">
      <polygon
        fill="red"
        stroke-width="0"
        points="100,198 50,10 190,160 10,80 190,80 10,160 150,10"
      />
    </svg>
  </div>
</main>

<style>
  main {
    min-height: 100%;
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    /* justify-content: space-evenly; */
  }
  main > div {
    display: flex;
    flex-basis: calc(50%);
    justify-content: center;
    flex-direction: column;
    z-index: 0;
  }
</style>
