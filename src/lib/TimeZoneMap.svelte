<script>
  import { onDestroy, onMount } from "svelte";

  const ZONE_OVERLAYS = [
    { zone: "America/Los_Angeles", label: "Pacific", region: "North America West", offsetHint: "UTC-8 / UTC-7", points: "38,76 86,66 95,96 58,111 34,97", badgeX: 66, badgeY: 88 },
    { zone: "America/Denver", label: "Mountain", region: "North America Interior", offsetHint: "UTC-7 / UTC-6", points: "88,64 134,58 140,94 98,106 94,95", badgeX: 114, badgeY: 82 },
    { zone: "America/Chicago", label: "Central", region: "North America Central", offsetHint: "UTC-6 / UTC-5", points: "136,60 176,56 184,92 142,104", badgeX: 160, badgeY: 80 },
    { zone: "America/New_York", label: "Eastern", region: "North America East", offsetHint: "UTC-5 / UTC-4", points: "176,58 212,64 220,96 184,90", badgeX: 198, badgeY: 82 },
    { zone: "America/Sao_Paulo", label: "Brazil", region: "South America", offsetHint: "UTC-3", points: "168,124 222,132 232,198 180,212 154,168", badgeX: 198, badgeY: 166 },
    { zone: "UTC", label: "UTC", region: "Atlantic", offsetHint: "UTC+0", points: "244,62 278,58 282,198 246,208", badgeX: 262, badgeY: 136 },
    { zone: "Europe/London", label: "London", region: "Western Europe", offsetHint: "UTC+0 / UTC+1", points: "292,48 316,44 318,76 294,80", badgeX: 306, badgeY: 62 },
    { zone: "Europe/Berlin", label: "Berlin", region: "Central Europe", offsetHint: "UTC+1 / UTC+2", points: "318,48 348,46 350,82 320,84", badgeX: 334, badgeY: 64 },
    { zone: "Europe/Prague", label: "Prague", region: "Czech Republic", offsetHint: "UTC+1 / UTC+2", points: "328,56 340,55 342,68 330,70", badgeX: 336, badgeY: 63 },
    { zone: "Africa/Johannesburg", label: "Johannesburg", region: "Southern Africa", offsetHint: "UTC+2", points: "308,112 360,118 370,206 322,214 292,170", badgeX: 336, badgeY: 168 },
    { zone: "Asia/Dubai", label: "Dubai", region: "Arabian Peninsula", offsetHint: "UTC+4", points: "372,64 410,66 416,102 380,106", badgeX: 394, badgeY: 84 },
    { zone: "Asia/Kolkata", label: "India", region: "Indian Subcontinent", offsetHint: "UTC+5:30", points: "420,72 456,78 460,122 426,126 412,96", badgeX: 438, badgeY: 98 },
    { zone: "Asia/Bangkok", label: "Bangkok", region: "Southeast Asia", offsetHint: "UTC+7", points: "462,70 520,78 520,130 466,130", badgeX: 492, badgeY: 100 },
    { zone: "Asia/Tokyo", label: "Tokyo", region: "Japan", offsetHint: "UTC+9", points: "542,62 582,70 586,120 548,116", badgeX: 564, badgeY: 90 },
    { zone: "Australia/Sydney", label: "Sydney", region: "Australia East", offsetHint: "UTC+10 / UTC+11", points: "534,156 604,162 612,214 546,222 520,186", badgeX: 572, badgeY: 190 },
    { zone: "Pacific/Auckland", label: "Auckland", region: "New Zealand", offsetHint: "UTC+12 / UTC+13", points: "620,178 654,188 646,230 616,220", badgeX: 636, badgeY: 206 },
  ];

  export let title = "Interactive time zone map";
  export let eyebrow = "Time tool";
  export let lede = "Click a zone overlay to inspect its current local time.";
  export let showHero = true;

  let now = new Date();
  let timer;
  let selectedZone = "Europe/Prague";

  function getOffsetLabel(zone, date) {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: zone,
      timeZoneName: "shortOffset",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    const offsetPart = formatter
      .formatToParts(date)
      .find((part) => part.type === "timeZoneName")?.value;

    return offsetPart?.replace("GMT", "UTC") ?? "UTC";
  }

  function formatTime(zone, date) {
    return new Intl.DateTimeFormat("en-GB", {
      timeZone: zone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(date);
  }

  function formatDate(zone, date) {
    return new Intl.DateTimeFormat("en-GB", {
      timeZone: zone,
      weekday: "long",
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  }

  function formatLocalTime(date) {
    return new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(date);
  }

  $: overlays = ZONE_OVERLAYS.map((overlay) => ({
    ...overlay,
    time: formatTime(overlay.zone, now),
    date: formatDate(overlay.zone, now),
    offset: getOffsetLabel(overlay.zone, now),
  }));

  $: activeOverlay =
    overlays.find((overlay) => overlay.zone === selectedZone) ?? overlays[0];

  onMount(() => {
    timer = setInterval(() => {
      now = new Date();
    }, 1000);
  });

  onDestroy(() => {
    clearInterval(timer);
  });
</script>

<section class="page">
  {#if showHero}
    <header class="hero">
      <div>
        <p class="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p class="lede">{lede}</p>
      </div>
      <div class="hero-meta">
        <span>Local machine</span>
        <strong>{formatLocalTime(now)}</strong>
      </div>
    </header>
  {/if}

  <section class="workspace">
    <div class="map-panel">
      <svg class="zone-map" viewBox="0 0 680 260" aria-label="Interactive time zone map">
        <defs>
          <linearGradient id="ocean" x1="0%" x2="100%" y1="0%" y2="100%">
            <stop offset="0%" stop-color="#0f172a"></stop>
            <stop offset="100%" stop-color="#172554"></stop>
          </linearGradient>
          <linearGradient id="land" x1="0%" x2="0%" y1="0%" y2="100%">
            <stop offset="0%" stop-color="#84cc16"></stop>
            <stop offset="100%" stop-color="#365314"></stop>
          </linearGradient>
        </defs>

        <rect x="0" y="0" width="680" height="260" rx="24" fill="url(#ocean)"></rect>

        <g class="graticule" aria-hidden="true">
          {#each [85, 170, 255, 340, 425, 510, 595] as x}
            <line x1={x} y1="18" x2={x} y2="242"></line>
          {/each}
          {#each [65, 130, 195] as y}
            <line x1="20" y1={y} x2="660" y2={y}></line>
          {/each}
        </g>

        <g class="landmass" aria-hidden="true">
          <path d="M42,74 C70,42 124,40 162,52 C180,58 198,68 210,84 C188,98 172,108 148,112 C114,118 76,116 48,104 Z"></path>
          <path d="M168,126 C196,118 224,126 238,146 C236,178 228,202 204,216 C182,204 172,184 166,158 Z"></path>
          <path d="M294,44 C330,34 374,38 406,56 C392,70 374,80 350,84 C326,88 308,80 294,68 Z"></path>
          <path d="M318,98 C346,92 374,100 392,124 C394,158 380,196 350,220 C328,202 312,172 304,140 Z"></path>
          <path d="M404,76 C444,54 504,52 556,72 C574,86 586,102 594,120 C566,126 540,126 514,120 C482,112 448,106 418,100 Z"></path>
          <path d="M532,162 C564,156 596,162 614,178 C608,208 590,222 560,224 C540,210 530,190 528,172 Z"></path>
        </g>

        {#each overlays as overlay}
          <g class="zone-overlay">
            <polygon
              class:selected={overlay.zone === activeOverlay.zone}
              points={overlay.points}
              on:click={() => (selectedZone = overlay.zone)}
              on:keydown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  selectedZone = overlay.zone;
                }
              }}
              tabindex="0"
              role="button"
              aria-label={`Show current time in ${overlay.label}`}
            ></polygon>
            <text x={overlay.badgeX} y={overlay.badgeY}>{overlay.label}</text>
          </g>
        {/each}
      </svg>
    </div>

    <aside class="detail-panel">
      <p class="eyebrow">Selected zone</p>
      <h2>{activeOverlay.label}</h2>
      <p class="zone-region">{activeOverlay.region}</p>

      <div class="time-card">
        <span class="offset">{activeOverlay.offset}</span>
        <div class="time">{activeOverlay.time}</div>
        <div class="date">{activeOverlay.date}</div>
      </div>

      <div class="meta-grid">
        <div>
          <span class="meta-label">IANA zone</span>
          <strong>{activeOverlay.zone}</strong>
        </div>
        <div>
          <span class="meta-label">Typical range</span>
          <strong>{activeOverlay.offsetHint}</strong>
        </div>
      </div>

      <div class="chip-row">
        {#each overlays as overlay}
          <button
            type="button"
            class:active={overlay.zone === activeOverlay.zone}
            on:click={() => (selectedZone = overlay.zone)}
          >
            {overlay.label}
          </button>
        {/each}
      </div>
    </aside>
  </section>
</section>

<style>
  .page {
    display: grid;
    gap: 1.5rem;
  }

  .hero,
  .map-panel,
  .detail-panel {
    display: grid;
    gap: 1rem;
    padding: 1.25rem;
    border-radius: 1rem;
    background: rgba(255, 255, 255, 0.82);
    box-shadow: inset 0 0 0 1px rgba(15, 23, 42, 0.08);
  }

  .hero {
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: end;
  }

  .workspace {
    display: grid;
    grid-template-columns: minmax(0, 1.65fr) minmax(18rem, 0.95fr);
    gap: 1.5rem;
  }

  .eyebrow,
  .lede,
  h1,
  h2,
  p {
    margin: 0;
  }

  .eyebrow {
    margin-bottom: 0.35rem;
    font-size: 0.8rem;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    opacity: 0.68;
  }

  .hero-meta {
    display: grid;
    justify-items: end;
    gap: 0.15rem;
  }

  .hero-meta span {
    font-size: var(--font-size-1);
    opacity: 0.68;
  }

  .hero-meta strong,
  .time {
    font-family: ui-monospace, "SFMono-Regular", "SF Mono", Consolas, "Liberation Mono", Menlo, monospace;
    font-variant-numeric: tabular-nums;
  }

  .zone-map {
    width: 100%;
    height: auto;
    display: block;
  }

  .graticule line {
    stroke: rgba(255, 255, 255, 0.1);
    stroke-width: 1;
  }

  .landmass path {
    fill: url(#land);
    opacity: 0.34;
  }

  .zone-overlay polygon {
    fill: rgba(96, 165, 250, 0.22);
    stroke: rgba(191, 219, 254, 0.48);
    stroke-width: 1.5;
    cursor: pointer;
    transition:
      fill 0.2s ease,
      transform 0.2s ease,
      stroke 0.2s ease;
  }

  .zone-overlay polygon:hover,
  .zone-overlay polygon:focus-visible,
  .zone-overlay polygon.selected {
    fill: rgba(251, 191, 36, 0.4);
    stroke: rgba(254, 240, 138, 0.95);
    outline: none;
  }

  .zone-overlay text {
    fill: rgba(255, 255, 255, 0.9);
    font-size: 11px;
    text-anchor: middle;
    pointer-events: none;
    letter-spacing: 0.04em;
  }

  .zone-region {
    opacity: 0.72;
  }

  .time-card {
    display: grid;
    gap: 0.35rem;
    padding: 1rem;
    border-radius: 1rem;
    background: rgba(15, 23, 42, 0.06);
  }

  .offset,
  .date {
    opacity: 0.7;
  }

  .time {
    font-size: clamp(2rem, 5vw, 3rem);
    line-height: 1;
  }

  .meta-grid {
    display: grid;
    gap: 0.8rem;
  }

  .meta-grid > div {
    display: grid;
    gap: 0.2rem;
  }

  .meta-label {
    font-size: var(--font-size-1);
    opacity: 0.64;
  }

  .chip-row {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .chip-row button {
    border: 0;
    border-radius: 999px;
    padding: 0.5rem 0.8rem;
    font: inherit;
    background: rgba(15, 23, 42, 0.08);
    cursor: pointer;
  }

  .chip-row button.active {
    background: var(--main-color);
    color: white;
  }

  @media (max-width: 900px) {
    .workspace,
    .hero {
      grid-template-columns: 1fr;
    }
  }
</style>
