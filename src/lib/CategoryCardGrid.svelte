<script>
  import CategoryBackground from "$lib/CategoryBackground.svelte";

  export let items = [];
</script>

<section class="catalog">
  {#each items as item}
    <a class="card" href={item.href}>
      <div class="visual">
        <CategoryBackground
          code={item.code}
          title={item.area_cz}
          subtitle={item.folder}
          compact
        />
      </div>

      <div class="content">
        <div class="meta">
          <span>{item.code}</span>
          <span>{item.theme.label}</span>
        </div>
        <h2>{item.area_cz}</h2>
        <p>{item.summary}</p>
      </div>
    </a>
  {/each}
</section>

<style>
  .catalog {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1.5rem;
    padding: 1.5rem;
  }

  .card {
    display: flex;
    flex-direction: column;
    min-height: 22rem;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 1.5rem;
    overflow: hidden;
    text-decoration: none;
    color: inherit;
    background: rgba(6, 10, 18, 0.68);
    box-shadow: 0 20px 45px rgba(15, 23, 42, 0.28);
    transition:
      transform 180ms ease,
      box-shadow 180ms ease,
      border-color 180ms ease;
  }

  .card:hover,
  .card:focus-visible {
    transform: translateY(-4px);
    box-shadow: 0 28px 60px rgba(15, 23, 42, 0.34);
    border-color: rgba(255, 255, 255, 0.18);
  }

  .visual {
    position: relative;
    min-height: 14rem;
  }

  .content {
    display: grid;
    gap: 0.9rem;
    padding: 1.15rem 1.15rem 1.35rem;
  }

  .meta {
    display: flex;
    justify-content: space-between;
    gap: 0.75rem;
    font-size: 0.74rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    opacity: 0.72;
  }

  h2,
  p {
    margin: 0;
  }

  h2 {
    font-size: 1.3rem;
  }

  p {
    line-height: 1.55;
    opacity: 0.84;
  }
</style>
