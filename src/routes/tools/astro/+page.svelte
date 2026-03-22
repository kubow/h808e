<script>
  const series = [
    { id: "jup_lon", label: "Jupiter longitude" },
    { id: "sat_lon", label: "Saturn longitude" },
    { id: "urn_lon", label: "Uranus longitude" },
    { id: "npt_lon", label: "Neptune longitude" },
    { id: "plt_lon", label: "Pluto longitude" },
  ];

  export let data;

  let selectedSeries = "jup_lon";
  const sample = data.sample;

  $: values = sample.map((entry) => Number(entry[selectedSeries]));
  $: minValue = Math.min(...values);
  $: maxValue = Math.max(...values);
  $: range = Math.max(1, maxValue - minValue);
  $: chartPath = sample
    .map((entry, index) => {
      const x = (index / (sample.length - 1)) * 100;
      const y = 100 - ((Number(entry[selectedSeries]) - minValue) / range) * 100;
      return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");
</script>

<svelte:head>
  <title>Tools | Astronomy</title>
</svelte:head>

<section class="page">
  <header class="hero">
    <div>
      <p class="eyebrow">Astronomy tools</p>
      <h1>Planet data and chart entry point</h1>
      <p class="lede">
        This page is the astronomy tool hub. It links the calculator and keeps the
        planet dataset ready for a future Dygraphs-based chart view.
      </p>
    </div>
    <div class="actions">
      <a href="/tools/calc">Open calculator</a>
      <a href="/tools/calc">Open calculator tool</a>
    </div>
  </header>

  <section class="panel">
    <div class="panel-head">
      <div>
        <h2>Chart preview</h2>
        <p>Current lightweight preview from `src/lib/store/planets_test.json`.</p>
      </div>
      <div class="series-switcher">
        {#each series as option}
          <button
            type="button"
            class:active={selectedSeries === option.id}
            on:click={() => (selectedSeries = option.id)}
          >
            {option.label}
          </button>
        {/each}
      </div>
    </div>

    <div class="chart-shell">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="astro-line" x1="0%" x2="0%" y1="0%" y2="100%">
            <stop offset="0%" stop-color="#f7b267"></stop>
            <stop offset="100%" stop-color="#4f46e5"></stop>
          </linearGradient>
        </defs>
        <path class="grid-line" d="M 0 20 H 100"></path>
        <path class="grid-line" d="M 0 50 H 100"></path>
        <path class="grid-line" d="M 0 80 H 100"></path>
        <path class="series" d={chartPath}></path>
      </svg>
    </div>

    <div class="chart-meta">
      <span>{sample[0].date}</span>
      <span>{sample[sample.length - 1].date}</span>
    </div>
  </section>

  <section class="panel">
    <h2>Dygraphs hookup</h2>
    <p>
      The astronomy route now has a stable tool URL. When you add Dygraphs, this
      page is the place to load it against the local planet JSON series.
    </p>
    <ul>
      <li>Dataset: `src/lib/store/planets_test.json` for preview work</li>
      <li>Long-range datasets: `planets_BC1.json`, `planets_BC2.json`, `planets_AD1.json`, `planets_AD2.json`</li>
      <li>Immediate next step: replace the SVG preview with a dynamic Dygraphs mount</li>
    </ul>
  </section>
</section>

<style>
  .page {
    display: grid;
    gap: 1.5rem;
    padding: 1.5rem;
  }

  .hero,
  .panel {
    display: grid;
    gap: 1rem;
    padding: 1.25rem;
    border-radius: 1rem;
    background: rgba(255, 255, 255, 0.8);
    box-shadow: inset 0 0 0 1px rgba(15, 23, 42, 0.08);
  }

  .hero {
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: end;
  }

  .eyebrow {
    margin: 0 0 0.35rem;
    font-size: 0.8rem;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    opacity: 0.68;
  }

  .lede,
  h1,
  h2,
  p {
    margin: 0;
  }

  .actions {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  .actions a {
    padding: 0.7rem 1rem;
    border-radius: 999px;
    background: var(--main-color);
    color: white;
    text-decoration: none;
  }

  .panel-head {
    display: grid;
    gap: 1rem;
  }

  .series-switcher {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .series-switcher button {
    border: 0;
    border-radius: 999px;
    padding: 0.55rem 0.9rem;
    background: rgba(15, 23, 42, 0.08);
    cursor: pointer;
    font: inherit;
  }

  .series-switcher button.active {
    background: var(--main-color);
    color: white;
  }

  .chart-shell {
    overflow: hidden;
    border-radius: 1rem;
    background:
      radial-gradient(circle at top, rgba(247, 178, 103, 0.24), transparent 38%),
      linear-gradient(180deg, #0f172a 0%, #1e1b4b 100%);
    aspect-ratio: 16 / 6;
  }

  .chart-shell svg {
    width: 100%;
    height: 100%;
  }

  .grid-line {
    fill: none;
    stroke: rgba(255, 255, 255, 0.14);
    stroke-width: 0.35;
  }

  .series {
    fill: none;
    stroke: url(#astro-line);
    stroke-width: 1.4;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .chart-meta {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    font-size: 0.85rem;
    opacity: 0.72;
  }

  ul {
    margin: 0;
    padding-left: 1.2rem;
  }

  @media (max-width: 720px) {
    .hero {
      grid-template-columns: 1fr;
      align-items: start;
    }
  }
</style>
