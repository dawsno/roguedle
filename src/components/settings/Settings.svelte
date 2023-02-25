<script lang="ts">
  import { createEventDispatcher, getContext, onMount } from "svelte";

  import { mode, settings } from "../../stores";
  import { modeData, GameState } from "../../utils";
  import type { Toaster } from "../widgets";
  import Setting from "./Setting.svelte";

  export let state: GameState;

  const toaster = getContext<Toaster>("toaster");
  const dispatch = createEventDispatcher();

  let root: HTMLElement;
  onMount(() => {
    root = document.documentElement;
  });
  $: {
    if (root) {
      $settings.dark
        ? root.classList.remove("light")
        : root.classList.add("light");
      $settings.colorblind
        ? root.classList.add("colorblind")
        : root.classList.remove("colorblind");
      localStorage.setItem("settings", $settings.toString());
    }
  }
</script>

<!-- not currently supported, see https://github.com/sveltejs/svelte/issues/3105 -->
<!-- <svelte:body class:light={!$settings.dark} class:colorblind={$settings.colorblind} /> -->
<div class="outer">
  <div class="settings-top">
    <h3>settings</h3>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div
      on:click={() => {
        if (!state.validHard) {
          toaster.pop("Game has already violated hard mode");
        }
      }}
    >
      <Setting
        type="switch"
        bind:value={$settings.hard[$mode]}
        disabled={!state.validHard}
      >
        <svelte:fragment slot="title">Hard Mode</svelte:fragment>
        <svelte:fragment slot="desc">
          Any revealed hints must be used in subsequent guesses
        </svelte:fragment>
      </Setting>
    </div>
    <Setting type="switch" bind:value={$settings.dark}>
      <svelte:fragment slot="title">Dark Theme</svelte:fragment>
    </Setting>
    <Setting type="switch" bind:value={$settings.colorblind}>
      <svelte:fragment slot="title">Color Blind Mode</svelte:fragment>
      <svelte:fragment slot="desc">High contrast colors</svelte:fragment>
    </Setting>
    <Setting
      type="dropdown"
      bind:value={$mode}
      options={modeData.modes.map((e) => e.name)}
    >
      <svelte:fragment slot="title">Game Mode</svelte:fragment>
      <svelte:fragment slot="desc">
        The game mode determines how often the word refreshes
      </svelte:fragment>
    </Setting>
    <div class="links">
      <a
        href="https://github.com/dawsno/roguedle"
        target="_blank"
        rel="noreferrer"
      >
        Leave a ⭐
      </a>
      <a
        href="https://github.com/dawsno/roguedle/issues"
        target="_blank"
        rel="noreferrer"
      >
        Report a Bug
      </a>
    </div>
  </div>
</div>
<!--
  .custom {
    height: 2rem;
    fill: var(--fg-secondary);
    cursor: pointer;
  }
-->

<style>
  .outer {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .links {
    font-size: var(--fs-medium);
    border-bottom: 1px solid var(--border-primary);
    color: var(--fg-secondary);
    display: flex;
    justify-content: space-between;
  }
  :global(.settings-top > div) {
    padding: 16px 0;
    border-bottom: 1px solid var(--border-primary);
  }
</style>
