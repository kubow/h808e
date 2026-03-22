<script>
  import { onMount } from "svelte";
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

  /**
   * @param {Date} d
   */
  function weekNumber(d) {
    let first = +new Date(d.getFullYear(), 0, 1);
    let today = +new Date(d.getFullYear(), d.getMonth(), d.getDate());
    let dayOfYear = (today - first + 1) / 86400000;
    return Math.ceil(dayOfYear / 7).toString();
  }

  /**
   * @param {Date} d
   */
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

  /**
   * @param {Date} d
   */
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
          today = today.concat("Dnes má svátek " + entry["`day_name`"]);
        } else if (entry["`calendar`"] == "cz_important") {
          today = today.concat(entry["`day_name`"]);
        } else if (entry["`calendar`"] == "cz_holiday") {
          today = today.concat(entry["`day_name`"]);
        } else if (entry["`calendar`"] == "cz_other") {
          today = today.concat(
            entry["`day_name`"] + "(" + entry["`day_memo`"] + ")"
          );
        }
      }
    }
    today = today.concat(dayDesc);
    console.log(today);
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
          {#each today as line}
            <span class="tooltip-line">{line}</span>
          {/each}
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
    overflow: visible;
    min-width: 10%;
    width: 6.5rem;
  }
  .clockWrapper {
    position: relative;
    display: inline-flex;
    margin: auto;
    border-radius: 17px;
    background: none;
  }
  .clockDisplay {
    font-size: var(--font-size-0);
    line-height: 1.35;
    background: var(--surface-strong);
    border-radius: 17px;
    color: var(--surface-text);
    text-align: center;
    white-space: nowrap;
    padding: 0.4rem 0.55rem;
    margin: 0;
    border: 1px solid color-mix(in srgb, var(--surface-text) 14%, transparent);
  }
  .tooltip-wrapper {
    position: absolute;
    visibility: hidden;
    background: var(--surface-strong);
    color: var(--surface-text);
    right: 0;
    top: calc(100% + 0.35rem);
    margin: 3px;
    padding: 10px;
    border-radius: 0.75rem;
    min-width: max-content;
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.28);
    pointer-events: none;
  }
  .clockDisplay:hover .tooltip-wrapper {
    visibility: visible;
    opacity: 0.92;
    z-index: 5;
  }
  .tooltip-line {
    display: block;
    text-align: left;
    font-size: var(--font-size-1);
  }
</style>
