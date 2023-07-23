<script>
  import { onMount } from "svelte";
  import { h808e, loadDataUrl } from "./stores";

  let date = new Date();
  let ast_info = "";
  var params = {
    lang: "en",
    month: date.getMonth() + 1,
    year: date.getFullYear(),
    size: 50, //pixels
    lightColor: "#FFFF88", //CSS color
    shadeColor: "#111111", //CSS color
    sizeQuarter: 20, //pixels
    texturize: false, //true - false
    LDZ: date,
  };
  // Original Snippet: https://gist.github.com/endel/dfe6bb2fbe679781948c
  // Source: https://gist.github.com/endel/dfe6bb2fbe679781948c
  var Moon = {
    phases: [
      "new-moon",
      "waxing-crescent-moon",
      "waxing-quarter-moon",
      "waxing-gibbous-moon",
      "full-moon",
      "waning-gibbous-moon",
      "last-quarter-moon",
      "waning-crescent-moon",
    ],
    phase: (
      /** @type {number} */ year,
      /** @type {number} */ month,
      /** @type {number} */ day
    ) => {
      let jd = 0; // jd is helper for recompute
      let b = 0; // b is the actual phase
      if (month < 3) {
        year--;
        month += 12;
      }
      ++month;
      jd = 365.25 * year + 30.6 * month + day - 694039.09; // total days elapsed
      jd /= 29.5305882; // divide by the moon cycle ?? can be more precise
      b = parseInt(jd); // int(jd) -> b, take integer part of jd
      jd -= b; // subtract integer part to leave fractional part of original jd
      b = Math.round(jd * 8); // scale fraction from 0-8 and round
      if (b >= 8) b = 0; // 0 and 8 are the same so turn 8 into 0
      return { phase: b, name: Moon.phases[b] };
    },
  };
  let moon_phase = Moon.phase(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate()
  );
  //console.log(moon_phase);

  /**
   * @param {number} value
   * @param {number} places
   */
  function roundTo(value, places) {
    let power = Math.pow(10, places);
    return Math.round(value * power) / power;
  }

  function constructBackground() {
    if (moon_phase.phase == 0) {
      return "background:url(/image/moon-new.svg)";
    } else if (moon_phase.phase == 1) {
      return "background:url(/image/moon-waxing-crescent.svg)";
    } else if (moon_phase.phase == 2) {
      return "background:url(/image/moon-first-quarter.svg)";
    } else if (moon_phase.phase == 3) {
      return "background:url(/image/moon-waxing-gibbous.svg)";
    } else if (moon_phase.phase == 4) {
      return "background:url(/image/moon-full.svg)";
    } else if (moon_phase.phase == 5) {
      return "background:url(/image/moon-waxing-crescent.svg)";
    } else if (moon_phase.phase == 6) {
      return "background:url(/image/moon-waning-gibbous.svg)";
    } else if (moon_phase.phase == 7) {
      return "background:url(/image/moon-waning-crescent.svg)";
    } else {
      return "background:url(/image/moon-new.svg)";
    }
  }

  onMount(async () => {
    ast_info = await loadDataUrl(
      $h808e.api.ipgeoloc.url.replace("BOBOK", $h808e.api.ipgeoloc.access_key)
    );
    if (!ast_info) {
      var opt_string = [];
      for (var i in params) {
        opt_string.push(i + "=" + encodeURIComponent(params[i]));
      }
      ast_info = await loadDataUrl(
        "https://www.icalendar37.net/lunar/api/?" + opt_string.join("&")
      );
    }
  });
</script>

<section>
  <div class="moonWrapper">
    {#await moon_phase}
      <p>Moon</p>
    {:then moon_phase}
      <div class="moonDisplay" style={constructBackground()}>
        <span class="moonTip">
          {#await ast_info}
            <p>...data not yet loaded</p>
          {:then ast_info}
            here we see a moon
            <!-- <p>{moon_phase.name} @ {ast_info.location.location}</p>
            <p>moon rise: {ast_info.moonrise} set {ast_info.moonset}</p>
            <p>
              moon alt: {roundTo(ast_info.moon_altitude, 2)} angle {roundTo(
                ast_info.moon_parallactic_angle,
                2
              )}
            </p>
            <p>sun rise: {ast_info.sunrise} set: {ast_info.sunset}</p>
            <p>day length: {ast_info.day_length}</p> -->
          {:catch error}
            <p style="color: red">error: {error.message}</p>
          {/await}
        </span>
      </div>
    {:catch error}
      <svg width="7%" height="7%">
        <circle cx="50" cy="50" r="50" stroke="none" fill="#111111" />
      </svg>
    {/await}
  </div>
</section>

<style>
  section,
  .moonWrapper,
  .moonDisplay {
    display: flex;
    justify-content: center;
    align-items: center;
    /* 		margin:0;
		padding: 0; */
    background-repeat: no-repeat;
    background-attachment: fixed;
    background-position: center;
  }
  section {
    overflow: hidden;
    min-width: 10%;
    width: 3.5rem; /* fits the moon nicely next to clock */
  }
  .moonWrapper {
    display: inline;
    margin: auto;
    width: 100%;
  }
  .moonDisplay {
    font-size: 0.75em;
    min-height: 50px;

    text-align: center;
    white-space: nowrap;

    width: 100%;
    height: 100%;
  }
  .moonTip {
    /* tooltip taken from: 
		https://codepen.io/PhilippeVay/pen/AXGaJv?editors=1000 */
    position: absolute;
    visibility: hidden;
    background: #000000;
    color: #ffffff;
    right: 50 !important;
    margin: 3px;
    padding: 10px;
  }
  .moonDisplay:hover .moonTip {
    visibility: visible;
    opacity: 0.7;
    top: 10%;
    z-index: 5;
    /*left: 50%;*/
    /*margin-left: -76px;*/
    /* z-index: 999; defined above with value of 5 */
  }
</style>
