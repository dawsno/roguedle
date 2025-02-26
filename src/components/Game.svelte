<script lang="ts">
  import { fade } from "svelte/transition";
  import Header from "./Header.svelte";
  import { Board } from "./board";
  import Keyboard from "./keyboard";
  import Modal from "./Modal.svelte";
  import { getContext, onMount, setContext } from "svelte";
  import Settings from "./settings";
  import {
    Share,
    Separator,
    Definition,
    Tutorial,
    Statistics,
    Distribution,
    Timer,
    Toaster,
    ShareGame,
    Tips,
    Historical,
  } from "./widgets";
  import {
    contractNum,
    DELAY_INCREMENT,
    PRAISE,
    modeData,
    ROWS,
    COLS,
    newSeed,
    GameState,
    seededRandomInt,
    LetterStates,
    words,
    Stats,
    generateWord,
    incrementRow,
    artifactChoices,
    roundsBetweenArtifact,
  } from "../utils";
  import { letterStates, settings, mode } from "../stores";
  import Stat from "./widgets/stats/Stat.svelte";
  import Row from "./board/Row.svelte";
  import { trusted } from "svelte/internal";
  import { Artifact } from "../artifacts";
  import ArtifactSelection from "./widgets/ArtifactSelection.svelte";

  export let word: string;
  export let stats: Stats;
  export let game: GameState;
  export let toaster: Toaster;
  export let showRefresh = false;
  let mmm = $mode;

  setContext("toaster", toaster);
  const version = getContext<string>("version");
  // implement transition delay on keys
  const delay = DELAY_INCREMENT * ROWS + 800;
  const allowedArtifacts = [
    4, 5, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 24, 25, 26, 32, 38, 40, 41,
    44, 59, 60, 62, 67,
  ];
  let showTutorial = $settings.tutorial === 3;
  let showSettings = false;
  let showArtifacts = false;
  let showStats = false;
  let showHistorical = false;
  let artifactIds: number[] = [3, 3, 3, 3];
  let imgStrings: string[] = [
    "../../../public/artifactArt/CuriosCoots1.png",
    "../../../public/artifactArt/CuriosCoots1.png",
    "../../../public/artifactArt/CuriosCoots1.png",
    "../../../public/artifactArt/CuriosCoots1.png",
  ];
  let board: Board;
  let timer: Timer;

  function submitWord() {
    //TODO make this so artifacts work like all others
    var freestyle = game.artifactStates.some((a) => a.id === 14);
    var allowFreestyle = false;
    if (freestyle) {
      var freestyleIndex = game.artifactStates.findIndex((a) => a.id === 14);
      if (game.artifactStates[freestyleIndex].artifactBool) {
        game.artifactStates[freestyleIndex].artifactBool = false;
        allowFreestyle = true;
      }
    }
    if (game.latestWord.length !== COLS) {
      toaster.pop("Not enough letters");
      board.shake(game.guesses);
    } else if (words.contains(game.latestWord) || allowFreestyle) {
      if (game.guesses > 0) {
        const hm = game.checkHardMode();
        if ($settings.hard[$mode]) {
          if (hm.type === "🟩") {
            toaster.pop(
              `${contractNum(
                hm.pos + 1
              )} letter must be ${hm.char.toUpperCase()}`
            );
            board.shake(game.guesses);
            return;
          } else if (hm.type === "🟨") {
            toaster.pop(`Guess must contain ${hm.char.toUpperCase()}`);
            board.shake(game.guesses);
            return;
          }
        } else if (hm.type !== "⬛") {
          game.validHard = false;
        }
      }
      game.board.state[game.guesses] = game.guess(word);
      ++game.guesses;
      $letterStates.update(game.lastState, game.lastWord);
      var hasClarity = game.artifactStates.some((a) => a.id === 38);
      var hasPurrfector = game.artifactStates.some((a) => a.id === 44);
      if (hasClarity) {
        $letterStates.removeRandLetter(game, word);
      }
      if (hasPurrfector) {
        if (game.guesses % 5 == 0) {
          $letterStates.removeRandLetter(game, word);
          $letterStates.removeRandLetter(game, word);
          $letterStates.removeRandLetter(game, word);
          $letterStates.removeRandLetter(game, word);
          $letterStates.removeRandLetter(game, word);
          $letterStates.removeRandLetter(game, word);
          $letterStates.removeRandLetter(game, word);
        }
      }
      $letterStates = $letterStates;
      var hasShadow = game.artifactStates.some((a) => a.id === 10);
      var hasHunter = game.artifactStates.some((a) => a.id === 11);
      if (hasShadow) {
        if (game.lastState.every((value) => value === "⬛")) {
          incrementRow();
        }
      }
      if (hasHunter) {
        if (game.lastState.every((value) => value === "🟨")) {
          incrementRow();
        }
      }
      game.updateBoard();
      var acceptedWin = game.lastWord === word;
      var hasRabbit = game.artifactStates.some((a) => a.id === 9);
      var hasPortal = game.artifactStates.some((a) => a.id === 8);
      if (hasRabbit) {
        var filteredList = game.lastState.filter((value) => value === "🟨");
        acceptedWin =
          filteredList.length <= 3 &&
          game.lastState.every((value) => value === "🟩" || value === "🟨");
      }
      if (hasPortal) {
        var filteredList = game.lastState.filter((value) => value === "⬛");
        acceptedWin =
          filteredList.length <= 2 &&
          game.lastState.every((value) => value === "🟩" || value === "⬛");
      }
      if (hasPortal && hasRabbit) {
        var yellowList = game.lastState.filter((value) => value === "🟨");
        var grayList = game.lastState.filter((value) => value === "⬛");
        if (yellowList.length <= 3 && grayList.length <= 3) {
          acceptedWin = true;
        }
      }
      if (acceptedWin) {
        win();
        if (freestyle) {
          game.artifactStates[freestyleIndex].artifactBool = true;
        }
      } else if (game.guesses === ROWS) {
        if (freestyle) {
          game.artifactStates[freestyleIndex].artifactBool = true;
        }
        lose();
      }
    } else {
      toaster.pop("Not in word list");
      board.shake(game.guesses);
    }
  }
  function win() {
    let ind: number;
    board.bounce(game.guesses - 1);
    game.active = false;
    ind = game.guesses - 1;
    if (COLS == 12) {
      stats.twelveLetters++;
      if (stats.twelveLetters >= 2) {
        setTimeout(
          () => toaster.pop("YOU WIN"),
          DELAY_INCREMENT * COLS + DELAY_INCREMENT
        );
        concede();
        return;
      }
    }
    if (ind >= PRAISE.length) ind = PRAISE.length - 1;
    setTimeout(
      () => toaster.pop(PRAISE[ind]),
      DELAY_INCREMENT * COLS + DELAY_INCREMENT
    );
    generateArtifact(game, stats.streak % roundsBetweenArtifact == 0);
    showArtifacts = true;
    setTimeout(setShowStatsTrue, delay * 1.4);
    if (!modeData.modes[$mode].historical) {
      stats.addWin(game.guesses, modeData.modes[$mode]);
      showRefresh = true;
      game.streak = stats.streak;
      stats = stats;
      localStorage.setItem(`stats-${$mode}`, stats.toString());
    }
  }

  function lose() {
    game.active = false;
    showArtifacts = false;
    game.artifactStates = new Array<ArtifactState>();
    setTimeout(setShowStatsTrue, delay);
    if (!modeData.modes[$mode].historical) {
      stats.addLoss(modeData.modes[$mode]);
      game.streak = stats.streak;
      stats = stats;
      localStorage.setItem(`stats-${$mode}`, stats.toString());
    }
  }

  function concede() {
    showSettings = true;
    setTimeout(setShowStatsTrue, DELAY_INCREMENT);
    lose();
  }

  async function reload() {
    modeData.modes[$mode].historical = false;
    var seed = newSeed($mode) + stats.streak;
    modeData.modes[$mode].seed = seed;
    $letterStates = new LetterStates();
    var states = game.artifactStates;
    if (stats.streak > 0) {
      game = new GameState(
        $mode,
        seed,
        stats.streak,
        states,
        localStorage.getItem(`state-${$mode}`)
      );
    } else {
      game = new GameState(
        $mode,
        seed,
        stats.streak,
        [],
        localStorage.getItem(`state-${$mode}`)
      );
    }
    game = game;
    seed = seed + stats.streak;
    word = await generateWord(game, seed);
    $letterStates.getInfoStart(game, word);
    $letterStates = $letterStates;
    showStats = false;
    showRefresh = false;
    timer.reset($mode);
  }

  function setShowStatsTrue() {
    if (!game.active) showStats = true;
  }

  function onSwipe(e: Swipe) {
    switch (e.detail.direction) {
      case "left":
        $mode = ($mode + 1) % modeData.modes.length;
        toaster.pop(modeData.modes[$mode].name);
        break;
      case "right":
        $mode = ($mode - 1 + modeData.modes.length) % modeData.modes.length;
        toaster.pop(modeData.modes[$mode].name);
        break;
    }
  }

  onMount(() => {
    if (!game.active) setTimeout(setShowStatsTrue, delay);
  });
  // $: toaster.pop(word);
  $: saveState(game);
  function saveState(state: GameState) {
    if (modeData.modes[$mode].historical) {
      localStorage.setItem(`state-${$mode}-h`, state.toString());
    } else {
      localStorage.setItem(`state-${$mode}`, state.toString());
    }
  }
  let showCoots: boolean;
  function generateArtifact(g: GameState, generate: boolean) {
    if (!generate) {
      imgStrings = [];
      ids = [];
      return;
    }
    var coots = g.artifactStates.find((item) => item.id === 3);
    var cootsCount = 1;
    if (coots) {
      cootsCount = coots.artifactData;
    }
    if (cootsCount >= 7) {
      showCoots = false;
    } else {
      showCoots = true;
    }
    var ids = new Array<number>();
    var idsToExclude = g.artifactStates
      .filter((obj) => !obj.canHaveMultiple)
      .map((obj) => obj.id);
    var availableItems = allowedArtifacts.filter(
      (item) => !idsToExclude.includes(item)
    );
    if (!availableItems.includes(12)) {
      availableItems.push(12);
    }
    if (!availableItems.includes(13)) {
      availableItems.push(13);
    }
    var x = 0;
    for (let index = 0; index < artifactChoices; index++) {
      var ind = seededRandomInt(0, availableItems.length, g.seed);
      var id = availableItems[ind];
      while (ids.includes(id)) {
        ind = seededRandomInt(0, availableItems.length, g.seed + x);
        id = availableItems[ind];
        x++;
      }
      ids.push(id);
    }
    artifactIds = ids;
    var artifactImages = new Array<string>();
    artifactIds.forEach((id) => {
      var artifact = Artifact.generateArtifact(id, game);
      var baseURL = "../../../public/artifactArt/";
      artifactImages.push(baseURL + artifact.state.imgString);
    });
    imgStrings = artifactImages;
    ids.push(3);
    imgStrings.push(
      "../../../public/artifactArt/CuriosCoots" + cootsCount + ".png"
    );
  }
  function handleDataUpdated(event: CustomEvent<GameState>) {
    game = event.detail;
    game = game;
    saveState(game);
    $mode = $mode;
  }
</script>

<svelte:body on:click={board.hideCtx} on:contextmenu={board.hideCtx} />

<main class:guesses={game.guesses !== 0} style="--rows: {ROWS}; --cols: {COLS}">
  <Header
    bind:showRefresh
    tutorial={$settings.tutorial === 2}
    on:closeTutPopUp|once={() => ($settings.tutorial = 1)}
    showStats={stats.played > 0 ||
      (modeData.modes[$mode].historical && !game.active)}
    on:stats={() => (showStats = true)}
    on:tutorial={() => (showTutorial = true)}
    on:settings={() => (showSettings = true)}
    on:reload={reload}
  />
  <Board
    bind:this={board}
    bind:value={game.board.words}
    tutorial={$settings.tutorial === 1}
    on:closeTutPopUp|once={() => ($settings.tutorial = 0)}
    board={game.board}
    guesses={game.guesses}
    icon={modeData.modes[$mode].icon}
    on:swipe={onSwipe}
  />
  <Keyboard
    on:keystroke={() => {
      if ($settings.tutorial) $settings.tutorial = 0;
      board.hideCtx();
    }}
    bind:value={game.board.words[game.guesses === ROWS ? 0 : game.guesses]}
    on:submitWord={submitWord}
    on:esc={() => {
      showTutorial = false;
      showStats = false;
      showSettings = false;
    }}
    disabled={!game.active || $settings.tutorial === 3 || showHistorical}
  />
</main>

<Modal
  bind:visible={showTutorial}
  on:close|once={() => $settings.tutorial === 3 && --$settings.tutorial}
  fullscreen={$settings.tutorial === 0}
>
  <Tutorial visible={showTutorial} />
</Modal>
<Modal bind:visible={showStats}>
  <Statistics data={stats} />
  <ArtifactSelection
    gs={game}
    ids={artifactIds}
    images={imgStrings}
    show={showArtifacts}
    on:dataUpdated={handleDataUpdated}
  />
  <Separator visible={!game.active}>
    <Timer
      slot="1"
      bind:this={timer}
      on:timeup={() => (showRefresh = true)}
      on:reload={reload}
    />
    <Share slot="2" state={game} />
  </Separator>
  <ShareGame wordNumber={game.wordNumber} />
  {#if !game.active}
    <Definition {word} alternates={2} />
  {:else}
    <!-- Fade with delay is to prevent a bright red button from appearing as soon as refresh is pressed -->
    <div
      in:fade={{ delay: 300 }}
      class="button concede"
      on:click={concede}
      on:keydown={concede}
    >
      give up
    </div>
  {/if}
</Modal>

<Modal fullscreen={true} bind:visible={showSettings}>
  <Settings state={game} on:historical={() => (showHistorical = true)} />
  {#if game.active}
    <div class="button concede" on:click={concede} on:keydown={concede}>
      give up
    </div>
  {/if}
  <Tips change={showSettings} />

  <svelte:fragment slot="footer">
    <a
      href="https://www.nytimes.com/games/wordle/"
      target="_blank"
      rel="noreferrer">Original Wordle</a
    >
    <div>
      <div>v{version}</div>
      <div
        title="double click to reset your stats"
        class="word"
        on:dblclick={() => {
          localStorage.clear();
          toaster.pop("localStorage cleared");
        }}
      >
        {modeData.modes[$mode].name} word #{game.wordNumber}
      </div>
    </div>
  </svelte:fragment>
</Modal>

<Modal bind:visible={showHistorical}>
  <Historical bind:showSettings />
</Modal>

<style lang="scss">
  main {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    width: 100%;
    overflow-y: scroll;
    margin: auto;
    position: relative;
  }
  .historical {
    text-align: center;
    margin-top: 10px;
    padding: 0 20px;
    text-transform: uppercase;
  }
  .concede {
    background-color: var(--red);
  }
</style>
