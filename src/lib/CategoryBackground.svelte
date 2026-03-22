<script>
  import { getCategoryTheme } from "$lib/h808";

  export let code = "400";
  export let title = "";
  export let subtitle = "";
  export let compact = false;
  export let showLegend = undefined;

  function polygonPoints(sides, radius, cx, cy, rotation = 0) {
    return Array.from({ length: sides }, (_, index) => {
      const angle = ((Math.PI * 2) / sides) * index - Math.PI / 2 + rotation;
      const x = cx + Math.cos(angle) * radius;
      const y = cy + Math.sin(angle) * radius;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    }).join(" ");
  }

  $: theme = getCategoryTheme(code);
  $: legendVisible = showLegend ?? !compact;
  $: nodeCount = compact ? Math.max(4, theme.density - 1) : theme.density + 2;
  $: nodes = Array.from({ length: nodeCount }, (_, index) => {
    const angle = ((theme.seed * (index + 3)) % 360) * (Math.PI / 180);
    const radius = 38 + index * (compact ? 12 : 16);
    const size = 8 + ((theme.seed + index * 11) % (compact ? 12 : 18));
    const x = 120 + Math.cos(angle) * radius;
    const y = 120 + Math.sin(angle) * radius;

    return {
      x,
      y,
      size,
      sides: 3 + ((theme.category + index) % 5),
      rotation:
        ((theme.rotationOffset + index * 19) % 360) * (Math.PI / 180),
      duration: `${theme.animationSeconds + index * 0.8}s`,
      delay: `${index * 0.45}s`,
    };
  });
</script>

<div
  class:compact
  class="background"
  style={`--primary:${theme.primary}; --secondary:${theme.secondary}; --accent:${theme.accent}; --surface:${theme.surface}; --glow:${theme.glow}; --rotation:${theme.rotationOffset}deg; --duration:${theme.animationSeconds}s; --pulse:${theme.pulseSeconds}s; --tilt:${theme.gridTilt}deg; --stripe:${theme.stripeOffset}%;`}
>
  <div class="wash"></div>
  <div class="grid"></div>
  <div class="beams"></div>

  <svg
    class="scene"
    viewBox="0 0 240 240"
    aria-hidden="true"
    preserveAspectRatio="xMidYMid slice"
  >
    <defs>
      <radialGradient id={`glow-${theme.code}`}>
        <stop offset="0%" stop-color={theme.accent} stop-opacity="0.95"></stop>
        <stop offset="55%" stop-color={theme.secondary} stop-opacity="0.35"></stop>
        <stop offset="100%" stop-color={theme.primary} stop-opacity="0"></stop>
      </radialGradient>
    </defs>

    <circle
      class="halo"
      cx="120"
      cy="120"
      r={compact ? 42 : 56}
      fill={`url(#glow-${theme.code})`}
    ></circle>

    {#each Array.from({ length: theme.orbitCount }, (_, index) => index) as orbit}
      <circle
        class="orbit"
        cx="120"
        cy="120"
        r={60 + orbit * theme.orbitSpread}
        stroke-dasharray={orbit % 2 === 0 ? "5 7" : "11 9"}
      ></circle>
    {/each}

    {#each nodes as node}
      <polygon
        class="node"
        points={polygonPoints(node.sides, node.size, node.x, node.y, node.rotation)}
        style={`--node-duration:${node.duration}; --node-delay:${node.delay};`}
      ></polygon>
    {/each}

    <polygon
      class="emblem"
      points={polygonPoints(
        theme.emblemSides,
        compact ? 34 : 44,
        120,
        120,
        (theme.rotationOffset * Math.PI) / 180
      )}
    ></polygon>
    <polygon
      class="emblem inner"
      points={polygonPoints(
        Math.max(3, theme.emblemSides - 1),
        compact ? 18 : 24,
        120,
        120,
        ((theme.rotationOffset + 12) * Math.PI) / 180
      )}
    ></polygon>
  </svg>

  {#if legendVisible}
    <div class="legend">
      <span class="code">{theme.code}</span>
      {#if title}
        <h1>{title}</h1>
      {/if}
      {#if subtitle}
        <p>{subtitle}</p>
      {/if}
    </div>
  {/if}
</div>

<style>
  .background {
    position: absolute;
    inset: 0;
    overflow: hidden;
    background:
      radial-gradient(circle at 20% 20%, var(--glow), transparent 35%),
      radial-gradient(circle at 80% 15%, color-mix(in srgb, var(--accent) 25%, transparent), transparent 30%),
      linear-gradient(145deg, var(--surface), color-mix(in srgb, var(--surface) 70%, black));
  }

  .compact {
    border-radius: 1.5rem;
  }

  .wash,
  .grid,
  .beams,
  .scene,
  .legend {
    position: absolute;
    inset: 0;
  }

  .wash {
    background:
      radial-gradient(circle at 50% 50%, color-mix(in srgb, var(--secondary) 18%, transparent), transparent 40%),
      linear-gradient(120deg, transparent 10%, color-mix(in srgb, var(--primary) 30%, transparent) 50%, transparent 90%);
    animation: drift calc(var(--duration) * 1s) linear infinite alternate;
  }

  .grid {
    inset: -20%;
    background-image:
      linear-gradient(color-mix(in srgb, var(--accent) 11%, transparent) 1px, transparent 1px),
      linear-gradient(90deg, color-mix(in srgb, var(--accent) 11%, transparent) 1px, transparent 1px);
    background-size: 32px 32px;
    transform: rotate(var(--tilt));
    opacity: 0.32;
  }

  .beams {
    background:
      linear-gradient(
        135deg,
        transparent calc(var(--stripe) - 10%),
        color-mix(in srgb, var(--primary) 30%, transparent) var(--stripe),
        transparent calc(var(--stripe) + 12%)
      );
    transform: translateX(-8%);
    animation: scan calc(var(--duration) * 1.3s) ease-in-out infinite;
  }

  .scene {
    width: 100%;
    height: 100%;
  }

  .halo {
    animation: pulse calc(var(--pulse) * 1s) ease-in-out infinite;
  }

  .orbit {
    fill: none;
    stroke: color-mix(in srgb, var(--secondary) 60%, white);
    stroke-width: 0.9;
    opacity: 0.45;
    transform-origin: 120px 120px;
    animation: spin calc(var(--duration) * 1s) linear infinite;
  }

  .node {
    fill: color-mix(in srgb, var(--primary) 70%, var(--accent));
    stroke: color-mix(in srgb, var(--accent) 80%, white);
    stroke-width: 0.8;
    transform-origin: center;
    animation: bob var(--node-duration) ease-in-out infinite;
    animation-delay: var(--node-delay);
  }

  .emblem {
    fill: color-mix(in srgb, var(--primary) 28%, transparent);
    stroke: var(--accent);
    stroke-width: 1.2;
    transform-origin: 120px 120px;
    animation: spin calc(var(--duration) * 1s) linear infinite reverse;
  }

  .emblem.inner {
    fill: color-mix(in srgb, var(--secondary) 38%, transparent);
    stroke: color-mix(in srgb, var(--accent) 70%, white);
    animation-duration: calc(var(--duration) * 0.75s);
  }

  .legend {
    inset: auto 0 0 0;
    padding: 1.5rem;
    background: linear-gradient(180deg, transparent, rgba(0, 0, 0, 0.58));
    color: white;
  }

  .legend h1,
  .legend p {
    margin: 0;
  }

  .code {
    display: inline-flex;
    margin-bottom: 0.5rem;
    padding: 0.35rem 0.65rem;
    border: 1px solid color-mix(in srgb, var(--accent) 40%, white);
    border-radius: 999px;
    background: rgba(0, 0, 0, 0.24);
    letter-spacing: 0.18em;
    font-size: 0.78rem;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes pulse {
    0%,
    100% {
      transform: scale(0.94);
      opacity: 0.55;
    }
    50% {
      transform: scale(1.08);
      opacity: 0.95;
    }
  }

  @keyframes bob {
    0%,
    100% {
      transform: translateY(0px) rotate(0deg);
    }
    50% {
      transform: translateY(-6px) rotate(8deg);
    }
  }

  @keyframes drift {
    from {
      transform: translate3d(-2%, -1%, 0) scale(1);
    }
    to {
      transform: translate3d(2%, 2%, 0) scale(1.04);
    }
  }

  @keyframes scan {
    0%,
    100% {
      transform: translateX(-10%);
      opacity: 0.28;
    }
    50% {
      transform: translateX(10%);
      opacity: 0.52;
    }
  }
</style>
