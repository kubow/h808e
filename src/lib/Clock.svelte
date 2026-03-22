<script>
  import { onDestroy, onMount } from "svelte";
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
  let interval;

  function pad(value) {
    return value.toString().padStart(2, "0");
  }

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

  function syncClock() {
    date = new Date();
    dayOrNight = date.getHours() >= 12 ? "PM" : "AM";
  }

  onMount(async () => {
    syncClock();
    interval = setInterval(syncClock, 1000);
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

  onDestroy(() => {
    clearInterval(interval);
  });
</script>

<section>
  <div class="clockWrapper">
    <p class="clockDisplay">
      {pad(hour)}:{pad(min)}:{pad(sec)}
      <span class="meridiem">{dayOrNight}</span>
      <span class="tooltip-wrapper">
        <span class="tooltip">
          <span class="tooltip-line tooltip-date">
            {pad(day)}. {pad(month)}. {year}
          </span>
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
    width: 5.6rem;
  }
  .clockWrapper {
    position: relative;
    display: inline-flex;
    margin: auto;
    width: 100%;
    background: none;
  }
  .clockDisplay {
    justify-content: center;
    gap: 0.28rem;
    width: 100%;
    font-size: 0.82rem;
    line-height: 1;
    font-family: ui-monospace, "SFMono-Regular", "SF Mono", Consolas, "Liberation Mono", Menlo, monospace;
    background: color-mix(in srgb, var(--surface-strong) 92%, black);
    border-radius: 999px;
    color: var(--surface-text);
    text-align: center;
    white-space: nowrap;
    padding: 0.52rem 0.5rem;
    margin: 0;
    min-width: 5.6rem;
    border: 1px solid color-mix(in srgb, var(--surface-text) 14%, transparent);
    font-variant-numeric: tabular-nums;
  }
  .meridiem {
    font-size: 0.62rem;
    letter-spacing: 0.08em;
    opacity: 0.72;
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
  .tooltip-date {
    margin-bottom: 0.45rem;
    padding-bottom: 0.45rem;
    border-bottom: 1px solid color-mix(in srgb, var(--surface-text) 16%, transparent);
  }
</style>
