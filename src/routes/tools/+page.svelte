<script>
  const tools = [
    {
      href: "/tools/calc",
      title: "Planet Position Calculator",
      summary: "Standalone calculator tool from the static asset bundle.",
    },
    {
      href: "/tools/astro",
      title: "Astronomy",
      summary: "Astronomy entry point with local planet datasets and chart preview.",
    },
    {
      href: "/tools/map",
      title: "Maps",
      summary: "Mapping experiments and geographic views.",
    },
    {
      href: "/tools/time",
      title: "Time",
      summary: "Interactive time zone map with clickable overlays.",
    },
  ];
</script>

<svelte:head>
  <title>Tools</title>
</svelte:head>

<section class="tools">
  {#each tools as tool}
    <a class="tool" href={tool.href}>
      <h2>{tool.title}</h2>
      <p>{tool.summary}</p>
    </a>
  {/each}
</section>

<style>
  .tools {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 1.5rem;
    padding: 1.5rem;
  }

  .tool {
    display: grid;
    gap: 0.75rem;
    padding: 1.25rem;
    border-radius: 1rem;
    text-decoration: none;
    color: inherit;
    background: rgba(255, 255, 255, 0.72);
    box-shadow: inset 0 0 0 1px rgba(15, 23, 42, 0.08);
  }

  .tool h2,
  .tool p {
    margin: 0;
  }
</style>
