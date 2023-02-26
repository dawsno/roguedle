<script lang="ts">
  import { mode } from "../../../stores";
  import { COLS, modeData, Stats } from "../../../utils";

  import Stat from "./Stat.svelte";
  export let data: Stats;

  let stats: [string, string | number][];
  $: {
    stats = [
      ["word", data.streak],
      ["level", COLS - 4],
    ];
  }
</script>

<h3>Statistics ({modeData.modes[$mode].name})</h3>
<div>
  {#each stats as stat}
    <Stat name={stat[0]} stat={stat[1]} />
  {/each}
</div>

<style>
  div {
    display: flex;
    justify-content: center;
    gap: 8px;
  }
</style>
