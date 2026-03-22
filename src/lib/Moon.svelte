<script>
  let date = new Date();

  const PHASES = [
    {
      name: "New Moon",
      image: "/images/moon-new.svg",
    },
    {
      name: "Waxing Crescent",
      image: "/images/moon-waxing-crescent.svg",
    },
    {
      name: "First Quarter",
      image: "/images/moon-first-quarter.svg",
    },
    {
      name: "Waxing Gibbous",
      image: "/images/moon-waxing-gibbous.svg",
    },
    {
      name: "Full Moon",
      image: "/images/moon-full.svg",
    },
    {
      name: "Waning Gibbous",
      image: "/images/moon-waning-gibbous.svg",
    },
    {
      name: "Last Quarter",
      image: "/images/moon-third-quarter.svg",
    },
    {
      name: "Waning Crescent",
      image: "/images/moon-waning-crescent.svg",
    },
  ];

  const SYNODIC_MONTH = 29.530588853;
  const KNOWN_NEW_MOON_UTC = Date.UTC(2000, 0, 6, 18, 14, 0);

  function getMoonData(currentDate) {
    const lunarAge =
      (((currentDate.getTime() - KNOWN_NEW_MOON_UTC) / 86400000) %
        SYNODIC_MONTH +
        SYNODIC_MONTH) %
      SYNODIC_MONTH;

    const phaseIndex = Math.round((lunarAge / SYNODIC_MONTH) * 8) % 8;
    const illumination = ((1 - Math.cos((2 * Math.PI * lunarAge) / SYNODIC_MONTH)) / 2) * 100;
    const isWaxing = lunarAge <= SYNODIC_MONTH / 2;
    const daysUntilNext =
      phaseIndex === 0
        ? SYNODIC_MONTH - lunarAge
        : Math.abs(
            (((phaseIndex * SYNODIC_MONTH) / 8) % SYNODIC_MONTH) - lunarAge
          );

    return {
      ...PHASES[phaseIndex],
      phaseIndex,
      lunarAge,
      illumination,
      isWaxing,
      daysUntilNext,
    };
  }

  function roundTo(value, places = 1) {
    const power = 10 ** places;
    return Math.round(value * power) / power;
  }

  $: moon = getMoonData(date);

  $: details = [
    moon.name,
    `${moon.isWaxing ? "Waxing" : "Waning"} phase`,
    `Illumination ${roundTo(moon.illumination)}%`,
    `Lunar age ${roundTo(moon.lunarAge, 2)} days`,
    `Cycle position ${moon.phaseIndex + 1}/8`,
    `Next phase in about ${roundTo(moon.daysUntilNext, 1)} days`,
  ];
</script>

<svelte:head></svelte:head>

<section>
  <div class="moonWrapper">
    <div class="moonDisplay" style={`background-image:url(${moon.image})`}>
      <span class="moonTip">
        {#each details as line}
          <span class="tooltip-line">{line}</span>
        {/each}
      </span>
    </div>
  </div>
</section>

<style>
  section,
  .moonWrapper,
  .moonDisplay {
    display: flex;
    justify-content: center;
    align-items: center;
    background-repeat: no-repeat;
    background-position: center;
  }

  section {
    overflow: visible;
    min-width: 10%;
    width: 3.5rem;
  }

  .moonWrapper {
    position: relative;
    display: inline-flex;
    margin: auto;
    width: 100%;
  }

  .moonDisplay {
    position: relative;
    width: 100%;
    min-height: 50px;
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
  }

  .moonTip {
    position: absolute;
    visibility: hidden;
    right: 0;
    top: calc(100% + 0.35rem);
    margin: 3px;
    padding: 10px;
    border-radius: 0.75rem;
    min-width: max-content;
    background: var(--surface-strong);
    color: var(--surface-text);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.28);
    pointer-events: none;
    border: 1px solid color-mix(in srgb, var(--surface-text) 14%, transparent);
  }

  .moonDisplay:hover .moonTip {
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
