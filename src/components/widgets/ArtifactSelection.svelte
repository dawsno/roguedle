<script lang="ts">
  import { Artifact } from "../../artifacts";
  import type { GameMode } from "../../enums";
  import saveState from "../../App.svelte";
  import type { GameState } from "../../utils";
  import { createEventDispatcher } from "svelte";

  // Define the props for the component
  export let images: string[];
  export let ids: number[];
  export let gs: GameState;
  export let show: boolean;

  let hoverImageId: number | null = null;
  let hoverTimeout: number | null = null;

  function handleImageClick(imageId: number) {
    images = [];
    var artifact = Artifact.generateArtifact(imageId, gs);
    gs.artifactStates.push(artifact.state);
    updateData(gs);
    show = false;
  }

  function updateData(updatedData: GameState) {
    gs = updatedData;
    dispatch("dataUpdated", updatedData);
  }
  function handleImageHover(imageId: number) {
    clearTimeout(hoverTimeout);
    hoverTimeout = setTimeout(() => {
      hoverImageId = imageId;
    }, 300); // Set the delay to 300ms
  }

  function handleMouseOut(event: MouseEvent) {
    clearTimeout(hoverTimeout);
    hoverTimeout = null;
    if (
      event.relatedTarget &&
      !(event.relatedTarget as Element).contains(event.currentTarget as Element)
    ) {
      hoverImageId = null;
    }
  }

  const dispatch = createEventDispatcher();
</script>

<!-- The component template -->
<div class="image-container">
  <div class="image-grid">
    <!-- svelte-ignore a11y-mouse-events-have-key-events -->
    {#each images as image, i}
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-mouse-events-have-key-events -->
      <div
        class="image-wrapper"
        on:click={() => handleImageClick(ids[i])}
        on:mouseover={() => handleImageHover(ids[i])}
        on:mouseout={handleMouseOut}
      >
        <img
          src={image}
          alt={`Image ${i + 1}`}
          class={i === images.length - 1 ? "last-image" : ""}
          style={`grid-column: ${(i % 3) + 1}; grid-row: ${
            Math.floor(i / 3) + 1
          };`}
        />
        {#if hoverImageId === ids[i]}
          <div class="hover-text">
            {Artifact.generateArtifact(ids[i], gs).state.effectText}
          </div>
        {/if}
      </div>
    {/each}
  </div>
</div>

<style>
  /* Center the image grid on the page */
  .image-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  /* Define the grid layout */
  .image-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }

  /* Set the max width of the images */
  img {
    max-width: 100%;
  }

  /* Style the last image to span all three columns */
  .last-image {
    grid-column: span;
  }

  /* Style the image wrapper to position the hover text */
  .image-wrapper {
    position: relative;
  }

  /* Style the hover text */
  .hover-text {
    position: absolute;
    bottom: -24px;
    left: 50%;
    transform: translateX(-50%);
    background-color: gray;
    color: black;
    padding: 8px;
    border-radius: 4px;
  }
</style>
