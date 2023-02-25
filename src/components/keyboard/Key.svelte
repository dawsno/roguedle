<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { Settings } from "../../utils";
  export let letter: string;
  export let state: LetterState = "🔳";

  var temp = new Settings(localStorage.getItem("settings"));
  let colorMode: boolean = temp.colorblind;
  let present = colorMode
    ? "../../../public/tiles/slotBlue.png"
    : "../../../public/tiles/slotYellow.png";
  let correct = colorMode
    ? "../../../public/tiles/slotRed.png"
    : "../../../public/tiles/slotGreen.png";
  const dispatch = createEventDispatcher();
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
  class={state}
  class:big={letter.length !== 1}
  on:click={() => dispatch("keystroke", letter)}
>
  {letter}<slot />
</div>

<style>
  div {
    font-size: min(2em, 4vw);
    font-weight: bold;
    text-transform: uppercase;
    -webkit-text-stroke: 2px black;
    color: white;
    border-radius: 4px;
    height: 4em;
    max-width: max(3em, 3vw);
    max-width: 2em;
    max-height: 2em;
    background: var(--key-bg);
    cursor: pointer;
    display: grid;
    place-items: center;
    flex: 1;
    background: url("../../../public/tiles/slotGrey.png");
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    transition: background-color 0.3s ease-in-out;
  }
  :global(.guesses) div {
    transition-delay: 1s;
  }
  :global(.guesses .preventChange) div {
    transition-duration: 0.15s;
    transition-delay: 0s;
    background: var(--key-bg) !important;
  }
  .big {
    font-size: auto;
    max-width: max(3.75em, 5vw);
    max-height: 2em;
    height: 4em;
  }
  .⬛ {
    background: url("../../../public/tiles/slotDarkGrey.png");
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
  }
  .🟨 {
    background-image: var(--color-present);
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
  }
  .🟩 {
    background: var(--color-correct);
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
  }
</style>
