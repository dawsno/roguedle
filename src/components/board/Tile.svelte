<script lang="ts">
  import { onDestroy } from "svelte";

  import { mode } from "../../stores";

  import { DELAY_INCREMENT, ROWS } from "../../utils";

  export let value = "";
  export let state: LetterState;
  export let position = 0;
  export function bounce() {
    setTimeout(
      () => (animation = "bounce"),
      (ROWS + position) * DELAY_INCREMENT
    );
  }
  let s: string;
  let pop = false;
  let animation = "";

  // reset animation when value changes, because for some reason changing anination to "" when the game is over causes the tiles to flash
  $: !value && (animation = "");

  // ensure all animations play
  const unsub = mode.subscribe(() => {
    animation = "";
    s = "🔳";
    setTimeout(() => (s = ""), 10);
  });
  // prevent pop animation from playing at the beginning
  setTimeout(() => (pop = true), 200);

  onDestroy(unsub);
</script>

<div
  data-animation={animation}
  class:value
  class:pop
  class="tile {state} {s}"
  style="transition-delay: {position * DELAY_INCREMENT}ms"
>
  <div class="front">{value}</div>
  <div class="back">{value}</div>
</div>

<style lang="scss">
  :not(.pop),
  :global(.complete) .value {
    scale: 1 !important;
    opacity: 1 !important;
  }
  .value {
    animation: pop 0.1s;
    .front {
      border-color: var(--border-primary);
    }
  }
  @font-face {
    font-family: NerkoOne;
    src: url("../../../public/fonts/NerkoOne-Regular.eot")
        format("embedded-opentype"),
      url("../../../public/fonts/NerkoOne-Regular.eot"),
      url("../../../public/fonts/NerkoOne-Regular.ttf") format("truetype"),
      url("../../../public/fonts/NerkoOne-Regular.woff2") format("woff2"),
      url("../../../public/fonts/NerkoOne-Regular.woff") format("woff"),
      url("../../../public/fonts/NerkoOne-Regular.svg#NeroOne-Regular")
        format("svg");
  }
  .tile {
    color: black;
    text-align: center;
    vertical-align: middle;
    -webkit-text-stroke: 1px #fff9e1;
    font-size: min(6vw, 3rem);
    //font-weight: bold;
    text-transform: uppercase;
    position: relative;
    transform-style: preserve-3d;
    font-family: "NerkoOne";
    &[data-animation="bounce"] {
      animation: bounce 1s;
    }
  }
  .back,
  .front {
    border-radius: min(7px, 1vw);
    display: grid;
    place-items: center;
    position: absolute;
    inset: 0;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    transition: transform 0s ease-in-out;
  }
  .front {
    border: 2px solid var(--border-primary);
    background: none;
    transform: rotateX(0deg);
  }
  .back {
    background: url("../../../public/tiles/slotDarkGrey.png");
    background-size: 100%;
    transform: rotateX(180deg);
  }
  .🟩 .back {
    background: var(--color-correct);
    background-size: 100%;
    background-color: transparent;
  }
  .🟨 .back {
    background: var(--color-present);
    background-size: 100%;
    background-color: transparent;
  }
  :global(.complete) .tile:not(.🔳) .front {
    transition-delay: inherit !important;
    transition-duration: 0.8s;
    transform: rotateX(180deg);
  }
  :global(.complete) .tile:not(.🔳) .back {
    transition-delay: inherit !important;
    transition-duration: 0.8s;
    transform: rotateX(0deg);
  }
  @keyframes pop {
    from {
      scale: 0.8;
      opacity: 0;
    }

    40% {
      scale: 1.1;
      opacity: 1;
    }
  }
  @keyframes bounce {
    0%,
    20% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-30px);
    }
    50% {
      transform: translateY(5px);
    }
    60% {
      transform: translateY(-15px);
    }
    80% {
      transform: translateY(2px);
    }
    100% {
      transform: translateY(0);
    }
  }
</style>
