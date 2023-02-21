<script lang="ts">
  import { COLS, ROWS } from "../../utils";

  import { Tile } from "../board";
  export let visible: boolean;
</script>

<h3>how to play</h3>
<div>Guess the word in {ROWS} tries.</div>
<div>Each guess must be a valid word. Hit the enter button to submit.</div>
<div>
  After each guess, the color of the tiles will change to show how close your
  guess was to the word.
</div>
<div>
  After every two correct words, you will be given the option to pick an
  artifact or get an extra guess. The word length will increase.
</div>
<div>You win by solving two 12 letter words.</div>
<div class:complete={visible} class="examples">
  <div><strong>Examples</strong></div>
  <div class="row">
    <Tile value="c" state="🟩" />
    <Tile value="i" state="⬛" />
    <Tile value="d" state="⬛" />
    <Tile value="e" state="⬛" />
    <Tile value="r" state="⬛" />
  </div>
  <div>
    The letter <strong>C</strong> is in the word and in the correct spot.
  </div>
  <div class="row">
    <Tile value="s" state="🟨" />
    <Tile value="n" state="⬛" />
    <Tile value="a" state="⬛" />
    <Tile value="c" state="⬛" />
    <Tile value="k" state="⬛" />
  </div>
  <div>The letter <strong>S</strong> is in the word but in the wrong spot.</div>
  <div class="row">
    <Tile value="v" state="⬛" />
    <Tile value="a" state="⬛" />
    <Tile value="g" state="⬛" />
    <Tile value="u" state="⬛" />
    <Tile value="e" state="⬛" />
  </div>
  <div>None of the letters are in the word in any spot.</div>
  <div class="row">
    <Tile value="c" state="🟩" />
    <Tile value="o" state="🟩" />
    <Tile value="o" state="🟩" />
    <Tile value="t" state="🟩" />
    <Tile value="s" state="🟩" />
  </div>
  <div>The word <strong>COOTS</strong> is correct.</div>
</div>

<style lang="scss">
  div {
    margin: 14px 0;
  }
  .examples {
    border-top: 1px solid var(--border-primary);
    border-bottom: 1px solid var(--border-primary);
    :global(.row > *) {
      height: 100%;
      aspect-ratio: 1;
    }
    &:not(.complete) :global(.row .back) {
      transition-delay: 0.3s;
    }
  }
  .row {
    height: 40px;
    display: flex;
    gap: 4px;
  }
</style>
