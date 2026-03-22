<script>
  export let datasets = [];
</script>

{#if datasets.length > 0}
  <section class="datasets">
    <div class="heading">
      <h2>Structured content</h2>
      <p>CSV-derived JSON mapped to this category.</p>
    </div>

    {#each datasets as dataset}
      <section class="dataset">
        <div class="dataset-head">
          <div>
            <h3>{dataset.title}</h3>
            <p>{dataset.description}</p>
          </div>
          <span>{dataset.count} records</span>
        </div>

        <div class="grid">
          {#each dataset.items as item}
            {#if item.href}
              <a class="card" href={item.href} target="_blank" rel="noreferrer">
                <strong>{item.title}</strong>
                <span>{item.summary}</span>
              </a>
            {:else}
              <article class="card">
                <strong>{item.title}</strong>
                <span>{item.summary}</span>
              </article>
            {/if}
          {/each}
        </div>
      </section>
    {/each}
  </section>
{/if}

<style>
  .datasets {
    display: grid;
    gap: 1.5rem;
  }

  .heading,
  .dataset {
    padding: 0 1.5rem;
  }

  .heading h2,
  .heading p,
  .dataset-head h3,
  .dataset-head p {
    margin: 0;
  }

  .heading p,
  .dataset-head p {
    opacity: 0.72;
  }

  .dataset {
    display: grid;
    gap: 1rem;
  }

  .dataset-head {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    align-items: end;
  }

  .dataset-head span {
    font-size: var(--font-size-1);
    opacity: 0.7;
    white-space: nowrap;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 1rem;
  }

  .card {
    display: grid;
    gap: 0.45rem;
    min-height: 6.5rem;
    padding: 1rem;
    border-radius: 1rem;
    background: rgba(255, 255, 255, 0.72);
    box-shadow: inset 0 0 0 1px rgba(15, 23, 42, 0.08);
    color: inherit;
    text-decoration: none;
  }

  .card strong {
    font-size: var(--font-size-2);
  }

  .card span {
    line-height: 1.5;
    opacity: 0.78;
  }
</style>
