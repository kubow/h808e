<script>
  import { onMount } from "svelte";
  import { h808e } from "$lib/stores";
  import Popover from "svelte-popover";
  import calendar from "$lib/store/calendar.json";

  let date = new Date();
  $: day = date.getDate();
  $: month = date.getMonth() + 1;
  $: year = date.getFullYear();
  $: hour = date.getHours();
  $: min = date.getMinutes();
  $: sec = date.getSeconds();
  $: dayDesc = `Je ${weekDay(date)} / ${weekNumber(date)}.týden / ${dayNumber(
    date
  )}. den v roce`;

  /**
   * @type {string[]}
   */
  let today = [];
  let dayOrNight = "AM";

  function weekNumber(d) {
    let first = +new Date(d.getFullYear(), 0, 1);
    let today = +new Date(d.getFullYear(), d.getMonth(), d.getDate());
    let dayOfYear = (today - first + 1) / 86400000;
    return Math.ceil(dayOfYear / 7).toString();
  }

  function weekDay(d) {
    let weekday = new Array(7);
    weekday[0] = "neděle"; //"Sunday";
    weekday[1] = "pondělí"; //"Monday";
    weekday[2] = "úterý"; //"Tuesday";
    weekday[3] = "středa"; //"Wednesday";
    weekday[4] = "čtvrtek"; //"Thursday";
    weekday[5] = "pátek"; //"Friday";
    weekday[6] = "sobota"; //"Saturday";
    return weekday[d.getDay()];
  }

  function dayNumber(d) {
    let first = +new Date(d.getFullYear(), 0, 1);
    let today = +new Date(d.getFullYear(), d.getMonth(), d.getDate());
    let dayOfYear = (today - first + 1) / 86400000;
    return Math.floor(dayOfYear).toString();
  }

  onMount(async () => {
    const interval = setInterval(() => {
      date = new Date();
      dayOrNight = hour >= 12 ? "PM" : "AM";
    }, 1000);
    for (let entry of calendar) {
      if (entry["`n_month`"] == month && entry["`n_day`"] == day) {
        if (entry["`calendar`"] == "cz_jmena") {
          today.push("Dnes má svátek " + entry["`day_name`"]);
        } else if (entry["`calendar`"] == "cz_important") {
          today.push(entry["`day_name`"]);
        } else if (entry["`calendar`"] == "cz_holiday") {
          today.push(entry["`day_name`"]);
        } else if (entry["`calendar`"] == "cz_other") {
          today.push(entry["`day_name`"] + "(" + entry["`day_memo`"] + ")");
        }
      }
    }
    today.push(dayDesc);
  });
</script>

<section>
  <div class="clockWrapper">
    <p class="clockDisplay">
      {day}. {month}. {year} <br />
      {hour} : {min} : {sec}
      {dayOrNight}
      <span class="tooltip-wrapper">
        <span class="tooltip">
          {#await today}
            <p>...data not yet loaded</p>
          {:then today}
            {#each today as important}
              <p>{important}</p>
            {/each}
          {:catch error}
            <p style="color: red">error: {error.message}</p>
          {/await}
        </span>
      </span>
    </p>
  </div>
</section>

<style>
  section,
  .clockWrapper,
  .clockDisplay {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  section {
    overflow: hidden;
    min-width: 10%;
  }
  .clockWrapper {
    /*position: relative;*/
    display: inline;
    margin: auto;
    border-radius: 17px;
    background: #ffffff;
  }
  .clockDisplay {
    font-size: 0.75em;
    background: #000000;
    border-radius: 17px;
    color: #ffffff;
    text-align: center;
    white-space: nowrap;
  }
  .tooltip-wrapper {
    /* tooltip source https://codepen.io/PhilippeVay/pen/AXGaJv?editors=1000 */
    position: absolute;
    visibility: hidden;
    background: #000000;
    right: 0 !important;
    margin: 3px;
    padding: 10px;
  }
  .clockDisplay:hover .tooltip-wrapper {
    visibility: visible;
    opacity: 0.7;
    top: 10%;
    z-index: 5;
    /*left: 50%;*/
    /*margin-left: -76px;*/
    /* z-index: 999; defined above with value of 5 */
  }
</style>
