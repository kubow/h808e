<script>
  export let data_set = [];

  function getHref(item) {
    return item.href || item.ref || "";
  }

  function isExternal(href) {
    return /^(https?:)?\/\//i.test(href);
  }
</script>

<div class="cards-list">
  {#each data_set as item}
    {@const href = getHref(item)}
    {@const external = isExternal(href)}

    {#if href}
      <a
        class="card-link"
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer" : undefined}
      >
        <article class="card">
          <div class="card_image">
            {#if item.image}
              <img src={item.image} alt={item.title || "card preview"} loading="lazy" />
            {:else}
              <div class="card_placeholder" aria-hidden="true"></div>
            {/if}
          </div>
          <div class="card_overlay"></div>
          <div class="card_title">
            <p>{item.title}</p>
            {#if item.content}
              <span>{item.content}</span>
            {/if}
          </div>
        </article>
      </a>
    {:else}
      <article class="card card-static">
        <div class="card_image">
          {#if item.image}
            <img src={item.image} alt={item.title || "card preview"} loading="lazy" />
          {:else}
            <div class="card_placeholder" aria-hidden="true"></div>
          {/if}
        </div>
        <div class="card_overlay"></div>
        <div class="card_title">
          <p>{item.title}</p>
          {#if item.content}
            <span>{item.content}</span>
          {/if}
        </div>
      </article>
    {/if}
  {/each}
</div>

<style>
  .cards-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    width: 100%;
  }

  .card-link {
    display: block;
    color: inherit;
    text-decoration: none;
  }

  .card {
    position: relative;
    overflow: hidden;
    width: 100%;
    aspect-ratio: 1 / 1;
    border-radius: 2rem;
    background: rgba(255, 255, 255, 0.16);
    box-shadow:
      0 18px 36px rgba(15, 23, 42, 0.24),
      inset 0 0 0 1px rgba(255, 255, 255, 0.18);
    transition:
      transform 0.32s ease,
      box-shadow 0.32s ease,
      filter 0.32s ease;
  }

  .card-link:hover .card,
  .card-link:focus-visible .card,
  .card-static:hover {
    transform: translateY(-8px);
    box-shadow:
      0 24px 48px rgba(15, 23, 42, 0.3),
      inset 0 0 0 1px rgba(255, 255, 255, 0.24);
    filter: saturate(1.08);
  }

  .card-link:focus-visible {
    outline: none;
  }

  .card_image,
  .card_image img,
  .card_placeholder {
    width: 100%;
    height: 100%;
  }

  .card_image img,
  .card_placeholder {
    object-fit: cover;
  }

  .card_placeholder {
    position: relative;
    background:
      radial-gradient(circle at 52% 20%, rgba(255, 224, 157, 0.94), transparent 18%),
      linear-gradient(180deg, #405ec7 0%, #7944ae 28%, #d23b8b 58%, #ff9d7b 79%, #382d78 100%);
  }

  .card_placeholder::before,
  .card_placeholder::after {
    content: "";
    position: absolute;
    inset: auto 0 0 0;
  }

  .card_placeholder::before {
    height: 58%;
    background: linear-gradient(180deg, rgba(59, 32, 112, 0.08), rgba(67, 35, 112, 0.95));
    clip-path: polygon(0 100%, 0 52%, 10% 44%, 20% 50%, 31% 33%, 42% 47%, 55% 30%, 70% 45%, 84% 31%, 100% 42%, 100% 100%);
  }

  .card_placeholder::after {
    height: 44%;
    background: linear-gradient(180deg, rgba(30, 21, 74, 0.1), rgba(45, 36, 106, 0.96));
    clip-path: polygon(0 100%, 0 68%, 16% 57%, 26% 63%, 37% 54%, 48% 71%, 61% 52%, 75% 61%, 88% 56%, 100% 48%, 100% 100%);
  }

  .card_overlay {
    position: absolute;
    inset: 0;
    background:
      linear-gradient(180deg, rgba(10, 14, 30, 0.03) 28%, rgba(10, 14, 30, 0.76) 100%),
      radial-gradient(circle at top right, rgba(255, 255, 255, 0.14), transparent 30%);
  }

  .card_title {
    position: absolute;
    inset: auto 0 0 0;
    display: grid;
    gap: 0.45rem;
    padding: 1.2rem 1.25rem 1.3rem;
    color: white;
    text-shadow: 0 2px 14px rgba(0, 0, 0, 0.55);
  }

  .card_title p,
  .card_title span {
    margin: 0;
  }

  .card_title p {
    font-size: clamp(1.4rem, 2vw, 2.15rem);
    line-height: 0.98;
    font-weight: 700;
  }

  .card_title span {
    display: -webkit-box;
    overflow: hidden;
    max-width: 28ch;
    font-size: var(--font-size-1);
    line-height: 1.45;
    opacity: 0.92;
    line-clamp: 3;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }

  @media (max-width: 700px) {
    .cards-list {
      grid-template-columns: 1fr;
      gap: 1rem;
    }

    .card {
      aspect-ratio: 1.08 / 1;
      border-radius: 1.6rem;
    }
  }
</style>
